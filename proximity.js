const { Board, Proximity, Led } = require("johnny-five");
const { WebSocketServer } = require("ws");
const board = new Board();
let proximity, led;

const wss = new WebSocketServer({ port: 3000 });

board.on("ready", () => {
    proximity = new Proximity({
        controller: "HCSR04",
        pin: "A0"
    });

    led = new Led(13).off();
});

let distanceThresholdReached = false;
const DISTANCE_THRESHOLD = 50;

const DEBUG = false;

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    proximity.on("change", () => {
        const { centimeters } = proximity;

        if (centimeters <= DISTANCE_THRESHOLD && !distanceThresholdReached) {
            console.log('DISTANCE_THRESHOLD_REACHED');
            ws.send(JSON.stringify({ 'event': 'DISTANCE_THRESHOLD_REACHED' }));
            distanceThresholdReached = true;
            led.on();
        }
        else if (centimeters > DISTANCE_THRESHOLD) {
            distanceThresholdReached = false;
            led.off()
        }
        if (DEBUG) {
            ws.send(JSON.stringify({ 'debug-distance': centimeters }));
            console.log("Proximity  cm  : ", centimeters);
        }

    });
});