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

    // physics logic for walls
    // when you've collided with a wall, get the normal angle of that wall
    // add it to the restricted angles thing
    // adjust the velocity of your character to be projected onto the perpendicular to the normal of that wall clamped by the restricted angles thing
    // try to resolve the collision:
    //     find the vector to the nearest adjacent pixel defined by the restricted angle
    //     move the character to the nearest adjacent pixel along this vector
    //     add this normal to the restricted normal list
    //     repeat until you've exhausted your velocity I guess, and if you're still in a wall go back to the beginning pixel and set your velocity to 0

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

            const collisionPixel = new Vec2();
            const collision = checkCollisions(this, pixelNewPosition, collisionPixel);
            if (collision) {
                const stepCollisionPixel = new Vec2();
                const stepNormal = new Vec2();
                const stepUpOffset = stepUp(this, controller, pixelNewPosition, stepCollisionPixel, stepNormal);
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

                    Renderer.debugCanvas.drawLine(stepCollisionPixel.x, stepCollisionPixel.y, stepCollisionPixel.x + stepNormal.x * 20, stepCollisionPixel.y + stepNormal.y * 20);
                } else {
                    // actual collision we can't resolve, for now stop here?
                    // paint_edges(collision_pixel.x, collision_pixel.y, velocity);
                    // controller.position.x = position.x;
                    // controller.position.y = position.y;
                    velocity.y = 0;

                    const normal = getNormal(this, controller.velocity, collisionPixel);
                    Renderer.debugCanvas.drawLine(collisionPixel.x, collisionPixel.y, collisionPixel.x + normal.x * 20, collisionPixel.y + normal.y * 20);

                    break;
                }
            }
    
            position.x = newPosition.x;
            position.y = newPosition.y;
            // each step is a length of 1 for now
            remainingLength = Math.max(remainingLength - 1.0, 0);
        }
    
        controller.position.x = position.x;
        controller.position.y = position.y;
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
const checkCollisions = (world, aabb, returnPixel) => {
    for (let x = 0; x < aabb.width; x++) {
        if (world.getPixel(aabb.x + x, aabb.y)) {
            if (returnPixel) {
                returnPixel.x = aabb.x + x;
                returnPixel.y = aabb.y;
            }

            return true;
        }
        if (world.getPixel(aabb.x + x, aabb.y + aabb.height - 1)) {
            if (returnPixel) {
                returnPixel.x = aabb.x + x;
                returnPixel.y = aabb.y + aabb.height - 1;
            }

            return true;
        }
    }

    for (let y = 0; y < aabb.height; y++) {
        if (world.getPixel(aabb.x, aabb.y + y)) {
            if (returnPixel) {
                returnPixel.x = aabb.x;
                returnPixel.y = aabb.y + y;
            }

            return true;
        }
        if (world.getPixel(aabb.x + aabb.width - 1, aabb.y + y)) {
            if (returnPixel) {
                returnPixel.x = aabb.x + aabb.width - 1;
                returnPixel.y = aabb.y + y;
            }
            
            return true;
        }
    }

    return false;
};

