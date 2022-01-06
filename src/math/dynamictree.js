const box2d = {
    b2_aabbExtension: 0.1,
};

box2d.DEBUG = false;
box2d.ENABLE_ASSERTS = box2d.DEBUG;

/**
 * @export
 * @const
 * @type {number}
 */
box2d.b2_maxFloat = 1E+37; // FLT_MAX instead of Number.MAX_VALUE;

/**
 * @export
 * @const
 * @type {number}
 */
box2d.b2_epsilon = 1E-5; // FLT_EPSILON instead of Number.MIN_VALUE;

/**
 * This is used to fatten AABBs in the dynamic tree. This is
 * used to predict the future position based on the current
 * displacement.
 * This is a dimensionless multiplier.
 * @export
 * @const
 * @type {number}
 */
box2d.b2_aabbMultiplier = 2;

box2d.b2Assert = function(condition, opt_message, var_args) {
    if (box2d.DEBUG) {
        if (!condition) {
            throw new Error();
        }

        //goog.asserts.assert(condition, opt_message, var_args);
    }
}

/**
 * @export
 * @return {number}
 * @param {number} n
 */
box2d.b2Abs = Math.abs;

/**
 * @export
 * @return {number}
 * @param {number} a
 * @param {number} b
 */
box2d.b2Min = Math.min;

/**
 * @export
 * @return {number}
 * @param {number} a
 * @param {number} b
 */
box2d.b2Max = Math.max;

/**
 * @export
 * @return {number}
 * @param {number} a
 * @param {number} lo
 * @param {number} hi
 */
box2d.b2Clamp = function(a, lo, hi) {
    return Math.min(Math.max(a, lo), hi);
}









/**
 * @export
 * @return {Array.<*>}
 * @param {number=} length
 * @param {function(number): *=} init
 */
box2d.b2MakeArray = function(length, init) {
    length = (typeof(length) === 'number') ? (length) : (0);
    var a = [];
    if (typeof(init) === 'function') {
        for (var i = 0; i < length; ++i) {
            a.push(init(i));
        }
    } else {
        for (var i = 0; i < length; ++i) {
            a.push(null);
        }
    }
    return a;
}

/**
 * @export
 * @return {Array.<number>}
 * @param {number=} length
 */
box2d.b2MakeNumberArray = function(length) {
    return box2d.b2MakeArray(length, function(i) {
        return 0;
    });
}












/**
 * This is a growable LIFO stack with an initial capacity of N.
 * If the stack size exceeds the initial capacity, the heap is
 * used to increase the size of the stack.
 * @export
 * @constructor
 * @param {number} N
 */
box2d.b2GrowableStack = function(N) {
    this.m_stack = new Array(N);
}

/**
 * @export
 * @type {Array.<*>}
 */
box2d.b2GrowableStack.prototype.m_stack = null;
/**
 * @export
 * @type {number}
 */
box2d.b2GrowableStack.prototype.m_count = 0;

/**
 * @export
 * @return {box2d.b2GrowableStack}
 */
box2d.b2GrowableStack.prototype.Reset = function() {
    this.m_count = 0;
    return this;
}

/**
 * @export
 * @return {void}
 * @param {*} element
 */
box2d.b2GrowableStack.prototype.Push = function(element) {
    this.m_stack[this.m_count] = element;
    ++this.m_count;
}

/**
 * @export
 * @return {*}
 */
box2d.b2GrowableStack.prototype.Pop = function() {
    if (box2d.ENABLE_ASSERTS) {
        box2d.b2Assert(this.m_count > 0);
    }
    --this.m_count;
    var element = this.m_stack[this.m_count];
    this.m_stack[this.m_count] = null;
    return element;
}

/**
 * @export
 * @return {number}
 */
box2d.b2GrowableStack.prototype.GetCount = function() {
    return this.m_count;
}













/**
 * A 2D column vector.
 * @export
 * @constructor
 * @param {number=} x
 * @param {number=} y
 */
box2d.b2Vec2 = function(x, y) {
    this.x = x || 0.0;
    this.y = y || 0.0;
    //this.a = new Float32Array(2);
    //this.a[0] = x || 0;
    //this.a[1] = y || 0;
}

/**
 * @export
 * @type {number}
 */
box2d.b2Vec2.prototype.x = 0.0;
/**
 * @export
 * @type {number}
 */
box2d.b2Vec2.prototype.y = 0.0;

//  /**
//   * @type {Float32Array}
//   */
//  box2d.b2Vec2.prototype.a;
//
//  box2d.b2Vec2.prototype.__defineGetter__('x', function () { return this.a[0]; });
//  box2d.b2Vec2.prototype.__defineGetter__('y', function () { return this.a[1]; });
//  box2d.b2Vec2.prototype.__defineSetter__('x', function (n) { this.a[0] = n; });
//  box2d.b2Vec2.prototype.__defineSetter__('y', function (n) { this.a[1] = n; });

/**
 * @export
 * @const
 * @type {box2d.b2Vec2}
 */
box2d.b2Vec2_zero = new box2d.b2Vec2();
/**
 * @export
 * @const
 * @type {box2d.b2Vec2}
 */
box2d.b2Vec2.ZERO = new box2d.b2Vec2();
/**
 * @export
 * @const
 * @type {box2d.b2Vec2}
 */
box2d.b2Vec2.UNITX = new box2d.b2Vec2(1.0, 0.0);
/**
 * @export
 * @const
 * @type {box2d.b2Vec2}
 */
box2d.b2Vec2.UNITY = new box2d.b2Vec2(0.0, 1.0);

/**
 * @export
 * @type {box2d.b2Vec2}
 */
box2d.b2Vec2.s_t0 = new box2d.b2Vec2();
/**
 * @export
 * @type {box2d.b2Vec2}
 */
box2d.b2Vec2.s_t1 = new box2d.b2Vec2();
/**
 * @export
 * @type {box2d.b2Vec2}
 */
box2d.b2Vec2.s_t2 = new box2d.b2Vec2();
/**
 * @export
 * @type {box2d.b2Vec2}
 */
box2d.b2Vec2.s_t3 = new box2d.b2Vec2();

/**
 * @export
 * @return {Array.<box2d.b2Vec2>}
 * @param {number=} length
 */
box2d.b2Vec2.MakeArray = function(length) {
    return box2d.b2MakeArray(length, function(i) {
        return new box2d.b2Vec2();
    });
}

/**
 * @export
 * @return {box2d.b2Vec2}
 */
box2d.b2Vec2.prototype.Clone = function() {
    return new box2d.b2Vec2(this.x, this.y);
}

/**
 * Set this vector to all zeros.
 * @export
 * @return {box2d.b2Vec2}
 */
box2d.b2Vec2.prototype.SetZero = function() {
    this.x = 0.0;
    this.y = 0.0;
    return this;
}

/**
 * Set this vector to some specified coordinates.
 * @export
 * @return {box2d.b2Vec2}
 * @param {number} x
 * @param {number} y
 */
box2d.b2Vec2.prototype.Set = function(x, y) {
    this.x = x;
    this.y = y;
    return this;
}

/**
 * @export
 * @return {box2d.b2Vec2}
 * @param {box2d.b2Vec2} other
 */
box2d.b2Vec2.prototype.Copy = function(other) {
    //if (box2d.ENABLE_ASSERTS) { box2d.b2Assert(this !== other); }
    this.x = other.x;
    this.y = other.y;
    return this;
}

/**
 * Add a vector to this vector.
 * @export
 * @return {box2d.b2Vec2}
 * @param {box2d.b2Vec2} v
 */
box2d.b2Vec2.prototype.SelfAdd = function(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
}

/**
 * @export
 * @return {box2d.b2Vec2}
 * @param {number} x
 * @param {number} y
 */
box2d.b2Vec2.prototype.SelfAddXY = function(x, y) {
    this.x += x;
    this.y += y;
    return this;
}

/**
 * Subtract a vector from this vector.
 * @export
 * @return {box2d.b2Vec2}
 * @param {box2d.b2Vec2} v
 */
box2d.b2Vec2.prototype.SelfSub = function(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
}

/**
 * @export
 * @return {box2d.b2Vec2}
 * @param {number} x
 * @param {number} y
 */
