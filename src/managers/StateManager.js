export class StateManager {
    constructor() {
        this.state = {
            expression: 'neutral',
            eyePosition: { x: 0, y: 0 },
            isBlinking: false,
            idleState: true,
            lastInteraction: Date.now()
        };

        this.expressions = ['neutral', 'happy', 'annoyed'];
        this.currentExpressionIndex = 0;
    }

    getState() {
        return { ...this.state };
    }

    setExpression(expression) {
        if (this.expressions.includes(expression)) {
            this.state.expression = expression;
            this.currentExpressionIndex = this.expressions.indexOf(expression);
        }
    }

    cycleExpression() {
        this.currentExpressionIndex = (this.currentExpressionIndex + 1) % this.expressions.length;
        this.state.expression = this.expressions[this.currentExpressionIndex];
        return this.state.expression;
    }

    setEyePosition(x, y) {
        this.state.eyePosition = { x, y };
    }

    setBlinking(isBlinking) {
        this.state.isBlinking = isBlinking;
    }

    setIdleState(isIdle) {
        this.state.idleState = isIdle;
    }

    updateLastInteraction() {
        this.state.lastInteraction = Date.now();
    }

    getExpression() {
        return this.state.expression;
    }

    isBlinking() {
        return this.state.isBlinking;
    }
}
