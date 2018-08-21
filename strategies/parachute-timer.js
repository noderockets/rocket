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
    this.parachuteArmed = true
  }

  parachuteDidArm () {
    this.parachuteArmed = true
  }

  parachuteDidDisarm ()  {
    this.parachuteArmed = false
  }

  rocketLaunched () {
    if (!this.parachuteArmed) return
    this.log(`Deploying parachute in ${this.props.delay / 1000} second(s)`)
    this.parachuteArmed = false
    setTimeout(() => {
      this.log('Deploy parachute now!')
      this.emit('deploy-parachute')
      this.emit('disarm-parachute')
    }, this.props.delay)
  }
}
