const fs = require('fs')

function iterateDirectories (root, cb) {
  const files = fs.readdirSync(root)
  files.forEach(file => {
    const path = `${root}/${file}`
    if (fs.statSync(path).isDirectory()) cb(file, path)
  })
}

module.exports = () => {
  const errors = []
  const info = []
  const strategies = {}
  iterateDirectories(__dirname, (key, path) => {
    try {
      const manifest = require(`${path}/manifest.json`)
      const strategy = require(`${path}/index.js`)
      strategies[key] = strategy
      info.push({ ...manifest, key })
    } catch (err) {
      errors.push({ key, err })
    }
  })
  return { info, errors }
}
