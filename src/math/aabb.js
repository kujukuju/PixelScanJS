class AABB extends Array {
    constructor(x, y, width, height) {
        super(4);

        this[0] = x || 0;
        this[1] = y || 0;
        this[2] = width || 0;
        this[3] = height || 0;
    }

    static copy(aabb) {
        return new AABB(aabb[0], aabb[1], aabb[2], aabb[3]);
    }

    copy(aabb) {
        this[0] = aabb[0];
        this[1] = aabb[1];
        this[2] = aabb[2];
        this[3] = aabb[3];

        return this;
    }

    add(x, y) {
        this[0] += x;
        this[1] += y;
    }

    
}