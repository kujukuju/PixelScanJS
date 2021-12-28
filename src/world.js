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