import * as THREE from 'three';
import * as OIMO from 'oimo';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import {scene, global, Sun, Earth} from '/variables.js'

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );



const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

// White directional light at half intensity shining from the top.
const controls = new OrbitControls( camera, renderer.domElement );

camera.position.set( 0, 20, 1000 );
controls.update();
scene.add(camera);

const light = new THREE.DirectionalLight( 0xffffff, 1 );
light.position.copy(camera.position); //default; light shining from top
light.castShadow = true; // default false
camera.add( light );

light.target(camera);
/* const earthLight = new THREE.DirectionalLight( 0xffffff, 1);
earthLight.position.set( 0.5, 0, 1 );
scene.add(earthLight); */


//Set up shadow properties for the light
light.shadow.mapSize.width = 512; // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 500; // default */


/* function initialiseBody(body) {
	
	console.log(body.position);
};

initialiseBody(sun);
initialiseBody(earth); */
/* earthLight.target = Earth; */



/* function rotateBody(body) {
	body.rotation.x += 0.05;
	body.rotation.y += 0.05;
	body.rotation.z += 0.05;
}
 */
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

	console.info(scene.children)
	completeFrame()
	


}


function completeFrame() {
	Earth.update();
    // update world
    global.step()
    // render this frame of our animation
    renderer.render(scene, camera)
    // line up our next frame
	
}
renderer.setAnimationLoop( animate );