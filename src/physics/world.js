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
        controller.position.add(controller.velocity);
    }

    getPixel(x, y) {
        const index = y * this.width + x;
        if (index < 0 || index >= this.pixels.length) {
            return false;
        }

        return this.pixels[index];
    }
}

// tries to step up from your current position, returns the necessary offset
const stepAABB = new AABB();
const stepUp = (world, aabb, height, resultVector) => {
    for (let y = 0; y <= height; y++) {
        stepAABB.x = aabb.x;
        stepAABB.y = aabb.y - y;

        if (!checkCollisions(world, stepAABB)) {
            resultVector.x = stepAABB.x;
            resultVector.y = stepAABB.y;
            return true;
        }
    }

    return false;
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