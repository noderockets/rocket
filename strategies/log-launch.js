const fs = require('fs')

class LaunchLogger {
  constructor () {
    this.logs = []
  }

  rocketDidEmitData (data) {
    if (this.logs.length >= 600) this.logs.shift()
    this.logs.push(data)
  }

  rocketLaunched () {
    setTimeout(() => {
      const file = `/log/${this.logs[0].timestamp}`
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
    description: 'Number of seconds to log',
    type: 'number',
    default: 10
  }
}
module.exports = LaunchLogger
