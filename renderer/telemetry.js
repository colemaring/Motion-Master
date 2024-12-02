const { ipcRenderer } = require("electron");
let timeout;

ipcRenderer.send("motionControl", motionControl);
ipcRenderer.send("input", input);

drawTractionCircle(0, 0);

ipcRenderer.on("data", (event, data) => {
  // data received from main process
  document.getElementById("gForce").innerHTML = data[1].toFixed(2);
  // document.getElementById("pitchValue").innerHTML = data[3].toFixed(1);
  // document.getElementById("yawValue").innerHTML = data[2].toFixed(1); //just for display
  // document.getElementById("rollValue").innerHTML = data[4].toFixed(1);
  document.getElementById("rpmValue").innerHTML = data[0].toFixed(0);
  document.getElementById("maxrpmValue").innerHTML = data[11].toFixed(0);
  // document.getElementById("xAccelValue").innerHTML = (data[5] * 10).toFixed(1);
  // document.getElementById("yAccelValue").innerHTML = (data[6] * 10).toFixed(1);
  // document.getElementById("zAccelValue").innerHTML = (data[10] * 10).toFixed(1);
  document.getElementById("gearValue").innerHTML = data[7];
  document.getElementById("throttleValue").innerHTML = (data[8] / 255) * 100;
  document.getElementById("brakeValue").innerHTML = (data[9] / 255) * 100;
  document.getElementById("pitchText").textContent = `Pitch: ${data[3].toFixed(
    1
  )}`;
  document.getElementById("yawText").textContent = `Yaw: ${data[2].toFixed(1)}`;
  document.getElementById("rollText").textContent = `Roll: ${data[4].toFixed(
    1
  )}`;
  document.getElementById("xAccelText").textContent = `xAccel: ${(
    data[5] * 10
  ).toFixed(1)}`;
  document.getElementById("yAccelText").textContent = `yAccel: ${(
    data[6] * 10
  ).toFixed(1)}`;
  document.getElementById("zAccelText").textContent = `zAccel: ${(
    data[10] * 10
  ).toFixed(1)}`;
  document.getElementById("heaveText").textContent = `Heave: ${(
    data[10] * 10
  ).toFixed(1)}`;
  document.getElementById("swayText").textContent = `Sway: ${(
    data[5] * 10
  ).toFixed(1)}`;
  document.getElementById("surgeText").textContent = `Surge: ${(
    data[6] * 10
  ).toFixed(1)}`;

  drawTractionCircle(data[5], data[6]);
  changeConnectionStatus(data[0]);

  // send to servo driver
  ipcRenderer.send("data-to-main", data);
});

// when board is ready (main.js), update html text
document.getElementById("arduinoConnected").style.color = "red";
ipcRenderer.on("update-html-text", (event, newText) => {
  // Update the HTML text
  document.getElementById("arduinoConnected").innerText = newText[0];
  document.getElementById("outputApply").disabled = newText[1];
  document.getElementById("outputApplySettings").disabled = !newText[1];
  if (newText[1] == true)
    document.getElementById("arduinoConnected").style.color = "green";
  else document.getElementById("arduinoConnected").style.color = "red";
});

// after some time of server inactivity we should change the status
function changeConnectionStatus(data) {
  if (data >= 0) {
    document.getElementById("connectionStatus").innerHTML = "Connected to FH5";
    document.getElementById("connectionStatus").style.color = "green";

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      document.getElementById("connectionStatus").innerHTML =
        "Not connected to a game";
      document.getElementById("connectionStatus").style.color = "red";
    }, 500);
  }
}

// draws our traction circle
function drawTractionCircle(xAccel, yAccel) {
  var canvas = document.getElementById("tractionCircle");
  var context = canvas.getContext("2d");

  context.clearRect(0, 0, canvas.width, canvas.height);

  // outer circle
  context.beginPath();
  context.arc(
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 2 - 10,
    0,
    2 * Math.PI
  );
  context.stroke();

  // crosshairs
  context.beginPath();
  context.moveTo(canvas.width / 2, 10);
  context.lineTo(canvas.width / 2, canvas.height - 10);
  context.moveTo(10, canvas.height / 2);
  context.lineTo(canvas.width - 10, canvas.height / 2);
  context.stroke();

  // red dot math
  var x = -1 * (xAccel * 4 * (canvas.width / 2 - 10)) + canvas.width / 2;
  var y = yAccel * 4 * (canvas.height / 2 - 10) + canvas.height / 2;

  // line from center to red dot
  context.beginPath();
  context.moveTo(canvas.width / 2, canvas.height / 2);
  context.lineTo(x, y);
  context.lineWidth = 2; // set the line width
  context.stroke();
  context.lineWidth = 1; // reset the line width

  // red dot
  context.beginPath();
  context.arc(x, y, 5, 0, 2 * Math.PI);
  context.fillStyle = "red";
  context.fill();
}
