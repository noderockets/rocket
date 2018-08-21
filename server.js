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

const strategyManager = new StrategyManager(io.sockets, rocket.events, err => {
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

// Socket IO configuration
io.sockets.on('connection', function(socket) {
  console.log('incoming connection')

  socket.emit('hello', {})

  const info = strategyManager.getAllInfo()
  socket.emit('strategy-data', info)

  socket.on('arm-parachute', function() {
    rocket.armParachute()
  })

  socket.on('disarm-parachute', function() {
    rocket.disarmParachute()
  })

  socket.on('deploy-parachute', function() {
    rocket.deployParachute()
  })
})

// Routes
app.get('/', function(req, res) {
  res.sendfile(__dirname + '/www/index.html')
})

// Listen
server.listen(80)
console.log('Rocket listening on port 80')
