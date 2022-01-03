class PerlinNoise {
    static getNoise(seed, t) {
        if (seed <= 1) {
            seed *= 256;
        }

        const row = (Math.floor(Math.abs(seed) % 256) + Math.floor(t)) % 256;
        
        const rawColumn = (t % 1) * 256;
        const columnStart = Math.floor(rawColumn);
        const columnEnd = (columnStart + 1) % 256;
        const columnProgress = t % 1;

        const startValue = PERLIN[row * 256 + columnStart];
        const endValue = PERLIN[row * 256 + columnEnd];

        return startValue + (endValue - startValue) * columnProgress;
    }
}