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

    stepAnimation(name, frames, loop) {
        if (Number.isNaN(name)) {
            loop = frames;
            frames = name;
            name = undefined;
        }

        frames = frames || 1;
        if (loop === undefined) {
            loop = true;
        }

        if (this.currentName !== name) {
            if (!this.animations[this.currentName] || !this.animations[this.currentName].linked[name]) {
                this.currentFrame = 0;
            }
        }

        this.currentName = name;
        if (this.animations[this.currentName]) {
            if (loop) {
                this.currentFrame = (this.currentFrame + frames) % this.animations[this.currentName].count;
            } else {
                this.currentFrame = Math.min(this.currentFrame + frames, this.animations[this.currentName].count - 1);
            }
        } else {
            if (loop) {
                this.currentFrame = (this.currentFrame + frames) % this.textures.length;
            } else {
                this.currentFrame = Math.min(this.currentFrame + frames, this.textures.length - 1);
            }
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
class Input {
    static KEY_0 = '0';
    static KEY_1 = '1';
    static KEY_2 = '2';
    static KEY_3 = '3';
    static KEY_4 = '4';
    static KEY_5 = '5';
    static KEY_6 = '6';
    static KEY_7 = '7';
    static KEY_8 = '8';
    static KEY_9 = '9';
    static KEY_A = 'a';
    static KEY_B = 'b';
    static KEY_C = 'c';
    static KEY_D = 'd';
    static KEY_E = 'e';
    static KEY_F = 'f';
    static KEY_G = 'g';
    static KEY_H = 'h';
    static KEY_I = 'i';
    static KEY_J = 'j';
    static KEY_K = 'k';
    static KEY_L = 'l';
    static KEY_M = 'm';
    static KEY_N = 'n';
    static KEY_O = 'o';
    static KEY_P = 'p';
    static KEY_Q = 'q';
    static KEY_R = 'r';
    static KEY_S = 's';
    static KEY_T = 't';
    static KEY_U = 'u';
    static KEY_V = 'v';
    static KEY_W = 'w';
    static KEY_X = 'x';
    static KEY_Y = 'y';
    static KEY_Z = 'z';
    static KEY_ESCAPE = 'escape';
    static KEY_SHIFT = 'shift';
    static KEY_SPACE = ' ';

    static keys = {};

    static mouseDownLeft = false;
    static mouseDownRight = false;

    static mousePosition = null;
}

window.addEventListener('load', () => {
    Input.mousePosition = new Vec2();

    

    window.addEventListener('keydown', event => {
        if (!event.key) {
            return true;
        }

        Input.keys[event.key.toLowerCase()] = true;

        return true;
    }, true);


    window.addEventListener('keyup', event => {
        if (!event.key) {
            return true;
        }

        delete Input.keys[event.key.toLowerCase()];

        return true;
    }, true);

    window.addEventListener('mousedown', event => {
        if (event.button === 0) {
            Input.mouseDownLeft = true;
        }
        if (event.button === 2) {
            Input.mouseDownRight = true;
        }

        return true;
    }, true);

    window.addEventListener('mouseup', event => {
        if (event.button === 0) {
            Input.mouseDownLeft = false;
        }
        if (event.button === 2) {
            Input.mouseDownRight = false;
        }

        return true;
    }, true);

    window.addEventListener('mousemove', event => {
        Input.mousePosition[0] = event.clientX;
        Input.mousePosition[1] = event.clientY;

        return true;
    }, true);

    window.addEventListener('contextmenu', event => {
        event.preventDefault();
        return false;
    }, true);
});
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

    round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);

        return this;
    }

    contains(x, y) {
        return (x >= this.x) && (y >= this.y) && (x - this.x < this.width) && (y - this.y < this.height);
    }
}
class Mat3 {
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

        tempMat.v0 = this.v4 * this.v8 - this.v7 * this.v5;
        tempMat.v3 = this.v6 * this.v5 - this.v3 * this.v8;
        tempMat.v6 = this.v3 * this.v7 - this.v6 * this.v4;
        tempMat.v1 = this.v7 * this.v2 - this.v1 * this.v8;
        tempMat.v4 = this.v0 * this.v8 - this.v6 * this.v2;
        tempMat.v7 = this.v6 * this.v1 - this.v0 * this.v7;
        tempMat.v2 = this.v1 * this.v5 - this.v4 * this.v2;
        tempMat.v5 = this.v3 * this.v2 - this.v0 * this.v5;
        tempMat.v8 = this.v0 * this.v4 - this.v3 * this.v1;

