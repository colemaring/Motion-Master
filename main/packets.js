// reads data from game, calculates, and sends to renderer processes

const {ipcMain, BrowserWindow } = require('electron')
const dgram = require("dgram");
let server = dgram.createSocket("udp4");
let game, port, linearAccelValue, maAccelValue, rawValue, maRawValue = null;
let invertPitch, invertRoll = 1;

// when apply button clicked on input tab
ipcMain.on("input", (event, input) => {
    game = input[0];
    port = input[1];
  
    // server is unbound
    if (server._bindState == 0) {
      server.bind(port);
      return;
    }
  
    // server is bound, port was changed
    if (server._bindState == 2) {
      server.close(() => {
        server = dgram.createSocket('udp4');
        server.bind(port);
        server.on("message", handleMessage);
      });
    }
  });

// when apply button clicked on motionControl tab
ipcMain.on("motionControl", (event, motionControl) => {
  linearAccelValue = motionControl[0];
  maAccelValue = motionControl[1];
  rawValue = motionControl[2];
  maRawValue = motionControl[3];

  if (motionControl[4])
    invertPitch = -1;
  else
    invertPitch = 1;
  if (motionControl[5])
    invertRoll = -1;
  else
    invertRoll = 1;
})

// does this have to exist here? or can it be deleted
server.on("message", handleMessage);

// turns raw bytes from packets into useable data
function handleMessage(msg)
{
  let rpm, xAccel, zAccel, yaw, pitch, roll = null;

  if(game === "FH5"){
    rpm = Math.floor(Buffer.from(msg.slice(16, 20)).readFloatLE() * 100) / 100;
    xAccel = invertRoll * Math.floor(Buffer.from(msg.slice(20, 24)).readFloatLE() * 100) / 100;
    zAccel = invertPitch * Math.floor(Buffer.from(msg.slice(28, 32)).readFloatLE() * 100) / 100;
    yaw = Math.floor(Buffer.from(msg.slice(32+24, 36+24)).readFloatLE() * 10000) / 100;
    pitch = invertPitch * Math.floor(Buffer.from(msg.slice(36+24, 40+24)).readFloatLE() * 10000) / 100;
    roll = invertRoll * Math.floor(Buffer.from(msg.slice(40+24, 44+24)).readFloatLE() * 10000) / 100;
  }

  const returnData = [rpm, 0, yaw, pitch, roll, xAccel, zAccel];
  sendDataToRenderer(returnData)
}

// the data returned by this function will be ready to be rendered or applied to servos
// the data returned by here will also correspond to the threejs cars
function dataProcessing(data){
    let rpm = data[0];
    let xAccel = xAccelMovingAverage(data[5]) * linearAccelValue;
    let yAccel = yAccelMovingAverage(data[6]) * linearAccelValue;
    let gForce = calculateGForce(xAccelMovingAverage(data[5]), yAccelMovingAverage(data[6]));
    let yaw = data[2];
    let pitch = pitchMovingAverage(data[3]) * rawValue;
    let roll = rollMovingAverage(data[4]) * rawValue;
  
    const returnData = [rpm, gForce, yaw, pitch, roll, xAccel, yAccel];
    return returnData;
}

// used to display car motion, traction circle, telemetery, and used for servo motion
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

const xAccelMovingAverage = (function() {
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
  
const yAccelMovingAverage = (function() {
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
  
const pitchMovingAverage = (function() {
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
  
const rollMovingAverage = (function() {
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