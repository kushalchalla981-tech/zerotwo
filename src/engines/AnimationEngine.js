import { expressions, blinkingStates } from '../config/expressions.js';

export class AnimationEngine {
    constructor(stateManager, renderingEngine) {
        this.stateManager = stateManager;
        this.renderingEngine = renderingEngine;
        this.cursorPosition = { x: 1024, y: 1500 };
        this.targetEyePosition = { x: 0, y: 0 };
        this.currentEyePosition = { x: 0, y: 0 };
        
        this.blinkTimer = null;
        this.blinkState = 'open';
        this.blinkDuration = { closing: 100, hold: 100, opening: 150 };
        this.isBlinkingActive = false;
        
        this.idleTime = 0;
        this.idleEnabled = false;
        this.idleThreshold = 3000;
        
        this.isRunning = false;
        this.animationTime = 0;
        
        this.currentExpression = 'neutral';
    }

    start() {
        this.isRunning = true;
        this.startBlinkCycle();
        this.animate();
    }

    stop() {
        this.isRunning = false;
        if (this.blinkTimer) {
            clearTimeout(this.blinkTimer);
        }
    }

    updateCursorPosition(position) {
        this.cursorPosition = position;
        this.calculateEyeTracking();
    }

    calculateEyeTracking() {
        const eyeCenterX = 1024;
        const eyeCenterY = 1400;
        
        const maxOffsetX = 20;
        const maxOffsetY = 15;
        const sensitivity = 0.02;

        let offsetX = (this.cursorPosition.x - eyeCenterX) * sensitivity;
        let offsetY = (this.cursorPosition.y - eyeCenterY) * sensitivity;

        offsetX = Math.max(-maxOffsetX, Math.min(maxOffsetX, offsetX));
        offsetY = Math.max(-maxOffsetY, Math.min(maxOffsetY, offsetY));

        this.targetEyePosition = { x: offsetX, y: offsetY };
    }

    lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    startBlinkCycle() {
        if (!this.isRunning) return;
        
        const interval = 2000 + Math.random() * 3000;
        
        this.blinkTimer = setTimeout(() => {
            this.executeBlink();
        }, interval);
    }

    executeBlink() {
        if (!this.isRunning) return;
        if (this.stateManager.getExpression() !== this.currentExpression) {
            this.currentExpression = this.stateManager.getExpression();
        }

        this.blinkState = 'closing';
        this.stateManager.setBlinking(true);
        this.isBlinkingActive = true;
        this.updateEyelidState();

        setTimeout(() => {
            if (!this.isRunning) return;
            this.blinkState = 'closed';
            this.updateEyelidState();
            
            setTimeout(() => {
                if (!this.isRunning) return;
                this.blinkState = 'opening';
                this.updateEyelidState();
                
                setTimeout(() => {
                    if (!this.isRunning) return;
                    this.blinkState = 'open';
                    this.stateManager.setBlinking(false);
                    this.isBlinkingActive = false;
                    this.updateEyelidState();
                    this.startBlinkCycle();
                }, this.blinkDuration.opening);
            }, this.blinkDuration.hold);
        }, this.blinkDuration.closing);
    }

    updateEyelidState() {
        const state = this.blinkState;
        const stateAssets = blinkingStates[state];
        
        if (!stateAssets) return;

        this.renderingEngine.updateLayer('eyelid_upper_left', { src: stateAssets.upper_left });
        this.renderingEngine.updateLayer('eyelid_upper_right', { src: stateAssets.upper_right });
        this.renderingEngine.updateLayer('eyelid_lower_left', { src: stateAssets.lower_left, visible: state === 'closed' || state === 'closing' });
        this.renderingEngine.updateLayer('eyelid_lower_right', { src: stateAssets.lower_right, visible: state === 'closed' || state === 'closing' });
    }

    updateExpression(expression) {
        const exprAssets = expressions[expression];
        if (!exprAssets) return;

        this.renderingEngine.updateLayer('mouth', { src: exprAssets.mouth });
        this.renderingEngine.updateLayer('eyebrow_left', { src: exprAssets.eyebrow_left });
        this.renderingEngine.updateLayer('eyebrow_right', { src: exprAssets.eyebrow_right });
    }

    animate() {
        if (!this.isRunning) return;

        this.animationTime += 16;
        
        this.currentEyePosition.x = this.lerp(this.currentEyePosition.x, this.targetEyePosition.x, 0.15);
        this.currentEyePosition.y = this.lerp(this.currentEyePosition.y, this.targetEyePosition.y, 0.15);
        
        this.stateManager.setEyePosition(this.currentEyePosition.x, this.currentEyePosition.y);

        this.renderingEngine.updateLayer('pupil_left', { 
            x: 790 + this.currentEyePosition.x,
            y: 1230 + this.currentEyePosition.y
        });
        this.renderingEngine.updateLayer('pupil_right', { 
            x: 1120 + this.currentEyePosition.x,
            y: 1230 + this.currentEyePosition.y
        });

        const expr = this.stateManager.getExpression();
        if (expr !== this.currentExpression) {
            this.currentExpression = expr;
            this.updateExpression(expr);
        }

        this.updateIdleAnimation();

        requestAnimationFrame(() => this.animate());
    }

    updateIdleAnimation() {
        const time = Date.now();
        const idleTime = time - this.stateManager.state.lastInteraction;

        if (idleTime > this.idleThreshold) {
            this.stateManager.setIdleState(true);
            
            const verticalOffset = Math.sin(time * 0.002) * 10;
            const swayOffset = Math.sin(time * 0.001) * 5;

            this.renderingEngine.updateLayer('body_base', {
                y: 1600 + verticalOffset,
                x: 524 + swayOffset
            });
            
            this.renderingEngine.updateLayer('face_base', {
                y: 600 + verticalOffset,
                x: 574 + swayOffset
            });
        } else {
            if (this.stateManager.state.idleState) {
                this.renderingEngine.updateLayer('body_base', { y: 1600, x: 524 });
                this.renderingEngine.updateLayer('face_base', { y: 600, x: 574 });
            }
            this.stateManager.setIdleState(false);
        }
    }
}
