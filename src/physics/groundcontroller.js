class GroundController {
    position = new Vec2();
    velocity = new Vec2();
    jumping = false;
    falling = false;
    normals = [];
    accel = 2;
    friction = 0.75;
    // the fricton that is applied on top of default friction once you've exceeded max speed
    terminalFriction = 0.15;
    speed = 4;
    // the y component of the maximumly angled normal vector that you're able to walk on, default 30 degrees
    groundNormalSlope = 0.8660254037844386;
    // the x component of the maximumly angled normal vector that you're able to slide on, default 30 degrees
    wallNormalSlope = 0.8660254037844386;
    groundJumpVelocity = 5.4;
    wallJumpVelocity = 12;
    fallingFrames = 10;
    allowedStepHeight = 6;

    _jumpingForce = 0;
    _jumpingDelta = 0;
    _currentFallingFrames = 0;

    constructor() {

    }

    applyAcceleration(up, left, down, right) {
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

        let accelX = 0;
        if (left) {
            accelX -= this.accel;
        }
        if (right) {
            accelX += this.accel;
        }

        const friction = ground ? this.friction : this.friction / 1;
    
        // TODO when not on ground dont apply friction
        const initialVelocityX = this.velocity.x;
        if (Math.abs(this.velocity.x + accelX) <= friction) {
            this.velocity.x = 0;
        } else {
            this.velocity.x += accelX;
            this.velocity.x -= Math.sign(this.velocity.x) * friction;
        }
    
        if (Math.abs(initialVelocityX) > this.speed && Math.abs(this.velocity.x) > this.speed) {
            if (Math.abs(this.velocity.x) > Math.abs(initialVelocityX)) {
                // in this scenario we want to match the previously applied acceleration to the friciton to only cancel it out, then apply the terminal friction on top
                this.velocity.x -= (accelX - Math.sign(accelX) * friction);
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
        if (this.jumping && (!up || ground || leftWall || rightWall)) {
            this.falling = true;
            this.jumping = false;
        }
    
        // jump if you're trying to and able to
        if (ground || leftWall || rightWall) {
            this._jumpingForce = 0;
            this._jumpingDelta = 0;

            if (!this.jumping && up) {
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

        // const MAX_JUMPING_FORCE = 0.002;
        const JUMP_ACCEL = 0.0001;
        const DELTA = 16;

        if (this.jumping) {
            const startingDelta = this._jumpingDelta;
            this._jumpingDelta += DELTA;

            const progress = this._jumpingDelta / 600;
            const startProgress = startingDelta / 400;
            const finalProgress = this._jumpingDelta / 400;

            let integratedJumpingForce = 1.0 / (startProgress + 1) - 1.0 / (finalProgress + 1);
            integratedJumpingForce *= 8;

            this._jumpingForce = 1.0 / (progress * (progress + 2) + 1);
            this._jumpingForce *= 0.0042;

            this.velocity.y -= integratedJumpingForce;
            // client_player.body.velocity.y -= client_player.jumping_force * delta;
        } else {
            this._jumpingForce -= JUMP_ACCEL * DELTA;
            this._jumpingForce = Math.max(this._jumpingForce, 0);

            this.velocity.y -= this._jumpingForce * DELTA;
        }

        if (this.velocity.y >= 0) {
            if (this.jumping) {
                this.falling = true;
            }

            this.jumping = false;
        }

        if (!this.jumping && !ground && !leftWall && !rightWall) {
            this._currentFallingFrames++;
        } else {
            this._currentFallingFrames = 0;
        }

        this.falling = (this.falling || this._currentFallingFrames > this.fallingFrames) && !this.jumping && !ground && !leftWall && !rightWall;
    }

    applyForce(force) {
        this.velocity.add(force);
    }
}