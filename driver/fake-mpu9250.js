const data = require('./fake-data')

let zero = 0
let next = 0

function getMotion() {
  const { accelerometer, gyroscope, magnetometer } = data[next]
  next = (next + 1) % data.length
  return { accelerometer, gyroscope, magnetometer }
}

module.exports = {
  getMotion
}
