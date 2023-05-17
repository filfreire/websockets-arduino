const { Board, Proximity, Led, Sensor } = require("johnny-five");
const { WebSocket, WebSocketServer } = require("ws");
const board = new Board();
let led;

let distanceThresholdReached = false;
const DISTANCE_THRESHOLD = 50;
const DURATION = 5000; // 3 secs


const DEBUG = false;

const wss = new WebSocketServer({ port: 3000 });

function sendProximityEvents(client, proximity) {
    const { centimeters } = proximity;

    if (centimeters <= DISTANCE_THRESHOLD && !distanceThresholdReached) {
        console.log('DISTANCE_THRESHOLD_REACHED');
        client.send('DISTANCE_THRESHOLD_REACHED');
        distanceThresholdReached = true;
        led.on();
    }
    else if (centimeters > DISTANCE_THRESHOLD) {
        distanceThresholdReached = false;
        led.off()
    }
    if (DEBUG) {
        client.send(JSON.stringify({ 'debug-distance': centimeters }));
        console.log("Proximity  cm  : ", centimeters);
    }

}

function sendSoundTriggerEvent(client, value) {
    if (value !== null) {
        console.log('SOUND_TRIGGER_DETECTED');
        client.send('SOUND_TRIGGER_DETECTED');
    }
    if (DEBUG) {
        client.send(JSON.stringify({ 'debug-sound': value }));
        console.log("debug-sound : ", value);
    }

}


board.on("ready", () => {

    // motor trigger pin 3
    motor1 = new Led(3).off();
    motor2 = new Led(4).off();

    led = new Led(13).off();

    // sensor pin 8
    let sensor = new Sensor.Digital(8);

    // proximity pin A0
    let proximity = new Proximity({
        controller: "HCSR04",
        pin: "A0"
    });

    wss.on('connection', function connection(ws) {
        ws.on('error', console.error);


        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN && board.isReady) {
                console.log('open!');

                proximity.on("change", () => sendProximityEvents(client, proximity));

                sensor.on("change", () => sendSoundTriggerEvent(client, sensor.value));

                client.on('close', function close() {
                    console.log('disconnected');
                    // TODO remove listener not working in subsequent ws connections
                    // proximity.removeListener("change", sendProximityEvents)
                });
            }

            ws.on('message', function message(data) {
                if (board.isReady) {
                    const d = data.toString();
                    if (d === 'TRIGGER_PIN') {
                        console.log('received TRIGGER_PIN');
                        ws.send('motor:on');
                        motor1.on();
                        motor2.on();

                        board.wait(50, function () {motor1.off()});
                        board.wait(50, function () {motor1.on()});
                        board.wait(50, function () {motor1.off()});
                        board.wait(50, function () {motor1.on()});
                        board.wait(DURATION, function () {
                            ws.send('motor:off');
                            motor1.off();
                            motor2.off();
                        });
                    } else {
                        console.log('received unknown message', d)
                    }
                }
            });
        });

    });
});
