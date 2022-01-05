class DebugCanvas extends PIXI.Graphics {
    constructor() {
        super();
    }

    drawRect(x, y, width, height, color, alpha) {
        color = color || 0;
        alpha = alpha === undefined ? 1 : alpha;

        this.beginFill(color, alpha);

        super.drawRect(x, y, width, height);

        this.endFill();
    }

    render(renderer) {
        super.render(renderer);

        this.clear();
    }
}