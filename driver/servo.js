const Gpio = require('pigpio').Gpio
const motor = new Gpio(13, { mode: Gpio.OUTPUT })
const pulseWidth = 1000
const pulseRange = 1000
const increment = 100

function setHigh() {
  motor.servoWrite(pulseWidth)
}

function setLow() {
  motor.servoWrite(pulseWidth + pulseRange)
}

function setTo(n) {
  if (isNaN(+n) || !isFinite(n) || n < 0 || n > 1) return
  motor.servoWrite(pulseWidth + Math.floor(pulseRange * n))
}

function test() {
  setLow()
  setTimeout(setHigh, 1000)
}

module.exports = {
  setLow,
  setHigh,
  setTo,
  test
}