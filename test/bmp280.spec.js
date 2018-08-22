const barometer = require('../driver/bmp280')

console.log(`Reading sensors`)
setInterval(async () => {
  const barometerValues = await barometer.getValues()
  console.log({barometerValues})
}, 250)
