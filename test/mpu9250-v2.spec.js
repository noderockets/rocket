const motionSensor = require('../driver/mpu9250')
console.log('motionSensor')
console.log(motionSensor)

setInterval(() => {
  const motion = motionSensor.getMotion()
  console.log({ motion })
}, 250)

