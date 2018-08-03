module.exports = function(rocket) {
  console.log('Using timer based strategy')

  rocket.events.on('launched', function() {
    console.log('Deploying parachute in 1s')
    setTimeout(function() {
      console.log('Deploy parachute now!')
      rocket.deployParachute()
    }, 1000)
  })
}