        this.v0 = inv * tempMat.v0;
        this.v3 = inv * tempMat.v3;
        this.v6 = inv * tempMat.v6;
        this.v1 = inv * tempMat.v1;
        this.v4 = inv * tempMat.v4;
        this.v7 = inv * tempMat.v7;
        this.v2 = inv * tempMat.v2;
        this.v5 = inv * tempMat.v5;
        this.v8 = inv * tempMat.v8;

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
        const inverseVec = this.getTranslation(tempVec).negate();
        const inverse = tempMat.setToTranslation(inverseVec);

        // translation * (inverse * self)
        this.leftMultiply(inverse);

        const correct = tempMat.setToTranslation(vec);
        return this.leftMultiply(correct)
    }

    translate(vec) {
        tempMat.setToTranslation(vec);

        return this.multiply(tempMat);
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
        const inverse = tempMat.setToRotation(-this.getRotation());
        this.multiply(inverse);
        const correct = tempMat.setToRotation(radians);
        return this.multiply(correct);
    }

    rotate(radians) {
        tempMat.setToRotation(radians);

        return this.multiply(tempMat);
    }
}

tempMat = new Mat3();
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

    add(vec) {
        this.x += vec.x;
        this.y += vec.y;

        return this;
    }

    round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);

        return this;
    }

    multiply(mat) {
        if (Number.isNaN(mat)) {
            const x = this.x * mat.v0 + this.y * mat.v3 + mat.v6;
            const y = this.x * mat.v1 + this.y * mat.v4 + mat.v7;
            this.x = x;
            this.y = y;
        } else {
            this.x *= mat;
            this.y *= mat;
        }

        return this;
    }

    mul = this.multiply;

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    length = this.magnitude;

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
            return this;
        }

        this.x /= length;
        this.y /= length;

        return this;
    }

    norm = this.normalize;

    distance(vec) {
        const dx = vec.x - this.x;
        const dy = vec.y - this.y;

        return Math.sqrt(dx * dx + dy * dy);
    }

    dist = this.distance;

    distanceSquared(vec) {
        const dx = vec.x - this.x;
        const dy = vec.y - this.y;

        return dx * dx + dy * dy;
    }

    distSquared = this.distanceSquared;

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

    projectOnto(vec) {
        tempVec.copy(vec);
        tempVec.normalize();

        const top = this.dot(tempVec);
        const bottom = tempVec.dot(tempVec);

        this.copy(tempVec);
        this.multiply(top / bottom);

        return this;
    }
}

tempVec = new Vec2();
class GroundController {
    position = new Vec2();
    velocity = new Vec2();
    jumping = false;
    normals = [];
    accel = 6;
    friction = 4.5;
    // the fricton that is applied on top of default friction once you've exceeded max speed
    terminalFriction = 0.5;
    speed = 12;
    // the y component of the maximumly angled normal vector that you're able to walk on, default 30 degrees
    groundNormalSlope = 0.8660254037844386;
    // the x component of the maximumly angled normal vector that you're able to slide on, default 30 degrees
    wallNormalSlope = 0.8660254037844386;
    groundJumpVelocity = 25;
    wallJumpVelocity = 40;

    constructor() {

    }

