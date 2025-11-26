import { mat4 } from 'https://wgpu-matrix.org/dist/3.x/wgpu-matrix.module.js';

export class Camera {
    constructor(canvas, startDist = 15, startAzim = 0, startElev = 0.5) {
        this.canvas = canvas;
        
        // Camera State
        this.dist = startDist;
        this.azim = startAzim;
        this.elev = startElev;
        
        // Mouse State
        this.isDragging = false;
        this.lastX = 0;
        this.lastY = 0;

        // Bind events immediately
        this.initEvents();
    }

    initEvents() {
        // Mouse Down
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.lastX = e.clientX;
            this.lastY = e.clientY;
        });

        // Mouse Up (Global)
        window.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        // Mouse Move
        this.canvas.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            const dx = e.clientX - this.lastX;
            const dy = e.clientY - this.lastY;

            // Sensitivity settings
            const rotateSpeed = 0.01;
            
            this.azim -= dx * rotateSpeed;
            this.elev -= dy * rotateSpeed;

            // Clamp elevation so we don't flip upside down
            this.elev = Math.max(-1.5, Math.min(1.5, this.elev));

            this.lastX = e.clientX;
            this.lastY = e.clientY;
        });

        // Zoom (Scroll Wheel)
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomSpeed = 0.01;
            this.dist += e.deltaY * zoomSpeed;
            // Clamp zoom distance (Min: 2.0, Max: 50.0)
            this.dist = Math.max(2.0, Math.min(50.0, this.dist));
        }, { passive: false });
    }

    getMatrix() {
        // 1. Convert Spherical (Angles) to Cartesian (X/Y/Z)

        const cx = this.dist * Math.sin(this.azim) * Math.cos(this.elev);
        const cy = this.dist * Math.sin(this.elev);
        const cz = this.dist * Math.cos(this.azim) * Math.cos(this.elev);

        // 2. Return the View Matrix (Looking at 0,0,0)
        return mat4.lookAt([cx, cy, cz], [0, 0, 0], [0, 1, 0]);
    }
}
