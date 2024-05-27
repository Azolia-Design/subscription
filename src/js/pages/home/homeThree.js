import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import SplineLoader from "@splinetool/loader";
// import { Application } from '@splinetool/runtime';
import { lerp } from '../../helper/index';

const ThreeHome = () => {
	// camera
	const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 70, 100000);
	camera.position.set(0, 0, 500);
	camera.quaternion.setFromEuler(new THREE.Euler(0, 0, 0));

	// scene
	const scene = new THREE.Scene();

	let target
	// spline scene
	const loader = new SplineLoader();
	loader.load(
		'https://prod.spline.design/rrXeErN4IOE0CoXt/scene.splinecode',
		(splineScene) => {
			target = splineScene.children[0].children[0]

			console.log(target);
			scene.add(splineScene);
		}
	);

	// renderer
	const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: document.getElementById('homeHeroCanvas') });
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setAnimationLoop(animate);

	// scene settings
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFShadowMap;

	scene.background = new THREE.Color('#F5450D');
	renderer.setClearAlpha(0);

	// orbit controls
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.dampingFactor = 0.125;
	window.addEventListener('resize', onWindowResize);

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}
	
	function animate(time) {
		controls.update();
		// console.log(renderer.render(scene.children[0].children[0].children[0], camera));
		// renderer.render(scene.children[0].children[0].children[0], camera);
	}
}

export default ThreeHome
