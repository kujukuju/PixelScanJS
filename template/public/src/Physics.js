class Physics {
    static TEXTURE = PIXI.Texture.from('assets/foreground.png');

    static world;

    static initialize() {
        Physics.world = new World(Physics.TEXTURE.width, Physics.TEXTURE.height, new Vec2(0, 0.35));

        const pixels = PixelScan.extract(Renderer.application, Physics.TEXTURE);
        Physics.world.fillPixels(0, 0, Physics.TEXTURE.width, Physics.TEXTURE.height, pixels, 4, 3);
    }
}