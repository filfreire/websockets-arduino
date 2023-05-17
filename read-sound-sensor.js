const { Board, Pin, Sensor } = require("johnny-five");
const { WebSocket, WebSocketServer } = require("ws");
const board = new Board();

const DEBUG = false;

let sensor = null;
const wss = new WebSocketServer({ port: 3000 });

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

board.on("ready", function () {
    sensor = new Sensor.Digital(8);
});

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN && board.isReady) {
            console.log('open!');
            sensor.on("change", () => {
                sendSoundTriggerEvent(client, sensor.value)
            });
            client.on('close', function close() {
                console.log('disconnected');
            });
        }
    });
});
