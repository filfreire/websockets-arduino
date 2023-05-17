const { Board, Led } = require("johnny-five");
const { WebSocketServer } = require("ws");
const board = new Board();

const DURATION = 3000; // 3 secs

// Create an Led on pin 13
let led;

board.on("ready", () => {
    led = new Led(13).off();
});


const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    ws.on('message', function message(data) {
        if (board.isReady) {
            const d = data.toString();
            if (d === 'TRIGGER_PIN') {
                console.log('received TRIGGER_PIN');
                ws.send('led:on');
                led.on();
                board.wait(DURATION, function () {
                    ws.send('led:off');
                    led.off();
                });
            } else {
                console.log('received unknown message', d)
            }
        }
    });
});