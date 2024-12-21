import * as THREE from 'three';
import * as OIMO from 'oimo';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { AfterimagePass } from 'three/addons/postprocessing/AfterimagePass.js';


import {scene, global} from '/variables.js'
import { planetList } from './variables';

const params = {

	enable: true

};

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 5000 );



const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

// White directional light at half intensity shining from the top.
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true; // Smooth controls
controls.dampingFactor = 0.1;



camera.position.set( 0, 20, 1000 );
controls.update();
scene.add(camera);

const light = new THREE.DirectionalLight( 0xffffff, 1 );
light.position.copy(camera.position); //default; light shining from top
light.castShadow = true; // default false
camera.add( light );


/* const earthLight = new THREE.DirectionalLight( 0xffffff, 1);
earthLight.position.set( 0.5, 0, 1 );
scene.add(earthLight); */


//Set up shadow properties for the light
light.shadow.mapSize.width = 512; // default
light.shadow.mapSize.height = 1024; // default
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 5000; // default */


// Set up the post-processing composer
const renderScene = new RenderPass(scene, camera);

const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 5, 0, 0);

const afterImagePass = new AfterimagePass();
afterImagePass.uniforms["damp"].value = 0.975;

const composer = new EffectComposer(renderer);

composer.addPass(renderScene);

composer.addPass(bloomPass);

// Raycaster and mouse for detecting clicks
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Variable to store the selected planet
let targetPlanet = null;
let cameraOffset = new THREE.Vector3(0, 5, 15); // Initial relative offset

// Check if simulation is paused
let pauseStatus = false;

// Event listener to detect clicks
window.addEventListener('click', onMouseClick);

window.addEventListener('keydown', onKeyDown);

function onMouseClick(event) {
    // Convert mouse position to normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Perform raycasting
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    // If a planet is clicked, set it as the target
    if (intersects.length > 0) {
        targetPlanet = intersects[0].object;

		 // Calculate the initial offset relative to the planet
		cameraOffset = camera.position.clone().sub(targetPlanet.position);
		
		controls.enableRotate = true; // Allow rotation around the planet

		// controls.target.copy(targetPlanet.position);
    }
}

function onKeyDown(event) {
	if (event.code === 'Space') {
		if(pauseStatus == false) {
			pauseStatus = true;
		}
		else {
			pauseStatus = false;
		}
	}

}

scene.background = spaceTexture;




 function rotateBody(body) {
	body.rotation.x += 0.05;
	body.rotation.y += 0.05;
	body.rotation.z += 0.05;
}
 
/* const geometry = new THREE.SphereGeometry( 15, 32, 32 );
const material = new THREE.MeshStandardMaterial( { color: 0xFFE484, roughness: 0.176 } );
const sphere = new THREE.Mesh( geometry, material );
sphere.castShadow = true; //default is false
sphere.receiveShadow = false; //default
scene.add( sphere );
 */

var time = 0

camera.position.y = 0;
camera.position.z = 1000;

function animate() {
	/* rotateBody(Sun);
	rotateBody(Earth); */
	time += 1/60
	console.log(time);

	if (targetPlanet) {
        // // Smoothly move the camera to follow the target planet
        // const offset = new THREE.Vector3(0, 200, 10); // Camera offset relative to planet
        // const planetPosition = targetPlanet.position.clone();

        // // Update camera position
        // const targetPosition = planetPosition.add(offset);
        // camera.position.lerp(targetPosition, 0.05); // Smooth transition
        // camera.lookAt(targetPlanet.position); // Keep camera focused on the planet
		// controls.target.copy(targetPlanet.position);

		// Update the camera position to maintain the offset
        const desiredPosition = targetPlanet.position.clone().add(cameraOffset);
        camera.position.lerp(desiredPosition, 0.01); // Smooth transition

        // Always update controls to focus on the planet
        controls.target.copy(targetPlanet.position);

        // Optional: Update the offset if user rotates the view
        controls.update();
        cameraOffset = camera.position.clone().sub(targetPlanet.position);
    }
	controls.update();
	console.info(scene.children)
	composer.render(scene, camera);
	completeFrame()
	


}


function completeFrame() {
	for (const planet in planetList) {
		if (pauseStatus == false) {
			planetList[planet].update();
			createOrbit(planet.orbitRadius, planet.orbitRadius, 128, 0xffffff);
			// controls.target = planetList[planet].onClick();
			// controls.update();
		}
		
	}
    // update world
	if (pauseStatus == false) {
		global.step();
	}

    
    // render this frame of our animation
    // renderer.render(scene, camera)
	
	
    // line up our next frame
	
}
requestAnimationFrame(animate);
// renderer.setAnimationLoop( animate );

function createOrbit(a, b, segments = 64, color = 0xffffff) {
    const curve = new THREE.EllipseCurve(
        0, 0,        // x, y center of ellipse
        a, b,        // xRadius, yRadius
        0, 2 * Math.PI, // startAngle, endAngle
        false,        // clockwise
        0            // rotation
    );

    const points = curve.getPoints(segments);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const material = new THREE.LineBasicMaterial({ color: color });
    const orbit = new THREE.Line(geometry, material);

    orbit.rotation.x = Math.PI / 2; // Rotate to match the plane of the solar system
    return orbit;
}