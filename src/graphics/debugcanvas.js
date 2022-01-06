class DebugCanvas extends PIXI.Graphics {
    constructor() {
        super();
    }

    drawRect(x, y, width, height, color, alpha) {
        color = color || 0;
        alpha = alpha === undefined ? 1 : alpha;

        this.lineStyle(0);
        this.beginFill(color, alpha);

        super.drawRect(x, y, width, height);

        this.endFill();
    }

    drawLine(x1, y1, x2, y2, color, alpha) {
        color = color || 0;
        alpha = alpha === undefined ? 1 : alpha;

        this.lineStyle(1, color, alpha);

        this.moveTo(x1, y1);
        this.lineTo(x2, y2);

        this.closePath();
    }

    render(renderer) {
        super.render(renderer);

        this.clear();
    }
}