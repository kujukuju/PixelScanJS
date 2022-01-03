class Camera {
    static position = new Vec2();
    static aabb = new AABB();
    static scale = new Vec2(1, 1);

    static nextPosition = new Vec2();
    static nextScale = new Vec2(1, 1);

    static containers = [];

    static positionSpeed = 0;
    static positionAccel = 1;
    static minimumPositionSpeed = 2;
    static maximumPositionSpeed = 80;
    static maximumPositionDistance = 200;
    static scaleSpeed = 0;
    static scaleAccel = 0.001;
    static minimumScaleSpeed = 0.02;
    static maximumScaleSpeed = 0.2;
    static maximumScaleDistance = 0.5;

    static shakeDuration = 15;
    static shakeIntensity = 10;
    static shakeFalloff = 0.75;
    static remainingShakeDuration = 0;

    static shakeSeedHorizontal = 0;
    static shakeSeedVertical = 0;

    static setPosition(position) {
        Camera.nextPosition.copy(position);
    }

    static setPositionImmediate(position) {
        Camera.nextPosition.copy(position);
        Camera.position.copy(position);
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

    static setSpeedProperties(accel, minumumSpeed, maximumSpeed, maxmimuDistance) {
        this.positionAccel = accel;
        this.minimumPositionSpeed = minumumSpeed;
        this.maximumPositionSpeed = maximumSpeed;
        this.maximumPositionDistance = maxmimuDistance;
    }

    static setScaleProperties(accel, minumumSpeed, maximumSpeed, maximumScale) {
        this.scaleAccel = accel;
        this.minimumScaleSpeed = minumumSpeed;
        this.maximumScaleSpeed = maximumSpeed;
        this.maximumScaleDistance = maximumScale;
    }

    static setShakeProperties(duration, falloff) {
        Camera.shakeDuration = duration;
        Camera.shakeFalloff = falloff;
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
        const positionDeltaProgress = positionDeltaLength / Camera.maximumPositionDistance;
        const currentMaxPositionSpeed = (Math.cos(positionDeltaProgress * Math.PI * 2 + Math.PI) + 1) / 2 * (Camera.maximumPositionSpeed - Camera.minimumPositionSpeed) + Camera.minimumPositionSpeed;

        Camera.positionSpeed = Math.max(Math.min(Camera.positionSpeed + Camera.positionAccel, currentMaxPositionSpeed), Camera.minimumPositionSpeed);
        if (positionDeltaLength <= Camera.positionSpeed) {
            Camera.position.copy(Camera.nextPosition);
        } else {
            Camera.position.x += Math.sign(positionDeltaX) * Camera.positionSpeed * (Math.abs(positionDeltaX) / positionDeltaLength);
            Camera.position.y += Math.sign(positionDeltaY) * Camera.positionSpeed * (Math.abs(positionDeltaY) / positionDeltaLength);
        }

        const scaleDelta = Camera.nextScale.x - Camera.scale.x;
        const scaleDeltaProgress = Math.abs(scaleDelta) / Camera.maximumScaleDistance;
        const currentMaxScaleSpeed = (Math.cos(scaleDeltaProgress * Math.PI * 2 + Math.PI) + 1) / 2 * (Camera.maximumScaleSpeed - Camera.minimumScaleSpeed) + Camera.minimumScaleSpeed;

        Camera.scaleSpeed = Math.max(Math.min(Camera.scaleSpeed + Camera.scaleAccel, currentMaxScaleSpeed), Camera.minimumScaleSpeed);
        if (Math.abs(scaleDelta) <= Camera.scaleSpeed) {
            Camera.scale.copy(Camera.nextScale);
        } else {
            Camera.scale.x += Math.sign(scaleDelta) * Camera.scaleSpeed;
            Camera.scale.y = Camera.scale.x;
        }

        const width = window.innerWidth;
        const height = window.innerHeight;

        Camera.aabb.x = Camera.position.x - width / 2 / Camera.scale.x + shakeX;
        Camera.aabb.y = Camera.position.y - height / 2 / Camera.scale.y + shakeY;
        Camera.aabb.width = width / Camera.scale.x;
        Camera.aabb.height = height / Camera.scale.y;

        const x = Camera.aabb.width / 2 * Camera.scale.x - Camera.position.x * Camera.scale.x;
        const y = Camera.aabb.height / 2 * Camera.scale.y - Camera.position.y * Camera.scale.y;

        for (let i = 0; i < Camera.containers.length; i++) {
            Camera.containers[i].position.x = x + shakeX;
            Camera.containers[i].position.y = y + shakeY;
            Camera.containers[i].scale.x = Camera.scale.x;
            Camera.containers[i].scale.y = Camera.scale.y;
        }
    }

    static addContainer(container) {
        Camera.containers.push(container);
    }
}