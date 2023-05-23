// const {Board, Servo} = require("johnny-five");
// const {ipcMain } = require('electron')
// const board = new Board({
//   repl: false,
//   port: "COM3",
//   // timeout: 1
// });
// const controller = "PCA9685";

// // ipcMain.on("pitchTestSlider", (event, value) => {
// //   console.log(value)
// // })

// // ipcMain.on("rollTestSlider", (event, value) => {
// //   console.log(value)
// // })

// board.on("ready", () => {
//   console.log("Connected");
//   let pitch, yaw, roll;

//   // Initialize the servo instance
//   const a = new Servo({
//     controller,
//     pin: 0,
//   });

//   const b = new Servo({
//     controller,
//     range: [0, 180],
//     pin: 1,
//   });

//   // a.to(90);
//   // b.to(90);

//   ipcMain.on('data-to-main', (event, data) => {
//      // data received from main process
//      pitch = data[3];
//      yaw = data[2]; 
//      roll = data[4];
//      xAccel = data[5];
// 	   yAccel = data[6];
//      //console.log(roll + " + " + pitch);
//      //console.log(xAccel + " + " + yAccel);
//      let pitchVal = xAccel * -400;
//      let yawVal = yAccel * -400;
//      b.to(pitchVal + yawVal + 110);
//      a.to(pitchVal + -1 * yawVal + 90);
//     //  a.to(90);
//     //  b.to(90);
//   });

//   ipcMain.on("pitchTestSlider", (event, value) => {
//     a.to(value);
//   })
  
//   ipcMain.on("rollTestSlider", (event, value) => {
//     b.to(value);
//   })


//   // a.sweep();
//   // b.to(0);
  
// });