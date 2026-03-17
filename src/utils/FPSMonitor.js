export class FPSMonitor {
    constructor() {
        this.frames = [];
        this.lastTime = performance.now();
        this.fps = 60;
        this.avgFPS = 60;
        this.frameCount = 0;
        this.lastFpsUpdate = performance.now();
    }

    start() {
        this.lastTime = performance.now();
        this.frames = [];
    }

    recordFrame() {
        const now = performance.now();
        const delta = now - this.lastTime;
        this.lastTime = now;
        
        this.frames.push(delta);
        
        if (this.frames.length > 60) {
            this.frames.shift();
        }
        
        this.frameCount++;
        
        if (now - this.lastFpsUpdate >= 1000) {
            this.fps = Math.round(this.frameCount * 1000 / (now - this.lastFpsUpdate));
            this.frameCount = 0;
            this.lastFpsUpdate = now;
            
            this.avgFPS = this.calculateAverageFPS();
        }
        
        return this.getFrameTime();
    }

    calculateAverageFPS() {
        if (this.frames.length === 0) return 60;
        
        const sum = this.frames.reduce((acc, val) => acc + val, 0);
        const avgFrameTime = sum / this.frames.length;
        return Math.round(1000 / avgFrameTime);
    }

    getFPS() {
        return this.fps;
    }

    getAvgFPS() {
        return this.avgFPS;
    }

    getFrameTime() {
        if (this.frames.length === 0) return 16;
        return this.frames[this.frames.length - 1];
    }

    isStable() {
        return this.avgFPS >= 55;
    }

    logPerformance() {
        console.log(`FPS: ${this.fps} | Avg: ${this.avgFPS} | Frame Time: ${this.getFrameTime().toFixed(2)}ms`);
    }
}
