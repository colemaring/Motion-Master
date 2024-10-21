// Creates and applies motion to the cars in our threejs scenes

const { ipcRenderer } = require("electron");

// setup for pitch and roll simulation
const Scene = new THREE.Scene();
const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 1000;
const Camera = new THREE.OrthographicCamera(
  (frustumSize * aspect) / 1.5 / -2,
  (frustumSize * aspect) / 1.5 / 2,
  (frustumSize / 2) * 1.5,
  (frustumSize / -2) * 1.5,
  0.1,
  1000
);

Camera.zoom = 10; // Increase the zoom level further
Camera.updateProjectionMatrix(); // Update the projection matrix after changing the zoom

let Container = document.getElementById("rawCanvas");
const Renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: rawCanvas,
});
Renderer.setClearColor(0xffffff);
Renderer.setSize(Container.clientWidth, Container.clientHeight);
const Controls = new THREE.OrbitControls(Camera, Renderer.domElement);
Controls.dampingFactor = 0.6; // friction
Controls.rotateSpeed = 0.5; // mouse sensitivity
Controls.update();

// setup for g-force simulation
// const simScene = new THREE.Scene();
// //simScene.background = new THREE.Color("white"); // Black color
// const simCamera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 1000);
// let simContainer = document.getElementById("simCanvas")
// const simRenderer = new THREE.WebGLRenderer({antialias: true, canvas: simCanvas});
// simRenderer.setClearColor(0xffffff);
// simRenderer.setSize(simContainer.clientWidth, simContainer.clientHeight);
// const simControls = new THREE.OrbitControls(simCamera, simRenderer.domElement)
// simControls.dampingFactor = 0.6; // friction
// simControls.rotateSpeed = 0.5; // mouse sensitivity
// simControls.update();

// lighting for pitch and roll simulation
const AmbientLight = new THREE.AmbientLight(0xffffff, 0.6);
Scene.add(AmbientLight);
const DirectionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
DirectionalLight.position.set(200, 500, 300);
Scene.add(DirectionalLight);

// lighting for g-force simulation
// const simAmbientLight = new THREE.AmbientLight(0xffffff, 0.6);
// simScene.add(simAmbientLight);
// const simDirectionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
// simDirectionalLight.position.set(200, 500, 300);
// simScene.add(simDirectionalLight);

// creates the wheels for our cars
function createWheels() {
  const geometry = new THREE.BoxBufferGeometry(12, 12, 33);
  const material = new THREE.MeshLambertMaterial({ color: 0x333333 });
  const wheel = new THREE.Mesh(geometry, material);
  return wheel;
}

// create our cars
function createCar(bodyColor, text) {
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
    new THREE.MeshLambertMaterial({ color: bodyColor })
  );

  main.position.y = 12;
  main.rotation.y = Math.PI / 2;
  car.add(main);

  const cabin = new THREE.Mesh(
    new THREE.BoxBufferGeometry(33, 12, 24),
    new THREE.MeshLambertMaterial({ color: 0xa5aab0 })
  );

  cabin.position.set(0, 22, -10);
  cabin.rotation.y = Math.PI / 2;
  car.add(cabin);

  car.position.y -= 8;

  const loader = new THREE.FontLoader();
  loader.load("renderer/Roboto_Regular.json", function (font) {
    const textGeometry = new THREE.TextGeometry(text, {
      font: font,
      size: 5,
      height: 1,
    });
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(15, 12, 8); // Adjust position as needed
    textMesh.rotation.y = Math.PI / 2;
    car.add(textMesh);
  });

  return car;
}

// init our cars and orient them correctly
const car1 = createCar(0xf57e42, "Euler");
const car2 = createCar(0xeb4034, "G-Force");
const car3 = createCar(0xf99efe, "Linear");
// const simCar = createCar(0x3d89d4);
car1.rotation.z = Math.PI / 2;
car1.position.y = -55;
car2.rotation.z = Math.PI * 2;
car2.position.y = -10;
car3.rotation.z = Math.PI * 2;
car3.position.y = 35;
// simCar.rotation.z = (Math.PI / 2);
Scene.add(car1);
Scene.add(car2);
Scene.add(car3);
// simScene.add(simCar);

