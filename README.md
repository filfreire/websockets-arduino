# websockets-arduino

Experiments using arduino and websockets

## List of experiments

- Lighting a LED via websocket event
- Reading proximity values from HCSR-04 sensor and triggering a server-sent websocket event
- Remotely triggering a pin from a websocket event done by the client
- Read KY-038 sound values using Sensor.Digital
- (non-arduino related) - connecting to a [Joy-Con controller](https://en.wikipedia.org/wiki/Joy-Con) and triggering the rumble

## Running an experiment

Example running `ledtest.js`

```shell
npm i

node ledtest.js
```

![example screenshot](example.jpg)

Connect to `ws://localhost:3000`, and send:

```json
{
    "led": "on"
}
```

![insomnia example websocket connection](insomnia-led.jpg)

![example of led on, arduino](led-arduino.jpg)

### Windows problems

- Install Python and Visual Studio (with C++ libs)
- Install `node-gyp` - `npm install -g node-gyp`
- Install `serialport` - `npm install serialport`

## See also

- [https://www.instructables.com/Javascript-robotics-and-browser-based-Arduino-cont/]
- [https://www.makeuseof.com/tag/control-arduino-using-javascript/]
- [https://github.com/rwaldron/johnny-five/blob/main/docs/proximity-hcsr04.md]
- [https://www.geeksforgeeks.org/how-to-open-web-cam-in-javascript/]
- [https://www.tutorialspoint.com/arduino/arduino_dc_motor.htm]
- [https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/message_event]
- [https://github.com/rwaldron/johnny-five/blob/main/docs/sensor.md]
- [https://github.com/tomayac/joy-con-webhid]
