/* jshint node:true, strict:false, laxcomma:true */
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)

io.set('log level', 1)

app.use(express.static(__dirname + '/www'))

const rocket = require('./rocket')
rocket.init()

require('./strategy/detect-launch')(rocket)
require('./strategy/parachute-timer')(rocket)
//require('./strategy/parachute-apogee')(rocket);
require('./strategy/log-launch')(rocket);

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

// Socket IO configuration
io.sockets.on('connection', function(socket) {
  console.log('incoming connection')

  socket.emit('hello', {})

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
