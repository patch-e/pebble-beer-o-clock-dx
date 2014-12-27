pebble-beer-o-clock-dx
======================

A silly Pebble watch face featuring a beer mug that fills until Beer O'Clock (aka 5pm).

![Imgur](http://i.imgur.com/TAYQzkfl.jpg)

This is a port of a Pebble 1.0 firmware watchface written by ThomW (http://www.lmnopc.com/) in Pebble's original C SDK.

The intention of the port was to get the watchface up and running on Pebble 2.0+ firmware.

The port was written using [Pebble.js](https://github.com/pebble/pebblejs) on [CloudPebble](https://cloudpebble.net).

My port is differs slightly from the original:
- animates on the minute
- shows AM/PM on the time text
- keeps the Beer O'Clock graphic visible from 5pm-6pm
- doesn't hide the time text during Beer O'Clock
- by nature of being a Pebble.js app, requires the Pebble companion app on the paired phone
