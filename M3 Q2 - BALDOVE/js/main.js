import * as THREE from './three.module.js';
import { FontLoader } from './FontLoader.js';
import { TextGeometry } from './TextGeometry.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
let stars, starGeo;
let nameMesh;

lighting();
particles();
text(); // Call the text function

const intervalId = setInterval(animateParticles, 10);

function particles() {
  const points = [];

  for (let i = 0; i < 6000; i++) {
    let star = new THREE.Vector3(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    );
    points.push(star);
  }

  starGeo = new THREE.BufferGeometry().setFromPoints(points);

  let sprite = new THREE.TextureLoader().load("assets/images/star.png");
  let starMaterial = new THREE.PointsMaterial({
    color: 0xffb6c1,
    size: 0.7,
    map: sprite,
  });

  stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);
}

function animateParticles() {
  starGeo.verticesNeedUpdate = true;
  stars.position.y -= 0.9;
  if (stars.position.y < -200) {
    stars.position.y = 200; // I changed the coordinates here, sir.
    changeParticleColor(); // I called the change color here
  }
}

// Color Switch function
function changeParticleColor() {
  const randomColor = new THREE.Color(Math.random(), Math.random(), Math.random());
  stars.material.color = randomColor;
}

function text() {
  const texture = new THREE.TextureLoader().load("assets/textures/wooden.jpg");

  const floader = new FontLoader();
  floader.load('../assets/fonts/helvetiker_bold.typeface.json', function(font) {
    const textGeometry = new TextGeometry("Lawrenzo", {
      font: font,
      size: 15, 
      height: 4, 
    });
    textGeometry.center();
    const textMaterial = new THREE.MeshPhongMaterial({ map: texture }); 
    nameMesh = new THREE.Mesh(textGeometry, textMaterial); 
    nameMesh.position.set(0, 4, -50);
    scene.add(nameMesh);
  });
}

function lighting() {
  const light = new THREE.HemisphereLight(0x780a44, 0x1c3020, 1);
  scene.add(light);

  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(0, 0, 15);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 500;
  spotLight.shadow.camera.far = 4000;
  spotLight.shadow.camera.fov = 30;
  scene.add(spotLight);
}

function animate() {
  requestAnimationFrame(animate);

   // Name Rotation
    nameMesh.rotation.x += 0.01;
    nameMesh.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();

