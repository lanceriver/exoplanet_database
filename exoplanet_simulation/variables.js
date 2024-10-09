import * as THREE from 'three';
import * as OIMO from 'oimo';
import Body from '/physics.js';
import { TextureLoader } from 'three';

export const sunTexture = new THREE.TextureLoader().load('exoplanet_simulation\textures\sun-blasts-a-m66-flare.jpg');

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

export const Sun = new Body({x:0,y:0,z:0},{x:0,y:0,z:0},{x:0,y:0,z:0},20, 1.989e30, 0xFFE484);
export const Earth = new Body({x:700, y:0, z:500},{x:0,y:0.0005,z:-300},{x:0,y:0,z:0}, 5, 5.9724e24, 0x0000FF);
export const gravitationalConstant = 6.67e-11;