    applyAcceleration(up, left, down, right) {
        let accelX = 0;
        if (left) {
            accelX -= this.accel;
        }
        if (right) {
            accelX += this.accel;
        }
    
        const initialVelocityX = this.velocity.x;
        if (Math.abs(this.velocity.x + accelX) <= this.friction) {
            this.velocity.x = 0;
        } else {
            this.velocity.x += accelX;
            this.velocity.x -= Math.sign(this.velocity.x) * this.friction;
        }
    
        if (Math.abs(initialVelocityX) > this.speed && Math.abs(this.velocity.x) > this.speed) {
            if (Math.abs(this.velocity.x) > Math.abs(initialVelocityX)) {
                // in this scenario we want to match the previously applied acceleration to the friciton to only cancel it out, then apply the terminal friction on top
                this.velocity.x -= (accelX - Math.sign(accelX) * this.friction);
            }
    
            if (Math.abs(this.velocity.x) - this.terminalFriction <= this.speed) {
                // because we're able to go past the max speed using the terminal friction we only adjust to the max speed
                this.velocity.x = Math.sign(this.velocity.x) * this.speed;
            } else {
                this.velocity.x -= Math.sign(this.velocity.x) * this.terminalFriction;
            }
        } else if (Math.abs(this.velocity.x) > this.speed) {
            // if this scenario we want to slow you down to the maximum speed because we were the ones that applied you to be above it
            this.velocity.x = Math.sign(this.velocity.x) * this.speed;
        }
    
        // clear the jumping flag if you're not jumping
        if (this.jumping) {
            for (let i = 0; i < this.normals.length; i++) {
                if (this.normals[i].y <= -this.groundNormalSlope) {
                    this.jumping = false;
                    break;
                }
                
                if (this.normals[i].x >= this.wallNormalSlope) {
                    this.jumping = false;
                    break;
                }
    
                if (this.normals[i].x <= -this.wallNormalSlope) {
                    this.jumping = false;
                    break;
                }
            }
        }
    
        // jump if you're trying to and able to
        if (!this.jumping && up) {
            let ground = false;
            let leftWall = false;
            let rightWall = false;
            for (let i = 0; i < this.normals.length; i++) {
                if (this.normals[i].y <= -this.groundNormalSlope) {
                    ground = true;
                }
                
                if (this.normals[i].x >= this.wallNormalSlope) {
                    rightWall = true;
                }
    
                if (this.normals[i].x <= -this.wallNormalSlope) {
                    leftWall = true;
                }
            }
    
            if (ground || leftWall || rightWall) {
                const jumpVelocity = (leftWall || rightWall) ? this.wallJumpVelocity : this.groundJumpVelocity;
                let jumpDirectionX = 0;
                let jumpDirectionY = 0;
    
                if (ground) {
                    jumpDirectionY = -1;
                } else if (leftWall && rightWall) {
                    jumpDirectionY = -1;
                } else if (leftWall) {
                    jumpDirectionX = 0.5;
                    jumpDirectionY = -0.8660254037844386;
                } else if (rightWall) {
                    jumpDirectionX = -0.5;
                    jumpDirectionY = -0.8660254037844386;
                }
    
                this.jumping = true;
                this.velocity.x += jumpDirectionX * jumpVelocity;
                this.velocity.y = jumpDirectionY * jumpVelocity;
            }
        }
    }
}
class World {
    width;
    height;
    pixels;

    gravity;
    airResistance;

    constructor(width, height, gravity) {
        this.width = width;
        this.height = height;
        this.pixels = new Array(width * height);
        this.gravity = gravity || new Vec2(0, 1);
        this.airResistance = 2;
    }

    // stride and offset indicate the size of a given pixel in bytes and the offset in order to access the alpha value
    fillPixels(x, y, width, height, data, stride, offset) {
        stride = stride || 1;
        offset = offset || 0;
        
        for (let offsetX = 0; offsetX < width; offsetX++) {
            const realX = x + offsetX;
    
            for (let offsetY = 0; offsetY < height; offsetY++) {
                const realY = y + offsetY;
                
                const worldIndex = realY * this.width + realX;
                const dataIndex = offsetY * width + offsetX;
    
                this.pixels[worldIndex] = !!data[dataIndex * stride + offset];
            }
        }
    }