box2d.b2Vec2.prototype.SelfSubXY = function(x, y) {
    this.x -= x;
    this.y -= y;
    return this;
}

/**
 * Multiply this vector by a scalar.
 * @export
 * @return {box2d.b2Vec2}
 * @param {number} s
 */
box2d.b2Vec2.prototype.SelfMul = function(s) {
    this.x *= s;
    this.y *= s;
    return this;
}

/**
 * this += s * v
 * @export
 * @return {box2d.b2Vec2}
 * @param {number} s
 * @param {box2d.b2Vec2} v
 */
box2d.b2Vec2.prototype.SelfMulAdd = function(s, v) {
    this.x += s * v.x;
    this.y += s * v.y;
    return this;
}

/**
 * this -= s * v
 * @export
 * @return {box2d.b2Vec2}
 * @param {number} s
 * @param {box2d.b2Vec2} v
 */
box2d.b2Vec2.prototype.SelfMulSub = function(s, v) {
    this.x -= s * v.x;
    this.y -= s * v.y;
    return this;
}

/**
 * @export
 * @return {number}
 * @param {box2d.b2Vec2} v
 */
box2d.b2Vec2.prototype.Dot = function(v) {
    return this.x * v.x + this.y * v.y;
}

/**
 * @export
 * @return {number}
 * @param {box2d.b2Vec2} v
 */
box2d.b2Vec2.prototype.Cross = function(v) {
    return this.x * v.y - this.y * v.x;
}

/**
 * Get the length of this vector (the norm).
 * @export
 * @return {number}
 */
box2d.b2Vec2.prototype.Length = function() {
    var x = this.x,
        y = this.y;
    return Math.sqrt(x * x + y * y);
}

/**
 * Get the length squared. For performance, use this instead of
 * b2Vec2::Length (if possible).
 * @export
 * @return {number}
 */
box2d.b2Vec2.prototype.LengthSquared = function() {
    var x = this.x,
        y = this.y;
    return (x * x + y * y);
}

/**
 * Convert this vector into a unit vector. Returns the length.
 * @export
 * @return {number}
 */
box2d.b2Vec2.prototype.Normalize = function() {
    var length = this.Length();
    if (length >= box2d.b2_epsilon) {
        var inv_length = 1.0 / length;
        this.x *= inv_length;
        this.y *= inv_length;
    }
    return length;
}

/**
 * @export
 * @return {box2d.b2Vec2}
 */
box2d.b2Vec2.prototype.SelfNormalize = function() {
    this.Normalize();
    return this;
}

/**
 * @export
 * @return {box2d.b2Vec2}
 * @param {number} c
 * @param {number} s
 */
box2d.b2Vec2.prototype.SelfRotate = function(c, s) {
    var x = this.x,
        y = this.y;
    this.x = c * x - s * y;
    this.y = s * x + c * y;
    return this;
}

/**
 * @export
 * @return {box2d.b2Vec2}
 * @param {number} radians
 */
box2d.b2Vec2.prototype.SelfRotateAngle = function(radians) {
    return this.SelfRotate(Math.cos(radians), Math.sin(radians));
}

/**
 * Does this vector contain finite coordinates?
 * @export
 * @return {boolean}
 */
box2d.b2Vec2.prototype.IsValid = function() {
    return isFinite(this.x) && isFinite(this.y);
}

/**
 * @export
 * @return {box2d.b2Vec2}
 * @param {box2d.b2Vec2} v
 */
box2d.b2Vec2.prototype.SelfMin = function(v) {
    this.x = Math.min(this.x, v.x);
    this.y = Math.min(this.y, v.y);
    return this;
}

/**
 * @export
 * @return {box2d.b2Vec2}
 * @param {box2d.b2Vec2} v
 */
box2d.b2Vec2.prototype.SelfMax = function(v) {
    this.x = Math.max(this.x, v.x);
    this.y = Math.max(this.y, v.y);
    return this;
}

/**
 * @export
 * @return {box2d.b2Vec2}
 */
box2d.b2Vec2.prototype.SelfAbs = function() {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);
    return this;
}

/**
 * @export
 * @return {box2d.b2Vec2}
 */
box2d.b2Vec2.prototype.SelfNeg = function() {
    this.x = (-this.x);
    this.y = (-this.y);
    return this;
}

/**
 * Get the skew vector such that dot(skew_vec, other) ===
 * cross(vec, other)
 * @export
 * @return {box2d.b2Vec2}
 */
box2d.b2Vec2.prototype.SelfSkew = function() {
    var x = this.x;
    this.x = -this.y;
    this.y = x;
    return this;
}

/**
 * @export
 * @return {box2d.b2Vec2}
 * @param {box2d.b2Vec2} v
 * @param {box2d.b2Vec2} out
 */
box2d.b2Abs_V2 = function(v, out) {
    out.x = Math.abs(v.x);
    out.y = Math.abs(v.y);
    return out;
}

/**
 * @export
 * @return {box2d.b2Vec2}
 * @param {box2d.b2Vec2} a
 * @param {box2d.b2Vec2} b
 * @param {box2d.b2Vec2} out
 */
box2d.b2Min_V2_V2 = function(a, b, out) {
    out.x = Math.min(a.x, b.x);
    out.y = Math.min(a.y, b.y);
    return out;
}

/**
 * @export
 * @return {box2d.b2Vec2}
 * @param {box2d.b2Vec2} a
 * @param {box2d.b2Vec2} b
 * @param {box2d.b2Vec2} out
 */
box2d.b2Max_V2_V2 = function(a, b, out) {
    out.x = Math.max(a.x, b.x);
    out.y = Math.max(a.y, b.y);
    return out;
}

/**
 * @export
 * @return {box2d.b2Vec2}
 * @param {box2d.b2Vec2} v
 * @param {box2d.b2Vec2} lo
 * @param {box2d.b2Vec2} hi
 * @param {box2d.b2Vec2} out
 */
box2d.b2Clamp_V2_V2_V2 = function(v, lo, hi, out) {
    out.x = Math.min(Math.max(v.x, lo.x), hi.x);
    out.y = Math.min(Math.max(v.y, lo.y), hi.y);
    return out;
}

/**
 * Perform the dot product on two vectors.
 * a.x * b.x + a.y * b.y
 * @export
 * @return {number}
 * @param {box2d.b2Vec2} a
 * @param {box2d.b2Vec2} b
 */
box2d.b2Dot_V2_V2 = function(a, b) {
    return a.x * b.x + a.y * b.y;
}

/**
 * Perform the cross product on two vectors. In 2D this produces a scalar.
 * a.x * b.y - a.y * b.x
 * @export
 * @return {number}
 * @param {box2d.b2Vec2} a
 * @param {box2d.b2Vec2} b
 */
box2d.b2Cross_V2_V2 = function(a, b) {
    return a.x * b.y - a.y * b.x;
}

/**
 * Perform the cross product on a vector and a scalar. In 2D
 * this produces a vector.
 * @export
 * @return {box2d.b2Vec2}
 * @param {box2d.b2Vec2} v
 * @param {number} s
 * @param {box2d.b2Vec2} out
 */
box2d.b2Cross_V2_S = function(v, s, out) {
    var v_x = v.x;
    out.x = s * v.y;
    out.y = -s * v_x;
    return out;
}

/**
 * Perform the cross product on a scalar and a vector. In 2D
 * this produces a vector.
 * @export
 * @return {box2d.b2Vec2}
 * @param {number} s
 * @param {box2d.b2Vec2} v
 * @param {box2d.b2Vec2} out
 */
box2d.b2Cross_S_V2 = function(s, v, out) {
    var v_x = v.x;
    out.x = -s * v.y;
    out.y = s * v_x;
    return out;
}

/**
 * Add two vectors component-wise.
 * @export
 * @return {box2d.b2Vec2}
 * @param {box2d.b2Vec2} a
 * @param {box2d.b2Vec2} b
 * @param {box2d.b2Vec2} out
 */
box2d.b2Add_V2_V2 = function(a, b, out) {
    out.x = a.x + b.x;
    out.y = a.y + b.y;
    return out;
}

/**
 * Subtract two vectors component-wise.
 * @export
 * @return {box2d.b2Vec2}
 * @param {box2d.b2Vec2} a
 * @param {box2d.b2Vec2} b
 * @param {box2d.b2Vec2} out
 */
