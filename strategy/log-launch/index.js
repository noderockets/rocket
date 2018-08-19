const fs = require('fs')
const logs = []

module.exports = rocket => {
  rocket.events.on('data', data => {
    if (logs.length >= 600) logs.unshift()
    logs.push(data)
  })

  rocket.events.on('launch', () => {
    setTimeout(() => {
      const file = `/log/${logs[0].timestamp}`
      const data = JSON.stringify(logs)
      fs.writeFile(file, data, err => {
        if (err) {
          return console.log(err);
        }
        console.log(`Flight data recorded as: ${file}`);
    })
    }, 10000)
  })
}
