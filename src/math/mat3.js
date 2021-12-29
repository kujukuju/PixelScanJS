class Mat3 {
    static _tempMat = null;
    static _tempVec = new Vec2();

    v0;
    v1;
    v2;
    v3;
    v4;
    v5;
    v6;
    v7;
    v8;

    // NOTE: libgdx's indices are transposed

    constructor() {
        this.v0 = 1;
        this.v1 = 0;
        this.v2 = 0;
        this.v3 = 0;
        this.v4 = 1;
        this.v5 = 0;
        this.v6 = 0;
        this.v7 = 0;
        this.v8 = 1;
    }

    copy(mat) {
        this.v0 = mat.v0;
        this.v1 = mat.v1;
        this.v2 = mat.v2;
        this.v3 = mat.v3;
        this.v4 = mat.v4;
        this.v5 = mat.v5;
        this.v6 = mat.v6;
        this.v7 = mat.v7;
        this.v8 = mat.v8;

        return this;
    }

    determinant() {
        return this.v0 * this.v4 * this.v8 + this.v1 * this.v5 * this.v6 + this.v2 * this.v3 * this.v7 - this.v0
            * this.v5 * this.v7 - this.v1 * this.v3 * this.v8 - this.v2 * this.v4 * this.v6;
    }

    invert() {
        const det = this.determinant();
        if (det === 0) {
            return null;
        }

        const inv = 1.0 / det;

        Mat3._tempMat.v0 = this.v4 * this.v8 - this.v7 * this.v5;
        Mat3._tempMat.v3 = this.v6 * this.v5 - this.v3 * this.v8;
        Mat3._tempMat.v6 = this.v3 * this.v7 - this.v6 * this.v4;
        Mat3._tempMat.v1 = this.v7 * this.v2 - this.v1 * this.v8;
        Mat3._tempMat.v4 = this.v0 * this.v8 - this.v6 * this.v2;
        Mat3._tempMat.v7 = this.v6 * this.v1 - this.v0 * this.v7;
        Mat3._tempMat.v2 = this.v1 * this.v5 - this.v4 * this.v2;
        Mat3._tempMat.v5 = this.v3 * this.v2 - this.v0 * this.v5;
        Mat3._tempMat.v8 = this.v0 * this.v4 - this.v3 * this.v1;

        this.v0 = inv * Mat3._tempMat.v0;
        this.v3 = inv * Mat3._tempMat.v3;
        this.v6 = inv * Mat3._tempMat.v6;
        this.v1 = inv * Mat3._tempMat.v1;
        this.v4 = inv * Mat3._tempMat.v4;
        this.v7 = inv * Mat3._tempMat.v7;
        this.v2 = inv * Mat3._tempMat.v2;
        this.v5 = inv * Mat3._tempMat.v5;
        this.v8 = inv * Mat3._tempMat.v8;

        return this;
    }

    multiply(mat) {
        const v00 = this.v0 * mat.v0 + this.v3 * mat.v1 + this.v6 * mat.v2;
        const v01 = this.v0 * mat.v3 + this.v3 * mat.v4 + this.v6 * mat.v5;
        const v02 = this.v0 * mat.v6 + this.v3 * mat.v7 + this.v6 * mat.v8;

        const v10 = this.v1 * mat.v0 + this.v4 * mat.v1 + this.v7 * mat.v2;
        const v11 = this.v1 * mat.v3 + this.v4 * mat.v4 + this.v7 * mat.v5;
        const v12 = this.v1 * mat.v6 + this.v4 * mat.v7 + this.v7 * mat.v8;

        const v20 = this.v2 * mat.v0 + this.v5 * mat.v1 + this.v8 * mat.v2;
        const v21 = this.v2 * mat.v3 + this.v5 * mat.v4 + this.v8 * mat.v5;
        const v22 = this.v2 * mat.v6 + this.v5 * mat.v7 + this.v8 * mat.v8;

        this.v0 = v00;
        this.v1 = v10;
        this.v2 = v20;
        this.v3 = v01;
        this.v4 = v11;
        this.v5 = v21;
        this.v6 = v02;
        this.v7 = v12;
        this.v8 = v22;

        return this;
    }

    leftMultiply(mat) {
        const v00 = mat.v0 * this.v0 + mat.v3 * this.v1 + mat.v6 * this.v2;
        const v01 = mat.v0 * this.v3 + mat.v3 * this.v4 + mat.v6 * this.v5;
        const v02 = mat.v0 * this.v6 + mat.v3 * this.v7 + mat.v6 * this.v8;

        const v10 = mat.v1 * this.v0 + mat.v4 * this.v1 + mat.v7 * this.v2;
        const v11 = mat.v1 * this.v3 + mat.v4 * this.v4 + mat.v7 * this.v5;
        const v12 = mat.v1 * this.v6 + mat.v4 * this.v7 + mat.v7 * this.v8;

        const v20 = mat.v2 * this.v0 + mat.v5 * this.v1 + mat.v8 * this.v2;
        const v21 = mat.v2 * this.v3 + mat.v5 * this.v4 + mat.v8 * this.v5;
        const v22 = mat.v2 * this.v6 + mat.v5 * this.v7 + mat.v8 * this.v8;

        this.v0 = v00;
        this.v1 = v10;
        this.v2 = v20;
        this.v3 = v01;
        this.v4 = v11;
        this.v5 = v21;
        this.v6 = v02;
        this.v7 = v12;
        this.v8 = v22;

        return this;
    }

    setToTranslation(vec) {
        this.v0 = 1;
        this.v1 = 0;
        this.v2 = 0;
        this.v3 = 0;
        this.v4 = 1;
        this.v5 = 0;
        this.v6 = vec.x;
        this.v7 = vec.y;
        this.v8 = 1;

        return this;
    }

    getTranslation(out) {
        out.x = this.v6;
        out.y = this.v7;

        return out;
    }

    setTranslation(vec) {
        const inverseVec = this.getTranslation(Mat3._tempVec).negate();
        const inverse = Mat3._tempMat.setToTranslation(inverseVec);

        // translation * (inverse * self)
        this.leftMultiply(inverse);

        const correct = Mat3._tempMat.setToTranslation(vec);
        return this.leftMultiply(correct)
    }

    translate(vec) {
        Mat3._tempMat.setToTranslation(vec);

        return this.multiply(Mat3._tempMat);
    }

    setToRotation(radians) {
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);

        this.v0 = cos;
        this.v1 = sin;
        this.v2 = 0;

        this.v3 = -sin;
        this.v4 = cos;
        this.v5 = 0;

        this.v6 = 0;
        this.v7 = 0;
        this.v8 = 1;

        return this;
    }

    getRotation() {
        return Math.atan2(this.v1, this.v0);
    }

    setRotation(radians) {
        const inverse = Mat3._tempMat.setToRotation(-this.getRotation());
        this.multiply(inverse);
        const correct = Mat3._tempMat.setToRotation(radians);
        return this.multiply(correct);
    }

    rotate(radians) {
        Mat3._tempMat.setToRotation(radians);

        return this.multiply(Mat3._tempMat);
    }
}

Mat3._tempMat = new Mat3();