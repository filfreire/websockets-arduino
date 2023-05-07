const { Board, Led } = require("johnny-five");
const { WebSocketServer } = require("ws");
const board = new Board();

// Create an Led on pin 13
let led;

board.on("ready", () => {
  led = new Led(13).off();
  // Blink every half second
  // led.blink(500);
});


const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    const parsedData = JSON.parse(data);
    if (board.isReady) {
      if (parsedData.led == "on") { // on
        ws.send('led:on');
        led.on();
      }

      if (parsedData.led == "off") { // off
        ws.send('led:off');
        led.off();
      }
    }
  });

  ws.send('something');
});