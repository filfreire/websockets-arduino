const { Board, Proximity, Led } = require("johnny-five");
const { WebSocket, WebSocketServer } = require("ws");
const board = new Board();
let led;

let distanceThresholdReached = false;
const DISTANCE_THRESHOLD = 50;

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

board.on("ready", () => {

    led = new Led(13).off();
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

                client.on('close', function close() {
                    console.log('disconnected');
                    // TODO remove listener not working in subsequent ws connections
                    // proximity.removeListener("change", sendProximityEvents)
                });
            }
        });

    });
});
