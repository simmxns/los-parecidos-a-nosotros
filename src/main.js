// @ts-check
import * as THREE from 'three'
import { MapControls } from 'three/examples/jsm/controls/OrbitControls';
import { WINDOW_HEIGHT, WINDOW_WIDTH, LIMIT_MAX_X, LIMIT_MIN_X, LIMIT_MAX_Y, LIMIT_MIN_Y } from './constants'




let scene, camera, renderer, controls, listener;

document.addEventListener('DOMContentLoaded', () => {
  init()
  animate()
})

function init() {
  scene = new THREE.Scene()
  listener = new THREE.AudioListener();
  camera = new THREE.PerspectiveCamera(70, WINDOW_WIDTH / WINDOW_HEIGHT, 0.1, 1000);
  camera.add(listener)
  camera.position.set(0, -500, 5000);


  const getImageRatioPlane = async () => {
    const texture = await new THREE.TextureLoader().loadAsync('./textures/map4.jpg');
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const geometry = new THREE.PlaneGeometry(texture.image.width, texture.image.height);
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    return geometry
  }
  
  
  
  
  renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(WINDOW_WIDTH, WINDOW_HEIGHT)
  document.body.appendChild(renderer.domElement)
  
  setMapControls(getImageRatioPlane())
  addSound(listener, { path: 'sounds/rain.mp3', loop: true, volume: .09 });
}

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
  controls.update()
}


function addSound(listener, { path, loop, volume }) {
  const sound = new THREE.Audio( listener );
  //const sound = new THREE.PositionalAudio( listener );

  const audioLoader = new THREE.AudioLoader();
  
  audioLoader.load(path, function(buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(loop);
    sound.setVolume(volume);
    sound.play();
  });
}

function setMapControls(geometry) {
  const controlState = {
    positionX: 0,
    positionY: 0,
    phi: 0,
    theta: 0,
  }
  const { positionX, positionY, phi, theta } = controlState

  controls = new MapControls(camera, renderer.domElement);

  controls.screenSpacePanning = true;
  controls.minDistance = 1;
  controls.maxDistance = 600;
  controls.enableRotate = false
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  //controls.maxPolarAngle = Math.PI / 2;
  
  var box = new THREE.Box3();
  box.setFromObject(controls.object);

  const minPan = new THREE.Vector3(-200, -140, 0);
  const maxPan = new THREE.Vector3(200, 85, 0);
  const _v = new THREE.Vector3(2000,2000,1000);
  
  controls.addEventListener('change', evt => {
    _v.copy(controls.target);
    controls.target.clamp(minPan, maxPan);
    _v.sub(controls.target);
    camera.position.sub(_v);
    console.log(controls.object.position)
  })

  const createSnow = () => {
    var map = new THREE.TextureLoader().load(snow);
    var material = new THREE.SpriteMaterial({
      map: map,
      transparent: true,
      opacity: 0.5,
      color: 0xffffff,
    });
    return new THREE.Sprite(material);
  };
}
