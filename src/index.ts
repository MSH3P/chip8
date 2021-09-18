import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Texture, Vector3 } from 'three';
const essentials = () => {
  return {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    ),
    renderer: new THREE.WebGLRenderer(),
  };
};

const appendToDom = (renderer: any) => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
};

const addLight = (scene: any) => {
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
  directionalLight.position.add(new Vector3(2, 3, 2));
  scene.add(directionalLight);
};

const cameraPosition = (camera: any) => {
  camera.position.z = 5;
};

const image = (width: number, height: number) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'red';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = 'blue';
  ctx.fillRect(200, 150, 10, 10);

  return canvas.toDataURL();
};

const initControls = (isDev, camera, renderer) => {
  return isDev ? new OrbitControls(camera, renderer.domElement) : null;
};

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  if (computer != null) computer.rotation.y += 0.005;
  if (controls != null) controls.update();
}

const init = essentials();

const scene = init.scene;
const camera = init.camera;
const renderer = init.renderer;

let controls = initControls(true, camera, renderer);

appendToDom(renderer);
cameraPosition(camera);
addLight(scene);

let computer;
let terminal;

const loader = new GLTFLoader();
loader.load(
  'assets/models/macintosh2.glb',
  function (gltf) {
    computer = gltf.scene;
    terminal = computer.children[3];

    const texture = new THREE.TextureLoader().load(image(640, 320), () => {
      texture.needsUpdate = true;
    });

    terminal.material = new THREE.MeshBasicMaterial({
      map: texture,
    });

    computer.rotation.y = 270 * (Math.PI / 180);
    scene.add(computer);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

animate();
