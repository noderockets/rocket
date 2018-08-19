var LAUNCH_THRESHOLD = 2

module.exports = function(rocket, emitter) {
  var firstKnown

  emitter.on('data', function(data) {
    var current = data.altitude

    if (!firstKnown) {
      firstKnown = current
    } else {
      if (current > firstKnown + LAUNCH_THRESHOLD) {
        console.log('detected launch')
        emitter.emit('launched')
      }
    }
  })
}
