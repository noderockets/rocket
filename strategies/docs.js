import RocketStrategy from './base-strategy'

// todo: describe what these are
// this.error
// this.log
// this.emit

module.exports = class LaunchDetector extends RocketStrategy {
  static displayName = 'Strategy Name'

  static description = 'Strategy Description'

  static propTypes = {
    propKey: {
      displayName: 'Prop Name'
      description: 'Prop Description',
      type: 'number | string | boolean',
      default: 'Default Prop Value'
    }
  }

  constructor (props) {
    super()
    // called when strategy is created
  }

  strategyDidActivate () {
    // called when strategy is activated; typically directly after constructor is called
  }

  strategyWillReceiveProps (nextProps) {
    // called when the props are updated
    // return false to cancel the update
  }

  strategyWillDeactivate () {
    // called when strategy is disabled
  }

  /* Built-in Events */

  rocketDidTick (data) {
    // called on rocket-data
    const current = data.altitude
    if (!this.firstKnown) {
      this.firstKnown = current
    } else {
      if (current > this.firstKnown + this.props.launchThreshold) {
        this.log('detected launch') // logs to console, and is sent to mission control ui
        this.emit('launched') // emits a new custom event
      }
    }
  }

  parachuteDidArm ()  {
    // called when the parachute arms
  }

  parachuteDidDeploy ()  {
    // called when the parachute deploys
  }

  parachuteDidDisarm ()  {
    // called when the parachute disarms
  }

  onEvent (name, data) {
    // if an event (custom or built-in) is emitted and there is no handler for it, this will be invoked
    // return false in any of the event handlers above to keep propogating the event
  }

  /* Custom Events */

  rocketLaunched () {
    // custom event! called when rocket launches

    // for custom events, we call `rocket${upperCamelCase(name)}`
    // example: if your event is `did-launch`, we would call `rocketDidLaunch`
  }

  onCustomEvent (name, data) {
    // if a custom event is emitted and there is no handler for it, this will be invoked
  }
}
