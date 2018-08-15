# Strategies

A strategy can read rocket data events and call rocket functions. This simple strategy watches rocket data events for changes in altitude. If the rocket's altitude ever reaches 2 meters above its starting value it considers it a launch and emits a "launched" event on the rocket.

```js
const LAUNCH_THRESHOLD = 2

module.exports = function (rocket) {
  var firstKnown

  rocket.events.on('data', data => {
    var current = data.altitude

    if (!firstKnown) {
      firstKnown = current
    } else {
      if (current > firstKnown + LAUNCH_THRESHOLD) {
        console.log('detected launch')
        rocket.events.emit('launched')
      }
    }
  })
}
```

## Rocket APIs
| Function | Description |
| -------- | ----------- |
| armParachute | Tells the rocket that the parachute is ready for deployment |
| disarmParachute | Tells the rocket that the parachute in not ready for deployment |
| deployParachute | Deploys the parachute (if the parachute is armed) |

## Rocket Events
| Event | Description |
| -------- | ----------- |
| ready | The rocket has started up and will begin sending data events |
| data | The rocket has new data |
| launched | The rocket has launched |
| altimeter ready | The altimeter has started and will begin sending altitude data |
| altimeter error | The altimeter has encountered an error |
| altimeter data | The altimeter has new data |
| motion ready | The motion sensor has started and will begin sending motion data |
| motion error | The motion sensor has encountered an error |
| motion data | the motion sensor has new data |

