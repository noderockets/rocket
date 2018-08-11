const DELAY = 1500

module.exports = function(rocket) {
  console.log('Using timer based strategy')

  function deployParachute () {
    console.log('Deploy parachute now!')
    rocket.deployParachute()
    rocket.disarmParachute()
    rocket.events.removeListener(delayParachuteDeployment)
    setTimeout(() => {
      rocket.events.on('launched', delayParachuteDeployment)
    }, 1000)
  }

  function delayParachuteDeployment () {
    console.log(`Deploying parachute in ${DELAY / 1000} second(s)`)
    setTimeout(deployParachute, DELAY)
  }

  rocket.events.on('launched', delayParachuteDeployment)
}
