class WaterShader extends PIXI.Filter {
    static NOISE_TEXTURE = PIXI.Texture.from('assets/simple-noise.png', {wrapMode: PIXI.WRAP_MODES.REPEAT, scaleMode: PIXI.SCALE_MODES.LINEAR, mipmap: PIXI.MIPMAP_MODES.ON, type: PIXI.TYPES.UNSIGNED_BYTE});
    static HIGHLIGHT_TEXTURE = PIXI.Texture.from('assets/highlights.png', {wrapMode: PIXI.WRAP_MODES.REPEAT, scaleMode: PIXI.SCALE_MODES.LINEAR, mipmap: PIXI.MIPMAP_MODES.ON});

    static FRAG_SRC = `
    varying vec2 vTextureCoord;
    
    uniform sampler2D uSampler;
    uniform vec4 inputPixel;

    uniform float uTime;
    uniform sampler2D uNoiseSampler;
    uniform sampler2D uHighlights;
    uniform vec2 uOffset;
    uniform float uOpacity;
    uniform float uStrength;
    uniform float uScale;
    uniform float uSpeed;

    float avg(vec4 color) {
        return (color.r + color.g + color.b) / 3.0;
    }

    void main(void) {
        float time = uTime / 60.0;
     
        vec2 uv = vec2(vTextureCoord.x, 1.0 - vTextureCoord.y) + uOffset / inputPixel.xy;
        vec2 scaledUv = uv * uScale * inputPixel.xy / 1200.0;
    
        vec4 water1 = vec4(texture2D(uNoiseSampler, scaledUv + time * uSpeed * 0.02 - 0.1 + vec2(0.0, 0.5)).rgb / 3.0, 1.0);
        vec4 water2 = vec4(texture2D(uNoiseSampler, scaledUv + time * uSpeed * -0.02 + 0.1).rgb / 3.0, 1.0);
        
        vec4 highlights1 = vec4(texture2D(uHighlights, scaledUv + time * uSpeed / vec2(-10, 100) + vec2(0.0, 0.5)).rgb / 3.0, 1.0);
        vec4 highlights2 = vec4(texture2D(uHighlights, scaledUv + time * uSpeed / vec2(10, 100)).rgb / 3.0, 1.0);
        
        vec4 background = texture2D(uSampler, vTextureCoord + avg(water1) * 0.05 * uStrength);
        
        water1.rgb = vec3(avg(water1));
        water2.rgb = vec3(avg(water2));
        
        highlights1.rgb = vec3(avg(highlights1) / 1.5);
        highlights2.rgb = vec3(avg(highlights2) / 1.5);
        
        float alpha = uOpacity;
        
        if (avg(water1 + water2) > 0.3) {
            alpha = 0.0;
        }
        
        if (avg(water1 + water2 + highlights1 + highlights2) > 0.85) {
            alpha = 5.0 * uOpacity;
        }

        gl_FragColor = (water1 + water2) * alpha + background;
    }
    `;

    constructor() {
        super(null, WaterShader.FRAG_SRC, {
            uTime: 0.0,
            uNoiseSampler: WaterShader.NOISE_TEXTURE,
            uHighlights: WaterShader.HIGHLIGHT_TEXTURE,
            uOffset: new Float32Array([0, 0]),
            uOpacity: 0.5,
            uStrength: 1.0,
            uScale: 1.5,
            uSpeed: 0.8,
        });

        this.autoFit = false;
    }

    getTime() {
        return this.uniforms.uTime;
    }

    setTime(time) {
        this.uniforms.uTime = time;
    }

    getOffset() {
        return new Vec2(this.uniforms.uOffset[0], this.uniforms.uOffset[1]);
    }

    setOffset(offset) {
        this.uniforms.uOffset[0] = offset.x;
        this.uniforms.uOffset[1] = offset.y;
    }

    getOpacity() {
        return this.uniforms.uOpacity;
    }

    setOpacity(opacity) {
        this.uniforms.uOpacity = opacity;
    }

    getStrength() {
        return this.uniforms.uStrength;
    }

    setStrength(strength) {
        this.uniforms.uStrength = strength;
    }

    getScale() {
        return this.uniforms.uScale;
    }

    setScale(scale) {
        this.uniforms.uScale = scale;
    }

    getSpeed() {
        return this.uniforms.uSpeed;
    }

    setSpeed(speed) {
        this.uniforms.uSpeed = speed;
    }
}