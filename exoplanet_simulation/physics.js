import * as THREE from 'three';
import * as OIMO from 'oimo';
import { scene, global, gravitationalConstant, sunTexture } from '/variables.js';


export default class Body {
    
    constructor(position, velocity, acceleration, radius, mass, color, texture) {
        this.time = 0;
        this.mass = mass;
        this.position = new THREE.Vector3(position.x,position.y,position.z);
        this.distance = 0;
        this.velocity = new THREE.Vector3(velocity.x,velocity.y,velocity.z);
        this.acceleration = new THREE.Vector3(acceleration.x,acceleration.y,acceleration.z);
        this.radius = radius;
        this.color = color;
        this.texture = sunTexture;
        this.geometry = new THREE.SphereGeometry( this.radius, 32, 32 );
        this.material = new THREE.MeshStandardMaterial( { color: this.color, roughness: 0.176} );
        this.sphere = new THREE.Mesh( this.geometry, this.material );
        this.sphere.castShadow = true; //default is false
        this.sphere.receiveShadow = false; //default
        this.sphere.position.set(this.position.x, this.position.y, this.position.z);
        scene.add(this.sphere);
        this.body = global.add({
            type: 'sphere',
            size: [15],
            pos: [this.position.x, this.position.y, this.position.z],
            move: true,
            friction: 0.5,
            restitution: 0.5,
          });
        return this;
    }
    calculateNewPosition() {
        var timestep = 1/60;
        console.log(this.time)
        if (this.time == 0) {
            this.calculateInitials();
            this.time += timestep;
        }
        else {
            this.time += timestep;
            this.lastAcceleration = this.acceleration.clone();
            console.log(this.position);
            console.log(this.velocity);
            this.position.add(this.velocity.clone().multiplyScalar(timestep));
            this.position.add(this.lastAcceleration.clone().multiplyScalar((1/2)*(timestep**2)));
            console.log(this.position);
            this.calculateAcceleration();
            console.log(this.velocity);
            console.log(this.lastAcceleration);
            this.velocity.add(this.lastAcceleration.clone().multiplyScalar(1/2));
            console.log(this.velocity);
            this.velocity.add(this.acceleration.clone().multiplyScalar(timestep));
            this.body.setPosition(this.position);
            
        }
        
        
    }
    velocityVerlet() {

    }
    calculateInitials() {
        const total = this.position.x**2 + this.position.y**2 + this.position.z**2;
        const magnitude = (Math.sqrt(total));
        const GM = -(gravitationalConstant*1.989e25) / 214285714;
        const r2 = (1.491e11)**2;
        this.initialVector = new THREE.Vector3();
        this.initialVector = this.position.clone();
        const initialAccelerationScalar = GM/magnitude**3;
        this.initialVector.multiplyScalar(initialAccelerationScalar);
        this.acceleration = this.initialVector.clone();
        console.log(this.acceleration);
    }
    calculateAcceleration() {
        const GM = -(gravitationalConstant*1.989e25) / 214285714;
        const total = this.position.x**2 + this.position.y**2 + this.position.z**2;
        console.log(this.position);
        const magnitude = (Math.sqrt(total));
        this.unitVector = new THREE.Vector3();
        this.unitVector = this.position.clone();
        console.log(this.unitVector);
        const accelerationScalar = GM/(magnitude**3);
        console.log(accelerationScalar);
        console.log(this.unitVector);
        this.unitVector.multiplyScalar(accelerationScalar);
        console.log(this.unitVector);
        this.acceleration = this.unitVector.clone();
        console.log(this.position);
        console.log(this.acceleration);
    }
    update() {
        this.calculateNewPosition();
        this.sphere.position.copy(this.body.getPosition());
        this.sphere.quaternion.copy(this.body.getQuaternion());
    }

}