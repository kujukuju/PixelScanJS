const PixelScanJS = {
        gravity: null,
        resolve_physics: (aabb, velocity) => {

        },
        create_world: (width, height) => {
            PixelScanJS.gravity = new Vec2(0, 0.5);
            PixelScanJS.world = new Array(width * height);
        },
        fill_world: (x, y, width, height, data) => {
            console.log(this, PixelScanJS);
        },
        world: null,
};