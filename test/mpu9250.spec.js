var mpu9250 = require('mpu9250')
// Instantiate and initialize.
// default value
var mpu = new mpu9250({
    // i2c path (default is '/dev/i2c-1')
    device: '/dev/i2c-1',

    // mpu9250 address (default is 0x68)
    address: 0x68,

    // Enable/Disable magnetometer data (default false)
    UpMagneto: true,

    // If true, all values returned will be scaled to actual units (default false).
    // If false, the raw values from the device will be returned.
    scaleValues: false,

    // Enable/Disable debug mode (default false)
    DEBUG: false,

    // ak8963 (magnetometer / compass) address (default is 0x0C)
    ak_address: 0x0C,

    // Set the Gyroscope sensitivity (default 0), where:
    //      0 => 250 degrees / second
    //      1 => 500 degrees / second
    //      2 => 1000 degrees / second
    //      3 => 2000 degrees / second
    GYRO_FS: 3,

    // Set the Accelerometer sensitivity (default 2), where:
    //      0 => +/- 2 g
    //      1 => +/- 4 g
    //      2 => +/- 8 g
    //      3 => +/- 16 g
    ACCEL_FS: 3
})
if (mpu.initialize()) {
  setInterval(() => {
    const motion = mpu.getMotion9()
    console.log({
      accelerometer: {
        x: motion[0],
        y: motion[1],
        z: motion[2]        
      },
      gyroscope: {
        x: motion[3],
        y: motion[4],
        z: motion[5]        
      },
      magnetometer: {
        x: motion[6],
        y: motion[7],
        z: motion[8]
      }
    })
  }, 250)
}