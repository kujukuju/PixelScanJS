const extract = (application, texture) => {
    const renderTexture = PIXI.RenderTexture.create({width: texture.width, height: texture.height});
    const sprite = new PIXI.Sprite(texture);

    application.renderer.render(sprite, renderTexture);
    const pixels = application.renderer.plugins.extract.pixels(renderTexture);

    renderTexture.destroy();

    return pixels;
};

const getLinePixels = (x1, y1, x2, y2, inclusive) => {
    x1 = Math.round(x1);
    y1 = Math.round(y1);
    x2 = Math.round(x2);
    y2 = Math.round(y2);

    // modified bresenham’s to handle reverse lines and vertical lines
    const dx = x2 - x1;
    const dy = y2 - y1;

    const pixels = [];
    if (Math.abs(dx) >= Math.abs(dy)) {
        let x = x1;
        let y = y1;

        if (x2 > x1) {
            let p = 2 * dy - dx;
            while (x < x2) {
                if (p >= 0) {
                    const point = new Vec2(x, y);
                    pixels.push(point);

                    y = y + 1;
                    p = p + 2 * dy - 2 * dx;
                } else {
                    const point = new Vec2(x, y);
                    pixels.push(point);

                    p = p + 2 * dy;
                }

                x = x + 1;
            }
        } else {
            let p = -2 * dy + dx;
            while (x > x2) {
                if (p >= 0) {
                    const point = new Vec2(x, y);
                    pixels.push(point);

                    y = y - 1;
                    p = p - 2 * dy + 2 * dx;
                } else {
                    const point = new Vec2(x, y);
                    pixels.push(point);

                    p = p - 2 * dy;
                }

                x = x - 1;
            }
        }
    } else {
        let x = x1;
        let y = y1;

        if (y2 > y1) {
            let p = 2 * dx - dy;
            while (y < y2) {
                if (p >= 0) {
                    const point = new Vec2(x, y);
                    pixels.push(point);

                    x = x + 1;
                    p = p + 2 * dx - 2 * dy;
                } else {
                    const point = new Vec2(x, y);
                    pixels.push(point);

                    p = p + 2 * dx;
                }

                y = y + 1;
            }
        } else {
            let p = -2 * dx + dy;
            while (y > y2) {
                if (p >= 0) {
                    const point = new Vec2(x, y);
                    pixels.push(point);

                    x = x - 1;
                    p = p - 2 * dx + 2 * dy;
                } else {
                    const point = new Vec2(x, y);
                    pixels.push(point);

                    p = p - 2 * dx;
                }

                y = y - 1;
            }
        }
    }

    if (inclusive || (x1 == x2 && y1 == y2)) {
        const point = new Vec2(x2, y2);
        pixels.push(point);
    }

    return pixels;
}