const {ipcRenderer} = require("electron");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
let container = document.getElementById("simulation")
const renderer = new THREE.WebGLRenderer({antialias: true, canvas: simulation } );
renderer.setSize( container.clientWidth, container.clientHeight );

const controls = new THREE.OrbitControls(camera, renderer.domElement)
controls.dampingFactor = 0.6; // friction
controls.rotateSpeed = 0.5; // mouse sensitivity
controls.update();

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(200, 500, 300);
scene.add(directionalLight);

function createWheels() {
	const geometry = new THREE.BoxBufferGeometry(12, 12, 33);
	const material = new THREE.MeshLambertMaterial({ color: 0x333333 });
	const wheel = new THREE.Mesh(geometry, material);
	return wheel;
  }

  function createCar() {
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
	  new THREE.MeshLambertMaterial({ color: 0x78b14b })
	);
	main.position.y = 12;
	main.rotation.y = Math.PI / 2;
	car.add(main);
  
	const cabin = new THREE.Mesh(
	  new THREE.BoxBufferGeometry(33, 12, 24),
	  new THREE.MeshLambertMaterial({ color: 0xffffff })
	);
	cabin.position.x = 0;
	cabin.position.y = 22;
	cabin.position.z = -10;
	cabin.rotation.y = Math.PI / 2;
	car.add(cabin);
  
	return car;
  }

  const car = createCar();

  car.rotation.z = (Math.PI / 2);

  scene.add(car);

camera.rotation.y = Math.PI;
camera.position.z = -50;
camera.position.x = 50;
camera.position.y = 50;

var point = new THREE.Vector3( 0, 0, 0 );

camera.lookAt( point );

let pitch = null;
let yaw = null;
let roll = null;

ipcRenderer.on('data', (event, data) => {
	// data received from main process
	pitch = data[3];
	yaw = data[2]; 
	roll = data[4];
  })

function animate() {
	requestAnimationFrame( animate );

	// update pitch, yaw, and roll

	// update quaternion
	let sensitivity = 0.05;
	var quaternion = new THREE.Quaternion();
	quaternion.setFromEuler(new THREE.Euler(pitch * sensitivity, 0, -1 * roll * sensitivity, 'XYZ'));
	car.quaternion.copy(quaternion);
	controls.update();
	//car.rotation.y = Math.PI /2;

	renderer.render( scene, camera );
}

animate();

