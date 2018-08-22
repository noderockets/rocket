#!/bin/bash

cp ~/scripts/headless_pi_zero_setup/wpa_supplicant.conf /Volumes/boot/
touch /Volumes/boot/ssh
cp ~/scripts/headless_pi_zero_setup/config.txt /Volumes/boot/
cp ~/scripts/headless_pi_zero_setup/cmdline.txt /Volumes/boot/

