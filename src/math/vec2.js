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

    static fromAngle(angle) {
        return new Vec2(Math.cos(angle), Math.sin(angle));
    }

    copy(vec) {
        this.x = vec.x;
        this.y = vec.y;

        return this;
    }

    set(x, y) {
        this.x = x;
        this.y = y;

        return this;
    }

    add(vec) {
        this.x += vec.x;
        this.y += vec.y;

        return this;
    }

    round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);

        return this;
    }

    multiply(mat) {
        if (Number.isNaN(mat)) {
            const x = this.x * mat.v0 + this.y * mat.v3 + mat.v6;
            const y = this.x * mat.v1 + this.y * mat.v4 + mat.v7;
            this.x = x;
            this.y = y;
        } else {
            this.x *= mat;
            this.y *= mat;
        }

        return this;
    }

    mul = this.multiply;

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    length = this.magnitude;

    magnitudeSquared() {
        return this.x * this.x + this.y * this.y;
    }

    square() {
        this.x = this.x * this.x;
        this.y = this.y * this.y;

        return this;
    }

    squareRoot() {
        this.x = Math.sqrt(this.x);
        this.y = Math.sqrt(this.y);

        return this;
    }

    sqrt = this.squareRoot;

    rotate(radians) {
        const x = this.x;
        const y = this.y;

        this.x = x * Math.cos(radians) - y * Math.sin(radians);
        this.y = y * Math.cos(radians) + x * Math.sin(radians);

        return this;
    }

    orthogonal() {
        const x = this.x;
        this.x = -this.y;
        this.y = x;

        return this;
    }

    ortho = this.orthogonal;

    normalize() {
        const length = this.magnitude();
        if (length === 0) {
            return this;
        }

        this.x /= length;
        this.y /= length;

        return this;
    }

    norm = this.normalize;

    distance(vec) {
        const dx = vec.x - this.x;
        const dy = vec.y - this.y;

        return Math.sqrt(dx * dx + dy * dy);
    }

    dist = this.distance;

    distanceSquared(vec) {
        const dx = vec.x - this.x;
        const dy = vec.y - this.y;

        return dx * dx + dy * dy;
    }

    distSquared = this.distanceSquared;

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

    projectOnto(vec) {
        tempVec.copy(vec);
        tempVec.normalize();

        const top = this.dot(tempVec);
        const bottom = tempVec.dot(tempVec);

        this.copy(tempVec);
        this.multiply(top / bottom);

        return this;
    }
}

tempVec = new Vec2();