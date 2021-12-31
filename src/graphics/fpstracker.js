class FPSTracker extends PIXI.Text {
    history;
    nextIndex;

    constructor(color) {
        super('FPS: 0.0', {fill: color === undefined ? 0xffffff : color, fontSize: 16});

        this.history = new Array(60).fill(0);
        this.nextIndex = 0;
    }

    getFPS() {
        let startIndex = this.nextIndex;
        if (this.history[startIndex] === 0) {
            startIndex = 0;
        }
    
        const firstTime = this.history[startIndex];
        if (startIndex === 0 && firstTime === 0) {
            return 0.0;
        }
    
        const lastIndex = (this.nextIndex + this.history.length - 1) % this.history.length;
        const lastTime = this.history[lastIndex];
    
        const deltaTime = lastTime - firstTime;
        const deltaFrames = (lastIndex - startIndex + this.history.length) % this.history.length;
    
        if (deltaTime === 0) {
            return 0;
        }
    
        return deltaFrames / deltaTime * 1000;
    }
    
    tick(time) {
        this.history[this.nextIndex] = time;
        this.nextIndex = (this.nextIndex + 1) % this.history.length;
        
        const fps = this.getFPS();
        const integer = Math.floor(fps);
        const remainder = Math.floor((fps - integer) * 100);

        this.text = 'FPS: ' + integer + '.' + remainder;
    }
}