box2d.b2Sub_V2_V2 = function(a, b, out) {
    out.x = a.x - b.x;
    out.y = a.y - b.y;
    return out;
}

/**
 * @export
 * @return {box2d.b2Vec2}
 * @param {box2d.b2Vec2} v
 * @param {number} s
 * @param {box2d.b2Vec2} out
 */
box2d.b2Add_V2_S = function(v, s, out) {
    out.x = v.x + s;
    out.y = v.y + s;
    return out;
}

/**
 * @export
 * @return {box2d.b2Vec2}
 * @param {box2d.b2Vec2} v
 * @param {number} s
 * @param {box2d.b2Vec2} out
 */
box2d.b2Sub_V2_S = function(v, s, out) {
    out.x = v.x - s;
    out.y = v.y - s;
    return out;
}

/**
 * @export
 * @return {box2d.b2Vec2}
 * @param {number} s
 * @param {box2d.b2Vec2} v
 * @param {box2d.b2Vec2} out
 */
box2d.b2Mul_S_V2 = function(s, v, out) {
    out.x = v.x * s;
    out.y = v.y * s;
    return out;
}

/**
 * @export
 * @return {box2d.b2Vec2}
 * @param {box2d.b2Vec2} v
 * @param {number} s
 * @param {box2d.b2Vec2} out
 */
box2d.b2Mul_V2_S = function(v, s, out) {
    out.x = v.x * s;
    out.y = v.y * s;
    return out;
}

/**
 * @export
 * @return {box2d.b2Vec2}
 * @param {box2d.b2Vec2} v
 * @param {number} s
 * @param {box2d.b2Vec2} out
 */
box2d.b2Div_V2_S = function(v, s, out) {
    out.x = v.x / s;
    out.y = v.y / s;
    return out;
}

/**
 * out = a + (s * b)
 * @export
 * @return {box2d.b2Vec2}
 * @param {box2d.b2Vec2} a
 * @param {number} s
 * @param {box2d.b2Vec2} b
 * @param {box2d.b2Vec2} out
 */
box2d.b2AddMul_V2_S_V2 = function(a, s, b, out) {
    out.x = a.x + (s * b.x);
    out.y = a.y + (s * b.y);
    return out;
}
/**
 * out = a - (s * b)
 * @export
 * @return {box2d.b2Vec2}
 * @param {box2d.b2Vec2} a
 * @param {number} s
 * @param {box2d.b2Vec2} b
 * @param {box2d.b2Vec2} out
 */
box2d.b2SubMul_V2_S_V2 = function(a, s, b, out) {
    out.x = a.x - (s * b.x);
    out.y = a.y - (s * b.y);
    return out;
}

/**
 * out = a + b2Cross(s, v)
 * @export
 * @return {box2d.b2Vec2}
 * @param {box2d.b2Vec2} a
 * @param {number} s
 * @param {box2d.b2Vec2} v
 * @param {box2d.b2Vec2} out
 */
box2d.b2AddCross_V2_S_V2 = function(a, s, v, out) {
    var v_x = v.x;
    out.x = a.x - (s * v.y);
    out.y = a.y + (s * v_x);
    return out;
}

/**
 * Get the center of two vectors.
 * @export
 * @return {box2d.b2Vec2}
 * @param {box2d.b2Vec2} a
 * @param {box2d.b2Vec2} b
 * @param {box2d.b2Vec2} out
 */
box2d.b2Mid_V2_V2 = function(a, b, out) {
    out.x = (a.x + b.x) * 0.5;
    out.y = (a.y + b.y) * 0.5;
    return out;
}

/**
 * Get the extent of two vectors (half-widths).
 * @export
 * @return {box2d.b2Vec2}
 * @param {box2d.b2Vec2} a
 * @param {box2d.b2Vec2} b
 * @param {box2d.b2Vec2} out
 */
box2d.b2Ext_V2_V2 = function(a, b, out) {
    out.x = (b.x - a.x) * 0.5;
    out.y = (b.y - a.y) * 0.5;
    return out;
}

/**
 * @export
 * @return {number}
 * @param {box2d.b2Vec2} a
 * @param {box2d.b2Vec2} b
 */
box2d.b2Distance = function(a, b) {
    var c_x = a.x - b.x;
    var c_y = a.y - b.y;
    return Math.sqrt(c_x * c_x + c_y * c_y);
}

/**
 * @export
 * @return {number}
 * @param {box2d.b2Vec2} a
 * @param {box2d.b2Vec2} b
 */
box2d.b2DistanceSquared = function(a, b) {
    var c_x = a.x - b.x;
    var c_y = a.y - b.y;
    return (c_x * c_x + c_y * c_y);
}











/**
 * Ray-cast input data. The ray extends from p1 to p1 +
 * maxFraction * (p2 - p1).
 * @export
 * @constructor
 */
box2d.b2RayCastInput = function() {
    this.p1 = new box2d.b2Vec2();
    this.p2 = new box2d.b2Vec2();
    this.maxFraction = 1;
}

/**
 * @export
 * @type {box2d.b2Vec2}
 */
box2d.b2RayCastInput.prototype.p1 = null;
/**
 * @export
 * @type {box2d.b2Vec2}
 */
box2d.b2RayCastInput.prototype.p2 = null;
/**
 * @export
 * @type {number}
 */
box2d.b2RayCastInput.prototype.maxFraction = 1;

/**
 * @export
 * @return {box2d.b2RayCastInput}
 * @param {box2d.b2RayCastInput} o
 */
box2d.b2RayCastInput.prototype.Copy = function(o) {
    this.p1.Copy(o.p1);
    this.p2.Copy(o.p2);
    this.maxFraction = o.maxFraction;
    return this;
}

/**
 * Ray-cast output data. The ray hits at p1 + fraction * (p2 -
 * p1), where p1 and p2 come from box2d.b2RayCastInput.
 * @export
 * @constructor
 */
box2d.b2RayCastOutput = function() {
    this.normal = new box2d.b2Vec2();
    this.fraction = 0;
};

/**
 * @export
 * @type {box2d.b2Vec2}
 */
box2d.b2RayCastOutput.prototype.normal = null;
/**
 * @export
 * @type {number}
 */
box2d.b2RayCastOutput.prototype.fraction = 0;

/**
 * @export
 * @return {box2d.b2RayCastOutput}
 * @param {box2d.b2RayCastOutput} o
 */
box2d.b2RayCastOutput.prototype.Copy = function(o) {
    this.normal.Copy(o.normal);
    this.fraction = o.fraction;
    return this;
}













/**
 * An axis aligned bounding box.
 * @export
 * @constructor
 */
box2d.b2AABB = function() {
    this.lowerBound = new box2d.b2Vec2();
    this.upperBound = new box2d.b2Vec2();

    this.m_out_center = new box2d.b2Vec2();
    this.m_out_extent = new box2d.b2Vec2();
};

/**
 * @export
 * @type {box2d.b2Vec2}
 */
box2d.b2AABB.prototype.lowerBound = null; ///< the lower vertex
/**
 * @export
 * @type {box2d.b2Vec2}
 */
box2d.b2AABB.prototype.upperBound = null; ///< the upper vertex

/**
 * @export
 * @type {box2d.b2Vec2}
 */
box2d.b2AABB.prototype.m_out_center = null; // access using GetCenter()
/**
 * @export
 * @type {box2d.b2Vec2}
 */
box2d.b2AABB.prototype.m_out_extent = null; // access using GetExtents()

/**
 * @export
 * @return {box2d.b2AABB}
 */
box2d.b2AABB.prototype.Clone = function() {
    return new box2d.b2AABB().Copy(this);
}

/**
 * @export
 * @return {box2d.b2AABB}
 * @param {box2d.b2AABB} o
 */
box2d.b2AABB.prototype.Copy = function(o) {
    this.lowerBound.Copy(o.lowerBound);
    this.upperBound.Copy(o.upperBound);
    return this;
}

/**
 * Verify that the bounds are sorted.
 * @export
 * @return {boolean}
 */
box2d.b2AABB.prototype.IsValid = function() {
    var d_x = this.upperBound.x - this.lowerBound.x;
    var d_y = this.upperBound.y - this.lowerBound.y;
    var valid = d_x >= 0 && d_y >= 0;
    valid = valid && this.lowerBound.IsValid() && this.upperBound.IsValid();
    return valid;
}