    resolvePhysics(controller, aabb) {
        let bodyFallingSpeed = Vec2.copy(controller.velocity).projectOnto(this.gravity).length() * 0.01 * this.airResistance;
        if (controller.velocity.dot(this.gravity) <= 0) {
            bodyFallingSpeed = 0;
        }

        const gravitySpeed = this.gravity.length();
        const appliedGravity = Vec2.copy(this.gravity).normalize().multiply(Math.max(gravitySpeed - bodyFallingSpeed * bodyFallingSpeed, 0));
        controller.velocity.add(appliedGravity);

        if (controller.velocity.length() === 0) {
            return;
        }

        // TODO specifically if you've moved at least 1 pixel then we can clear this
        controller.normals.length = 0;
    
        // this is not great, yet, because its stepping with lengths less than one entire step into the next pixel, so it will get overlapped pixels
        // like forming and L shape and stuff
        let remainingLength = controller.velocity.length();
        const step = Vec2.copy(controller.velocity).normalize();
        const position = Vec2.copy(controller.position);
        const velocity = Vec2.copy(controller.velocity);
        while (remainingLength > 0) {
            // is this kind of thing too confusing? idk
            const newPosition = new Vec2();
            if (remainingLength >= 1) {
                newPosition.x = position.x + step.x;
                newPosition.y = position.y + step.y;
            } else {
                // partial steps to preserve floating point accuracy
                newPosition.x = position.x + step.x * remainingLength;
                newPosition.y = position.y + step.y * remainingLength;
            }
    
            const pixelNewPosition = new AABB(newPosition.x + aabb.x, newPosition.y + aabb.y, aabb.width, aabb.height);
            pixelNewPosition.round();

            const collision = checkCollisions(this, pixelNewPosition);
            if (collision) {
                const stepUpOffset = stepUp(this, pixelNewPosition, 12);
                if (stepUpOffset !== 0) {
                    // TODO do this less stupidly
                    controller.jumping = false;
                    newPosition.y -= stepUpOffset;
    
                    // if youve been teleported up a step subtract this from the remaining movement length
                    // basically calculate the difference in the y value would make to equal the hypotenuse considering we're already subtracting one
                    // we need to calculate the distance that this vertical line would be to the actual velocity line, and use that as one of the
                    // edges of the triangle to calculate the hypotenuse
                    const travelDirection = Vec2.copy(velocity).normalize();
                    // const verticalStep = new Vec2(0, stepUpOffset);
                    // const stepAngle = Math.acos(travelDirection.dot(verticalStep) / (travelDirection.length() * verticalStep.length()));
                    // const minimumStepDistance = 1 / Math.tan(Math.PI / 2 - stepAngle);

                    const slopePenalty = Math.sqrt(1 + stepUpOffset * stepUpOffset) - 1;
                    remainingLength = Math.max(remainingLength - slopePenalty, 0);

                    controller.normals.push(new Vec2(0, -1));

                    velocity.y = 0;
                } else {
                    // actual collision we can't resolve, for now stop here?
                    // paint_edges(collision_pixel.x, collision_pixel.y, velocity);
                    // controller.position.x = position.x;
                    // controller.position.y = position.y;
                    velocity.y = 0;
                    break;
                }
            }
    
            position.x = newPosition.x;
            position.y = newPosition.y;
            // each step is a length of 1 for now
            remainingLength = Math.max(remainingLength - 1.0, 0);
        }
    
        controller.position.x = Math.round(position.x);
        controller.position.y = Math.round(position.y);
        controller.velocity.x = velocity.x;
        controller.velocity.y = velocity.y;
    }

    getPixel(x, y) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
            return false;
        }

        return this.pixels[y * this.width + x];
    }
}



const paintEdges = (x, y, velocity) => {
    // // okay first probably I will just draw all the pixels along a wall red to see what happens, if this algorithm even works for finding edges
    // normal_angle := atan2(-velocity.y, -velocity.x);

    // SetPixelColor(LEVEL.image, RED, x, y);

    // current_pixel, valid_pixel := get_next_wall_pixel(x, y, normal_angle);
    // color := GetPixelColor(LEVEL.image, current_pixel.x, current_pixel.y);
    // while valid_pixel && color != RED {
    //     SetPixelColor(LEVEL.image, RED, current_pixel.x, current_pixel.y);

    //     current_pixel, valid_pixel = get_next_wall_pixel(current_pixel.x, current_pixel.y, normal_angle);
    //     color = GetPixelColor(LEVEL.image, current_pixel.x, current_pixel.y);
    // }
}

