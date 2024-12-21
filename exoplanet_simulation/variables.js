import * as THREE from 'three';
import * as OIMO from 'oimo';
import Body from '/physics.js';
import { TextureLoader } from 'three';

export const loader = new THREE.TextureLoader();
export const sunTexture = loader.load('textures/sun.jpg');
const earthTexture = loader.load('textures/earth.jpg');
const mercuryTexture = loader.load('textures/mercury.jpeg');
const venusTexture = loader.load('textures/venus.jpg');
const marsTexture = loader.load('textures/mars.jpg');
const jupiterTexture = loader.load('textures/jupiter.jpg');
export const spaceTexture = loader.load('textures/space.jpg');

export const scene = new THREE.Scene();
export const global = new OIMO.World({ 
    timestep: 1/60, 
    iterations: 8, 
    broadphase: 2, // 1 brute force, 2 sweep and prune, 3 volume tree
    worldscale: 1, // scale full world 
    random: true,  // randomize sample
    info: false,   // calculate statistic or not
    gravity: [0,0,0] 
});

export const Sun = new Body({x:0,y:0,z:0},{x:0,y:0,z:0},{x:0,y:0,z:0},100, 1.989e30, 0xFFFF00, sunTexture);
export const Mercury = new Body({x:300,y:0,z:0},{x:0,y:-700,z:0},{x:0,y:0,z:0},10, 1.989e23, 0xFFFFFF, mercuryTexture);
export const Venus = new Body({x:600,y:0,z:0}, {x:0,y:-600,z:0},{x:0,y:0,z:0},18, 4.867e24, 0xFFFFFF, venusTexture);
export const Earth = new Body({x:1500, y:0, z:0},{x:0,y:-400,z:0},{x:0,y:0,z:0}, 20, 5.9724e24, 0xFFFFFF, earthTexture);
export const Mars = new Body({x:2000, y:0, z:0},{x:0,y:-300,z:0},{x:0,y:0,z:0},12, 6.39e23, 0xFFFFFF, marsTexture);
export const Jupiter = new Body({x:3000, y:0, z:0},{x:0,y:-200,z:0},{x:0,y:0,z:0},50, 1.898e27, 0xFFFFFF, jupiterTexture)
export const gravitationalConstant = 6.67e-11;



export const planetList = {Mercury, Venus, Earth, Mars, Jupiter};