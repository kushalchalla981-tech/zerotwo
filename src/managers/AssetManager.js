export class AssetManager {
    constructor() {
        this.cache = new Map();
        this.loadingProgress = 0;
        this.totalAssets = 0;
        this.loadedAssets = 0;
    }

    async load(src) {
        return new Promise((resolve, reject) => {
            if (this.cache.has(src)) {
                resolve(this.cache.get(src));
                return;
            }

            const img = new Image();
            img.onload = () => {
                this.cache.set(src, img);
                this.loadedAssets++;
                this.updateProgress();
                resolve(img);
            };
            img.onerror = () => {
                console.error(`Failed to load asset: ${src}`);
                reject(new Error(`Failed to load: ${src}`));
            };
            img.src = src;
        });
    }

    async loadAll(assetList) {
        this.totalAssets = assetList.length;
        this.loadedAssets = 0;
        this.loadingProgress = 0;

        const promises = assetList.map(src => this.load(src));
        
        try {
            await Promise.all(promises);
            return true;
        } catch (error) {
            console.error('Error loading assets:', error);
            return false;
        }
    }

    get(key) {
        return this.cache.get(key);
    }

    has(key) {
        return this.cache.has(key);
    }

    updateProgress() {
        if (this.totalAssets > 0) {
            this.loadingProgress = (this.loadedAssets / this.totalAssets) * 100;
        }
    }

    getProgress() {
        return this.loadingProgress;
    }

    clear() {
        this.cache.clear();
        this.loadedAssets = 0;
        this.totalAssets = 0;
        this.loadingProgress = 0;
    }
}
