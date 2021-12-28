const PixelUtilities = {
    extract: (application, texture) => {
        const renderTexture = PIXI.RenderTexture.create({width: texture.width, height: texture.height});
        const sprite = new PIXI.Sprite(texture);

        application.renderer.render(sprite, renderTexture);
        const pixels = application.renderer.plugins.extract.pixels(renderTexture);

        renderTexture.destroy();

        return pixels;
    },
};