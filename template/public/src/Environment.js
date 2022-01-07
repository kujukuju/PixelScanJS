class Environment {
    static FOREGROUND = PIXI.Texture.from('assets/foreground.png');
    static BACKGROUND = PIXI.Texture.from('assets/background.png');

    static foregroundSprite;
    static backgroundSprite;

    static initialize() {
        Environment.foregroundSprite = new PIXI.Sprite(Environment.FOREGROUND);
        Environment.backgroundSprite = new PIXI.Sprite(Environment.BACKGROUND);
        Renderer.foreground.addChild(Environment.foregroundSprite);
        Renderer.background.addChild(Environment.backgroundSprite);
    }
}