const {ipcMain, BrowserWindow } = require('electron')
const dgram = require("dgram");
let server = dgram.createSocket("udp4");

function sendDataToRenderer(data) {
  // Get all open windows
  const windows = BrowserWindow.getAllWindows()
  let dataProccessed = dataProcessing(data);

  // Send data to the first window
  if (windows.length > 0) {
    windows[0].webContents.send('data', dataProccessed)
  }
}

function calculateGForce(x, z) {
    let gForce = Math.sqrt(x * x + z * z) / 9.8;
    gForce = Math.trunc(gForce * 100) / 100;
    return gForce;
}

// the data returned by this function will be ready to be rendered or applied to servos
function dataProcessing(data){
  let rpm = data[0];
  let xAccel = movingAverage(data[5]) * linearAccelValue;
  let yAccel = movingAverage2(data[6]) * linearAccelValue;
  let gForce = calculateGForce(movingAverage(data[5]), movingAverage2(data[6]));
  let yaw = data[2];
  let pitch = movingAverage3(data[3]) * rawValue;
  let roll = movingAverage4(data[4]) * rawValue;

  const returnData = [rpm, gForce, yaw, pitch, roll, xAccel, yAccel];
  return returnData;
}

let game, port, linearAccelValue, maAccelValue, 
rawValue, maRawValue = null;

ipcMain.on("input", (event, input) => {
  game = input[0];
  port = input[1];
  server.bind(port);
})

ipcMain.on("cueing", (event, cueing) => {
  linearAccelValue = cueing[0];
  maAccelValue = cueing[1];
  rawValue = cueing[2];
  maRawValue = cueing[3];
})

server.on("message", (msg) => {
  let rpm, xAccel, zAccel, yaw, pitch, roll = null;

  if(game === "FH5"){
    rpm = Math.floor(Buffer.from(msg.slice(16, 20)).readFloatLE() * 100) / 100;
    xAccel = Math.floor(Buffer.from(msg.slice(20, 24)).readFloatLE() * 100) / 100;
    zAccel = Math.floor(Buffer.from(msg.slice(28, 32)).readFloatLE() * 100) / 100;
    yaw = Math.floor(Buffer.from(msg.slice(32+24, 36+24)).readFloatLE() * 10000) / 100;
    pitch = Math.floor(Buffer.from(msg.slice(36+24, 40+24)).readFloatLE() * 10000) / 100;
    roll = Math.floor(Buffer.from(msg.slice(40+24, 44+24)).readFloatLE() * 10000) / 100;
  }

  const returnData = [rpm, 0, yaw, pitch, roll, xAccel, zAccel];
  sendDataToRenderer(returnData)
})

const movingAverage = (function() {
  let windowSize = maAccelValue;
  const values = [];

  return function(newValue) {
    if (maAccelValue !== windowSize) {
      windowSize = maAccelValue;
      values.length = 0;
    }
    values.push(newValue);

    if (values.length > windowSize) {
      values.shift();
    }

    const sum = values.reduce((acc, val) => acc + val, 0);

    return sum / values.length;
  }
})();

const movingAverage2 = (function() {
  let windowSize = maAccelValue;
  const values = [];

  return function(newValue) {
    if (maAccelValue !== windowSize) {
      windowSize = maAccelValue;
      values.length = 0;
    }
    values.push(newValue);

    if (values.length > windowSize) {
      values.shift();
    }

    const sum = values.reduce((acc, val) => acc + val, 0);

    return sum / values.length;
  }
})();

const movingAverage3 = (function() {
  let windowSize = maRawValue;
  const values = [];

  return function(newValue) {
    if (maAccelValue !== windowSize) {
      windowSize = maAccelValue;
      values.length = 0;
    }
    values.push(newValue);

    if (values.length > windowSize) {
      values.shift();
    }

    const sum = values.reduce((acc, val) => acc + val, 0);

    return sum / values.length;
  }
})();

const movingAverage4 = (function() {
  let windowSize = maRawValue;
  const values = [];

  return function(newValue) {
    if (maAccelValue !== windowSize) {
      windowSize = maAccelValue;
      values.length = 0;
    }
    values.push(newValue);

    if (values.length > windowSize) {
      values.shift();
    }

    const sum = values.reduce((acc, val) => acc + val, 0);

    return sum / values.length;
  }
})();



