# Setting up your SD Card

Use [this guide](https://hackernoon.com/raspberry-pi-headless-install-462ccabd75d0) to install Raspbian Lite on your SD Card:

## Configure Raspian

Run from the root repo folder, while the SD card is mounted to your computer
Make sure wpa_supplicant file in the headless_pi_zero_setup folder has the correct credentials
Make sure the path to the SD card is correct (by default it is `/Volumes/boot`)

```
sh headless_pi_zero_setup/run.sh
```

This will allow SSH, connect to the Wi-Fi and allow for a USB OTG connection in case Wi-Fi is not available

`sudo raspi-config`

- 4 Localisation Options
- I3 Change Keyboard Layout
- Generic 104-key PC
- Keyboard layout: Other
- Country of origin for the keyboard: English (US)
- Keyboard layout: English (US)
- Key to function as AltGr: The Default...
- Compose key: No Compose key

- 2 Network Options
- N2 Wi-fi
- US
- ssid
- password

check that `/etc/wpa_supplicant/wpa_supplicant.conf` has your changes

install nvm

install node

`sudo apt-get update`
`sudo apt-get install git`

## Install PIGPIO

`sudo apt-get install pigpio`

## Configure SSH

`sudo raspi-config`

- 5 Interfacing Options
- P2 SSH
- enable SSH server: Yes

## Install i2c tools

`sudo apt-get install -y python-smbus`
`sudo apt-get install -y i2c-tools (may be unnecessary)`

sudo raspi-config

- 5 Interfacing Options
- P5 I2C
- enable ARM I2C Interface: Yes

`sudo reboot`

`verify: sudo i2cdetect -y 1`
