let servo = 1

function setLow() {
  servo = 0
  console.log('SERVO LOW')
}

function setHigh() {
  servo = 1
  console.log('SERVO HIGH')
}

function setTo(n) {
  if (isNaN(+n) || !isFinite(n) || n < 0 || n > 1) return
  servo = n
  console.log(`SERVO AT ${n}`)
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