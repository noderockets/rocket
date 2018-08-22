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

Install nvm

```
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```

Install node 8

```
nvm install 8
nvm use 8
```

## Install dependencies

`sudo apt-get update`
`sudo apt-get install git pigpio python-smbus i2c-tools`

## Enable i2c

`sudo raspi-config`

- 5 Interfacing Options
- P5 I2C
- enable ARM I2C Interface: Yes

`sudo reboot`

`verify: sudo i2cdetect -y 1`
