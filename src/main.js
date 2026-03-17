import { AssetManager } from './managers/AssetManager.js';
import { RenderingEngine } from './engines/RenderingEngine.js';
import { InputHandler } from './handlers/InputHandler.js';
import { StateManager } from './managers/StateManager.js';
import { AnimationEngine } from './engines/AnimationEngine.js';
import { FPSMonitor } from './utils/FPSMonitor.js';
import { layerConfig } from './config/layers.js';
import { expressions } from './config/expressions.js';

class App {
    constructor() {
        this.assetManager = new AssetManager();
        this.renderingEngine = null;
        this.inputHandler = null;
        this.stateManager = null;
        this.animationEngine = null;
        this.fpsMonitor = null;
    }

    async init() {
        const canvas = document.getElementById('avatar-canvas');
        const loadingScreen = document.getElementById('loading-screen');

        this.fpsMonitor = new FPSMonitor();
        this.fpsMonitor.start();

        this.renderingEngine = new RenderingEngine(canvas);
        this.stateManager = new StateManager();
        this.inputHandler = new InputHandler(canvas);
        this.animationEngine = new AnimationEngine(this.stateManager, this.renderingEngine);

        const assetList = this.buildAssetList();
        
        const loaded = await this.assetManager.loadAll(assetList);
        
        if (loaded) {
            this.renderingEngine.setAssetManager(this.assetManager);
            this.renderingEngine.setLayers(layerConfig);
            
            this.initializeExpression('neutral');
            
            this.renderingEngine.setFPSMonitor(this.fpsMonitor);
            this.renderingEngine.start();
            
            this.inputHandler.connect(this.animationEngine, this.stateManager);
            this.animationEngine.start();

            loadingScreen.classList.add('hidden');
            
            console.log('Interactive Avatar initialized successfully');
            setInterval(() => this.fpsMonitor.logPerformance(), 5000);
        } else {
            console.error('Failed to load assets');
        }
    }

    initializeExpression(expression) {
        const exprAssets = expressions[expression];
        if (!exprAssets) return;

        const layerMap = {
            'mouth': exprAssets.mouth,
            'eyebrow_left': exprAssets.eyebrow_left,
            'eyebrow_right': exprAssets.eyebrow_right
        };

        this.renderingEngine.updateLayer('mouth', { src: layerMap.mouth });
        this.renderingEngine.updateLayer('eyebrow_left', { src: layerMap.eyebrow_left });
        this.renderingEngine.updateLayer('eyebrow_right', { src: layerMap.eyebrow_right });
    }

    buildAssetList() {
        const assets = [];
        const basePath = '';

        const layerFiles = {
            head: ['head_base_01.png'],
            eyes: ['eye_left_base_01.png', 'eye_right_base_01.png'],
            pupils: ['pupil_left_01.png', 'pupil_right_01.png'],
            eyelids: [
                'eyelid_upper_left_open_01.png', 'eyelid_upper_left_half_01.png', 'eyelid_upper_left_closed_01.png',
                'eyelid_upper_right_open_01.png', 'eyelid_upper_right_half_01.png', 'eyelid_upper_right_closed_01.png',
                'eyelid_lower_left_open_01.png', 'eyelid_lower_left_half_01.png', 'eyelid_lower_left_closed_01.png',
                'eyelid_lower_right_open_01.png', 'eyelid_lower_right_half_01.png', 'eyelid_lower_right_closed_01.png'
            ],
            eyebrows: [
                'eyebrow_left_neutral_01.png', 'eyebrow_left_angry_01.png', 'eyebrow_left_happy_01.png',
                'eyebrow_right_neutral_01.png', 'eyebrow_right_angry_01.png', 'eyebrow_right_happy_01.png'
            ],
            mouth: ['mouth_neutral_01.png', 'mouth_annoyed_01.png', 'mouth_happy_01.png'],
            hair: ['hair_back_base_01.png', 'hair_front_base_01.png', 'hair_side_left_01.png', 'hair_side_right_01.png'],
            horns: ['horn_left_01.png', 'horn_right_01.png'],
            body: ['body_torso_base_01.png', 'body_neck_01.png', 'body_overlay_details_01.png'],
            arms: ['arm_left_base_01.png', 'arm_right_base_01.png'],
            legs: ['leg_left_base_01.png', 'leg_right_base_01.png'],
            overlays: []
        };

        for (const [category, files] of Object.entries(layerFiles)) {
            for (const file of files) {
                assets.push(basePath + 'assets/' + category + '/' + file);
            }
        }

        return assets;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});
