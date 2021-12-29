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
            this.currentFrame = this.currentFrame
        }

        this.updateFrame();
    }

    stepAnimation(name, frames) {
        if (Number.isNaN(name)) {
            frames = name;
            name = undefined;
        }

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
            this.currentFrame = (this.currentFrame + frames) % this.textures.length;
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
class AABB {
    x;
    y;
    width;
    height;
    
    constructor(x, y, width, height) {
        this.x = x || 0;
        this.y = y || 0;
        this.width = width || 0;
        this.height = height || 0;
    }

    static copy(aabb) {
        return new AABB(aabb.x, aabb.y, aabb.width, aabb.height);
    }

    copy(aabb) {
        this.x = aabb.x;
        this.y = aabb.y;
        this.width = aabb.width;
        this.height = aabb.height;

        return this;
    }

    contains(x, y) {
        return (x >= this.x) && (y >= this.y) && (x - this.x < this.width) && (y - this.y < this.height);
    }
}
class Vec2 {
    x;
    y;

    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    static copy(vec) {
        return new Vec2(vec.x, vec.y);
    }

    copy(vec) {
        this.x = vec.x;
        this.y = vec.y;

        return this;
    }

    multiply(mat) {
        const x = this.x * mat.v0 + this.y * mat.v3 + mat.v6;
        const y = this.x * mat.v1 + this.y * mat.v4 + mat.v7;
        this.x = x;
        this.y = y;

        return this;
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    magnitudeSquared() {
        return this.x * this.x + this.y * this.y;
    }

    rotate(radians) {
        const x = this.x;
        const y = this.y;

        this.x = x * Math.cos(radians) - y * Math.sin(radians);
        this.y = y * Math.cos(radians) + x * Math.sin(radians);

        return this;
    }

    normalize() {
        const length = this.magnitude();
        if (length === 0) {
            return;
        }

        this.x /= length;
        this.y /= length;
    }

    distance(vec) {
        const dx = vec.x - this.x;
        const dy = vec.y - this.y;

        return Math.sqrt(dx * dx + dy * dy);
    }

    distanceSquared(vec) {
        const dx = vec.x - this.x;
        const dy = vec.y - this.y;

        return dx * dx + dy * dy;
    }

    negate() {
        this.x = -this.x;
        this.y = -this.y;

        return this;
    }

    atan2() {
        return Math.atan2(this.y, this.x);
    }

    dot(vec) {
        return this.x * vec.x + this.y * vec.y;
    }

    cross(vec) {
        return this.x * vec.y - vec.x * this.y;
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
class Mat3 {
    static _tempMat = null;
    static _tempVec = new Vec2();

    v0;
    v1;
    v2;
    v3;
    v4;
    v5;
    v6;
    v7;
    v8;

    // NOTE: libgdx's indices are transposed

    constructor() {
        this.v0 = 1;
        this.v1 = 0;
        this.v2 = 0;
        this.v3 = 0;
        this.v4 = 1;
        this.v5 = 0;
        this.v6 = 0;
        this.v7 = 0;
        this.v8 = 1;
    }

    copy(mat) {
        this.v0 = mat.v0;
        this.v1 = mat.v1;
        this.v2 = mat.v2;
        this.v3 = mat.v3;
        this.v4 = mat.v4;
        this.v5 = mat.v5;
        this.v6 = mat.v6;
        this.v7 = mat.v7;
        this.v8 = mat.v8;

        return this;
    }

    determinant() {
        return this.v0 * this.v4 * this.v8 + this.v1 * this.v5 * this.v6 + this.v2 * this.v3 * this.v7 - this.v0
            * this.v5 * this.v7 - this.v1 * this.v3 * this.v8 - this.v2 * this.v4 * this.v6;
    }

    invert() {
        const det = this.determinant();
        if (det === 0) {
            return null;
        }

        const inv = 1.0 / det;

        Mat3._tempMat.v0 = this.v4 * this.v8 - this.v7 * this.v5;
        Mat3._tempMat.v3 = this.v6 * this.v5 - this.v3 * this.v8;
        Mat3._tempMat.v6 = this.v3 * this.v7 - this.v6 * this.v4;
        Mat3._tempMat.v1 = this.v7 * this.v2 - this.v1 * this.v8;
        Mat3._tempMat.v4 = this.v0 * this.v8 - this.v6 * this.v2;
        Mat3._tempMat.v7 = this.v6 * this.v1 - this.v0 * this.v7;
        Mat3._tempMat.v2 = this.v1 * this.v5 - this.v4 * this.v2;
        Mat3._tempMat.v5 = this.v3 * this.v2 - this.v0 * this.v5;
        Mat3._tempMat.v8 = this.v0 * this.v4 - this.v3 * this.v1;

        this.v0 = inv * Mat3._tempMat.v0;
        this.v3 = inv * Mat3._tempMat.v3;
        this.v6 = inv * Mat3._tempMat.v6;
        this.v1 = inv * Mat3._tempMat.v1;
        this.v4 = inv * Mat3._tempMat.v4;
        this.v7 = inv * Mat3._tempMat.v7;
        this.v2 = inv * Mat3._tempMat.v2;
        this.v5 = inv * Mat3._tempMat.v5;
        this.v8 = inv * Mat3._tempMat.v8;

        return this;
    }

    multiply(mat) {
        const v00 = this.v0 * mat.v0 + this.v3 * mat.v1 + this.v6 * mat.v2;
        const v01 = this.v0 * mat.v3 + this.v3 * mat.v4 + this.v6 * mat.v5;
        const v02 = this.v0 * mat.v6 + this.v3 * mat.v7 + this.v6 * mat.v8;

        const v10 = this.v1 * mat.v0 + this.v4 * mat.v1 + this.v7 * mat.v2;
        const v11 = this.v1 * mat.v3 + this.v4 * mat.v4 + this.v7 * mat.v5;
        const v12 = this.v1 * mat.v6 + this.v4 * mat.v7 + this.v7 * mat.v8;

        const v20 = this.v2 * mat.v0 + this.v5 * mat.v1 + this.v8 * mat.v2;
        const v21 = this.v2 * mat.v3 + this.v5 * mat.v4 + this.v8 * mat.v5;
        const v22 = this.v2 * mat.v6 + this.v5 * mat.v7 + this.v8 * mat.v8;

        this.v0 = v00;
        this.v1 = v10;
        this.v2 = v20;
        this.v3 = v01;
        this.v4 = v11;
        this.v5 = v21;
        this.v6 = v02;
        this.v7 = v12;
        this.v8 = v22;

        return this;
    }

    leftMultiply(mat) {
        const v00 = mat.v0 * this.v0 + mat.v3 * this.v1 + mat.v6 * this.v2;
        const v01 = mat.v0 * this.v3 + mat.v3 * this.v4 + mat.v6 * this.v5;
        const v02 = mat.v0 * this.v6 + mat.v3 * this.v7 + mat.v6 * this.v8;

        const v10 = mat.v1 * this.v0 + mat.v4 * this.v1 + mat.v7 * this.v2;
        const v11 = mat.v1 * this.v3 + mat.v4 * this.v4 + mat.v7 * this.v5;
        const v12 = mat.v1 * this.v6 + mat.v4 * this.v7 + mat.v7 * this.v8;

        const v20 = mat.v2 * this.v0 + mat.v5 * this.v1 + mat.v8 * this.v2;
        const v21 = mat.v2 * this.v3 + mat.v5 * this.v4 + mat.v8 * this.v5;
        const v22 = mat.v2 * this.v6 + mat.v5 * this.v7 + mat.v8 * this.v8;

        this.v0 = v00;
        this.v1 = v10;
        this.v2 = v20;
        this.v3 = v01;
        this.v4 = v11;
        this.v5 = v21;
        this.v6 = v02;
        this.v7 = v12;
        this.v8 = v22;

        return this;
    }

    setToTranslation(vec) {
        this.v0 = 1;
        this.v1 = 0;
        this.v2 = 0;
        this.v3 = 0;
        this.v4 = 1;
        this.v5 = 0;
        this.v6 = vec.x;
        this.v7 = vec.y;
        this.v8 = 1;

        return this;
    }

    getTranslation(out) {
        out.x = this.v6;
        out.y = this.v7;

        return out;
    }

    setTranslation(vec) {
        const inverseVec = this.getTranslation(Mat3._tempVec).negate();
        const inverse = Mat3._tempMat.setToTranslation(inverseVec);

        // translation * (inverse * self)
        this.leftMultiply(inverse);

        const correct = Mat3._tempMat.setToTranslation(vec);
        return this.leftMultiply(correct)
    }

    translate(vec) {
        Mat3._tempMat.setToTranslation(vec);

        return this.multiply(Mat3._tempMat);
    }

    setToRotation(radians) {
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);

        this.v0 = cos;
        this.v1 = sin;
        this.v2 = 0;

        this.v3 = -sin;
        this.v4 = cos;
        this.v5 = 0;

        this.v6 = 0;
        this.v7 = 0;
        this.v8 = 1;

        return this;
    }

    getRotation() {
        return Math.atan2(this.v1, this.v0);
    }

    setRotation(radians) {
        const inverse = Mat3._tempMat.setToRotation(-this.getRotation());
        this.multiply(inverse);
        const correct = Mat3._tempMat.setToRotation(radians);
        return this.multiply(correct);
    }

    rotate(radians) {
        Mat3._tempMat.setToRotation(radians);

        return this.multiply(Mat3._tempMat);
    }
}

Mat3._tempMat = new Mat3();
class Mat3 {
    static _tempMat = null;
    static _tempVec = new Vec2();

    v0;
    v1;
    v2;
    v3;
    v4;
    v5;
    v6;
    v7;
    v8;

    // NOTE: libgdx's indices are transposed

    constructor() {
        this.v0 = 1;
        this.v1 = 0;
        this.v2 = 0;
        this.v3 = 0;
        this.v4 = 1;
        this.v5 = 0;
        this.v6 = 0;
        this.v7 = 0;
        this.v8 = 1;
    }

    copy(mat) {
        this.v0 = mat.v0;
        this.v1 = mat.v1;
        this.v2 = mat.v2;
        this.v3 = mat.v3;
        this.v4 = mat.v4;
        this.v5 = mat.v5;
        this.v6 = mat.v6;
        this.v7 = mat.v7;
        this.v8 = mat.v8;

        return this;
    }

    determinant() {
        return this.v0 * this.v4 * this.v8 + this.v1 * this.v5 * this.v6 + this.v2 * this.v3 * this.v7 - this.v0
            * this.v5 * this.v7 - this.v1 * this.v3 * this.v8 - this.v2 * this.v4 * this.v6;
    }

    invert() {
        const det = this.determinant();
        if (det === 0) {
            return null;
        }

        const inv = 1.0 / det;

        Mat3._tempMat.v0 = this.v4 * this.v8 - this.v7 * this.v5;
        Mat3._tempMat.v3 = this.v6 * this.v5 - this.v3 * this.v8;
        Mat3._tempMat.v6 = this.v3 * this.v7 - this.v6 * this.v4;
        Mat3._tempMat.v1 = this.v7 * this.v2 - this.v1 * this.v8;
        Mat3._tempMat.v4 = this.v0 * this.v8 - this.v6 * this.v2;
        Mat3._tempMat.v7 = this.v6 * this.v1 - this.v0 * this.v7;
        Mat3._tempMat.v2 = this.v1 * this.v5 - this.v4 * this.v2;
        Mat3._tempMat.v5 = this.v3 * this.v2 - this.v0 * this.v5;
        Mat3._tempMat.v8 = this.v0 * this.v4 - this.v3 * this.v1;

        this.v0 = inv * Mat3._tempMat.v0;
        this.v3 = inv * Mat3._tempMat.v3;
        this.v6 = inv * Mat3._tempMat.v6;
        this.v1 = inv * Mat3._tempMat.v1;
        this.v4 = inv * Mat3._tempMat.v4;
        this.v7 = inv * Mat3._tempMat.v7;
        this.v2 = inv * Mat3._tempMat.v2;
        this.v5 = inv * Mat3._tempMat.v5;
        this.v8 = inv * Mat3._tempMat.v8;

        return this;
    }

    multiply(mat) {
        const v00 = this.v0 * mat.v0 + this.v3 * mat.v1 + this.v6 * mat.v2;
        const v01 = this.v0 * mat.v3 + this.v3 * mat.v4 + this.v6 * mat.v5;
        const v02 = this.v0 * mat.v6 + this.v3 * mat.v7 + this.v6 * mat.v8;

        const v10 = this.v1 * mat.v0 + this.v4 * mat.v1 + this.v7 * mat.v2;
        const v11 = this.v1 * mat.v3 + this.v4 * mat.v4 + this.v7 * mat.v5;
        const v12 = this.v1 * mat.v6 + this.v4 * mat.v7 + this.v7 * mat.v8;

        const v20 = this.v2 * mat.v0 + this.v5 * mat.v1 + this.v8 * mat.v2;
        const v21 = this.v2 * mat.v3 + this.v5 * mat.v4 + this.v8 * mat.v5;
        const v22 = this.v2 * mat.v6 + this.v5 * mat.v7 + this.v8 * mat.v8;

        this.v0 = v00;
        this.v1 = v10;
        this.v2 = v20;
        this.v3 = v01;
        this.v4 = v11;
        this.v5 = v21;
        this.v6 = v02;
        this.v7 = v12;
        this.v8 = v22;

        return this;
    }

    leftMultiply(mat) {
        const v00 = mat.v0 * this.v0 + mat.v3 * this.v1 + mat.v6 * this.v2;
        const v01 = mat.v0 * this.v3 + mat.v3 * this.v4 + mat.v6 * this.v5;
        const v02 = mat.v0 * this.v6 + mat.v3 * this.v7 + mat.v6 * this.v8;

        const v10 = mat.v1 * this.v0 + mat.v4 * this.v1 + mat.v7 * this.v2;
        const v11 = mat.v1 * this.v3 + mat.v4 * this.v4 + mat.v7 * this.v5;
        const v12 = mat.v1 * this.v6 + mat.v4 * this.v7 + mat.v7 * this.v8;

        const v20 = mat.v2 * this.v0 + mat.v5 * this.v1 + mat.v8 * this.v2;
        const v21 = mat.v2 * this.v3 + mat.v5 * this.v4 + mat.v8 * this.v5;
        const v22 = mat.v2 * this.v6 + mat.v5 * this.v7 + mat.v8 * this.v8;

        this.v0 = v00;
        this.v1 = v10;
        this.v2 = v20;
        this.v3 = v01;
        this.v4 = v11;
        this.v5 = v21;
        this.v6 = v02;
        this.v7 = v12;
        this.v8 = v22;

        return this;
    }

    setToTranslation(vec) {
        this.v0 = 1;
        this.v1 = 0;
        this.v2 = 0;
        this.v3 = 0;
        this.v4 = 1;
        this.v5 = 0;
        this.v6 = vec.x;
        this.v7 = vec.y;
        this.v8 = 1;

        return this;
    }

    getTranslation(out) {
        out.x = this.v6;
        out.y = this.v7;

        return out;
    }

    setTranslation(vec) {
        const inverseVec = this.getTranslation(Mat3._tempVec).negate();
        const inverse = Mat3._tempMat.setToTranslation(inverseVec);

        // translation * (inverse * self)
        this.leftMultiply(inverse);

        const correct = Mat3._tempMat.setToTranslation(vec);
        return this.leftMultiply(correct)
    }

    translate(vec) {
        Mat3._tempMat.setToTranslation(vec);

        return this.multiply(Mat3._tempMat);
    }

    setToRotation(radians) {
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);

        this.v0 = cos;
        this.v1 = sin;
        this.v2 = 0;

        this.v3 = -sin;
        this.v4 = cos;
        this.v5 = 0;

        this.v6 = 0;
        this.v7 = 0;
        this.v8 = 1;

        return this;
    }

    getRotation() {
        return Math.atan2(this.v1, this.v0);
    }

    setRotation(radians) {
        const inverse = Mat3._tempMat.setToRotation(-this.getRotation());
        this.multiply(inverse);
        const correct = Mat3._tempMat.setToRotation(radians);
        return this.multiply(correct);
    }

    rotate(radians) {
        Mat3._tempMat.setToRotation(radians);

        return this.multiply(Mat3._tempMat);
    }
}

Mat3._tempMat = new Mat3();
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