/**
 * Get the center of the AABB.
 * @export
 * @return {box2d.b2Vec2}
 */
box2d.b2AABB.prototype.GetCenter = function() {
    return box2d.b2Mid_V2_V2(this.lowerBound, this.upperBound, this.m_out_center);
}

/**
 * Get the extents of the AABB (half-widths).
 * @export
 * @return {box2d.b2Vec2}
 */
box2d.b2AABB.prototype.GetExtents = function() {
    return box2d.b2Ext_V2_V2(this.lowerBound, this.upperBound, this.m_out_extent);
}

/**
 * Get the perimeter length
 * @export
 * @return {number}
 */
box2d.b2AABB.prototype.GetPerimeter = function() {
    var wx = this.upperBound.x - this.lowerBound.x;
    var wy = this.upperBound.y - this.lowerBound.y;
    return 2 * (wx + wy);
}

/**
 * @return {box2d.b2AABB}
 * @param {box2d.b2AABB} a0
 * @param {box2d.b2AABB=} a1
 */
box2d.b2AABB.prototype.Combine = function(a0, a1) {
    switch (arguments.length) {
        case 1:
            return this.Combine1(a0);
        case 2:
            return this.Combine2(a0, a1 || new box2d.b2AABB());
        default:
            throw new Error();
    }
}

/**
 * Combine an AABB into this one.
 * @export
 * @return {box2d.b2AABB}
 * @param {box2d.b2AABB} aabb
 */
box2d.b2AABB.prototype.Combine1 = function(aabb) {
    this.lowerBound.x = box2d.b2Min(this.lowerBound.x, aabb.lowerBound.x);
    this.lowerBound.y = box2d.b2Min(this.lowerBound.y, aabb.lowerBound.y);
    this.upperBound.x = box2d.b2Max(this.upperBound.x, aabb.upperBound.x);
    this.upperBound.y = box2d.b2Max(this.upperBound.y, aabb.upperBound.y);
    return this;
}

/**
 * Combine two AABBs into this one.
 * @export
 * @return {box2d.b2AABB}
 * @param {box2d.b2AABB} aabb1
 * @param {box2d.b2AABB} aabb2
 */
box2d.b2AABB.prototype.Combine2 = function(aabb1, aabb2) {
    this.lowerBound.x = box2d.b2Min(aabb1.lowerBound.x, aabb2.lowerBound.x);
    this.lowerBound.y = box2d.b2Min(aabb1.lowerBound.y, aabb2.lowerBound.y);
    this.upperBound.x = box2d.b2Max(aabb1.upperBound.x, aabb2.upperBound.x);
    this.upperBound.y = box2d.b2Max(aabb1.upperBound.y, aabb2.upperBound.y);
    return this;
}

/**
 * @export
 * @return {box2d.b2AABB}
 * @param {box2d.b2AABB} aabb1
 * @param {box2d.b2AABB} aabb2
 * @param {box2d.b2AABB} out
 */
box2d.b2AABB.Combine = function(aabb1, aabb2, out) {
    out.Combine2(aabb1, aabb2);
    return out;
}

/**
 * Does this aabb contain the provided AABB.
 * @export
 * @return {boolean}
 * @param {box2d.b2AABB} aabb
 */
box2d.b2AABB.prototype.Contains = function(aabb) {
    var result = true;
    result = result && this.lowerBound.x <= aabb.lowerBound.x;
    result = result && this.lowerBound.y <= aabb.lowerBound.y;
    result = result && aabb.upperBound.x <= this.upperBound.x;
    result = result && aabb.upperBound.y <= this.upperBound.y;
    return result;
}

/**
 * From Real-time Collision Detection, p179.
 * @export
 * @return {boolean}
 * @param {box2d.b2RayCastOutput} output
 * @param {box2d.b2RayCastInput} input
 */
box2d.b2AABB.prototype.RayCast = function(output, input) {
    var tmin = (-box2d.b2_maxFloat);
    var tmax = box2d.b2_maxFloat;

    var p_x = input.p1.x;
    var p_y = input.p1.y;
    var d_x = input.p2.x - input.p1.x;
    var d_y = input.p2.y - input.p1.y;
    var absD_x = box2d.b2Abs(d_x);
    var absD_y = box2d.b2Abs(d_y);

    var normal = output.normal;

    if (absD_x < box2d.b2_epsilon) {
        // Parallel.
        if (p_x < this.lowerBound.x || this.upperBound.x < p_x) {
            return false;
        }
    } else {
        var inv_d = 1 / d_x;
        var t1 = (this.lowerBound.x - p_x) * inv_d;
        var t2 = (this.upperBound.x - p_x) * inv_d;

        // Sign of the normal vector.
        var s = (-1);

        if (t1 > t2) {
            var t3 = t1;
            t1 = t2;
            t2 = t3;
            s = 1;
        }

        // Push the min up
        if (t1 > tmin) {
            normal.x = s;
            normal.y = 0;
            tmin = t1;
        }

        // Pull the max down
        tmax = box2d.b2Min(tmax, t2);

        if (tmin > tmax) {
            return false;
        }
    }

    if (absD_y < box2d.b2_epsilon) {
        // Parallel.
        if (p_y < this.lowerBound.y || this.upperBound.y < p_y) {
            return false;
        }
    } else {
        var inv_d = 1 / d_y;
        var t1 = (this.lowerBound.y - p_y) * inv_d;
        var t2 = (this.upperBound.y - p_y) * inv_d;

        // Sign of the normal vector.
        var s = (-1);

        if (t1 > t2) {
            var t3 = t1;
            t1 = t2;
            t2 = t3;
            s = 1;
        }

        // Push the min up
        if (t1 > tmin) {
            normal.x = 0;
            normal.y = s;
            tmin = t1;
        }

        // Pull the max down
        tmax = box2d.b2Min(tmax, t2);

        if (tmin > tmax) {
            return false;
        }
    }

    // Does the ray start inside the box?
    // Does the ray intersect beyond the max fraction?
    if (tmin < 0 || input.maxFraction < tmin) {
        return false;
    }

    // Intersection.
    output.fraction = tmin;

    return true;
}

/**
 * @export
 * @return {boolean}
 * @param {box2d.b2AABB} other
 */
box2d.b2AABB.prototype.TestOverlap = function(other) {
    var d1_x = other.lowerBound.x - this.upperBound.x;
    var d1_y = other.lowerBound.y - this.upperBound.y;
    var d2_x = this.lowerBound.x - other.upperBound.x;
    var d2_y = this.lowerBound.y - other.upperBound.y;

    if (d1_x > 0 || d1_y > 0)
        return false;

    if (d2_x > 0 || d2_y > 0)
        return false;

    return true;
}

/**
 * @export
 * @return {boolean}
 * @param {box2d.b2AABB} a
 * @param {box2d.b2AABB} b
 */
box2d.b2TestOverlap_AABB = function(a, b) {
    var d1_x = b.lowerBound.x - a.upperBound.x;
    var d1_y = b.lowerBound.y - a.upperBound.y;
    var d2_x = a.lowerBound.x - b.upperBound.x;
    var d2_y = a.lowerBound.y - b.upperBound.y;

    if (d1_x > 0 || d1_y > 0)
        return false;

    if (d2_x > 0 || d2_y > 0)
        return false;

    return true;
}































/**
 * A node in the dynamic tree. The client does not interact with
 * this directly.
 * @export
 * @constructor
 * @param {number=} id
 */
box2d.b2TreeNode = function(id) {
    this.m_id = id || 0;

    this.aabb = new box2d.b2AABB();
};

/**
 * @export
 * @type {number}
 */
box2d.b2TreeNode.prototype.m_id = 0;

/**
 * Enlarged AABB
 * @export
 * @type {box2d.b2AABB}
 */
box2d.b2TreeNode.prototype.aabb = null;

/**
 * @export
 * @type {*}
 */
box2d.b2TreeNode.prototype.userData = null;

/**
 * @export
 * @type {box2d.b2TreeNode}
 */
box2d.b2TreeNode.prototype.parent = null; // or box2d.b2TreeNode.prototype.next

/**
 * @export
 * @type {box2d.b2TreeNode}
 */
