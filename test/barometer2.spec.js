const util = require('util')
const BMP280 = require("bmp280-sensor")

const OPTIONS = {
  i2cBusNumber: 1,            // defaults to 1
  i2cAddress: 0x76,           // defaults to 0x76
  verbose: true
}
const bmp280 = new BMP280(OPTIONS);

const SEA_LEVEL_PRESSURE = 101325
const ALTITUDE_PRESSURE_CONSTANTS = {
  n1: 44330,
  n2: 0.19022256039566293
}

bmp280.config({
  powerMode: 3,               // 0 - sleep, 1|2 - one measurement, 3 - continuous
  pressureOversampling: 4,    // 0 - Skipped, 1 - ×1, 2 - ×2, 3 - ×4, 4 - ×8, 5 - ×16
  temperatureOversampling: 2, // 0 - Skipped, 1 - ×1, 2 - ×2, 3 - ×4, 4 - ×8, 5 - ×16
  iirFilter: 2,               // Coefficient: 0 - off, 1 - 2, 2 - 4, 3 - 8, 4 - 16
  standby: 1                  // 0 - 0.5ms, 1 - 62.5ms, 2 - 125ms, 3 - 250ms, 4 - 500ms, 5 - 1000ms, 6 - 2000ms, 7 - 4000ms
})

console.log(`Reading sensors`)
setInterval(async () => {
  const { Temperature, Pressure, Altitude } = await getValues()
  console.log(`Temperature:\t${Temperature}`)
  console.log(`Pressure:\t${Pressure}`)
  console.log(`Altitude:\t${Altitude}`)
}, 100)

function getValues() {
  return bmp280
    .readSensors()
    .then(data => {
      const Altitude = getAltitude(data.Pressure, data.Temperature)
      return { ...data, Altitude }
    })
    .catch(err => {
      console.log(err)
      bmp280.close()
    })
}

process.on("SIGINT", () => {
  bmp280.close()
  process.exit()
})

function getAltitude(pressure, tempurature) {
  const { n1, n2 } = ALTITUDE_PRESSURE_CONSTANTS
  const SEA_LEVEL_PRESSURE = 1013.25
  return ((Math.pow((SEA_LEVEL_PRESSURE / pressure), n2) - 1.0) * (tempurature + 273.15)) / 0.0065
}

