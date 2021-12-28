const PixelScanJS = {
        gravity: null,
        resolve_physics: (aabb, velocity) => {

        },
        create_world: (width, height) => {
            PixelScanJS.gravity = new Vec2(0, 0.5);
            PixelScanJS.world = new Array(width * height);
        },
        fill_world: (x, y, width, height, data) => {
            console.log(this, PixelScanJS);
        },
        world: null,
};
class AABB extends Array {
    constructor(x, y, width, height) {
        super(4);

        this[0] = x || 0;
        this[1] = y || 0;
        this[2] = width || 0;
        this[3] = height || 0;
    }

    static copy(aabb) {
        return new AABB(aabb[0], aabb[1], aabb[2], aabb[3]);
    }

    copy(aabb) {
        this[0] = aabb[0];
        this[1] = aabb[1];
        this[2] = aabb[2];
        this[3] = aabb[3];

        return this;
    }

    contains(x, y) {
        return (x >= this[0]) && (y >= this[1]) && (x - this[0] < this[2]) && (y - this[1] < this[3]);
    }
}
class Vec2 extends Array {
    constructor(x, y) {
        super(2);

        this[0] = x || 0;
        this[1] = y || 0;
    }

    static copy(vec) {
        return new Vec2(vec[0], vec[1]);
    }

    copy(vec) {
        this[0] = vec[0];
        this[1] = vec[1];

        return this;
    }

    multiply(mat) {
        const x = this[0] * mat[0] + this[1] * mat[3] + mat[6];
        const y = this[0] * mat[1] + this[1] * mat[4] + mat[7];
        this[0] = x;
        this[1] = y;

        return this;
    }

    magnitude() {
        return Math.sqrt(this[0] * this[0] + this[1] * this[1]);
    }

    magnitudeSquared() {
        return this[0] * this[0] + this[1] * this[1];
    }

    rotate(radians) {
        const x = this[0];
        const y = this[1];

        this[0] = x * Math.cos(radians) - y * Math.sin(radians);
        this[1] = y * Math.cos(radians) + x * Math.sin(radians);

        return this;
    }

    normalize() {
        const length = this.magnitude();
        if (length === 0) {
            return;
        }

        this[0] /= length;
        this[1] /= length;
    }

    distance(vec) {
        const dx = vec[0] - this[0];
        const dy = vec[1] - this[1];

        return Math.sqrt(dx * dx + dy * dy);
    }

    distanceSquared(vec) {
        const dx = vec[0] - this[0];
        const dy = vec[1] - this[1];

        return dx * dx + dy * dy;
    }

    negate() {
        this[0] = -this[0];
        this[1] = -this[1];

        return this;
    }

    atan2() {
        return Math.atan2(this[1], this[0]);
    }

    dot(vec) {
        return this[0] * vec[0] + this[1] * vec[1];
    }

    cross(vec) {
        return this[0] * vec[1] - vec[0] * this[1];
    }

    // returns a number between -1 and 1,
    // where 0 represents the two vectors are the same direction,
    // 0.5 represents the perpendicular normal,
    // and -0.5 is the inverted normal
    // valid for all vectors where the positive angle between them is < 180, not equal
    crossDot(vec) {
        const sign = Math.sign(this.cross(vec)) || 1;
        return (0.5 - this.dot(vec) / 2.0) * sign;
    }
}
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
