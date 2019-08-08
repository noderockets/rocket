class LaunchDetector {
  rocketDidEmitData (data) {
    if (this.launchEmitted) return
    const current = Math.abs(data.accelerometer.z)
    console.log(current)
    if (!this.firstKnown) {
      this.firstKnown = current
    } else if (current > this.firstKnown + (this.props.launchThreshold * 2000)) {
      console.log('detected launch') 
      this.log('detected launch')
      this.emit('launched')
      this.launchEmitted = true
      setTimeout(() => {
        this.launchEmitted = false
      }, this.props.launchDuration)
    }
  }
}
LaunchDetector.displayName = 'Detect Launch using Accelerometer'
LaunchDetector.description = 'This strategy listens to rocket data for accelerometer changes. Once the rocket starts moving, it emits a "launched" event.'
LaunchDetector.propTypes = {
  launchThreshold: {
    description: 'G-forces',
    type: 'number',
    default: 3
  },
  launchDuration: {
    description: 'Number of milliseconds before allowing another `launched` event.',
    type: 'number',
    default: 20000
  }
}
module.exports = LaunchDetector
