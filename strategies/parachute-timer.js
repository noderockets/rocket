module.exports = class ParachuteTimer {
  static displayName = 'Parachute: Timer'

  static description = 'Listens for the launched event (typically emitted from detect-launch) and then deploys the parachute after a set amount of time.'

  static propTypes = {
    delay: {
      description: 'Number of milliseconds to wait after launch before deploying.',
      type: 'number',
      default: 1500
    }
  }

  rocketDidActivate () {
    this.log('Using timer based strategy')
  }

  // TODO:: respect parachute disarm/arm (set this.deployed = false)

  rocketLaunched () {
    if (this.deployed) return
    this.log(`Deploying parachute in ${this.props.delay / 1000} second(s)`)
    setTimeout(() => {
      this.log('Deploy parachute now!')
      this.emit('deploy-parachute')
      this.emit('disarm-parachute')
      this.deployed = true
    }, this.props.delay)
  }
}
