var LAUNCH_THRESHOLD = 3;

module.exports = function (rocket) {
  var firstKnown;

  rocket.events.on('data', function(data) {
    var current = data.altitude;

    if(!firstKnown) {
      firstKnown = current;
    } else {
      if (current > (firstKnown + LAUNCH_THRESHOLD)) {
        console.log('detected launch');
        rocket.events.emit('launched');
      }
    }
  });
};