// the original method also returned a point
const checkCollisions = (world, aabb) => {
    for (let x = 0; x < aabb.width; x++) {
        if (world.getPixel(aabb.x + x, aabb.y)) {
            return true;
        }
        if (world.getPixel(aabb.x + x, aabb.y + aabb.height - 1)) {
            return true;
        }
    }

    for (let y = 0; y < aabb.height; y++) {
        if (world.getPixel(aabb.x, aabb.y + y)) {
            return true;
        }
        if (world.getPixel(aabb.x + aabb.width - 1, aabb.y + y)) {
            return true;
        }
    }

    return false;
};

// tries to step up from your current position, returns the necessary offset
const stepAABB = new AABB();
const stepUp = (world, aabb, height) => {
    stepAABB.width = aabb.width;
    stepAABB.height = aabb.height;
    
    for (let y = 0; y <= height; y++) {
        stepAABB.x = aabb.x;
        stepAABB.y = aabb.y - y;

        if (!checkCollisions(world, stepAABB)) {
            return y;
        }
    }

    return 0;
};

// we need to find all pixels that have at least one adjacent empty space
// .[top left, top middle, top right, middle left, middle right, bottom left, bottom middle, bottom right]
const found = [false, false, false, false, false, false, false, false];
const pixels = [new Vec2(-1, -1), new Vec2(0, -1), new Vec2(1, -1), new Vec2(-1, 0), new Vec2(1, 0), new Vec2(-1, 1), new Vec2(0, 1), new Vec2(1, 1)];
const angles = [Math.atan2(-1, -1), Math.atan2(0, -1), Math.atan2(1, -1), Math.atan2(-1, 0), Math.atan2(1, 0), Math.atan2(-1, 1), Math.atan2(0, 1), Math.atan2(1, 1)];
const getNextWallPixel = (world, x, y, angle, mostAccuratePixel) => {    
    // the problem is that this pixel could easily have a wall facing the opposite way of the player, but do we care?
    // no we dont care, I dont think
    if (world.getPixel(x - 1, y - 1)) {
        // pixel to the right is transparent
        if (!world.getPixel(x, y - 1)) {
            found[0] = true;
        }
        // pixel below is transparent
        if (!world.getPixel(x - 1, y)) {
            found[0] = true;
        }
    }
    if (world.getPixel(x, y - 1)) {
        // pixel to the left is transparent
        if (!world.getPixel(x - 1, y - 1)) {
            found[1] = true;
        }
        // pixel to the right is transparent
        if (!world.getPixel(x + 1, y - 1)) {
            found[1] = true;
        }
    }
    if (world.getPixel(x + 1, y - 1)) {
        // pixel to the left is transparent
        if (!world.getPixel(x, y - 1)) {
            found[2] = true;
        }
        // pixel below is transparent
        if (!world.getPixel(x + 1, y)) {
            found[2] = true;
        }
    }
    if (world.getPixel(x - 1, y)) {
        // pixel above is transparent
        if (!world.getPixel(x - 1, y - 1)) {
            found[3] = true;
        }
        // pixel below is transparent
        if (!world.getPixel(x - 1, y + 1)) {
            found[3] = true;
        }
    }
    if (world.getPixel(x + 1, y)) {
        // pixel above is transparent
        if (!world.getPixel(x + 1, y - 1)) {
            found[4] = true;
        }
        // pixel below is transparent
        if (!world.getPixel(x + 1, y + 1)) {
            found[4] = true;
        }
    }
    if (world.getPixel(x - 1, y + 1)) {
        // pixel to the right is transparent
        if (!world.getPixel(x, y + 1)) {
            found[5] = true;
        }
        // pixel above is transparent
        if (!world.getPixel(x - 1, y)) {
            found[5] = true;
        }
    }
    if (world.getPixel(x, y + 1)) {
        // pixel to the left is transparent
        if (!world.getPixel(x - 1, y + 1)) {
            found[6] = true;
        }
        // pixel to the right is transparent
        if (!world.getPixel(x + 1, y + 1)) {
            found[6] = true;
        }
    }
    if (world.getPixel(x + 1, y + 1)) {
        // pixel to the left is transparent
        if (!world.getPixel(x, y + 1)) {
            found[7] = true;
        }
        // pixel above is transparent
        if (!world.getPixel(x + 1, y)) {
            found[7] = true;
        }
    }

    // temp code
    // for i: 0..7 {
    //     pos := pixels[i] + Vector2i.{1, 1};
    //     if GetPixel(view, pos.x, pos.y) == RED {
    //         found[i] = false;
    //     }
    // }

    let validPixel = false;
    let mostAccurateAbsAngleDiff = 0;

    for (let i = 0; i < 8; i++) {
        if (!found[i]) {
            continue;
        }

        const absAngleDiff = Math.abs(radiansBetween(angle, angles[i]));
        if (!validPixel || absAngleDiff < mostAccurateAbsAngleDiff) {
            mostAccuratePixel.x = pixels[i].x + x;
            mostAccuratePixel.y = pixels[i].y + y;
            mostAccurateAbsAngleDiff = absAngleDiff;
        }

        validPixel = true;
    }

    return validPixel;
};

