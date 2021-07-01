import './style.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 100);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight);
camera.position.setZ(30);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const meterial = new THREE.MeshStandardMaterial( {color: 0xFF6347} );
const torus = new THREE.Mesh( geometry, meterial);

scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20, 20, 20)
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material =  new THREE.MeshStandardMaterial({color: 0xffffff})
  const star = new THREE.Mesh( geometry, material );

  const [x, y ,z] = Array(3).fill().map(()=> 
    THREE.MathUtils.randFloatSpread( 100 )
  );

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

function animate() {
  requestAnimationFrame( animate );

  torus.rotateX(0.01)
  torus.rotateY(0.01)
  torus.rotateZ(0.01)

  controls.update();

  renderer.render(scene, camera);
}

animate()