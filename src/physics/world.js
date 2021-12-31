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

        const position = Vec2.copy(controller.position);
        const velocity = Vec2.copy(controller.velocity);

        // TODO specifically if you've moved at least 1 pixel then we can clear this
        const nextPosition = Vec2.copy(controller.position).add(controller.velocity).round();
        if (position.y !== nextPosition.y) {
            controller.normals.length = 0;
        }
    
        // this is not great, yet, because its stepping with lengths less than one entire step into the next pixel, so it will get overlapped pixels
        // like forming and L shape and stuff
        let remainingLength = controller.velocity.length();
        const step = Vec2.copy(controller.velocity).normalize();
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
                const stepUpOffset = stepUp(this, pixelNewPosition, controller.allowedStepHeight);
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