box2d.b2TreeNode.prototype.child1 = null;
/**
 * @export
 * @type {box2d.b2TreeNode}
 */
box2d.b2TreeNode.prototype.child2 = null;

/**
 * leaf = 0, free node = -1
 * @export
 * @type {number}
 */
box2d.b2TreeNode.prototype.height = 0;

/**
 * @export
 * @return {boolean}
 */
box2d.b2TreeNode.prototype.IsLeaf = function() {
    return this.child1 === null;
}

/**
 * A dynamic tree arranges data in a binary tree to accelerate
 * queries such as volume queries and ray casts. Leafs are proxies
 * with an AABB. In the tree we expand the proxy AABB by b2_fatAABBFactor
 * so that the proxy AABB is bigger than the client object. This allows the client
 * object to move by small amounts without triggering a tree update.
 *
 * Nodes are pooled and relocatable, so we use node indices rather than pointers.
 * @export
 * @constructor
 */
DynamicTree = function() {}

/**
 * @export
 * @type {box2d.b2TreeNode}
 */
DynamicTree.prototype.m_root = null;

//b2TreeNode* DynamicTree.prototype.m_nodes;
//int32 DynamicTree.prototype.m_nodeCount;
//int32 DynamicTree.prototype.m_nodeCapacity;

/**
 * @export
 * @type {box2d.b2TreeNode}
 */
DynamicTree.prototype.m_freeList = null;

/**
 * This is used to incrementally traverse the tree for
 * re-balancing.
 * @export
 * @type {number}
 */
DynamicTree.prototype.m_path = 0;

/**
 * @export
 * @type {number}
 */
DynamicTree.prototype.m_insertionCount = 0;

DynamicTree.s_stack = new box2d.b2GrowableStack(256);
DynamicTree.s_r = new box2d.b2Vec2();
DynamicTree.s_v = new box2d.b2Vec2();
DynamicTree.s_abs_v = new box2d.b2Vec2();
DynamicTree.s_segmentAABB = new box2d.b2AABB();
DynamicTree.s_subInput = new box2d.b2RayCastInput();
DynamicTree.s_combinedAABB = new box2d.b2AABB();
DynamicTree.s_aabb = new box2d.b2AABB();

/**
 * Get proxy user data.
 * @export
 * @return {*} the proxy user data or 0 if the id is invalid.
 * @param {box2d.b2TreeNode} proxy
 */
DynamicTree.prototype.GetUserData = function(proxy) {
    if (box2d.ENABLE_ASSERTS) {
        box2d.b2Assert(proxy !== null);
    }
    return proxy.userData;
}

/**
 * Get the fat AABB for a proxy.
 * @export
 * @return {box2d.b2AABB}
 * @param {box2d.b2TreeNode} proxy
 */
DynamicTree.prototype.GetFatAABB = function(proxy) {
    if (box2d.ENABLE_ASSERTS) {
        box2d.b2Assert(proxy !== null);
    }
    return proxy.aabb;
}

/**
 * Query an AABB for overlapping proxies. The callback class is
 * called for each proxy that overlaps the supplied AABB.
 * @export
 * @return {void}
 * @param {function(box2d.b2TreeNode):boolean} callback
 * @param {box2d.b2AABB} aabb
 */
DynamicTree.prototype.Query = function(callback, aabb) {
    if (this.m_root === null) return;

    /** @type {box2d.b2GrowableStack} */
    var stack = DynamicTree.s_stack.Reset();
    stack.Push(this.m_root);

    while (stack.GetCount() > 0) {
        /** @type {box2d.b2TreeNode} */
        var node = /** @type {box2d.b2TreeNode} */ (stack.Pop());
        if (node === null) {
            continue;
        }

        if (node.aabb.TestOverlap(aabb)) {
            if (node.IsLeaf()) {
                /** @type {boolean} */
                var proceed = callback(node);
                if (!proceed) {
                    return;
                }
            } else {
                stack.Push(node.child1);
                stack.Push(node.child2);
            }
        }
    }
}

/**
 * Query an AABB for all entries. The callback class is
 * called for each proxy.
 * @export
 * @return {void}
 * @param {function(box2d.b2TreeNode):boolean} callback
 */
DynamicTree.prototype.Recurse = function(callback) {
    if (this.m_root === null) return;

    /** @type {box2d.b2GrowableStack} */
    var stack = DynamicTree.s_stack.Reset();
    stack.Push(this.m_root);

    while (stack.GetCount() > 0) {
        /** @type {box2d.b2TreeNode} */
        var node = /** @type {box2d.b2TreeNode} */ (stack.Pop());
        if (node === null) {
            continue;
        }

        if (node.IsLeaf()) {
            /** @type {boolean} */
            var proceed = callback(node);
            if (!proceed) {
                return;
            }
        } else {
            stack.Push(node.child1);
            stack.Push(node.child2);
        }
    }
}

/**
 * Ray-cast against the proxies in the tree. This relies on the callback
 * to perform a exact ray-cast in the case were the proxy contains a shape.
 * The callback also performs the any collision filtering. This has performance
 * roughly equal to k * log(n), where k is the number of collisions and n is the
 * number of proxies in the tree.
 * @export
 * @return {void}
 * @param
 *      {function(box2d.b2RayCastInput,box2d.b2TreeNode):number}
 *      callback a callback class that is called for each
 *      proxy that is hit by the ray.
 * @param {box2d.b2RayCastInput} input the ray-cast input data.
 *      The ray extends from p1 to p1 + maxFraction * (p2 -
 *      p1).
 */
DynamicTree.prototype.RayCast = function(callback, input) {
    if (this.m_root === null) return;

    /** @type {box2d.b2Vec2} */
    var p1 = input.p1;
    /** @type {box2d.b2Vec2} */
    var p2 = input.p2;
    /** @type {box2d.b2Vec2} */
    var r = box2d.b2Sub_V2_V2(p2, p1, DynamicTree.s_r);
    if (box2d.ENABLE_ASSERTS) {
        box2d.b2Assert(r.LengthSquared() > 0);
    }
    r.Normalize();

    // v is perpendicular to the segment.
    /** @type {box2d.b2Vec2} */
    var v = box2d.b2Cross_S_V2(1.0, r, DynamicTree.s_v);
    /** @type {box2d.b2Vec2} */
    var abs_v = box2d.b2Abs_V2(v, DynamicTree.s_abs_v);

    // Separating axis for segment (Gino, p80).
    // |dot(v, p1 - c)| > dot(|v|, h)

    /** @type {number} */
    var maxFraction = input.maxFraction;

    // Build a bounding box for the segment.
    /** @type {box2d.b2AABB} */
    var segmentAABB = DynamicTree.s_segmentAABB;
    /** @type {number} */
    var t_x = p1.x + maxFraction * (p2.x - p1.x);
    /** @type {number} */
    var t_y = p1.y + maxFraction * (p2.y - p1.y);
    segmentAABB.lowerBound.x = box2d.b2Min(p1.x, t_x);
    segmentAABB.lowerBound.y = box2d.b2Min(p1.y, t_y);
    segmentAABB.upperBound.x = box2d.b2Max(p1.x, t_x);
    segmentAABB.upperBound.y = box2d.b2Max(p1.y, t_y);

    /** @type {box2d.b2GrowableStack} */
    var stack = DynamicTree.s_stack.Reset();
    stack.Push(this.m_root);

    while (stack.GetCount() > 0) {
        /** @type {box2d.b2TreeNode} */
        var node = /** @type {box2d.b2TreeNode} */ (stack.Pop());
        if (node === null) {
            continue;
        }

        if (!box2d.b2TestOverlap_AABB(node.aabb, segmentAABB)) {
            continue;
        }

        // Separating axis for segment (Gino, p80).
        // |dot(v, p1 - c)| > dot(|v|, h)
        /** @type {box2d.b2Vec2} */
        var c = node.aabb.GetCenter();
        /** @type {box2d.b2Vec2} */
        var h = node.aabb.GetExtents();
        /** @type {number} */
        var separation = box2d.b2Abs(box2d.b2Dot_V2_V2(v, box2d.b2Sub_V2_V2(p1, c, box2d.b2Vec2.s_t0))) - box2d.b2Dot_V2_V2(abs_v, h);
        if (separation > 0) {
            continue;
        }

        if (node.IsLeaf()) {
            /** @type {box2d.b2RayCastInput} */
            var subInput = DynamicTree.s_subInput;
            subInput.p1.Copy(input.p1);
            subInput.p2.Copy(input.p2);
            subInput.maxFraction = maxFraction;

            /** @type {number} */
            var value = callback(subInput, node);

            if (value === 0) {
                // The client has terminated the ray cast.
                return;
            }

            if (value > 0) {
                // Update segment bounding box.
                maxFraction = value;
                t_x = p1.x + maxFraction * (p2.x - p1.x);
                t_y = p1.y + maxFraction * (p2.y - p1.y);
                segmentAABB.lowerBound.x = box2d.b2Min(p1.x, t_x);
                segmentAABB.lowerBound.y = box2d.b2Min(p1.y, t_y);
                segmentAABB.upperBound.x = box2d.b2Max(p1.x, t_x);
                segmentAABB.upperBound.y = box2d.b2Max(p1.y, t_y);
            }
        } else {
            stack.Push(node.child1);
            stack.Push(node.child2);
        }
    }
}

