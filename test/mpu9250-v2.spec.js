const motionSensor = require('../driver/mpu9250')

setInterval(() => {
  const motion = motionSensor.getMotion()
  console.log({ motion })
}, 250)
