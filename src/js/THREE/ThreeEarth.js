import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import vertexShader from '../../assets/shaders/vertex.glsl'
import fragmentShader from '../../assets/shaders/fragment.glsl'

let scene;
let camera;
let renderer;
let controls;

function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
}

function initCamera() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 20);
}

function initRenderer() {
    renderer = new THREE.WebGLRenderer({
        antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio)
}

function initControls() {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
}

function initLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 0);
    scene.add(directionalLight);
}

export function createEarth() {
    initScene();
    initCamera();
    initRenderer();

    console.log(vertexShader)

    const sphere =  new THREE.Mesh(new THREE.SphereGeometry(5, 50, 50),
        // new THREE.MeshBasicMaterial({
        //     // color: 0xFF0000
        //     map: new THREE.TextureLoader().load('./src/assets/img/uv-earth.jpg')
        // },
        new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                globeTexture: {
                    value: new THREE.TextureLoader().load('./src/assets/img/uv-earth.jpg')
                }
            }
        }))

    scene.add(sphere);

    return renderer.domElement;
}

export function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera)
}