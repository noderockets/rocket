const data = require('./fake-data')

let zero = 0
let next = 0

async function getValues() {
  const { altitude, pressure, temperature } = data[next]
  next = (next + 1) % data.length 
  return { altitude: altitude - zero, pressure, temperature }
}

function setZero(val) {
  zero = val
}

module.exports = {
  setZero,
  getValues
}
