const fs = require('fs')
const _ = require('lodash')
const path = require('path')

function format (name) {
  return _.upperFirst(_.camelCase(name))
}

function getInfo (Strategy) {
  return {
    name: Strategy.displayName || Strategy.name || Strategy.filename,
    description: Strategy.description || '',
    props: Strategy.propTypes || {}
  }
}

const DATA_FILE = `${__dirname}/strategies/data.json`

function saveData (data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8')
}

function loadData () {
  if (!fs.existsSync(DATA_FILE)) return {}
  const data = fs.readFileSync(DATA_FILE, 'utf8')
  return JSON.parse(data)
}

module.exports = class StrategyManager {
  constructor (rocket, errorHandler) {
    this.rocket = rocket
    this.globalErrorHandler = errorHandler

    this.strategies = {}
    const files = fs.readdirSync(`${__dirname}/strategies`)
    files.forEach(file => {
      const parsed = path.parse(file)
      if (parsed.ext !== '.js') return
      const key = parsed.name
      this.strategies[key] = require(`./strategies/${file}`)
    })

    const savedData = loadData()
    this.data = {}
    for (const key in this.strategies) {
      const savedStrat = savedData[key] || {}
      const savedProps = savedStrat.props || {}
      const propTypes = getInfo(this.strategies[key]).props || {}
      const props = {}
      for (const key in Object.keys(propTypes)) {
        if (key in savedProps) props[key] = savedProps[key]
      }
      const enabled = savedStrat.enabled || false
      this.data[key] = { enabled, props }
    }
    saveData(this.data)

    this.activeStrategies = {}
    for (const key in this.data) {
      if (this.data[key].enabled) {
        this.handleError(key, () => {
          const strategy = this.createStrategy(key)
          this.activeStrategies[key] = strategy
          this.safelyInvokeLifecycle(strategy, 'strategyDidActivate')
        })
      }
    }

    rocket.on('activate-strategy', msg => {
      this.onActivate(msg)
      rocket.emit('refresh-strategy-data')
    })

    rocket.on('update-strategy', msg => {
      this.onUpdate(msg)
      rocket.emit('refresh-strategy-data')
    })

    rocket.on('deactivate-strategy', msg => {
      this.onDeactivate(msg)
      rocket.emit('refresh-strategy-data')
    })


    rocket.on('data', data => this.onEvent('rocket-data', 'rocketDidEmitData', data))
    rocket.on('parachute-armed', () => this.onEvent('parachute-armed', 'parachuteDidArm'))
    rocket.on('parachute-deployed', () => this.onEvent('parachute-deployed', 'parachuteDidDeploy'))
    rocket.on('parachute-disarmed', () => this.onEvent('parachute-disarmed', 'parachuteDidDisarm'))

    rocket.on('strategy-custom-event', data => this.onCustomEvent(data.name, data.payload))
  }

  createStrategy(key) {
    const Strategy = this.strategies[key]
    const data = this.data[key]
    const info = getInfo(Strategy)
    const props = {}
    for (const key in info.props) {
      props[key] = data.props[key] || info.props[key].default || null
    }
    const strategy = new Strategy(props)
    strategy.__computedName = info.name
    strategy.props = props
    strategy.emit = (name, payload) => {
      if (!data.enabled) return
      if (name === 'arm-parachute') return this.rocket.armParachute()
      if (name === 'deploy-parachute') return this.rocket.deployParachute()
      if (name === 'disarm-parachute') return this.rocket.disarmParachute()
      this.rocket.emit('strategy-custom-event', { key, name, payload })
    }
    strategy.log = payload => {
      if (!data.enabled) return
      this.rocket.emit('strategy-log', { key, payload })
    }
    strategy.error = payload => {
      if (!data.enabled) return
      this.rocket.emit('strategy-error', { key, payload })
    }
    return strategy
  }

  getAllInfo () {
    const infos = []
    for (const key in this.strategies) {
      const info = getInfo(this.strategies[key])
      info.key = key
      info.data = this.data[key]
      infos.push(info)
    }
    return infos
  }

  safelyInvokeLifecycle(strategy, methodName, args = []) {
    try {
      if (!strategy[methodName]) return
      return strategy[methodName].apply(strategy, args)
    } catch (err) {
      const finalError = new Error()
      finalError.isStrategyError = true
      finalError.originalErr = err
      finalError.strategyName = strategy.__computedName
      finalError.methodName = methodName
      finalError.args = args
      if (!strategy.strategyDidCrash) throw finalError
      try {
        strategy.strategyDidCrash(err, methodName, args)
      } catch (err) {
        finalError.strategyDidCrashError = err
        throw finalError
      }
    }
  }

  handleError (key, unsafeMethod) {
    try {
      unsafeMethod()
    } catch (err) {
      this.globalErrorHandler(err)
      delete this.activeStrategies[key]
      this.data[key].enabled = false
      this.rocket.emit('refresh-strategy-data')
    }
  }

  onActivate (key) {
    this.handleError(key, () => {
      if (!this.strategies[key]) throw new Error('Strategy does not exist')
      if (this.activeStrategies[key]) throw new Error('Strategy is already running')
      const strategy = this.createStrategy(key)
      this.safelyInvokeLifecycle(strategy, 'strategyDidActivate')
      this.activeStrategies[key] = strategy
      this.data[key].enabled = true
      saveData(this.data)
    })
  }

  onUpdate ({ strategyKey, key, value }) {
    this.handleError(strategyKey, () => {
      const strategy = this.activeStrategies[strategyKey]
      if (!strategy) throw new Error('Strategy does not exist')
      const nextProps = { ...strategy.props }
      nextProps[key] = value
      const retVal = this.safelyInvokeLifecycle(strategy, 'strategyWillReceiveProps', [nextProps])
      if (retVal === false) return
      strategy.props = nextProps
      this.data[strategyKey].props = nextProps
      saveData(this.data)
    })
  }

  onDeactivate (key) {
    this.handleError(key, () => {
      const strategy = this.activeStrategies[key]
      if (!strategy) throw new Error('Strategy does not exist')
      this.safelyInvokeLifecycle(strategy, 'strategyWillDeactivate')
      delete this.activeStrategies[key]
      this.data[key].enabled = false
      saveData(this.data)
    })
  }

  onEvent (eventName, methodName, data) {
    for (const key in this.activeStrategies) {
      this.handleError(key, () => {
        const strategy = this.activeStrategies[key]
        const retValue = this.safelyInvokeLifecycle(strategy, methodName, [data])
        if (!strategy[methodName] || retValue === false) {
          this.safelyInvokeLifecycle(strategy, 'onEvent', [eventName, data])
        }
      })
    }
  }

  onCustomEvent (eventName, data) {
    for (const key in this.activeStrategies) {
      this.handleError(key, () => {
        const strategy = this.activeStrategies[key]
        const methodName = `rocket${format(eventName)}`
        const retValue = this.safelyInvokeLifecycle(strategy, methodName, [data])
        if (!strategy[methodName] || retValue === false) {
          const retValue2 = this.safelyInvokeLifecycle(strategy, 'onCustomEvent', [eventName, data])
          if (!strategy.onCustomEvent || retValue2 === false) {
            this.safelyInvokeLifecycle(strategy, 'onEvent', [eventName, data, true])
          }
        }
      })
    }
  }
}