const requiredLineAccuracy = 16;
const rightPixel = new Vec2();
const leftPixel = new Vec2();
const startPixel = new Vec2();
const nextPixel = new Vec2();
const pixelOffsets = [
    new Vec2(0, 0),
    new Vec2(1, 0),
    new Vec2(1, 1),
    new Vec2(0, 1),
];
const getNormal = (world, velocity, pixel) => {
    // left means, if your character is falling down to the ground, the left direction of the surface
    leftPixel.copy(velocity).orthogonal();
    let leftAngle = leftPixel.atan2();

    rightPixel.copy(leftPixel).negate();
    let rightAngle = rightPixel.atan2();

    const startX = pixel.x + 0.5;
    const startY = pixel.y + 0.5;

    startPixel.copy(pixel);
    if (getNextWallPixel(world, startPixel, leftAngle, nextPixel)) {
        Renderer.debugCanvas.drawRect(nextPixel.x, nextPixel.y, 1, 1, 0xff0000);
        // here we know that the nextPixel is valid because its only the second, so skip the corner check
        // ccw most
        let leftMostAngle = Math.atan2(nextPixel.y + pixelOffsets[0].y - startY, nextPixel.x + pixelOffsets[0].x - startX);
        // cw most
        let rightMostAngle = leftMostAngle;

        // this is just the first pixel along the line, so get the widest angle possible
        for (let i = 1; i < pixelOffsets.length; i++) {
            const cornerX = nextPixel.x + pixelOffsets[i].x;
            const cornerY = nextPixel.y + pixelOffsets[i].y;

            const newAngle = Math.atan2(cornerY - startY, cornerX - startX);
            if (radiansBetween(leftMostAngle, newAngle) < 0) {
                leftMostAngle = newAngle;
            }
            if (radiansBetween(rightMostAngle, newAngle) > 0) {
                rightMostAngle = newAngle;
            }
        }

        // get the average of the possible line angle range
        leftAngle = Math.atan2(nextPixel.y + 0.5 - startY, nextPixel.x + 0.5 - startX);

        let count = 0;
        while (count < requiredLineAccuracy) {
            startPixel.copy(nextPixel);

            if (!getNextWallPixel(world, startPixel, leftAngle, nextPixel)) {
                break;
            } else {
                if (!validateCorners(startX, startY, nextPixel.x, nextPixel.y, leftMostAngle, rightMostAngle)) {
                    break;
                }

                Renderer.debugCanvas.drawRect(nextPixel.x, nextPixel.y, 1, 1, 0xff0000);

                let nextLeftMostAngle = Math.atan2(nextPixel.y + pixelOffsets[0].y - startY, nextPixel.x + pixelOffsets[0].x - startX);
                let nextRightMostAngle = nextLeftMostAngle;

                for (let i = 0; i < pixelOffsets.length; i++) {
                    const cornerX = nextPixel.x + pixelOffsets[i].x;
                    const cornerY = nextPixel.y + pixelOffsets[i].y;
        
                    const newAngle = Math.atan2(cornerY - startY, cornerX - startX);
                    if (radiansBetween(nextLeftMostAngle, newAngle) < 0) {
                        nextLeftMostAngle = newAngle;
                    }
                    if (radiansBetween(nextRightMostAngle, newAngle) > 0) {
                        nextRightMostAngle = newAngle;
                    }
                }

                // this is more restricting, so update it
                if (radiansBetween(leftMostAngle, nextLeftMostAngle) > 0) {
                    leftMostAngle = nextLeftMostAngle;
                }
                if (radiansBetween(rightMostAngle, nextRightMostAngle) < 0) {
                    rightMostAngle = nextRightMostAngle;
                }

                leftAngle = Math.atan2(nextPixel.y + 0.5 - startY, nextPixel.x + 0.5 - startX);
            }

            count++;
        }
    }

    Renderer.debugCanvas.drawRect(pixel.x, pixel.y, 1, 1, 0xffffff);

    // temporary
    return Vec2.fromAngle(leftAngle).orthogonal();
};

const validateCorners = (startX, startY, endX, endY, leftMostAngle, rightMostAngle) => {
    for (let i = 0; i < pixelOffsets.length; i++) {
        const cornerX = endX + pixelOffsets[i].x;
        const cornerY = endY + pixelOffsets[i].y;

        const angle = Math.atan2(cornerY - startY, cornerX - startX);
        if (radiansBetween(leftMostAngle, angle) >= 0 && radiansBetween(rightMostAngle, angle) <= 0) {
            return true;
        }
    }

    return false;
};

// tries to step up from your current position, returns the necessary offset
const stepPixel = new Vec2();
const previousStepPixel = new Vec2();
const stepAABB = new AABB();
const stepUp = (world, controller, aabb, returnCollisionPixel, returnNormal) => {
    stepAABB.width = aabb.width;
    stepAABB.height = aabb.height;

    let previouslyCollided = false;
    for (let y = 0; y <= controller.allowedStepHeight; y++) {
        stepAABB.x = aabb.x;
        stepAABB.y = aabb.y - y;

        const collided = checkCollisions(world, stepAABB, stepPixel);
        if (!collided && previouslyCollided) {
            // get the floor angle from the collided step pixel and determine if its valid
            const normal = getNormal(world, controller.velocity, previousStepPixel);
            // if (normal.y <= -controller.groundNormalSlope) {
                if (returnCollisionPixel) {
                    returnCollisionPixel.copy(previousStepPixel);
                }
                if (returnNormal) {
                    returnNormal.copy(normal);
                }

                return y;
            // }
        }

        previousStepPixel.copy(stepPixel);
        previouslyCollided = collided;
    }

    return 0;
};

