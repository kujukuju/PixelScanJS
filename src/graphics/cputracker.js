class CPUTracker extends PIXI.Text {
    history;
    nextIndex;

    startTime;
    endTime;

    constructor(color) {
        super('CPU: 0.0%', {fill: color === undefined ? 0xffffff : color, fontSize: 16});

        this.history = new Array(60).fill(0);
        this.nextIndex = 0;

        this.startTime = 0;
        this.endTime = 0;
    }

    beginFrame(time) {
        if (this.startTime > 0 && this.endTime > 0) {
            const totalTime = time - this.startTime;
            const frameTime = this.endTime - this.startTime;

            this.history[this.nextIndex] = Math.max(frameTime / totalTime, Number.MIN_VALUE);
            this.nextIndex = (this.nextIndex + 1) % this.history.length;

            let total = 0;
            let count = 0;
            for (let i = 0; i < this.history.length; i++) {
                if (this.history[i] === 0) {
                    continue;
                }
    
                total += this.history[i];
                count++;
            }
            
            const cpu = total / count * 100;
            const integer = Math.floor(cpu);
            const remainder = Math.floor((cpu - integer) * 100);
    
            this.text = 'CPU: ' + integer + '.' + remainder + '%';
        }

        this.startTime = time;
    }

    endFrame(time) {
        this.endTime = time;
    }
}