class Vec extends Array {
    constructor(x, y) {
        super(2);

        this[0] = x || 0;
        this[1] = y || 0;
    }

    static copy(vec) {
        return new Vec(vec[0], vec[1]);
    }

    copy(vec) {
        this[0] = vec[0];
        this[1] = vec[1];

        return this;
    }

    multiply(mat) {
        const x = this[0] * mat[0] + this[1] * mat[3] + mat[6];
        const y = this[0] * mat[1] + this[1] * mat[4] + mat[7];
        this[0] = x;
        this[1] = y;

        return this;
    }

    magnitude() {
        return Math.sqrt(this[0] * this[0] + this[1] * this[1]);
    }

    magnitudeSquared() {
        return this[0] * this[0] + this[1] * this[1];
    }

    rotate(radians) {
        const x = this[0];
        const y = this[1];

        this[0] = x * Math.cos(radians) - y * Math.sin(radians);
        this[1] = y * Math.cos(radians) + x * Math.sin(radians);

        return this;
    }

    normalize() {
        const length = this.magnitude();
        if (length === 0) {
            return;
        }

        this[0] /= length;
        this[1] /= length;
    }

    distance(vec) {
        const dx = vec[0] - this[0];
        const dy = vec[1] - this[1];

        return Math.sqrt(dx * dx + dy * dy);
    }

    distanceSquared(vec) {
        const dx = vec[0] - this[0];
        const dy = vec[1] - this[1];

        return dx * dx + dy * dy;
    }

    negate() {
        this[0] = -this[0];
        this[1] = -this[1];

        return this;
    }

    atan2() {
        return Math.atan2(this[1], this[0]);
    }

    dot(vec) {
        return this[0] * vec[0] + this[1] * vec[1];
    }

    cross(vec) {
        return this[0] * vec[1] - vec[0] * this[1];
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