```js
class LaunchDetector {
  rocketDidEmitData (data) {
    if (this.launchEmitted) return
    const current = data.altitude
    if (!this.firstKnown) {
      this.firstKnown = current
    } else if (current > this.firstKnown + this.props.launchThreshold) {
      this.log('detected launch')
      this.emit('launched')
      this.launchEmitted = true
      setTimeout(() => {
        this.launchEmitted = false
      }, this.props.launchDuration)
    }
  }
}
LaunchDetector.displayName = 'Detect Launch'
LaunchDetector.description = 'This strategy listens to rocket data for altitude changes. Once the rocket starts moving upward, it emits a "launched" event.'
LaunchDetector.propTypes = {
  launchThreshold: {
    description: 'Distance in meters',
    type: 'number',
    default: 2
  },
  launchDuration: {
    description: 'Number of milliseconds before allowing another `launched` event.',
    type: 'number',
    default: 20000
  }
}
module.exports = LaunchDetector
```