/**
 * @export
 * @return {box2d.b2TreeNode}
 */
DynamicTree.prototype.AllocateNode = function() {
    // Expand the node pool as needed.
    if (this.m_freeList) {
        /** @type {box2d.b2TreeNode} */
        var node = this.m_freeList;
        this.m_freeList = node.parent; // this.m_freeList = node.next;
        node.parent = null;
        node.child1 = null;
        node.child2 = null;
        node.height = 0;
        node.userData = null;
        return node;
    }

    return new box2d.b2TreeNode(DynamicTree.prototype.s_node_id++);
}
DynamicTree.prototype.s_node_id = 0;

/**
 * @export
 * @return {void}
 * @param {box2d.b2TreeNode} node
 */
DynamicTree.prototype.FreeNode = function(node) {
    node.parent = this.m_freeList; // node.next = this.m_freeList;
    node.height = -1;
    this.m_freeList = node;
}

/**
 * Create a proxy. Provide a tight fitting AABB and a userData
 * pointer.
 * @export
 * @return {box2d.b2TreeNode}
 * @param {box2d.b2AABB} aabb
 * @param {*} userData
 */
DynamicTree.prototype.CreateProxy = function(aabb, userData) {
    /** @type {box2d.b2TreeNode} */
    var node = this.AllocateNode();

    // Fatten the aabb.
    /** @type {number} */
    var r_x = box2d.b2_aabbExtension;
    /** @type {number} */
    var r_y = box2d.b2_aabbExtension;
    node.aabb.lowerBound.x = aabb.lowerBound.x - r_x;
    node.aabb.lowerBound.y = aabb.lowerBound.y - r_y;
    node.aabb.upperBound.x = aabb.upperBound.x + r_x;
    node.aabb.upperBound.y = aabb.upperBound.y + r_y;
    node.userData = userData;
    node.height = 0;

    this.InsertLeaf(node);

    return node;
}

/**
 * Destroy a proxy. This asserts if the id is invalid.
 * @export
 * @return {void}
 * @param {box2d.b2TreeNode} proxy
 */
DynamicTree.prototype.DestroyProxy = function(proxy) {
    if (box2d.ENABLE_ASSERTS) {
        box2d.b2Assert(proxy.IsLeaf());
    }

    this.RemoveLeaf(proxy);
    this.FreeNode(proxy);
}

/**
 * Move a proxy with a swepted AABB. If the proxy has moved
 * outside of its fattened AABB, then the proxy is removed from
 * the tree and re-inserted. Otherwise the function returns
 * immediately.
 * @export
 * @return {boolean} true if the proxy was re-inserted.
 * @param {box2d.b2TreeNode} proxy
 * @param {box2d.b2AABB} aabb
 * @param {box2d.b2Vec2} displacement
 */
DynamicTree.prototype.MoveProxy = function(proxy, aabb, displacement) {
    if (box2d.ENABLE_ASSERTS) {
        box2d.b2Assert(proxy.IsLeaf());
    }

    if (proxy.aabb.Contains(aabb)) {
        return false;
    }

    this.RemoveLeaf(proxy);

    // Extend AABB.
    // Predict AABB displacement.
    /** @type {number} */
    var r_x = box2d.b2_aabbExtension + box2d.b2_aabbMultiplier * (displacement.x > 0 ? displacement.x : (-displacement.x));
    /** @type {number} */
    var r_y = box2d.b2_aabbExtension + box2d.b2_aabbMultiplier * (displacement.y > 0 ? displacement.y : (-displacement.y));
    proxy.aabb.lowerBound.x = aabb.lowerBound.x - r_x;
    proxy.aabb.lowerBound.y = aabb.lowerBound.y - r_y;
    proxy.aabb.upperBound.x = aabb.upperBound.x + r_x;
    proxy.aabb.upperBound.y = aabb.upperBound.y + r_y;

    this.InsertLeaf(proxy);
    return true;
}

/**
 * @export
 * @return {void}
 * @param {box2d.b2TreeNode} leaf
 */
DynamicTree.prototype.InsertLeaf = function(leaf) {
    ++this.m_insertionCount;

    if (this.m_root === null) {
        this.m_root = leaf;
        this.m_root.parent = null;
        return;
    }

    // Find the best sibling for this node
    /** @type {box2d.b2AABB} */
    var leafAABB = leaf.aabb;
    /** @type {box2d.b2Vec2} */
    var center = leafAABB.GetCenter();
    /** @type {box2d.b2TreeNode} */
    var index = this.m_root;
    /** @type {box2d.b2TreeNode} */
    var child1;
    /** @type {box2d.b2TreeNode} */
    var child2;
    while (!index.IsLeaf()) {
        child1 = index.child1;
        child2 = index.child2;

        /** @type {number} */
        var area = index.aabb.GetPerimeter();

        /** @type {box2d.b2AABB} */
        var combinedAABB = DynamicTree.s_combinedAABB;
        combinedAABB.Combine2(index.aabb, leafAABB);
        /** @type {number} */
        var combinedArea = combinedAABB.GetPerimeter();

        // Cost of creating a new parent for this node and the new leaf
        /** @type {number} */
        var cost = 2 * combinedArea;

        // Minimum cost of pushing the leaf further down the tree
        /** @type {number} */
        var inheritanceCost = 2 * (combinedArea - area);

        // Cost of descending into child1
        /** @type {number} */
        var cost1;
        /** @type {box2d.b2AABB} */
        var aabb = DynamicTree.s_aabb;
        /** @type {number} */
        var oldArea;
        /** @type {number} */
        var newArea;
        if (child1.IsLeaf()) {
            aabb.Combine2(leafAABB, child1.aabb);
            cost1 = aabb.GetPerimeter() + inheritanceCost;
        } else {
            aabb.Combine2(leafAABB, child1.aabb);
            oldArea = child1.aabb.GetPerimeter();
            newArea = aabb.GetPerimeter();
            cost1 = (newArea - oldArea) + inheritanceCost;
        }

        // Cost of descending into child2
        /** @type {number} */
        var cost2;
        if (child2.IsLeaf()) {
            aabb.Combine2(leafAABB, child2.aabb);
            cost2 = aabb.GetPerimeter() + inheritanceCost;
        } else {
            aabb.Combine2(leafAABB, child2.aabb);
            oldArea = child2.aabb.GetPerimeter();
            newArea = aabb.GetPerimeter();
            cost2 = newArea - oldArea + inheritanceCost;
        }

        // Descend according to the minimum cost.
        if (cost < cost1 && cost < cost2) {
            break;
        }

        // Descend
        if (cost1 < cost2) {
            index = child1;
        } else {
            index = child2;
        }
    }

    /** @type {box2d.b2TreeNode} */
    var sibling = index;

    // Create a parent for the siblings.
    /** @type {box2d.b2TreeNode} */
    var oldParent = sibling.parent;
    /** @type {box2d.b2TreeNode} */
    var newParent = this.AllocateNode();
    newParent.parent = oldParent;
    newParent.userData = null;
    newParent.aabb.Combine2(leafAABB, sibling.aabb);
    newParent.height = sibling.height + 1;

    if (oldParent) {
        // The sibling was not the root.
        if (oldParent.child1 === sibling) {
            oldParent.child1 = newParent;
        } else {
            oldParent.child2 = newParent;
        }

        newParent.child1 = sibling;
        newParent.child2 = leaf;
        sibling.parent = newParent;
        leaf.parent = newParent;
    } else {
        // The sibling was the root.
        newParent.child1 = sibling;
        newParent.child2 = leaf;
        sibling.parent = newParent;
        leaf.parent = newParent;
        this.m_root = newParent;
    }

    // Walk back up the tree fixing heights and AABBs
    index = leaf.parent;
    while (index !== null) {
        index = this.Balance(index);

        child1 = index.child1;
        child2 = index.child2;

        if (box2d.ENABLE_ASSERTS) {
            box2d.b2Assert(child1 !== null);
        }
        if (box2d.ENABLE_ASSERTS) {
            box2d.b2Assert(child2 !== null);
        }

        index.height = 1 + box2d.b2Max(child1.height, child2.height);
        index.aabb.Combine2(child1.aabb, child2.aabb);

        index = index.parent;
    }

    //this.Validate();
}

