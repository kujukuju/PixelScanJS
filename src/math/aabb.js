class AABB {
    x;
    y;
    width;
    height;
    
    constructor(x, y, width, height) {
        this.x = x || 0;
        this.y = y || 0;
        this.width = width || 0;
        this.height = height || 0;
    }

    static copy(aabb) {
        return new AABB(aabb.x, aabb.y, aabb.width, aabb.height);
    }

    copy(aabb) {
        this.x = aabb.x;
        this.y = aabb.y;
        this.width = aabb.width;
        this.height = aabb.height;

        return this;
    }

    round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);

        return this;
    }

    contains(x, y) {
        return (x >= this.x) && (y >= this.y) && (x - this.x < this.width) && (y - this.y < this.height);
    }
}