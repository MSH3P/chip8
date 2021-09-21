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

const addLight = (
  scene: any,
  color: number,
  intensity: number,
  position: Vector3,
  visual: boolean
) => {
  const directionalLight = new THREE.DirectionalLight(color, intensity);
  directionalLight.position.add(position);
  directionalLight.lookAt(0, 0, 0);
  scene.add(directionalLight);

  console.log(visual);
  if (visual) {
    const visualize = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.1, 0.1),
      new THREE.MeshBasicMaterial({ color: color })
    );
    visualize.position.set(position.x, position.y, position.z);
    scene.add(visualize);
  }
};

const cameraPosition = (camera: any, zPos: number) => {
  camera.position.z = zPos;
};

const background = (scene) => {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('nebula.png', () => {
    const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
    rt.fromEquirectangularTexture(renderer, texture);
    scene.background = rt.texture;
  });
  return texture;
};

const image = (width: number, height: number) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#00FF01';
  ctx.fillRect(0, 0, 1, 1);
  ctx.font = '30px Arial';
  ctx.fillText('Hello World', 10, 50);

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
const ackground = background(scene);

let controls = initControls(true, camera, renderer);

appendToDom(renderer);
cameraPosition(camera, 2);
// three scenes of light that match the background;
addLight(scene, 0xff0000, 0.1, new Vector3(10, 3, -4), true);
addLight(scene, 0x0000ff, 0.1, new Vector3(-20, -5, 0), true);
addLight(scene, 0xffffff, 0.05, new Vector3(0, 0, 10), true);

let computer;
let terminal;

const loader = new GLTFLoader();
loader.load(
  'assets/models/macintosh2.glb',
  function (gltf) {
    computer = gltf.scene;
    terminal = computer.children[3];

    const texture = new THREE.TextureLoader().load(image(640, 320));
    texture.flipY = false;

    terminal.material = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
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
