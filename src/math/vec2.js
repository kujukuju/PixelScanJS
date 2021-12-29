class Vec2 {
    x;
    y;

    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    static copy(vec) {
        return new Vec2(vec.x, vec.y);
    }

    copy(vec) {
        this.x = vec.x;
        this.y = vec.y;

        return this;
    }

    multiply(mat) {
        const x = this.x * mat.v0 + this.y * mat.v3 + mat.v6;
        const y = this.x * mat.v1 + this.y * mat.v4 + mat.v7;
        this.x = x;
        this.y = y;

        return this;
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    magnitudeSquared() {
        return this.x * this.x + this.y * this.y;
    }

    rotate(radians) {
        const x = this.x;
        const y = this.y;

        this.x = x * Math.cos(radians) - y * Math.sin(radians);
        this.y = y * Math.cos(radians) + x * Math.sin(radians);

        return this;
    }

    normalize() {
        const length = this.magnitude();
        if (length === 0) {
            return;
        }

        this.x /= length;
        this.y /= length;
    }

    distance(vec) {
        const dx = vec.x - this.x;
        const dy = vec.y - this.y;

        return Math.sqrt(dx * dx + dy * dy);
    }

    distanceSquared(vec) {
        const dx = vec.x - this.x;
        const dy = vec.y - this.y;

        return dx * dx + dy * dy;
    }

    negate() {
        this.x = -this.x;
        this.y = -this.y;

        return this;
    }

    atan2() {
        return Math.atan2(this.y, this.x);
    }

    dot(vec) {
        return this.x * vec.x + this.y * vec.y;
    }

    cross(vec) {
        return this.x * vec.y - vec.x * this.y;
    }

    // returns a number between -1 and 1,
    // where 0 represents the two vectors are the same direction,
    // 0.5 represents the perpendicular normal,
    // and -0.5 is the inverted normal
    // valid for all vectors where the positive angle between them is < 180, not equal
    crossDot(vec) {
        const sign = Math.sign(this.cross(vec)) || 1;
        return (0.5 - this.dot(vec) / 2.0) * sign;
    }
}