```js
class MyStrategy {
  constructor (props) {
    super()
    // called when strategy is created
  }

  strategyDidActivate () {
    // called when strategy is activated; typically directly after constructor is called
    // this.emit, this.log, and this.error are available here. but not in the constructor
  }

  strategyWillReceiveProps (nextProps) {
    // called when the props are updated
    // return false to cancel the update
  }

  strategyWillDeactivate () {
    // called when strategy is disabled
  }

  strategyDidCrash () {
    // called when something goes really wrong. handle the error. if you don't, strategy will be disabled
  }

  /* Built-in Events */

  rocketDidEmitData (data) {
    // called on rocket-data
  }

  parachuteDidArm () {
    // called when the parachute arms
  }

  parachuteDidDeploy () {
    // called when the parachute deploys
  }

  parachuteDidDisarm () {
    // called when the parachute disarms
  }

  onEvent (name, data, isCustom) {
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
MyStrategy.displayName = 'Strategy Name'
MyStrategy.description = 'Strategy Description'
MyStrategy.propTypes = {
  propKey: {
    displayName: 'Prop Name (optional, will use propKey otherwise)'
    description: 'Prop Description',
    type: 'number | string | boolean',
    default: 'Default Prop Value'
  }
}

module.exports = MyStrategy
```