const radiansBetween = (start, end) => {
    // TODO this is bad and probably slow I need to change it later
    if (end < start) {
        if (start - end > Math.PI) {
            return Math.PI * 2 - (start - end);
        } else {
            return -(start - end);
        }
    } else {
        if (end - start > Math.PI) {
            return -(Math.PI * 2 - (end - start));
        } else {
            return end - start;
        }
    }
};
const extract = (application, texture) => {
    const renderTexture = PIXI.RenderTexture.create({width: texture.width, height: texture.height});
    const sprite = new PIXI.Sprite(texture);

    application.renderer.render(sprite, renderTexture);
    const pixels = application.renderer.plugins.extract.pixels(renderTexture);

    renderTexture.destroy();

    return pixels;
};
class FPSTracker extends PIXI.Text {
    history;
    nextIndex;

    constructor(color) {
        super('FPS: 0.0', {fill: color === undefined ? 0xffffff : color, fontSize: 16});

        this.history = new Array(60).fill(0);
        this.nextIndex = 0;
    }

    getFPS() {
        let startIndex = this.nextIndex;
        if (this.history[startIndex] === 0) {
            startIndex = 0;
        }
    
        const firstTime = this.history[startIndex];
        if (startIndex === 0 && firstTime === 0) {
            return 0.0;
        }
    
        const lastIndex = (this.nextIndex + this.history.length - 1) % this.history.length;
        const lastTime = this.history[lastIndex];
    
        const deltaTime = lastTime - firstTime;
        const deltaFrames = (lastIndex - startIndex + this.history.length) % this.history.length;
    
        if (deltaTime === 0) {
            return 0;
        }
    
        return deltaFrames / deltaTime * 1000;
    }
    
    tick(time) {
        this.history[this.nextIndex] = time;
        this.nextIndex = (this.nextIndex + 1) % this.history.length;
        
        const fps = this.getFPS();
        const integer = Math.floor(fps);
        const remainder = Math.floor((fps - integer) * 100);

        this.text = 'FPS: ' + integer + '.' + remainder;
    }
}

class CPUTracker extends PIXI.Text {
    history;
    nextIndex;

    startTime;
    endTime;

    constructor(color) {
        super('CPU: 0.0%', {fill: color === undefined ? 0xffffff : color, fontSize: 16});

        this.history = new Array(60).fill(0);
        this.nextIndex = 0;

        this.startTime = 0;
        this.endTime = 0;
    }

    beginFrame(time) {
        if (this.startTime > 0 && this.endTime > 0) {
            const totalTime = time - this.startTime;
            const frameTime = this.endTime - this.startTime;

            this.history[this.nextIndex] = Math.max(frameTime / totalTime, Number.MIN_VALUE);
            this.nextIndex = (this.nextIndex + 1) % this.history.length;

            let total = 0;
            let count = 0;
            for (let i = 0; i < this.history.length; i++) {
                if (this.history[i] === 0) {
                    continue;
                }
    
                total += this.history[i];
                count++;
            }
            
            const cpu = total / count * 100;
            const integer = Math.floor(cpu);
            const remainder = Math.floor((cpu - integer) * 100);
    
            this.text = 'CPU: ' + integer + '.' + remainder + '%';
        }

        this.startTime = time;
    }

    endFrame(time) {
        this.endTime = time;
    }
}
const PixelScan = {
    FramedSprite,
    AABB,
    Vec2,
    Input,
    World,
    GroundController,
    FPSTracker,
    CPUTracker,
    extract,
};
return PixelScan;
})();