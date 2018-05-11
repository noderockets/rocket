const BMP280 = require('node-bmp280')

const barometer = new BMP280()

barometer.begin(err => {
  if (err) {
    console.info('Unable to initialize barometer', err)
    return
  }

  console.info('Barometer started...')
  setInterval(() => {
    barometer.readPressureAndTemparature((err, pres, temp) => {
      console.info({ pres, temp })
    }, 1000)
  })
})

