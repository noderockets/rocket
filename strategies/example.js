import RocketStrategy from './base-strategy'

module.exports = class LaunchDetector extends RocketStrategy {
  static displayName = 'Detect Launch'

  static description = 'This strategy listens to rocket data for altitude changes. Once the rocket starts moving upward, it emits a "launched" event.'

  static propTypes = {
    launchThreshold: {
      description: 'Distance in meters',
      type: 'number',
      default: 2
    }
  }

  strategyWillReceiveProps (nextProps) {
    if (nextProps.launchThreshold < 0) {
      this.error('launchThreshold must be a positive number.')
      return false
    }
    if (nextProps.launchThreshold > 10000) {
      this.error('Yeaaaaah, your rocket is gonna crash; choose a smaller number.')
      return false
    }
  }

  rocketDidEmitData (data) {
    const current = data.altitude
    if (!this.firstKnown) {
      this.firstKnown = current
    } else if (current > this.firstKnown + this.props.launchThreshold) {
      this.log('detected launch')
      this.emit('launched')
    }
  }
}
