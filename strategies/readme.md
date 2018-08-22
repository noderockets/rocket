# Strategies

A strategy can read rocket data events and call rocket functions. A strategy consists of 1 folder with at least 2 files. The `manifest.json` describes the strategy and what parameters can be tweaked. The `index.js` contains the code for running the strategy.

This simple strategy watches rocket data events for changes in altitude. If the rocket's altitude ever reaches 2 meters above its starting value it considers it a launch and emits a "launched" event on the rocket. The launch threshhold is a parameter that can be tweaked in mission control. It's name in the UI will be `Launch Detection` but it's key in the rocket is `detect-launch`.

strategy/detect-launch
  |- manifest.json
  |- index.js

```json
{
  "name": "Launch Detection",
  "description": "This strategy listens to rocket data for altitude changes. Once the rocket starts moving upward, it emits a 'launched' event.",
  "parameters": {
    "altitudeDelta": {
      "description": "Distance in meters",
      "type": "number",
      "default": 2
    }
  }
}
```

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

