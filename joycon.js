// Adapted from https://github.com/tomayac/joy-con-webhid

import * as JoyCon from './node_modules/joy-con-webhid/src/index.js';

// For the initial pairing of the Joy-Cons. They need to be paired one by one.
// Once paired, Joy-Cons will be reconnected to on future page loads.
document.querySelector('.connect').addEventListener('click', async () => {
  // `JoyCon.connectJoyCon()` handles the initial HID pairing.
  // It keeps track of connected Joy-Cons in the `JoyCon.connectedJoyCons` Map.
  await JoyCon.connectJoyCon();
});

const rumble = document.getElementById('rumble-trigger');

// Joy-Cons may sleep until touched and fall asleep again if idle, so attach
// the listener dynamically, but only once.
setInterval(async () => {
  for (const joyCon of JoyCon.connectedJoyCons.values()) {
    if (joyCon.eventListenerAttached) {
      continue;
    }
    // Open the device and enable standard full mode and inertial measurement
    // unit mode, so the Joy-Con activates the gyroscope and accelerometers.
    await joyCon.open();
    await joyCon.enableVibration();

    if (!rumble.eventListenerAttached) {
        rumble.addEventListener('click', async () => {
            await joyCon.rumble(200, 200, 0.9);
            rumble.eventListenerAttached = true;
        });
    }

    joyCon.eventListenerAttached = true;
  }
}, 1000);