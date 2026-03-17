export class RenderingEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d', { alpha: true });
        this.assetManager = null;
        this.layers = [];
        this.isRunning = false;
        this.animationFrameId = null;
        this.fpsMonitor = null;
        this.layerCache = new Map();
        
        this.setupCanvas();
    }

    setupCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const displayWidth = Math.min(window.innerWidth * 0.9, 512);
        const displayHeight = displayWidth * 2;

        this.canvas.style.width = `${displayWidth}px`;
        this.canvas.style.height = `${displayHeight}px`;
        this.canvas.width = 2048;
        this.canvas.height = 4096;

        this.ctx.scale(dpr, dpr);
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
    }

    setAssetManager(assetManager) {
        this.assetManager = assetManager;
    }

    setLayers(layerConfig) {
        this.layers = layerConfig;
    }

    setFPSMonitor(fpsMonitor) {
        this.fpsMonitor = fpsMonitor;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.render();
    }

    stop() {
        this.isRunning = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    render() {
        if (!this.isRunning) return;

        if (this.fpsMonitor) {
            this.fpsMonitor.recordFrame();
        }

        this.clear();
        this.drawLayers();

        this.animationFrameId = requestAnimationFrame(() => this.render());
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawLayers() {
        for (const layer of this.layers) {
            this.drawLayer(layer);
        }
    }

    drawLayer(layer) {
        if (!layer.visible) return;

        const img = this.assetManager?.get(layer.src);
        if (!img) return;

        this.ctx.save();
        
        if (layer.opacity !== undefined) {
            this.ctx.globalAlpha = layer.opacity;
        }

        const x = layer.x || 0;
        const y = layer.y || 0;

        this.ctx.drawImage(img, x, y);

        this.ctx.restore();
    }

    updateLayer(key, updates) {
        const layer = this.layers.find(l => l.key === key);
        if (layer) {
            Object.assign(layer, updates);
        }
    }

    getCanvas() {
        return this.canvas;
    }

    getContext() {
        return this.ctx;
    }
}
