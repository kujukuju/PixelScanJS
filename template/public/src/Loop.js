class Loop {
    static DELAY = 16;

    static loopTime = 0;

    static initialize() {
        Loop.loopTime = Date.now();
        Loop.loop();
    }

    static loop() {
        const start = Date.now();
        Renderer.cpuTracker.beginFrame(start);

        Logic.update();
        Renderer.render(start);

        const finish = Date.now();
        Loop.loopTime = start;
        Renderer.cpuTracker.endFrame(finish);

        const duration = finish - start;

        setTimeout(() => {
            Loop.loop();
        }, Math.max(1, Loop.DELAY - duration));
    }
}