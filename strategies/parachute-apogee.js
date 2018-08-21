module.exports = class ParachuteApogee {
  static displayName = 'Parachute: Apogee'

  static description = 'Waits for the rocket to start moving downward, then deploys the parachute.'

  static propTypes = {
    threshold: {
      description: 'Number of measurements to verify rocket is falling.',
      type: 'number',
      default: 5
    }
  }

  rocketDidActivate () {
    this.log('Using apogee detection based strategy')
    this.lastAltitude = Number.MIN_VALUE
    this.descentCount = 0
    this.deployed = false;
  }

  // TODO:: respect parachute disarm/arm (set this.deployed = false)

  rocketDidEmitData (data) {
    if (this.deployed) return
    var currentAltitude = data.altitude

    if (lastAltitude < data.altitude) {
      descentCount = 0
      return
    }

    if (++descentCount > this.props.threshold) {
      this.emit('deploy-parachute')
      this.deployed = true
    }
  }
}
