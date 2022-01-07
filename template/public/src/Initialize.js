window.addEventListener('load', () => {
    Renderer.initialize();
    Environment.initialize();
    Physics.initialize();

    Loop.initialize();
});

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const Vec2 = PixelScan.Vec2;
const AABB = PixelScan.AABB;
const FramedSprite = PixelScan.FramedSprite;
const Input = PixelScan.Input;
const World = PixelScan.World;
const GroundController = PixelScan.GroundController;
const FPSTracker = PixelScan.FPSTracker;
const CPUTracker = PixelScan.CPUTracker;
const ParallaxSprite = PixelScan.ParallaxSprite;
const Camera = PixelScan.Camera;
const PerlinNoise = PixelScan.PerlinNoise;
const Hash = PixelScan.Hash;
const DebugCanvas = PixelScan.DebugCanvas;
const DynamicTree = PixelScan.DynamicTree;
