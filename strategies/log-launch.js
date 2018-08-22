const fs = require('fs')
const path = require('path')

class LaunchLogger {
  constructor () {
    this.logs = []
  }

  rocketDidEmitData (data) {
    const numLogs = this.props.prevSecondsLogged * 50 + this.props.secondsLogged * 50
    if (this.logs.length >= numLogs) this.logs.shift()
    this.logs.push(data)
  }

  rocketLaunched () {
    setTimeout(() => {
      const file = path.join(__dirname, '..', 'log', `${this.logs[0].timestamp}.json`)
      const data = JSON.stringify(this.logs)
      fs.writeFile(file, data, err => {
        if (err) return this.error(err)
        this.log(`Flight data recorded as: ${file}`)
      })
    }, this.props.secondsLogged * 1000)
  }
}
LaunchLogger.displayName = 'Flight Logs'
LaunchLogger.description = 'Listens for the launched event (typically emitted from detect-launch) and then writes 10 seconds of flight logs out to a file.'
LaunchLogger.propTypes = {
  secondsLogged: {
    description: 'Number of seconds to log post launch',
    type: 'number',
    default: 10
  },
  prevSecondsLogged: {
    description: 'Number of seconds to log pre launch',
    type: 'number',
    default: 2
  }
}
module.exports = LaunchLogger
