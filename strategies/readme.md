# Strategies

A strategy is a class that receives data from the rocket and emits events to the rocket/mission-control based on that data. The rocket automatically loads everything in `strategies/*.js`. These strategies can be enabled and modified through mission control. Check out `example.md` and `full.md` for more info.

## Events

You can handle rocket events by registering handlers as class methods. You can listen to built-in events with:
- `rocketDidEmitData(data)`
- `parachuteDidArm()`
- `parachuteDidDeploy()`
- `parachuteDidDisarm()`
If you don't register these, or if you return false from the class method, the event will propogate down to `onEvent(name, data)`.

Custom events are events that you create and emit in your strategies. They can be registered on strategies as: `rocket${UpperCamelCase(your-event)}`. For example, if you emit the event `did-launch`, then other strategies may register that event with `rocketDidLaunch`. If you don't have a handler, events will bubble up to `onCustomEvent(name, msg)`. If that's not defined, it'll bubble up to `onEvent(name, data, isCustom)`.

## Context

There are 4 properties/methods available for use anywhere in your strategy with one exception: they are not available in the `constructor(props)`.
- `this.props`: These are the properties defined in your strategy's `propTypes`.
- `this.error(err)`: Call this to emit an error to mission control.
- `this.log(msg)`: Call this to log data to mission control.
- `this.emit(name, data)`: Invoke this to emit a new custom event.
