class Renderer {
    static application;

    static parallax = new PIXI.Container();
    static container = new PIXI.Container();
    static fixed = new PIXI.Container();

    static background = new PIXI.Container();
    static midground = new PIXI.Container();
    static foreground = new PIXI.Container();

    static canvas = new DebugCanvas();

    static fpsTracker = new FPSTracker(0xffffff);
    static cpuTracker = new CPUTracker(0xffffff);

    static initialize() {
        Renderer.application = new PIXI.Application({width: window.innerWidth, height: window.innerHeight, autoStart: false});
        Renderer.application.stage.addChild(Renderer.parallax);
        Renderer.application.stage.addChild(Renderer.container);
        Renderer.application.stage.addChild(Renderer.fixed);

        Renderer.container.addChild(Renderer.background);
        Renderer.container.addChild(Renderer.midground);
        Renderer.container.addChild(Renderer.foreground);
        Renderer.container.addChild(Renderer.canvas);

        Renderer.fpsTracker.position.x = 20;
        Renderer.fpsTracker.position.y = 20;
        Renderer.fixed.addChild(Renderer.fpsTracker);
        Renderer.cpuTracker.position.x = 20;
        Renderer.cpuTracker.position.y = 40;
        Renderer.fixed.addChild(Renderer.cpuTracker);

        Renderer.parallax.scale.x = 3;
        Renderer.parallax.scale.y = 3;

        Camera.addContainer(Renderer.container);
        Camera.setScaleImmediate(new Vec2(2, 2));
        Camera.setScale(new Vec2(3, 3));

        document.getElementById('canvas-container').appendChild(Renderer.application.view);

        window.addEventListener('resize', () => {
            Renderer.resize();
        });
    }

    static render(time) {
        Renderer.fpsTracker.tick(time);
        Renderer.application.render();
    }

    static resize() {
        Renderer.application.renderer.resize(window.innerWidth, window.innerHeight);
    }
}