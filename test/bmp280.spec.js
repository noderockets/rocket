const barometer = require('../driver/bmp280')

console.log(`Reading sensors`)
setInterval(async () => {
  const { Temperature, Pressure, Altitude } = await barometer.getValues()
  console.log(`Temperature:\t${Temperature}`)
  console.log(`Pressure:\t${Pressure}`)
  console.log(`Altitude:\t${Altitude}`)
}, 100)
