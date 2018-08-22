# NodeRockets

## Building a Rocket
If you are participating in a NodeRockets event, a pre-configured SD Card will be provided to you. If not you can find the SD Card setup instructions here: [https://github.com/noderockets/rocket/blob/master/instructions/sd-card.md]

## Other Instructions
* [Fuselage](https://github.com/noderockets/rocket/blob/master/instructions/fuselage.md)
* [Onboard Computer](https://github.com/noderockets/rocket/blob/master/instructions/control-system.md)
* [Flight Control Software](https://github.com/noderockets/strategy)
* [Mission Control Software](https://github.com/noderockets/mission-control)
* [Launch Platform](https://github.com/noderockets/rocket/blob/master/instructions/launch-platform.md)
* [Launch Computer](https://github.com/noderockets/rocket/blob/master/instructions/launch-computer.md)
* [Launch Software](https://github.com/noderockets/rocket/blob/master/instructions/launch-software.md)

## Usage
ssh to your Raspberry Pi and run the following commands:
```sh
cd rocket
git pull origin master
npm install
sudo node server
```

This should start the flight control and mission control software on your onboard computer. You should check mission control by visiting your onboard computer's IP address via a browser. Run through a basic systems check to make sure all systems are functioning propperly.

The default strategies for arming, launching and deploying parachute are pretty basic. Once you have made sure your systems are functioning, you should head over to the strategies folder to improve your flight control software.
