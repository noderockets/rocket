#!/bin/bash

rsync -avz ./ -e ssh pi@$1:~/rocket
