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