// Creates and applies motion to the cars in our threejs scenes

const {ipcRenderer} = require("electron");

// setup for pitch and roll simulation
const rawScene = new THREE.Scene();
const rawCamera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 1000);
let rawContainer = document.getElementById("rawCanvas")
const rawRenderer = new THREE.WebGLRenderer({antialias: true, canvas: rawCanvas});
rawRenderer.setClearColor(0xffffff);
rawRenderer.setSize(rawContainer.clientWidth, rawContainer.clientHeight);
const rawControls = new THREE.OrbitControls(rawCamera, rawRenderer.domElement)
rawControls.dampingFactor = 0.6; // friction
rawControls.rotateSpeed = 0.5; // mouse sensitivity
rawControls.update();

// setup for g-force simulation
const simScene = new THREE.Scene();
//simScene.background = new THREE.Color("white"); // Black color
const simCamera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 1000);
let simContainer = document.getElementById("simCanvas")
const simRenderer = new THREE.WebGLRenderer({antialias: true, canvas: simCanvas});
simRenderer.setClearColor(0xffffff);
simRenderer.setSize(simContainer.clientWidth, simContainer.clientHeight);
const simControls = new THREE.OrbitControls(simCamera, simRenderer.domElement)
simControls.dampingFactor = 0.6; // friction
simControls.rotateSpeed = 0.5; // mouse sensitivity
simControls.update();


// lighting for pitch and roll simulation
const rawAmbientLight = new THREE.AmbientLight(0xffffff, 0.6);
rawScene.add(rawAmbientLight);
const rawDirectionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
rawDirectionalLight.position.set(200, 500, 300);
rawScene.add(rawDirectionalLight);

// lighting for g-force simulation
const simAmbientLight = new THREE.AmbientLight(0xffffff, 0.6);
simScene.add(simAmbientLight);
const simDirectionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
simDirectionalLight.position.set(200, 500, 300);
simScene.add(simDirectionalLight);

// creates the wheels for our cars
function createWheels() {
    const geometry = new THREE.BoxBufferGeometry(12, 12, 33);
    const material = new THREE.MeshLambertMaterial({color: 0x333333});
    const wheel = new THREE.Mesh(geometry, material);
    return wheel;
}

// create our cars
function createCar(bodyColor) {
	const car = new THREE.Group();
	
	const backWheel = createWheels();
	backWheel.position.y = 5;
	backWheel.position.x = 0;
	backWheel.position.z = -20;
	backWheel.rotation.y = Math.PI / 2;
	car.add(backWheel);
	
	const frontWheel = createWheels();
	frontWheel.position.y = 5;  
	frontWheel.position.x = 0;
	frontWheel.position.z = 20;
	frontWheel.rotation.y = Math.PI / 2;
	car.add(frontWheel);
  
	const main = new THREE.Mesh(
	  new THREE.BoxBufferGeometry(60, 15, 30),
	  new THREE.MeshLambertMaterial({color: bodyColor})
	);

	main.position.y = 12;
	main.rotation.y = Math.PI / 2;
	car.add(main);
  
	const cabin = new THREE.Mesh(
	  new THREE.BoxBufferGeometry(33, 12, 24),
	  new THREE.MeshLambertMaterial({color: 0xa5aab0})
	);

    cabin.position.set(0, 22, -10);
	cabin.rotation.y = Math.PI / 2;
	car.add(cabin);

	car.position.y -= 8;
  
    return car;
}


// init our cars and orient them correctly
const rawCar = createCar(0xf57e42);
const simCar = createCar(0x3d89d4);
rawCar.rotation.z = (Math.PI / 2);
simCar.rotation.z = (Math.PI / 2);
rawScene.add(rawCar);
simScene.add(simCar);

// position our cameras properly
rawCamera.rotation.y = Math.PI;
rawCamera.position.set(50, 50,-50);
simCamera.rotation.y = Math.PI;
simCamera.position.set(50, 50, -50);
rawCamera.lookAt(new THREE.Vector3( 0, 0, 0));
simCamera.lookAt(new THREE.Vector3( 0, 0, 0));
// rawCamera.zoom *= 100;

let xAccel, yAccel, pitch, yaw, roll = null;

// data received from packets.js (main process)
// pre-processed given motion control settings
ipcRenderer.on('data', (event, data) => {
    yaw = data[2];
	pitch = data[3];
	roll = data[4];
    xAccel = data[5];
	yAccel = data[6]; 
  })

function animate() {
	requestAnimationFrame(animate);

	// update quaternion for rawScene
	let rawSensitivity = 0.05;
	var rawQuaternion = new THREE.Quaternion();
	rawQuaternion.setFromEuler(new THREE.Euler(pitch * rawSensitivity, 0, -1 * roll * rawSensitivity, 'XYZ'));
	rawCar.quaternion.copy(rawQuaternion);
	rawControls.update();
    
    // update quaternion for simScene
	var simQuaternion = new THREE.Quaternion();
	simQuaternion.setFromEuler(new THREE.Euler(-1 * yAccel, 0, -1 * xAccel, 'XYZ'));
	simCar.quaternion.copy(simQuaternion);
	simControls.update();

    // render the scenes
	rawRenderer.render(rawScene, rawCamera);
    simRenderer.render(simScene, simCamera);
}

animate();