/**
 * @export
 * @return {void}
 * @param {box2d.b2TreeNode} leaf
 */
DynamicTree.prototype.RemoveLeaf = function(leaf) {
    if (leaf === this.m_root) {
        this.m_root = null;
        return;
    }

    /** @type {box2d.b2TreeNode} */
    var parent = leaf.parent;
    /** @type {box2d.b2TreeNode} */
    var grandParent = parent.parent;
    /** @type {box2d.b2TreeNode} */
    var sibling;
    if (parent.child1 === leaf) {
        sibling = parent.child2;
    } else {
        sibling = parent.child1;
    }

    if (grandParent) {
        // Destroy parent and connect sibling to grandParent.
        if (grandParent.child1 === parent) {
            grandParent.child1 = sibling;
        } else {
            grandParent.child2 = sibling;
        }
        sibling.parent = grandParent;
        this.FreeNode(parent);

        // Adjust ancestor bounds.
        /** @type {box2d.b2TreeNode} */
        var index = grandParent;
        while (index) {
            index = this.Balance(index);

            /** @type {box2d.b2TreeNode} */
            var child1 = index.child1;
            /** @type {box2d.b2TreeNode} */
            var child2 = index.child2;

            index.aabb.Combine2(child1.aabb, child2.aabb);
            index.height = 1 + box2d.b2Max(child1.height, child2.height);

            index = index.parent;
        }
    } else {
        this.m_root = sibling;
        sibling.parent = null;
        this.FreeNode(parent);
    }

    //this.Validate();
}

/**
 * Perform a left or right rotation if node A is imbalanced.
 * Returns the new root index.
 * @export
 * @param {box2d.b2TreeNode} A
 * @return {box2d.b2TreeNode}
 */
DynamicTree.prototype.Balance = function(A) {
    if (box2d.ENABLE_ASSERTS) {
        box2d.b2Assert(A !== null);
    }

    if (A.IsLeaf() || A.height < 2) {
        return A;
    }

    /** @type {box2d.b2TreeNode} */
    var B = A.child1;
    /** @type {box2d.b2TreeNode} */
    var C = A.child2;

    /** @type {number} */
    var balance = C.height - B.height;

    // Rotate C up
    if (balance > 1) {
        /** @type {box2d.b2TreeNode} */
        var F = C.child1;
        /** @type {box2d.b2TreeNode} */
        var G = C.child2;

        // Swap A and C
        C.child1 = A;
        C.parent = A.parent;
        A.parent = C;

        // A's old parent should point to C
        if (C.parent !== null) {
            if (C.parent.child1 === A) {
                C.parent.child1 = C;
            } else {
                if (box2d.ENABLE_ASSERTS) {
                    box2d.b2Assert(C.parent.child2 === A);
                }
                C.parent.child2 = C;
            }
        } else {
            this.m_root = C;
        }

        // Rotate
        if (F.height > G.height) {
            C.child2 = F;
            A.child2 = G;
            G.parent = A;
            A.aabb.Combine2(B.aabb, G.aabb);
            C.aabb.Combine2(A.aabb, F.aabb);

            A.height = 1 + box2d.b2Max(B.height, G.height);
            C.height = 1 + box2d.b2Max(A.height, F.height);
        } else {
            C.child2 = G;
            A.child2 = F;
            F.parent = A;
            A.aabb.Combine2(B.aabb, F.aabb);
            C.aabb.Combine2(A.aabb, G.aabb);

            A.height = 1 + box2d.b2Max(B.height, F.height);
            C.height = 1 + box2d.b2Max(A.height, G.height);
        }

        return C;
    }

    // Rotate B up
    if (balance < -1) {
        /** @type {box2d.b2TreeNode} */
        var D = B.child1;
        /** @type {box2d.b2TreeNode} */
        var E = B.child2;

        // Swap A and B
        B.child1 = A;
        B.parent = A.parent;
        A.parent = B;

        // A's old parent should point to B
        if (B.parent !== null) {
            if (B.parent.child1 === A) {
                B.parent.child1 = B;
            } else {
                if (box2d.ENABLE_ASSERTS) {
                    box2d.b2Assert(B.parent.child2 === A);
                }
                B.parent.child2 = B;
            }
        } else {
            this.m_root = B;
        }

        // Rotate
        if (D.height > E.height) {
            B.child2 = D;
            A.child1 = E;
            E.parent = A;
            A.aabb.Combine2(C.aabb, E.aabb);
            B.aabb.Combine2(A.aabb, D.aabb);

            A.height = 1 + box2d.b2Max(C.height, E.height);
            B.height = 1 + box2d.b2Max(A.height, D.height);
        } else {
            B.child2 = E;
            A.child1 = D;
            D.parent = A;
            A.aabb.Combine2(C.aabb, D.aabb);
            B.aabb.Combine2(A.aabb, E.aabb);

            A.height = 1 + box2d.b2Max(C.height, D.height);
            B.height = 1 + box2d.b2Max(A.height, E.height);
        }

        return B;
    }

    return A;
}

/**
 * Compute the height of the binary tree in O(N) time. Should
 * not be called often.
 * @export
 * @return {number}
 */
DynamicTree.prototype.GetHeight = function() {
    if (this.m_root === null) {
        return 0;
    }

    return this.m_root.height;
}

/**
 * Get the ratio of the sum of the node areas to the root area.
 * @export
 * @return {number}
 */
DynamicTree.prototype.GetAreaRatio = function() {
    if (this.m_root === null) {
        return 0;
    }

    /** @type {box2d.b2TreeNode} */
    var root = this.m_root;
    /** @type {number} */
    var rootArea = root.aabb.GetPerimeter();

    var GetAreaNode = function(node) {
        if (node === null) {
            return 0;
        }

        if (node.IsLeaf()) {
            return 0;
        }

        /** @type {number} */
        var area = node.aabb.GetPerimeter();
        area += GetAreaNode(node.child1);
        area += GetAreaNode(node.child2);
        return area;
    }
    /** @type {number} */
    var totalArea = GetAreaNode(this.m_root);

    /*
    float32 totalArea = 0.0;
    for (int32 i = 0; i < m_nodeCapacity; ++i)
    {
      const b2TreeNode* node = m_nodes + i;
      if (node.height < 0)
      {
        // Free node in pool
        continue;
      }
      totalArea += node.aabb.GetPerimeter();
    }
    */

    return totalArea / rootArea;
}

/**
 * Compute the height of a sub-tree.
 * @export
 * @return {number}
 * @param {box2d.b2TreeNode} node
 */
DynamicTree.prototype.ComputeHeightNode = function(node) {
    if (node.IsLeaf()) {
        return 0;
    }

    /** @type {number} */
    var height1 = this.ComputeHeightNode(node.child1);
    /** @type {number} */
    var height2 = this.ComputeHeightNode(node.child2);
    return 1 + box2d.b2Max(height1, height2);
}

/**
 * @export
 * @return {number}
 */
DynamicTree.prototype.ComputeHeight = function() {
    /** @type {number} */
    var height = this.ComputeHeightNode(this.m_root);
    return height;
}

/**
 * @export
 * @return {void}
 * @param {box2d.b2TreeNode} index
 */
