import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const loader = new GLTFLoader();
const light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);

let arcade;

loader.load(
  'assets/models/macintosh2.glb',
  function (gltf) {
    arcade = gltf.scene;
    scene.add(arcade);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);
camera.position.z = 2;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  arcade.rotation.y += 0.005;
}
animate();
