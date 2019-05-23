# Setting up your SD Card

Use this guide to install Raspbian Lite on your SD Card:

[https://hackernoon.com/raspberry-pi-headless-install-462ccabd75d0]

## Configure Raspian

`sudo raspi-config`
* 4 Localisation Options
* I3 Change Keyboard Layout
* Generic 104-key PC
* Keyboard layout: Other
* Country of origin for the keyboard: English (US)
* Keyboard layout: English (US) Alternative International
* Key to function as AltGr: The Default...
* Compose key: No Compose key

`sudo raspi-config`
* 2 Network Options
* N2 Wi-fi
* US
* ssid
* password

check that `/etc/wpa_supplicant/wpa_supplicant.conf` has your changes

install nvm

install node v8.x.x. 
* Node 12 does not have an Arm 6 build yet so it will try to build from source, but after >12 hours it will still fail. 
* The `pigpio` library does not support Node 11.
* The i2c library is written in Coffeescript and does not support Node 10.
```nvm install 8```

`sudo apt-get update`
`sudo apt-get install git`

## Install PIGPIO
`sudo apt-get install pigpio`

## Configure SSH
`sudo raspi-config`
* 5 Interfacing Options
* P2 SSH
* enable SSH server: Yes

## Install i2c tools
`sudo apt-get install -y python-smbus`
`sudo apt-get install -y i2c-tools (may be unnecessary)`


`sudo raspi-config`
* 5 Interfacing Options
* P5 I2C
* enable ARM I2C Interface: Yes


`sudo reboot`


`verify: sudo i2cdetect -y 1`
