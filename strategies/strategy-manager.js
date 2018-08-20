const fs = require('fs')

function getInfo (Strategy) {
  return {
    name: Strategy.displayName || Strategy.name || Strategy.filename,
    description: Strategy.description || '',
    props: Strategy.propTypes || {}
  }
}

function createStrategy(Strategy, data, rocket) {
  const info = getInfo(Strategy)
  const savedProps = get(data, 'props', {})
  const props = {}
  for (const key in info.props) {
    props[key] = savedProps[key] || info.props[key].default || null
  }

  const strategy = new Strategy(props)
  strategy.props = props
  // TODO:: write these methods
  strategy.emit = () => {}
  strategy.log = () => {}
  strategy.error = () => {}
  // END TODO
  if (strategy.strategyDidActivate) strategy.strategyDidActivate()
  return strategy
}

const DATA_FILE = `${__dirname}/data.json`

function saveData (data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8')
}

function loadData () {
  if (!fs.existsSync(DATA_FILE)) return {}
  const data = fs.readFileSync(DATA_FILE, 'utf8')
  return JSON.parse(data)
}

module.exports = class StrategyManager {
  constructor (server, rocket) {
    this.rocket = rocket

    // TODO:: loop over the strategies folder and import all the strategies
    this.strategies = {}

    this.data = loadData()
    // TODO:: create defaults
    // TODO:: ensure data only has valid strategies in it
    saveData(this.data)

    this.activeStrategies = {}
    for (const key in this.data) {
      if (this.data[key].enabled) {
        const strategy = createStrategy(this.strategies[key], this.data[key], this.rocket)
        this.activeStrategies[key] = strategy
      }
    }

    // TODO:: Make sure these are mapped up correctly
    server.on('activate-strategy', msg => this.onActivate(msg))
    server.on('update-strategy', msg => this.onUpdate(msg))
    server.on('deactivate-strategy', msg => this.onDeactivate(msg))

    rocket.on('parachute-armed', () => this.onEvent('parachuteArmed'))
    rocket.on('parachute-disarmed', () => this.onEvent('parachuteDisrmed'))
    rocket.on('parachute-deployed', () => this.onEvent('parachuteDeployed'))
  }

  getAllInfo () {
    const infos = []
    for (const key in this.strategies) {
      const info = getInfo(this.strategies[key])
      info[key] = key
      infos.push(info)
    }
    return infos
  }

  onActivate (key) {
    if (!this.strategies[key]) throw new Error('Strategy does not exist')
    if (this.activeStrategies[key]) throw new Error('Strategy is already running')
    const strategy = createStrategy(this.strategies[key], this.data[key], this.rocket)
    this.activeStrategies[key] = strategy
    this.data[key].enabled = true
    saveData(this.data)
  }

  // TODO:: We are expecting nextProps to be the entire props. is it partial? and needs to be merged in?
  onUpdate (key, nextProps) {
    if (!this.activeStrategies[key]) throw new Error('Strategy does not exist')
    if (strategy.strategyWillReceiveProps) {
      const retVal = strategy.strategyWillReceiveProps(nextProps)
      if (retVal === false) return
    }
    strategy.props = nextProps
    this.data[key].props = nextProps
    saveData(this.data)
  }

  onDeactivate (key) {
    if (!this.activeStrategies[key]) throw new Error('Strategy does not exist')
    if (strategy.strategyWillDeactivate) strategy.strategyWillDeactivate()
    delete this.activeStrategies[key]
    this.data[key].enabled = false
    saveData(this.data)
  }

  onEvent (methodName) {
    // invoke strategy[methodName] if it exists
    // if not or if returned false: invoke onEvent if it exists
  }
}

// error handling?

rocketDidTick(data)
parachuteDidArm()
parachuteDidDeploy()
parachuteDidDisarm()
    onEvent(name, data)

rocketLaunched()
    onCustomEvent(name, data)