DynamicTree.prototype.ValidateStructure = function(index) {
    if (index === null) {
        return;
    }

    if (index === this.m_root) {
        if (box2d.ENABLE_ASSERTS) {
            box2d.b2Assert(index.parent === null);
        }
    }

    /** @type {box2d.b2TreeNode} */
    var node = index;

    /** @type {box2d.b2TreeNode} */
    var child1 = node.child1;
    /** @type {box2d.b2TreeNode} */
    var child2 = node.child2;

    if (node.IsLeaf()) {
        if (box2d.ENABLE_ASSERTS) {
            box2d.b2Assert(child1 === null);
        }
        if (box2d.ENABLE_ASSERTS) {
            box2d.b2Assert(child2 === null);
        }
        if (box2d.ENABLE_ASSERTS) {
            box2d.b2Assert(node.height === 0);
        }
        return;
    }

    if (box2d.ENABLE_ASSERTS) {
        box2d.b2Assert(child1.parent === index);
    }
    if (box2d.ENABLE_ASSERTS) {
        box2d.b2Assert(child2.parent === index);
    }

    this.ValidateStructure(child1);
    this.ValidateStructure(child2);
}

/**
 * @export
 * @return {void}
 * @param {box2d.b2TreeNode} index
 */
DynamicTree.prototype.ValidateMetrics = function(index) {
    if (index === null) {
        return;
    }

    /** @type {box2d.b2TreeNode} */
    var node = index;

    /** @type {box2d.b2TreeNode} */
    var child1 = node.child1;
    /** @type {box2d.b2TreeNode} */
    var child2 = node.child2;

    if (node.IsLeaf()) {
        if (box2d.ENABLE_ASSERTS) {
            box2d.b2Assert(child1 === null);
        }
        if (box2d.ENABLE_ASSERTS) {
            box2d.b2Assert(child2 === null);
        }
        if (box2d.ENABLE_ASSERTS) {
            box2d.b2Assert(node.height === 0);
        }
        return;
    }

    /** @type {number} */
    var height1 = child1.height;
    /** @type {number} */
    var height2 = child2.height;
    /** @type {number} */
    var height;
    height = 1 + box2d.b2Max(height1, height2);
    if (box2d.ENABLE_ASSERTS) {
        box2d.b2Assert(node.height === height);
    }

    /** @type {box2d.b2AABB} */
    var aabb = DynamicTree.s_aabb;
    aabb.Combine2(child1.aabb, child2.aabb);

    if (box2d.ENABLE_ASSERTS) {
        box2d.b2Assert(aabb.lowerBound === node.aabb.lowerBound);
    }
    if (box2d.ENABLE_ASSERTS) {
        box2d.b2Assert(aabb.upperBound === node.aabb.upperBound);
    }

    this.ValidateMetrics(child1);
    this.ValidateMetrics(child2);
}

/**
 * Validate this tree. For testing.
 * @export
 * @return {void}
 */
DynamicTree.prototype.Validate = function() {
    this.ValidateStructure(this.m_root);
    this.ValidateMetrics(this.m_root);

    /** @type {number} */
    var freeCount = 0;
    /** @type {box2d.b2TreeNode} */
    var freeIndex = this.m_freeList;
    while (freeIndex !== null) {
        freeIndex = freeIndex.parent; //freeIndex = freeIndex.next;
        ++freeCount;
    }

    if (box2d.ENABLE_ASSERTS) {
        box2d.b2Assert(this.GetHeight() === this.ComputeHeight());
    }
}

/**
 * Get the maximum balance of an node in the tree. The balance
 * is the difference in height of the two children of a node.
 * @export
 * @return {number}
 */
DynamicTree.prototype.GetMaxBalance = function() {
    var GetMaxBalanceNode = function(node, maxBalance) {
        if (node === null) {
            return maxBalance;
        }

        if (node.height <= 1) {
            return maxBalance;
        }

        if (box2d.ENABLE_ASSERTS) {
            box2d.b2Assert(!node.IsLeaf());
        }

        /** @type {box2d.b2TreeNode} */
        var child1 = node.child1;
        /** @type {box2d.b2TreeNode} */
        var child2 = node.child2;
        /** @type {number} */
        var balance = box2d.b2Abs(child2.height - child1.height);
        return box2d.b2Max(maxBalance, balance);
    }

    /** @type {number} */
    var maxBalance = GetMaxBalanceNode(this.m_root, 0);

    /*
    int32 maxBalance = 0;
    for (int32 i = 0; i < m_nodeCapacity; ++i)
    {
      const b2TreeNode* node = m_nodes + i;
      if (node.height <= 1)
      {
        continue;
      }
      b2Assert(!node.IsLeaf());
      int32 child1 = node.child1;
      int32 child2 = node.child2;
      int32 balance = b2Abs(m_nodes[child2].height - m_nodes[child1].height);
      maxBalance = b2Max(maxBalance, balance);
    }
    */

    return maxBalance;
}

/**
 * Build an optimal tree. Very expensive. For testing.
 * @export
 * @return {void}
 */
DynamicTree.prototype.RebuildBottomUp = function() {
    /*
    int32* nodes = (int32*)b2Alloc(m_nodeCount * sizeof(int32));
    int32 count = 0;
    // Build array of leaves. Free the rest.
    for (int32 i = 0; i < m_nodeCapacity; ++i)
    {
      if (m_nodes[i].height < 0)
      {
        // free node in pool
        continue;
      }
      if (m_nodes[i].IsLeaf())
      {
        m_nodes[i].parent = b2_nullNode;
        nodes[count] = i;
        ++count;
      }
      else
      {
        FreeNode(i);
      }
    }
    while (count > 1)
    {
      float32 minCost = b2_maxFloat;
      int32 iMin = -1, jMin = -1;
      for (int32 i = 0; i < count; ++i)
      {
        b2AABB aabbi = m_nodes[nodes[i]].aabb;
        for (int32 j = i + 1; j < count; ++j)
        {
          b2AABB aabbj = m_nodes[nodes[j]].aabb;
          b2AABB b;
          b.Combine(aabbi, aabbj);
          float32 cost = b.GetPerimeter();
          if (cost < minCost)
          {
            iMin = i;
            jMin = j;
            minCost = cost;
          }
        }
      }
      int32 index1 = nodes[iMin];
      int32 index2 = nodes[jMin];
      b2TreeNode* child1 = m_nodes + index1;
      b2TreeNode* child2 = m_nodes + index2;
      int32 parentIndex = AllocateNode();
      b2TreeNode* parent = m_nodes + parentIndex;
      parent.child1 = index1;
      parent.child2 = index2;
      parent.height = 1 + b2Max(child1.height, child2.height);
      parent.aabb.Combine(child1.aabb, child2.aabb);
      parent.parent = b2_nullNode;
      child1.parent = parentIndex;
      child2.parent = parentIndex;
      nodes[jMin] = nodes[count-1];
      nodes[iMin] = parentIndex;
      --count;
    }
    m_root = nodes[0];
    b2Free(nodes);
    */

    this.Validate();
}

/**
 * Shift the world origin. Useful for large worlds.
 * The shift formula is: position -= newOrigin
 * @export
 * @param {box2d.b2Vec2} newOrigin the new origin with respect to the old origin
 * @return {void}
 */
DynamicTree.prototype.ShiftOrigin = function(newOrigin) {
    var ShiftOriginNode = function(node, newOrigin) {
        if (node === null) {
            return;
        }

        if (node.height <= 1) {
            return;
        }

        if (box2d.ENABLE_ASSERTS) {
            box2d.b2Assert(!node.IsLeaf());
        }

        /** @type {box2d.b2TreeNode} */
        var child1 = node.child1;
        /** @type {box2d.b2TreeNode} */
        var child2 = node.child2;
        ShiftOriginNode(child1, newOrigin);
        ShiftOriginNode(child2, newOrigin);

        node.aabb.lowerBound.SelfSub(newOrigin);
        node.aabb.upperBound.SelfSub(newOrigin);
    }

    ShiftOriginNode(this.m_root, newOrigin);

    /*
    // Build array of leaves. Free the rest.
    for (int32 i = 0; i < m_nodeCapacity; ++i)
    {
      m_nodes[i].aabb.lowerBound -= newOrigin;
      m_nodes[i].aabb.upperBound -= newOrigin;
    }
    */
}