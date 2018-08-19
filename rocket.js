const { isEqual } = require('lodash')
const motion = require('./driver/fake-mpu9250')
const altimeter = require('./driver/fake-bmp280')
const servo = require('./driver/fake-servo')
const EventEmitter = require('events').EventEmitter
const strategyLoader = require('./strategy-loader')

// Instantiate and initialize.
const TEST_DURATION_IN_MS = 1000
const events = new EventEmitter()
let altimeterReady = false
let altimeterData
let motionReady = false
let motionData
let parachuteArmed = false

events.on('ready', function() {
  startSpammingData()
  console.log('ready')
})

events.on('data', function(data) {
  process.stdout.write('.')
})

events.on('launched', () => {
  console.log('launched')
})

events.once('altimeter ready', function() {
  altimeterReady = true
  if (motionReady) events.emit('ready')
  console.log('altimeter ready')
})

events.on('altimeter error', function() {
  console.log('altimeter error')
})

events.on('altimeter data', function() {
  const timestamp = +new Date
  events.emit('data', { ...altimeterData, ...motionData, timestamp })
})

events.once('motion ready', function() {
  motionReady = true
  if (altimeterReady) events.emit('ready')
  console.log('motion ready')
})

events.on('motion error', function() {
  console.log('motion error')
})

events.on('motion data', function() {
  const timestamp = +new Date
  events.emit('data', { ...altimeterData, ...motionData, timestamp })
})

async function init() {
  servo.test()
  altimeterData = await altimeter.getValues()
  if (altimeterData) events.emit('altimeter ready')
  else events.emit('altimeter error')
  motionData = motion.getMotion()
  if (motionData) events.emit('motion ready')
  else events.emit('motion error')
}

function startSpammingData() {
  setInterval(() => {
    getAltimeterValues()
    getMotionValues()
  }, 20)
}

function getMotionValues() {
  data = motion.getMotion()
  if (!isEqual(data, motionData)) {
    motionData = data
    events.emit('motion data', data)
  }
}

async function getAltimeterValues() {
  data = await altimeter.getValues()
  if (!isEqual(data, altimeterData)) {
    altimeterData = data
    events.emit('alimeter data', motionData)
  }
}

function armParachute() {
  parachuteArmed = true
  events.emit('parachute-armed')
}

function disarmParachute() {
  parachuteArmed = false
  event.emit('parachute-disarmed')
}

function deployParachute() {
  servo.setHigh()
  events.emit('parachute-deployed')
}

module.exports = {
  init,
  events,
  getMotionValues,
  getAltimeterValues,
  armParachute,
  deployParachute
}