// position our cameras properly
Camera.rotation.y = Math.PI;
Camera.position.set(70, 20, 20);
// simCamera.rotation.y = Math.PI;
// simCamera.position.set(50, 50, -50);
Camera.lookAt(new THREE.Vector3(0, 0, 0));
// simCamera.lookAt(new THREE.Vector3( 0, 0, 0));
// Camera.zoom *= 100;

// Create text mesh for dynamic data
let dynamicTextMeshPitch;
let dynamicTextMeshYaw;
let dynamicTextMeshRoll;

let fontLoaded = null;
const loader = new THREE.FontLoader();
loader.load("renderer/Roboto_Regular.json", function (font) {
  fontLoaded = font;
  const textGeometryPitch = new THREE.TextGeometry("Pitch: 0", {
    font: font,
    size: 4,
    height: 1,
  });
  const textGeometryYaw = new THREE.TextGeometry("Yaw: 0", {
    font: font,
    size: 4,
    height: 1,
  });
  const textGeometryRoll = new THREE.TextGeometry("Roll: 0", {
    font: font,
    size: 4,
    height: 1,
  });
  const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
  dynamicTextMeshPitch = new THREE.Mesh(textGeometryPitch, textMaterial);
  dynamicTextMeshYaw = new THREE.Mesh(textGeometryYaw, textMaterial);
  dynamicTextMeshRoll = new THREE.Mesh(textGeometryRoll, textMaterial);

  dynamicTextMeshPitch.position.set(20, -38, 55); // Adjust position as needed
  dynamicTextMeshYaw.position.set(20, -45, 55);
  dynamicTextMeshRoll.position.set(20, -52, 55);

  dynamicTextMeshPitch.rotation.y = Math.PI / 2;
  dynamicTextMeshYaw.rotation.y = Math.PI / 2;
  dynamicTextMeshRoll.rotation.y = Math.PI / 2;

  Scene.add(dynamicTextMeshPitch);
  Scene.add(dynamicTextMeshYaw);
  Scene.add(dynamicTextMeshRoll);
});

let xAccel,
  yAccel,
  pitch,
  yaw,
  roll = null;

// data received from packets.js (main process)
// pre-processed given motion control settings
ipcRenderer.on("data", (event, data) => {
  yaw = data[2];
  pitch = data[3];
  roll = data[4];
  xAccel = data[5];
  yAccel = data[6];
  // Update dynamic text
  if (dynamicTextMeshPitch && fontLoaded) {
    const newTextPitch = `Pitch: ${pitch.toFixed(1)}`;
    const newTextYaw = `Yaw: ${yaw.toFixed(1)}`;
    const newTextRoll = `Roll: ${roll.toFixed(1)}`;

    dynamicTextMeshPitch.geometry.dispose(); // Dispose of old geometry
    dynamicTextMeshYaw.geometry.dispose();
    dynamicTextMeshRoll.geometry.dispose();

    dynamicTextMeshPitch.geometry = new THREE.TextGeometry(newTextPitch, {
      font: fontLoaded,
      size: 5,
      height: 1,
    });
    dynamicTextMeshYaw.geometry = new THREE.TextGeometry(newTextYaw, {
      font: fontLoaded,
      size: 5,
      height: 1,
    });
    dynamicTextMeshRoll.geometry = new THREE.TextGeometry(newTextRoll, {
      font: fontLoaded,
      size: 5,
      height: 1,
    });
  }
});

function animate() {
  requestAnimationFrame(animate);

  // update quaternion for Scene
  let Sensitivity = 0.05;
  var car1Quaternion = new THREE.Quaternion();
  car1Quaternion.setFromEuler(
    new THREE.Euler(pitch * Sensitivity, 0, -1 * roll * Sensitivity, "XYZ")
  );
  car1.quaternion.copy(car1Quaternion);
  Controls.update();

  // update quaternion for simScene
  // var simQuaternion = new THREE.Quaternion();
  // simQuaternion.setFromEuler(new THREE.Euler(-1 * yAccel, 0, -1 * xAccel, 'XYZ'));
  // simCar.quaternion.copy(simQuaternion);
  // simControls.update();

  // render the scenes
  Renderer.render(Scene, Camera);
  // simRenderer.render(simScene, simCamera);
}

animate();
