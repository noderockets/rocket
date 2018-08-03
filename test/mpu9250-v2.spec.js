const motionSensor = require('../driver/mpu9250')

setInterval(() => {
  console.log(motionSensor.getMotion())
}, 250)

