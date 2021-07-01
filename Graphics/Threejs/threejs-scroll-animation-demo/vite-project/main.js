import './style.css'

import * as THREE from 'three'

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
const meterial = new THREE.MeshBasicMaterial( {color: 0xFF6347, wireframe: true} );
const torus = new THREE.Mesh( geometry, meterial);

scene.add(torus);

function animate() {
  requestAnimationFrame( animate );

  torus.rotateX(0.01)
  torus.rotateY(0.01)
  torus.rotateZ(0.01)

  renderer.render(scene, camera);
}

animate()