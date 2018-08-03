const motion = require('./driver/mpu9250');
const altimeter = require('./driver/bmp280');
const EventEmitter = require('events').EventEmitter;

// Instantiate and initialize.
const TEST_DURATION_IN_MS = 1000;
var events = new EventEmitter();



events.once('motion.ready', function () {
  console.log('motion.ready');
  setReady('motion');
});

events.on('motion.error', function () {
  console.log('motion.error');
});

events.on('rocket.ready', function () {
  console.log('rocket.ready');
});

events.on('rocket.data', function (data) {
  console.log(data);
});

var rocket = {
  motion: false,
  altimeter: false
};

function setReady(system) {
  rocket[system] = true;
  for (var sys in rocket) {
    if (!rocket[sys]) return;
  }
  events.emit('rocket.ready');
  rocket.motion = false;
  rocket.altimeter = false;
  readData();
}

function setData(system, data) {
  rocket[system] = data;
  for (var sys in rocket) {
    if (!rocket[sys]) return;
  }
  rocket.dt = +new Date;
  events.emit('rocket.data', rocket);
  rocket.motion = false;
  rocket.altimeter = false;
}

function readData() {
  setInterval(function () {

    altimeter.read(function (data) {
      setData('altimeter', data);
    });

    motion.getMotion6(function (err, data) {
      setData('motion', adaptData(data));
    });

  }, 40);
}

function adaptData(data) {
  return {
    ax: data[0],
    ay: data[1],
    az: data[2],
    temp: data[3],
    gx: data[4],
    gy: data[5],
    gz: data[6]
  }
}

//setTimeout(function() { }, 10000);