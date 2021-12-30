// const createGroundController = () => {
//     return {
//         position: new Vec2(),
//         velocity: new Vec2(),
//         jumping: false,
//         normals: [],
//         accel: 0.4,
//         friction: 0.2,
//         // the fricton that is applied on top of default friction once you've exceeded max speed
//         terminalFriction: 0.05,
//         speed: 20,
//         // the y component of the maximumly angled normal vector that you're able to walk on, default 30 degrees
//         groundNormalSlope: 0.8660254037844386,
//         // the x component of the maximumly angled normal vector that you're able to slide on, default 30 degrees
//         wallNormalSlope: 0.8660254037844386,
//         groundJumpVelocity: 20,
//         wallJumpVelocity: 40,
//     };
// };

// const applyGroundAcceleration = (controller, up, left, down, right) => {
//     let accelX = 0;
//     if (left) {
//         accelX -= controller.accel;
//     }
//     if (right) {
//         accelX += controller.accel;
//     }

//     const initialVelocityX = controller.velocity.x;
//     if (Math.abs(controller.velocity.x + accelX) <= controller.friction) {
//         controller.velocity.x = 0;
//     } else {
//         controller.velocity.x += accelX;
//         controller.velocity.x -= Math.sign(controller.velocity.x) * controller.friction;
//     }

//     if (Math.abs(initialVelocityX) > controller.speed && Math.abs(controller.velocity.x) > controller.speed) {
//         if (Math.abs(controller.velocity.x) > Math.abs(initialVelocityX)) {
//             // in this scenario we want to match the previously applied acceleration to the friciton to only cancel it out, then apply the terminal friction on top
//             controller.velocity.x -= (accelX - Math.sign(accelX) * controller.friction);
//         }

//         if (Math.abs(controller.velocity.x) - controller.terminalFriction <= controller.speed) {
//             // because we're able to go past the max speed using the terminal friction we only adjust to the max speed
//             controller.velocity.x = Math.sign(controller.velocity.x) * controller.speed;
//         } else {
//             controller.velocity.x -= Math.sign(controller.velocity.x) * controller.terminalFriction;
//         }
//     } else if (Math.abs(controller.velocity.x) > controller.speed) {
//         // if this scenario we want to slow you down to the maximum speed because we were the ones that applied you to be above it
//         controller.velocity.x = Math.sign(controller.velocity.x) * controller.speed;
//     }

//     // clear the jumping flag if you're not jumping
//     if (controller.jumping) {
//         for (let i = 0; i < controller.normals.length; i++) {
//             if (controller.normals[i].y >= controller.groundNormalSlope) {
//                 controller.jumping = false;
//                 break;
//             }
            
//             if (controller.normals[i].x >= controller.wallNormalSlope) {
//                 controller.jumping = false;
//                 break;
//             }

//             if (controller.normals[i].x <= -controller.wallNormalSlope) {
//                 controller.jumping = false;
//                 break;
//             }
//         }
//     }

//     // jump if you're trying to and able to
//     if (!controller.jumping && up) {
//         let ground = false;
//         let leftWall = false;
//         let rightWall = false;
//         for (let i = 0; i < controller.normals.length; i++) {
//             if (controller.normals[i].y >= controller.groundNormalSlope) {
//                 ground = true;
//             }
            
//             if (controller.normals[i].x >= controller.wallNormalSlope) {
//                 rightWall = true;
//             }

//             if (controller.normals[i].x <= -controller.wallNormalSlope) {
//                 leftWall = true;
//             }
//         }

//         if (ground || leftWall || rightWall) {
//             const jumpVelocity = (leftWall || rightWall) ? controller.wallJumpVelocity : controller.groundJumpVelocity;
//             let jumpDirectionX = 0;
//             let jumpDirectionY = 0;

//             if (ground) {
//                 jumpDirectionY = -1;
//             } else if (leftWall && rightWall) {
//                 jumpDirectionY = -1;
//             } else if (leftWall) {
//                 jumpDirectionX = 0.5;
//                 jumpDirectionY = -0.8660254037844386;
//             } else if (rightWall) {
//                 jumpDirectionX = -0.5;
//                 jumpDirectionY = -0.8660254037844386;
//             }

//             controller.jumping = true;
//             controller.velocity.x += jumpDirectionX * jumpVelocity;
//             controller.velocity.y = jumpDirectionY * jumpVelocity;
//         }
//     }
// };