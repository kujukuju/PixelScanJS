const PixelScan = (function() {
class FramedSprite extends PIXI.Sprite {
    textures;
    animations;

    currentName;
    currentFrame;

    // left to right top to bottom sprite sheet
    constructor(texture, width, height, columns, count) {
        super(null);

        this.textures = [];
        this.textures.length = count;
        for (let i = 0; i < count; i++) {
            const row = Math.floor(i / columns);
            const column = i % columns;

            const x = column * width;
            const y = row * height;

            this.textures[i] = new PIXI.Texture(texture, new PIXI.Rectangle(x, y, width, height));
        }
        this.texture = this.textures[0];

        this.animations = {};

        this.currentName = undefined;
        this.currentFrame = 0;
    }

    addAnimation(name, start, count) {
        const animation = {
            start: start,
            count: count,
            linked: {},
        };

        this.animations[name] = animation;
    }

    gotoAnimation(name, frame) {
        if (frame !== undefined) {
            this.currentFrame = frame;
        } else if (this.currentName !== name) {
            // if were on a different animation check if we need to reset the frame
            if (!this.animations[this.currentName] || !this.animations[this.currentName].linked[name]) {
                this.currentFrame = 0;
            }
        }

        this.currentName = name;
        if (this.animations[this.currentName]) {
            this.currentFrame = this.currentFrame % this.animations[this.currentName].count;
        } else {
            this.currentFrame = this.currentframe
        }

        this.updateFrame();
    }

    stepAnimation(name, frames) {
        if (this.currentName !== name) {
            if (!this.animations[this.currentName] || !this.animations[this.currentName].linked[name]) {
                this.currentFrame = 0;
            }
        }

        frames = frames || 1;

        this.currentName = name;
        if (this.animations[this.currentName]) {
            this.currentFrame = (this.currentFrame + frames) % this.animations[this.currentName].count;
        } else {
            this.currentFrame = (this.currentframe + frames) % this.textures.length;
        }

        this.updateFrame();
    }

    // adds a linked animation so the animation will pick up from where it left off
    linkAnimations(name, linkedName) {
        this.animations[name].linked[linkedName] = true;
        this.animations[linkedName].linked[name] = true;
    }

    getFrame() {
        return this.currentFrame;
    }

    updateFrame() {
        if (this.animations[this.currentName]) {
            this.texture = this.textures[Math.floor(this.currentFrame + this.animations[this.currentName].start)];
        } else {
            this.texture = this.textures[Math.floor(this.currentFrame)];
        }
    }
}
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
const extract = (application, texture) => {
    const renderTexture = PIXI.RenderTexture.create({width: texture.width, height: texture.height});
    const sprite = new PIXI.Sprite(texture);

    application.renderer.render(sprite, renderTexture);
    const pixels = application.renderer.plugins.extract.pixels(renderTexture);

    renderTexture.destroy();

    return pixels;
};
let gravity = null;
let world = null;

const resolvePhysics = (aabb, velocity) => {

};

const createWorld = (width, height) => {
    PixelScanJS.gravity = new Vec2(0, 0.5);
    PixelScanJS.world = new Array(width * height);
};

const fillWorld = (x, y, width, height, data) => {
    console.log(this, PixelScanJS);
};
const PixelScan = {
    FramedSprite,
    AABB,
    Vec2,
    gravity,
    world,
    resolvePhysics,
    createWorld,
    fillWorld,
    extract,
};
return PixelScan;
})();