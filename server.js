/* jshint node:true, strict:false, laxcomma:true */
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)

const StrategyManager = require('./strategy-manager')

io.set('log level', 1)

app.use(express.static(__dirname + '/www'))

const rocket = require('./rocket')
rocket.init()

const strategyManager = new StrategyManager(rocket.events, err => {
  console.error('----------------- CRITICAL ERROR -----------------')
  console.error(err)
  if (err.isStrategyError) {
    console.error(err.originalErr)
    console.error(err.strategyName)
    console.error(err.methodName)
    console.error(err.args)
    console.error(err.strategyDidCrashError)
  }
  console.error('--------------------------------------------------')
})

rocket.events.on('data', data => {
  io.sockets.emit('rocket-data', data)
})

rocket.events.on('launched', data => {
  io.sockets.emit('launched', data)
})

rocket.events.on('parachute-armed', data => {
  io.sockets.emit('parachute-armed', data)
})

rocket.events.on('parachute-deployed', data => {
  io.sockets.emit('parachute-deployed', data)
})

rocket.events.on('parachute-disarmed', data => {
  io.sockets.emit('parachute-disarmed', data)
})

rocket.events.on('strategy-custom-event', data => {
  io.sockets.emit('strategy-custom-event', data)
})

rocket.events.on('strategy-log', data => {
  io.sockets.emit('strategy-log', data)
})

rocket.events.on('strategy-error', data => {
  io.sockets.emit('strategy-error', data)
})

rocket.events.on('refresh-strategy-data', () => {
  io.sockets.emit('strategy-data', strategyManager.getAllInfo())
})

// Socket IO configuration
io.sockets.on('connection', function(socket) {
  console.log('incoming connection')

  socket.emit('hello', {})

  socket.emit('strategy-data', strategyManager.getAllInfo())

  socket.on('arm-parachute', function() {
    rocket.events.emit('arm-parachute')
  })

  socket.on('disarm-parachute', function() {
    rocket.events.emit('disarm-parachute')
  })

  socket.on('deploy-parachute', function() {
    rocket.events.emit('deploy-parachute')
  })

  socket.on('reset-parachute', function() {
    rocket.events.emit('reset-parachute')
  })

  socket.on('activate-strategy', msg => {
    rocket.events.emit('activate-strategy', msg)
  })

  socket.on('update-strategy', msg => {
    rocket.events.emit('update-strategy', msg)
  })

  socket.on('deactivate-strategy', msg => {
    rocket.events.emit('deactivate-strategy', msg)
  })
})

// Routes
app.get('/', function(req, res) {
  res.sendfile(__dirname + '/www/index.html')
})

// Listen
server.listen(80)
console.log('Rocket listening on port 80')