// we need to find all pixels that have at least one adjacent empty space
// .[top left, top middle, top right, middle left, middle right, bottom left, bottom middle, bottom right]
const found = [false, false, false, false, false, false, false, false];
const pixels = [new Vec2(-1, -1), new Vec2(0, -1), new Vec2(1, -1), new Vec2(-1, 0), new Vec2(1, 0), new Vec2(-1, 1), new Vec2(0, 1), new Vec2(1, 1)];
const angles = [pixels[0].atan2(), pixels[1].atan2(), pixels[2].atan2(), pixels[3].atan2(), pixels[4].atan2(), pixels[5].atan2(), pixels[6].atan2(), pixels[7].atan2()];
const getNextWallPixel = (world, pixel, angle, mostAccuratePixel) => {    
    for (let i = 0; i < found.length; i++) {
        found[i] = false;
    }

    // the problem is that this pixel could easily have a wall facing the opposite way of the player, but do we care?
    // no we dont care, I dont think
    if (world.getPixel(pixel.x - 1, pixel.y - 1)) {
        // pixel to the right is transparent or pixel below is transparent
        if (!world.getPixel(pixel.x, pixel.y - 1) || !world.getPixel(pixel.x - 1, pixel.y)) {
            found[0] = true;
        }
    }
    if (world.getPixel(pixel.x, pixel.y - 1)) {
        // pixel to the left is transparent or pixel to the right is transparent
        if (!world.getPixel(pixel.x - 1, pixel.y - 1) || !world.getPixel(pixel.x + 1, pixel.y - 1)) {
            found[1] = true;
        }
    }
    if (world.getPixel(pixel.x + 1, pixel.y - 1)) {
        // pixel to the left is transparent or pixel below is transparent
        if (!world.getPixel(pixel.x, pixel.y - 1) || !world.getPixel(pixel.x + 1, pixel.y)) {
            found[2] = true;
        }
    }
    if (world.getPixel(pixel.x - 1, pixel.y)) {
        // pixel above is transparent or pixel below is transparent
        if (!world.getPixel(pixel.x - 1, pixel.y - 1) || !world.getPixel(pixel.x - 1, pixel.y + 1)) {
            found[3] = true;
        }
    }
    if (world.getPixel(pixel.x + 1, pixel.y)) {
        // pixel above is transparent or pixel below is transparent
        if (!world.getPixel(pixel.x + 1, pixel.y - 1) || !world.getPixel(pixel.x + 1, pixel.y + 1)) {
            found[4] = true;
        }
    }
    if (world.getPixel(pixel.x - 1, pixel.y + 1)) {
        // pixel to the right is transparent or pixel above is transparent
        if (!world.getPixel(pixel.x, pixel.y + 1) || !world.getPixel(pixel.x - 1, pixel.y)) {
            found[5] = true;
        }
    }
    if (world.getPixel(pixel.x, pixel.y + 1)) {
        // pixel to the left is transparent or pixel to the right is transparent
        if (!world.getPixel(pixel.x - 1, pixel.y + 1) || !world.getPixel(pixel.x + 1, pixel.y + 1)) {
            found[6] = true;
        }
    }
    if (world.getPixel(pixel.x + 1, pixel.y + 1)) {
        // pixel to the left is transparent or pixel above is transparent
        if (!world.getPixel(pixel.x, pixel.y + 1) || !world.getPixel(pixel.x + 1, pixel.y)) {
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
            mostAccuratePixel.x = pixels[i].x + pixel.x;
            mostAccuratePixel.y = pixels[i].y + pixel.y;
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