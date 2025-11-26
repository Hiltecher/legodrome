import { mat4 } from 'https://wgpu-matrix.org/dist/3.x/wgpu-matrix.module.js';

export class Camera {
    constructor(canvas, startDist = 20, startAzim = 0, startElev = 0.5) {

        // --- State Variables ---
        // "Target" is where we want to be
        this.targetDist = startDist;
        this.targetAzim = startAzim;
        this.targetElev = startElev;

        // "Current" is where we are 
        this.dist = startDist;
        this.azim = startAzim;
        this.elev = startElev;

        // Track key states
        this.keys = {
            ArrowUp: false, ArrowDown: false, 
            ArrowLeft: false, ArrowRight: false,
            '+': false, '=': false, '-': false, '_': false
        };

        this.initEvents();
    }

    initEvents() {
        // Listen for key presses
        window.addEventListener('keydown', (e) => {
            if (this.keys.hasOwnProperty(e.key)) this.keys[e.key] = true;
        });
        // Listen for key releases
        window.addEventListener('keyup', (e) => {
            if (this.keys.hasOwnProperty(e.key)) this.keys[e.key] = false;
        });
    }

    update() {
        const rotateSpeed = 0.03;
        const zoomSpeed = 0.5;
         // Lower = slipperier, higher = snappier (0-1)
        const smoothing = 0.5;

        // 1. Update target based on input
        if (this.keys.ArrowLeft)  this.targetAzim -= rotateSpeed;
        if (this.keys.ArrowRight) this.targetAzim += rotateSpeed;
        if (this.keys.ArrowUp)    this.targetElev += rotateSpeed;
        if (this.keys.ArrowDown)  this.targetElev -= rotateSpeed;

        // Clamp elevation target (prevent flipping upside down)
        this.targetElev = Math.max(-1.5, Math.min(1.5, this.targetElev));

        // Zoom target
        if (this.keys['+'] || this.keys['=']) this.targetDist -= zoomSpeed;
        if (this.keys['-'] || this.keys['_']) this.targetDist += zoomSpeed;
        this.targetDist = Math.max(2.0, Math.min(100.0, this.targetDist));

        // 2. Smoothly interpolate current -> target
        // This simple math creates the smooth drift effect
        this.azim += (this.targetAzim - this.azim) * smoothing;
        this.elev += (this.targetElev - this.elev) * smoothing;
        this.dist += (this.targetDist - this.dist) * smoothing;
    }

    getMatrix() {
        // Convert spherical coordinates (angles) to cartesian (XYZ)

        const cx = this.dist * Math.sin(this.azim) * Math.cos(this.elev);
        const cy = this.dist * Math.sin(this.elev);
        const cz = this.dist * Math.cos(this.azim) * Math.cos(this.elev);

        // Return view matrix looking at centre (0,0,0)
        return mat4.lookAt([cx, cy, cz], [0, 0, 0], [0, 1, 0]);
    }

    getPosition() {
        // Helper to return just the position [x,y,z] for the shader lighting
        const cx = this.dist * Math.sin(this.azim) * Math.cos(this.elev);
        const cy = this.dist * Math.sin(this.elev);
        const cz = this.dist * Math.cos(this.azim) * Math.cos(this.elev);
        return [cx, cy, cz];
    }
}
