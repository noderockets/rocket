const path = require('path')
const fs = require('fs')
const { promisify } = require('util')

const readdirAsync = promisify(fs.readdir)
const strategyPath = path.join(__dirname, 'strategy')

class ProxyEmitter {
  constructor () {
    this.eventMap = {}
  }
  
  on (event, callback) {
    console.log({ src: 'ProxyEmitter on', registered: event })
    this.eventMap[event] = callback
    if (this.eventEmitter) {
      this.eventEmitter.on(event, callback)
    }
  }

  removeListener (event, callback) {
    console.log({ src: 'ProxyEmitter removeListener', event })
    this.eventMap[event] = undefined
    if (this.eventEmitter) {
      this.eventEmitter.removeListener(event, callback)
    }
  }

  emit (event, data) {
    console.log({ src: 'ProxyEmitter emit', eventEmitter: this.eventEmitter})
    this.eventEmitter.emit(event, data)
  }

  activate (eventEmitter) {
    this.eventEmitter = eventEmitter
    for (let event in this.eventMap) {
      eventEmitter.on(event, this.eventMap[event])
    }
  }

  deactivate () {
    for (let event in this.eventMap) {
      this.eventEmitter.removeListener(event, this.eventMap[event])
    }
    this.eventEmitter = undefined
  }
}

module.exports = class Strategies {
  constructor (rocket) {
    this.strategyMap = {}
    this.load()
    this.rocket = rocket
  }

  async load () {
    const files = await readdirAsync(strategyPath)
    files.forEach(file => {
      if (file.endsWith('.js')) {
        const name = file.substr(0, file.length - 3)
        this.strategyMap[name] = {
          active: false,
          fn: require(`./strategy/${file}`),
          ee: new ProxyEmitter()
        }
      }
    })
  }

  list () {
    const map = {}
    for (let key in this.strategyMap) {
      map[key] = this.strategyMap[key].active
    }
    return map
  }

  activate (name) {
    const strat = this.strategyMap[name]
    if (!strat.ee) return
    strat.ee.activate(this.rocket.events)
    strat.active = true
  }

  deactivate (name) {
    const strat = this.strategyMap[name]
    if (!strat.ee) return
    strat.ee.deactivate()
    strat.active = false
  }
}
