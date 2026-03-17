export class InputHandler {
    constructor(canvas) {
        this.canvas = canvas;
        this.cursorPosition = { x: 0, y: 0 };
        this.isTracking = false;
        this.animationEngine = null;
        this.stateManager = null;
        this.lastInteraction = Date.now();
    }

    connect(animationEngine, stateManager) {
        this.animationEngine = animationEngine;
        this.stateManager = stateManager;
        this.attachListeners();
    }

    attachListeners() {
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('touchstart', (e) => this.handleTouch(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouch(e));
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        this.cursorPosition = {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };

        this.clampCoordinates();
        this.lastInteraction = Date.now();

        if (this.animationEngine) {
            this.animationEngine.updateCursorPosition(this.cursorPosition);
        }
    }

    handleClick(e) {
        this.lastInteraction = Date.now();
        
        if (this.stateManager) {
            this.stateManager.cycleExpression();
        }
    }

    handleTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        
        this.cursorPosition = {
            x: (touch.clientX - rect.left) * (this.canvas.width / rect.width),
            y: (touch.clientY - rect.top) * (this.canvas.height / rect.height)
        };

        this.clampCoordinates();
        this.lastInteraction = Date.now();

        if (this.animationEngine) {
            this.animationEngine.updateCursorPosition(this.cursorPosition);
        }
    }

    clampCoordinates() {
        this.cursorPosition.x = Math.max(0, Math.min(this.canvas.width, this.cursorPosition.x));
        this.cursorPosition.y = Math.max(0, Math.min(this.canvas.height, this.cursorPosition.y));
    }

    getCursorPosition() {
        return this.cursorPosition;
    }

    getLastInteraction() {
        return this.lastInteraction;
    }
}
