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