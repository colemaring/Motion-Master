let input = [document.getElementById("gameSelector").value, document.getElementById("portSelector").value];

let cueing = [document.getElementById("linearAccelSlider").value, document.getElementById("maAccelSlider").value, 
document.getElementById("rawSlider").value, document.getElementById("maRawSlider").value];


let axisAssign = [document.getElementById("servo1").value, document.getElementById("servo2").value, 
document.getElementById("maxPitchAngle").value, document.getElementById("maxRollAngle").value];

let test = [document.getElementById("pitchTestSlider").value, document.getElementById("rollTestSlider").value];

let output = [document.getElementById("linearAccelCheckbox").value, document.getElementById("pitchAndRollCheckbox").value];


document.getElementById("inputButton").addEventListener("click", function() { clearTabContent(); removeFocus(); showTabContent("input")})
document.getElementById("cueingButton").addEventListener("click", function() { clearTabContent(); removeFocus(); showTabContent("cueing")})
document.getElementById("axisAssignmentsButton").addEventListener("click", function() { clearTabContent(); removeFocus(); showTabContent("axisAssignments")})
document.getElementById("testButton").addEventListener("click", function() { clearTabContent(); removeFocus(); showTabContent("test")})
document.getElementById("outputButton").addEventListener("click", function() { clearTabContent(); removeFocus(); showTabContent("output")})
document.getElementById("inputButton").click();

document.getElementById("inputApply").addEventListener("click", function() {ipcRenderer.send('input', input); console.log(input[0] + " " + input[1])})
document.getElementById("cueingApply").addEventListener("click", function() {ipcRenderer.send('cueing', cueing);})
document.getElementById("axisAssignmentsApply").addEventListener("click", function() {ipcRenderer.send('axisAssign', axisAssign);})
document.getElementById("pitchTestSlider").addEventListener("change", function() {ipcRenderer.send('pitchTestSlider', document.getElementById("pitchTestSlider").value);})
document.getElementById("rollTestSlider").addEventListener("change", function() {ipcRenderer.send('rollTestSlider', document.getElementById("rollTestSlider").value);})
document.getElementById("outputApply").addEventListener("click", function() {ipcRenderer.send('output', output);})
document.getElementById("stopMotion").addEventListener("click", function() {ipcRenderer.send('stop', "foo");})
document.getElementById("startMotion").addEventListener("click", function() {ipcRenderer.send('start', "foo");})

function clearTabContent()
{
    let tabContent = document.getElementsByClassName("tabcontent");

    for (let i = 0; i < tabContent.length; i++)
    {
        tabContent[i].style.display = "none";
    }
}

function showTabContent(id)
{
    document.getElementById(id).style.display = "block";
    document.getElementById(id + "Button").className += " active";
}

function removeFocus(id)
{
    let tablinks = document.getElementsByClassName("tablinks");

    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
}
