class Camera {
    static position = new Vec2();
    static aabb = new AABB();
    static scale = new Vec2(1, 1);

    static nextPosition = new Vec2();
    static nextScale = new Vec2(1, 1);

    static containers = [];

    static positionSpeedStrength = 0.5;
    static scaleSpeedStrength = 0.05;

    static shakeDuration = 15;
    static shakeIntensity = 10;
    static shakeFalloff = 0.75;
    static remainingShakeDuration = 0;

    static shakeSeedHorizontal = 0;
    static shakeSeedVertical = 0;

    static cameraHeight = 1080;

    static setPosition(position) {
        Camera.nextPosition.copy(position).round();
    }

    static setPositionImmediate(position) {
        Camera.nextPosition.copy(position).round();
        Camera.position.copy(position).round();
    }

    static setScale(scale) {
        Camera.nextScale.copy(scale);
    }

    static setScaleImmediate(scale) {
        Camera.nextScale.copy(scale);
        Camera.scale.copy(scale);
    }

    static shake(intensity) {
        Camera.shakeIntensity = intensity || 15;
        Camera.remainingShakeDuration = Camera.shakeDuration;

        Camera.shakeSeedHorizontal = Math.random();
        Camera.shakeSeedVertical = Math.random();
    }

    static setSpeedProperties(strength) {
        this.positionSpeedStrength = strength;
    }

    static setScaleProperties(strength) {
        this.scaleAccel = accel;
        this.minimumScaleSpeed = minumumSpeed;
        this.maximumScaleSpeed = maximumSpeed;
        this.maximumScaleDistance = maximumScale;
    }

    static setShakeProperties(duration, falloff) {
        Camera.shakeDuration = duration;
        Camera.shakeFalloff = falloff;
    }

    static setCameraHeight(height) {
        Camera.cameraHeight = height;
    }

    static update() {
        let shakeX = 0;
        let shakeY = 0;
        if (Camera.remainingShakeDuration > 0) {
            Camera.remainingShakeDuration--;

            // its okay if progress goes past 1 because it wraps around 
            const progress = (Camera.shakeDuration - Camera.remainingShakeDuration) / 30;
            const shake = Camera.shakeIntensity - Camera.shakeIntensity * progress * Camera.shakeFalloff;

            shakeX = PerlinNoise.getNoise(Camera.shakeSeedHorizontal, progress) * shake - shake / 2;
            shakeY = PerlinNoise.getNoise(Camera.shakeSeedVertical, progress) * shake - shake / 2;
        }

        const positionDeltaX = Camera.nextPosition.x - Camera.position.x;
        const positionDeltaY = Camera.nextPosition.y - Camera.position.y;
        const positionDeltaLength = Math.sqrt(positionDeltaX * positionDeltaX + positionDeltaY * positionDeltaY);
        if (positionDeltaLength <= 0.5) {
            Camera.position.copy(Camera.nextPosition);
        } else {
            Camera.position.x += positionDeltaX * Camera.positionSpeedStrength;
            Camera.position.y += positionDeltaY * Camera.positionSpeedStrength;
        }

        const scaleDelta = Camera.nextScale.x - Camera.scale.x;
        if (Math.abs(scaleDelta) <= 0.01) {
            Camera.scale.copy(Camera.nextScale);
        } else {
            Camera.scale.x += scaleDelta * Camera.scaleSpeedStrength;
            Camera.scale.y = Camera.scale.x;
        }

        const width = window.innerWidth;
        const height = window.innerHeight;

        const heightScale = height / Camera.cameraHeight;

        const scaleX = Camera.scale.x * heightScale;
        const scaleY = Camera.scale.y * heightScale;

        Camera.aabb.x = Camera.position.x - width / 2 / scaleX + shakeX;
        Camera.aabb.y = Camera.position.y - height / 2 / scaleY + shakeY;
        Camera.aabb.width = width / scaleX;
        Camera.aabb.height = height / scaleY;

        const x = Camera.aabb.width / 2 * scaleX - Camera.position.x * scaleX;
        const y = Camera.aabb.height / 2 * scaleY - Camera.position.y * scaleY;

        for (let i = 0; i < Camera.containers.length; i++) {
            Camera.containers[i].position.x = x + shakeX;
            Camera.containers[i].position.y = y + shakeY;
            Camera.containers[i].scale.x = scaleX;
            Camera.containers[i].scale.y = scaleY;
        }
    }

    static addContainer(container) {
        Camera.containers.push(container);
    }
}