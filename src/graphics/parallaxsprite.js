class ParallaxSprite extends PIXI.Sprite {
    aabb;

    constructor(texture, aabb) {
        super(texture);
        
        this.aabb = aabb;
    }

    update(cameraAABB) {
        const cameraCenterX = cameraAABB.x + cameraAABB.width / 2;
        const cameraCenterY = cameraAABB.y + cameraAABB.height / 2;
        const minX = this.aabb.x + cameraAABB.width / 2;
        const minY = this.aabb.y + cameraAABB.height / 2;
        const maxX = this.aabb.x + this.aabb.width - cameraAABB.width / 2;
        const maxY = this.aabb.y + this.aabb.height - cameraAABB.height / 2;

        const progressX = Math.min(Math.max((cameraCenterX - minX) / (maxX - minX), 0), 1);
        const progressY = Math.min(Math.max((cameraCenterY - minY) / (maxY - minY), 0), 1);

        const spriteMaxDeltaX = this.width - cameraAABB.width;
        const spriteMaxDeltaY = this.height - cameraAABB.height;

        this.position.x = -spriteMaxDeltaX * progressX;
        this.position.y = -spriteMaxDeltaY * progressY;
    }
}