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

    fillPixels(x, y, width, height, data, stride, offset) {
        stride = stride || 1;
        offset = offset || 0;
        
        for (let offsetX = 0; offsetX < width; offsetX++) {
            const realX = x + offsetX;
    
            for (let offsetY = 0; offsetY < height; offsetY++) {
                const realY = y + offsetY;
                
                const worldIndex = realY * this.width + realX;
                const dataIndex = offsetY * width + offsetX;
    
                this.pixels[worldIndex] = data[dataIndex * stride + offset];
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
}

// const resolvePhysics = (world, controller, aabb) => {
//     let bodyFallingSpeed = Vec2.copy(controller.velocity).projectOnto(world.gravity).length() * 0.04;
//     if (controller.velocity.dot(world.gravity) <= 0) {
//         bodyFallingSpeed = 0;
//     }

//     const gravitySpeed = world.gravity.length();
//     const appliedGravity = Vec2.copy(world.gravity).normalize().multiply(Math.max(gravitySpeed - bodyFallingSpeed * bodyFallingSpeed, 0));

//     controller.velocity.add(appliedGravity);
//     controller.position.add(controller.velocity);
// };

// // stride and offset of the image data array to access the opaque values
// const fillWorld = (world, x, y, width, height, data, stride, offset) => {
//     stride = stride || 1;
//     offset = offset || 0;
    
//     for (let offsetX = 0; offsetX < width; offsetX++) {
//         const realX = x + offsetX;

//         for (let offsetY = 0; offsetY < height; offsetY++) {
//             const realY = y + offsetY;
            
//             const worldIndex = realY * world.width + realX;
//             const dataIndex = offsetY * width + offsetX;

//             world.pixels[worldIndex] = data[dataIndex * stride + offset];
//         }
//     }
// };