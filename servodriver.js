const {Board, Servo} = require("johnny-five");
const board = new Board({
  repl: false,
  port: "COM3"
});
const controller = "PCA9685";

board.on("ready", () => {
  console.log("Connected");

  // Initialize the servo instance
  const a = new Servo({
    controller,
    pin: 0,
  });

  const b = new Servo({
    controller,
    range: [0, 180],
    pin: 1,
  });

  a.sweep();
  b.to(0);
  
});