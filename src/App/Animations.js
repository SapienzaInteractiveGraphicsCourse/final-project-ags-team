import { TWEEN } from "../three/libs/tween.module.min.js";

/*  Make the robot say yes: Rotation along the x axis
    Reach value -Pi/8 then Pi/8
    Repeat and then go back to the initial position 
*/

export function yesTween(robot) {
    new TWEEN.Tween(robot.neck.rotation)
        .to({ x: -Math.PI / 8 }, 150)
        .easing(TWEEN.Easing.Linear.None)
        .onComplete(() => {
            new TWEEN.Tween(robot.neck.rotation)
                .to({ x: Math.PI / 8 }, 150)
                .easing(TWEEN.Easing.Linear.None)
                .onComplete(() => {
                    new TWEEN.Tween(robot.neck.rotation)
                        .to({ x: -Math.PI / 8 }, 150)
                        .easing(TWEEN.Easing.Linear.None)
                        .onComplete(() => {
                            new TWEEN.Tween(robot.neck.rotation)
                                .to({ x: Math.PI / 8 }, 150)
                                .easing(TWEEN.Easing.Linear.None)
                                .onComplete(() => {
                                    new TWEEN.Tween(robot.neck.rotation)
                                        .to({ x: 0 }, 100)
                                        .easing(TWEEN.Easing.Quadratic.Out)
                                        .start();
                                })
                                .start();
                        })
                        .start();
                })
                .start();
        })
        .start();
}

/*  Make the robot say no: Rotation along the y axis
    Reach value -Pi/8 then Pi/8
    Repeat and then go back to the initial position 
*/
export function noTween(robot) {
    new TWEEN.Tween(robot.neck.rotation)
        .to({ y: -Math.PI / 8 }, 150)
        .easing(TWEEN.Easing.Linear.None)
        .onComplete(() => {
            new TWEEN.Tween(robot.neck.rotation)
                .to({ y: Math.PI / 8 }, 150)
                .easing(TWEEN.Easing.Linear.None)
                .onComplete(() => {
                    new TWEEN.Tween(robot.neck.rotation)
                        .to({ y: -Math.PI / 8 }, 150)
                        .easing(TWEEN.Easing.Linear.None)
                        .onComplete(() => {
                            new TWEEN.Tween(robot.neck.rotation)
                                .to({ y: Math.PI / 8 }, 150)
                                .easing(TWEEN.Easing.Linear.None)
                                .onComplete(() => {
                                    new TWEEN.Tween(robot.neck.rotation)
                                        .to({ y: 0 }, 100)
                                        .easing(TWEEN.Easing.Quadratic.Out)
                                        .start();
                                })
                                .start();
                        })
                        .start();
                })
                .start();
        })
        .start();
}


/*  Animation coupled with the challenge involving the bin:
    The robot has to lean forward and then go back to the initial position
*/
export function leanTween(robot, angle) {
    const oldXRotL = robot.upperLegL.rotation.x;
    const oldXRotR = robot.upperLegR.rotation.x;
    new TWEEN.Tween(robot.body.rotation)
        .to({ x: angle })
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
    if (angle === 0) {
        new TWEEN.Tween(robot.upperLegL.rotation)
            .to({ x: oldXRotL })
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
        new TWEEN.Tween(robot.upperLegR.rotation)
            .to({ x: oldXRotR })
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
    }
    else {
        /*if (angle === 0) {
            new TWEEN.Tween(robot.footL.position)
                .to({ z: 0.000570146774407476 })
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();
            new TWEEN.Tween(robot.footR.position)
                .to({ z: 0.000570139964111149 })
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();
    
        }
        else {
            new TWEEN.Tween(robot.footL.position)
                .to({ z: -0.0044 })
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();
            new TWEEN.Tween(robot.footR.position)
                .to({ z: -0.0044 })
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();
        }
    */

        new TWEEN.Tween(robot.upperLegL.rotation)
            .to({ x: 2.4863 })
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
        new TWEEN.Tween(robot.upperLegR.rotation)
            .to({ x: 2.3863 })
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
    }

    //return tween;
}

//IDLE: head turned
export function neckTween(robot) {

    const num = Math.floor(Math.random() * 100) + 1;
    console.log(num);

    if (num > 0 && num <= 20) {
        let tween = new TWEEN.Tween(robot.neck.rotation)
            .to({ y: Math.PI / 8 }, 500)
            .easing(TWEEN.Easing.Bounce.InOut)
            .onComplete(() => {
                new TWEEN.Tween(robot.neck.rotation)
                    .to({ y: 0 }, 500)
                    .easing(TWEEN.Easing.Bounce.InOut)
                    .start();
            });
        return tween;
    }
    else if (num > 20 && num <= 40) {
        let tween = new TWEEN.Tween(robot.neck.rotation)
            .to({ y: -Math.PI / 8 }, 500)
            .easing(TWEEN.Easing.Bounce.InOut)
            .onComplete(() => {
                new TWEEN.Tween(robot.neck.rotation)
                    .to({ y: 0 }, 250)
                    .easing(TWEEN.Easing.Bounce.InOut)
                    .start();
            });
        return tween;
    }
    else if (num > 40 && num <= 60) {
        let tween = new TWEEN.Tween(robot.neck.rotation)
            .to({ y: Math.PI / 8 }, 500)
            .easing(TWEEN.Easing.Linear.None)
            .onComplete(() => {
                new TWEEN.Tween(robot.neck.rotation)
                    .to({ y: 0 }, 500)
                    .easing(TWEEN.Easing.Linear.None)
                    .start();
            });
        return tween;
    }
    else if (num > 60 && num <= 80) {
        let tween = new TWEEN.Tween(robot.neck.rotation)
            .to({ y: -Math.PI / 8 }, 500)
            .easing(TWEEN.Easing.Linear.None)
            .onComplete(() => {
                new TWEEN.Tween(robot.neck.rotation)
                    .to({ y: 0 }, 250)
                    .easing(TWEEN.Easing.Linear.None)
                    .start();
            });
        return tween;
    }
    else if (num > 80 && num <= 100) {
        let tween = new TWEEN.Tween(robot.neck.rotation)
            .to({ z: (-30 * Math.PI) / 180 }, 500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(() => {
                new TWEEN.Tween(robot.neck.rotation)
                    .to({ z: 0.05532293059308308 }, 250)
                    .easing(TWEEN.Easing.Linear.None)
                    .start();
            });
        return tween;
    }

}

//IDLE: Body moved down
export function idleBodyTween(robot) {
    let tween = new TWEEN.Tween(robot.body.position)
        .to({ y: 0.0129 }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(() => {
            new TWEEN.Tween(robot.body.position)
                .to({ y: 0.01378 }, 500)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .start();
        });
    return tween;
}

//IDLE: Bend the knee
export function idleLeftUpperLegTween(robot) {
    let tween = new TWEEN.Tween(robot.upperLegL.rotation)
        .to({ x: 2.7 }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(() => {
            new TWEEN.Tween(robot.upperLegL.rotation)
                .to({ x: 2.74795 }, 500)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();
        });
    return tween;
}

//IDLE: Bend the knee
export function idleLeftLowerLegTween(robot) {
    let tween = new TWEEN.Tween(robot.lowerLegL.rotation)
        .to({ x: 0.8, y: 0.1311 }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(() => {
            new TWEEN.Tween(robot.lowerLegL.rotation)
                .to({ x: 0.71575 }, 500)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();
        });
    return tween;
}

//IDLE: Bend the knee
export function idleRightUpperLegTween(robot) {
    let tween = new TWEEN.Tween(robot.upperLegR.rotation)
        .to({ x: 2.7 }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(() => {
            new TWEEN.Tween(robot.upperLegR.rotation)
                .to({ x: 2.74795 }, 500)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();
        });
    return tween;
}

//IDLE: Bend the knee
export function idleRightLowerLegTween(robot) {
    let tween = new TWEEN.Tween(robot.lowerLegR.rotation)
        .to({ x: 0.8 }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(() => {
            new TWEEN.Tween(robot.lowerLegR.rotation)
                .to({ x: 0.71575 }, 500)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();
        });
    return tween;
}

//Rotate the right shoulder for the jump
export function rightArmJumpTween(robot) {

    let tween = new TWEEN.Tween(robot.shoulderR.rotation)
        .to({ x: -1.5456 }, 700)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onComplete(() =>

            new TWEEN.Tween(robot.shoulderR.rotation)
                .to({ x: 0 }, 700)
                .easing(TWEEN.Easing.Cubic.InOut)
                .start()
        );

    return tween;
}

//Rotate the left shoulder for the jump
export function leftArmJumpTween(robot) {
    let tween = new TWEEN.Tween(robot.shoulderL.rotation)
        .to({ x: -1.6456 }, 700)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onComplete(() =>
            new TWEEN.Tween(robot.shoulderL.rotation)
                .to({ x: 0 }, 700)
                .easing(TWEEN.Easing.Cubic.InOut)
                .start()
        );
    return tween;
}

// Handles the turn of the robot to the right
export function turnRightTween(robot) {
    // console.log("right")
    let tween = new TWEEN.Tween(robot.rootNode.rotation)
        .to({ y: Math.PI / 2 }, 100)
        .easing(TWEEN.Easing.Cubic.Out);
    return tween;
}

// Handles the turn of the robot to the left
export function turnLeftTween(robot) {
    // console.log("left")
    let tween = new TWEEN.Tween(robot.rootNode.rotation)
        .to({ y: -Math.PI / 2 }, 100)
        .easing(TWEEN.Easing.Cubic.Out);
    return tween;
}

// Handles the turn of the robot to the front
export function turnFrontTween(robot) {
    // console.log("front")
    let tween = new TWEEN.Tween(robot.rootNode.rotation)
        .to({ y: 0 }, 100)
        .easing(TWEEN.Easing.Cubic.Out);
    return tween;
}

// Handles the turn of the robot to the back
export function turnBackTween(robot) {
    // console.log("back")
    let tween = new TWEEN.Tween(robot.rootNode.rotation)
        .to({ y: Math.PI }, 100)
        .easing(TWEEN.Easing.Cubic.Out);
    return tween;
}

//Function that starts the animation for the thumbs up
export function thumbsUpTween(robot) {

    let tween = new TWEEN.Tween(robot.upperArmR.rotation)
        .to({ x: (-120 * Math.PI) / 180, y: Math.PI / 4 }, 400)
        .easing(TWEEN.Easing.Linear.None)
        .onComplete(() => {
            new TWEEN.Tween(robot.neck.rotation)
                .to({ z: (-30 * Math.PI) / 180 }, 200)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onComplete(() => {

                    //Fingers except thumb closed to make the hand a fist
                    new TWEEN.Tween(robot.ring1R.rotation)
                        .to({ z: 0 }, 150)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .start();

                    new TWEEN.Tween(robot.middle1R.rotation)
                        .to({ z: (110 * Math.PI) / 180 }, 150)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .start();

                    new TWEEN.Tween(robot.indexR.rotation)
                        .to({ z: 0 }, 150)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .start();

                    //Thumb's parts rotated to make the thumb up
                    new TWEEN.Tween(robot.thumbR.rotation)
                        .to({ y: -Math.PI / 2 }, 150)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .start();

                    new TWEEN.Tween(robot.thumb2R.rotation)
                        .to({ x: -Math.PI, z: (-190 * Math.PI) / 180 }, 150)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .onComplete(() => {
                            let t = thumbsDownTween(robot);
                            t.delay(500);
                            t.start();
                        })
                        .start();

                })
                .start();
        });
    return tween;
}

//Function that starts the animation for the robot to go to the initial position after the thumb up
export function thumbsDownTween(robot) {

    let tween = new TWEEN.Tween(robot.neck.rotation)
        .to({ z: 0.05532293059308308 }, 200)
        .easing(TWEEN.Easing.Linear.None)
        .onComplete(() => {

            new TWEEN.Tween(robot.upperArmR.rotation)
                .to({ x: -3.00467658726543, y: 1.2647589033354352 }, 400)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onComplete(() => {

                    new TWEEN.Tween(robot.ring1R.rotation)
                        .to({ z: -0.9430903747676498 }, 150)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .start();

                    new TWEEN.Tween(robot.middle1R.rotation)
                        .to({ z: 1.1048657896799357 }, 150)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .start();

                    new TWEEN.Tween(robot.indexR.rotation)
                        .to({ z: -0.9294445756102357 }, 150)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .start();

                    new TWEEN.Tween(robot.thumbR.rotation)
                        .to({ y: -0.9211440514236585 }, 150)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .start();

                    new TWEEN.Tween(robot.thumb2R.rotation)
                        .to({ x: -1.717841085700298, z: -2.950171639213023 }, 150)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .start();

                })
                .start();
        });
    return tween;
}

export function bodyDanceTween(robot) {

    new TWEEN.Tween(robot.body.rotation)
        .to({ x: 0.1561 }, 1000)
        .easing(TWEEN.Easing.Linear.None)
        .start();

    new TWEEN.Tween(robot.upperLegL.rotation)
        .to({ x: 2.8087, y: -0.1433, z: -0.029 }, 1000)
        .easing(TWEEN.Easing.Linear.None)
        .start();

    new TWEEN.Tween(robot.upperLegR.rotation)
        .to({ x: 2.8183, y: 0.1024, z: 0.0131 }, 1000)
        .easing(TWEEN.Easing.Linear.None)
        .start();

    new TWEEN.Tween(robot.lowerLegL.rotation)
        .to({ x: 0.3428, y: 0.1535, z: 0.0352 }, 1000)
        .easing(TWEEN.Easing.Linear.None)
        .start();

    new TWEEN.Tween(robot.lowerLegR.rotation)
        .to({ x: 0.3907, y: -0.0446, z: 3.4373933246063144e-7 }, 1000)
        .easing(TWEEN.Easing.Linear.None)
        .onComplete(() => {
            new TWEEN.Tween(robot.neck.rotation) //testa
                .to({ x: -0.1653, y: 0.1911, z: 0.2957 }, 200)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onComplete(() => {
                    new TWEEN.Tween(robot.shoulderR.rotation)
                        .to({ x: -0.10898371808911646, y: -6.598976085917453e-7, z: 1.5613, }, 200)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .start();

                    new TWEEN.Tween(robot.shoulderL.rotation)
                        .to({ x: -0.10898371808911646, y: -0.2156, z: -1.5331, }, 200)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .start();

                    new TWEEN.Tween(robot.lowerArmL.rotation)
                        .to({ x: 3.0617, z: -3.141592653589793 }, 200)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .onComplete(() => {
                            new TWEEN.Tween(robot.lowerArmL.rotation)
                                .to({ x: 1.5427, y: 0.1043, z: -3.013 }, 1000)
                                .easing(TWEEN.Easing.Bounce.Out)
                                .start();
                        })
                        .start();

                    new TWEEN.Tween(robot.lowerArmR.rotation)
                        .to({ x: 3.141592653589793, y: -0.2156, z: 3.141592653589793, }, 200)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .onComplete(() => {
                            new TWEEN.Tween(robot.lowerArmR.rotation)
                                .to({ x: 1.598, y: -0.4552 }, 1000)
                                .easing(TWEEN.Easing.Bounce.Out)
                                .onComplete(() => {
                                    new TWEEN.Tween(robot.neck.rotation)
                                        .to({ x: -0.1653, z: 0.05532293059308308, }, 1000)
                                        .easing(TWEEN.Easing.Quadratic.Out)
                                        .onComplete(() => {
                                            new TWEEN.Tween(robot.neck.rotation)
                                                .to({ y: -2 * Math.PI }, 500)
                                                .easing(TWEEN.Easing.Quadratic.Out)
                                                .onComplete(() => {
                                                    new TWEEN.Tween(robot.body.rotation)
                                                        .to({ x: 2.1138427250003886e-36, }, 800)
                                                        .easing(TWEEN.Easing.Linear.None)
                                                        .start();

                                                    new TWEEN.Tween(robot.upperLegL.rotation)
                                                        .to({ x: 2.7479580378393664, y: -0.1554260117378598, z: -0.07532355032937453, }, 800)
                                                        .easing(TWEEN.Easing.Linear.None)
                                                        .start();

                                                    new TWEEN.Tween(robot.upperLegR.rotation)
                                                        .to({ x: 2.7391203645467432, y: 0.2547631701687732, z: 0.11865935999323499, }, 800)
                                                        .easing(TWEEN.Easing.Linear.None)
                                                        .start();

                                                    new TWEEN.Tween(robot.lowerLegL.rotation)
                                                        .to({ x: 0.7157526204231796, y: 1.630727074138696e-7, z: -2.2818463770589156e-7, }, 800)
                                                        .easing(TWEEN.Easing.Linear.None)
                                                        .start();

                                                    new TWEEN.Tween(robot.lowerLegR.rotation)
                                                        .to({ x: 0.715752620423293, y: -4.961868483732194e-7, z: 3.4373933246063144e-7, }, 800)
                                                        .easing(TWEEN.Easing.Linear.None)
                                                        .start();

                                                    new TWEEN.Tween(robot.neck.rotation)
                                                        .to({ x: -0.08598086606694484, z: 0.05532293059308308, }, 800)
                                                        .easing(TWEEN.Easing.Quadratic.Out)
                                                        //Qui è il problema
                                                        .start();

                                                    new TWEEN.Tween(robot.shoulderR.rotation)
                                                        .to({ x: -0.10898371808911646, y: -6.598976085917453e-7, z: 2.686421566968824, }, 800)
                                                        .easing(TWEEN.Easing.Quadratic.Out)
                                                        .start();

                                                    new TWEEN.Tween(robot.shoulderL.rotation)
                                                        .to({ x: -0.10898229518839646, y: -0.000001107503889347332, z: -2.71796254738819, }, 800)
                                                        .easing(TWEEN.Easing.Quadratic.Out)
                                                        .start();

                                                    new TWEEN.Tween(robot.lowerArmL.rotation)
                                                        .to({ x: 1.2070851479241527, y: 0.5176693038981423, z: -1.2969990028508354, }, 800)
                                                        .easing(TWEEN.Easing.Quadratic.Out)
                                                        .start();

                                                    new TWEEN.Tween(robot.lowerArmR.rotation)
                                                        .to({ x: 1.5924057846474595, y: -1.0731507461813292, z: 1.8341744463831946, }, 800)
                                                        .easing(TWEEN.Easing.Quadratic.Out)
                                                        .start();
                                                })
                                                .start();
                                        })
                                        .start();
                                })
                                .start();
                        })
                        .start();
                })
                .start();
        })
        .start();
}

export function waveFinishTween(robot) {
    new TWEEN.Tween(robot.shoulderR.rotation)
        .to({ x: -0.10898371808911646, y: -6.598976085917453e-7, z: 2.686421566968824, }, 800)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

    new TWEEN.Tween(robot.upperArmR.rotation)
        .to({ x: -3.00467658726543, y: 1.2647589033354352, z: -3.133786251177098, }, 800)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

    new TWEEN.Tween(robot.lowerArmR.rotation)
        .to({ x: 1.5924057846474595, y: -1.0731507461813292, z: 1.8341744463831946, }, 800)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

    new TWEEN.Tween(robot.neck.rotation)
        .to(
            { x: -0.08598086606694484, y: -0.030781048113647718, z: 0.05532293059308308, }, 800)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

    new TWEEN.Tween(robot.ring1R.rotation) //mignolo
        .to({ x: 2.0308031237629196, y: 0.9080663435840112, z: -0.9430903747676498, }, 150)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

    new TWEEN.Tween(robot.ring2R.rotation) //mignolo
        .to({ x: 0.2314505243580185, y: 0.16359926060669314, z: 0.8729432557646827, }, 150)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

    new TWEEN.Tween(robot.middle1R.rotation) //mignolo
        .to({ x: -0.06356590149694044, y: -0.06346705740446676, z: 1.1048657896799357, }, 150)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

    new TWEEN.Tween(robot.middle2R.rotation) //mignolo
        .to({ x: 0.09968116913559923, y: -0.03203014545859623, z: 1.061314611564705, }, 150)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

    new TWEEN.Tween(robot.indexR.rotation) //mignolo
        .to({ x: -1.9068990040299865, y: -1.0366460832544102, z: -0.9294445756102357, }, 150)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

    new TWEEN.Tween(robot.index2R.rotation) //mignolo
        .to({ x: -0.05851721796114638, y: -0.06463397545402096, z: 1.109980777526842, }, 150)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

    new TWEEN.Tween(robot.thumbR.rotation) //mignolo
        .to({ x: 2.8878214068890493, y: -0.9211440514236585, z: 1.3133193709709825, }, 150)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

    new TWEEN.Tween(robot.thumb2R.rotation) //mignolo
        .to({ x: -1.717841085700298, y: -0.639071107342826, z: -2.950171639213023, }, 150)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
}

export function waveTween(robot) {
    new TWEEN.Tween(robot.shoulderR.rotation)
        .to({ z: 1.5635 }, 800)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

    new TWEEN.Tween(robot.upperArmR.rotation)
        .to({ y: -0.5352, z: -3.141592653589793 }, 800)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(() => {

            new TWEEN.Tween(robot.lowerArmR.rotation)
                .to({ y: -1.0954 }, 800)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();

            new TWEEN.Tween(robot.neck.rotation)
                .to({ z: -0.2154 }, 800)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onComplete(() => {

                    new TWEEN.Tween(robot.ring1R.rotation) //mignolo
                        .to({ x: 2.0308031237629196, y: 0.9080663435840112, z: -2.3735, }, 150)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .start();

                    new TWEEN.Tween(robot.ring2R.rotation) //mignolo
                        .to({ x: -0.1219, y: -0.0766, z: 0.0899 }, 150)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .start();

                    new TWEEN.Tween(robot.middle1R.rotation) //mignolo
                        .to({ x: -0.06356590149694044, y: -0.06346705740446676, z: -0.0904, }, 150)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .start();

                    new TWEEN.Tween(robot.middle2R.rotation) //mignolo
                        .to({ x: 0.09968116913559923, y: -0.03203014545859623, z: 0.2639, }, 150)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .start();

                    new TWEEN.Tween(robot.indexR.rotation) //mignolo
                        .to({ x: -1.9068990040299865, y: -1.1349, z: -2.0538, }, 150)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .start();

                    new TWEEN.Tween(robot.index2R.rotation) //mignolo
                        .to({ x: -0.05851721796114638, y: -0.06463397545402096, z: 0.0451, }, 150)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .start();

                    new TWEEN.Tween(robot.thumbR.rotation) //mignolo
                        .to({ x: 2.8878214068890493, y: -1.7593, z: 1.5259, }, 150)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .start();

                    new TWEEN.Tween(robot.thumb2R.rotation) //mignolo
                        .to({ x: -2.8186, y: -0.8862, z: -2.9733 }, 150)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .start();

                    new TWEEN.Tween(robot.lowerArmR.rotation)
                        .to({ y: -0.4556 }, 200)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .onComplete(() => {

                            new TWEEN.Tween(robot.lowerArmR.rotation)
                                .to({ y: -1.0962 }, 200)
                                .easing(TWEEN.Easing.Quadratic.Out)
                                .onComplete(() => {

                                    new TWEEN.Tween(robot.lowerArmR.rotation)
                                        .to({ y: -0.4556 }, 200)
                                        .easing(TWEEN.Easing.Quadratic.Out)
                                        .onComplete(() => {

                                            new TWEEN.Tween(robot.lowerArmR.rotation)
                                                .to({ y: -1.0962 }, 200)
                                                .easing(TWEEN.Easing.Quadratic.Out)
                                                .onComplete(() => {

                                                    new TWEEN.Tween(robot.lowerArmR.rotation)
                                                        .to({ y: -0.4556 }, 200)
                                                        .easing(TWEEN.Easing.Quadratic.Out)
                                                        .onComplete(() => {

                                                            new TWEEN.Tween(robot.lowerArmR.rotation)
                                                                .to({ y: -1.0962, }, 200)
                                                                .easing(TWEEN.Easing.Quadratic.Out)
                                                                .onComplete(
                                                                    () => {
                                                                        waveFinishTween(robot);
                                                                    }
                                                                )
                                                                .start();
                                                        })
                                                        .start();
                                                })
                                                .start();
                                        })
                                        .start();
                                })
                                .start();
                        })
                        .start();
                })
                .start();
        })
        .start();
}


export function rightToBackWalkTween(robot) {
    //Back

    new TWEEN.Tween(robot.upperArmL.rotation)
        .to({ x: 0.0686 }, 400 / 2)
        .easing(TWEEN.Easing.Linear.None)
        .start();
    new TWEEN.Tween(robot.upperLegR.rotation)
        .to({ x: 3.4, y: -0.0036, z: 0.0183 }, 400 / 2)
        .easing(TWEEN.Easing.Linear.None)
        .start();
    new TWEEN.Tween(robot.footR.position)
        .to({ x: -0.0066, y: 0.0012, z: -0.0059 }, 400 / 2)
        .easing(TWEEN.Easing.Linear.None)
        .start();
    new TWEEN.Tween(robot.footR.rotation)
        .to({ x: -1.4369 }, 400 / 2)
        .easing(TWEEN.Easing.Linear.None)
        .start();
    new TWEEN.Tween(robot.lowerLegR.rotation)
        .to({ x: 0.6162 }, 400 / 2)
        .easing(TWEEN.Easing.Linear.None)

        .onComplete(() => {
            //INITIAL POSITION
            new TWEEN.Tween(robot.upperArmL.rotation)
                .to({ x: 0.3844815830256843 }, 400 / 2)
                .easing(TWEEN.Easing.Linear.None)
                .start();
            new TWEEN.Tween(robot.upperLegR.rotation)
                .to({ x: 2.7391203645467432, y: 0.2547631701687732, z: 0.11865935999323499 }, 400 / 2)
                .easing(TWEEN.Easing.Linear.None)
                .start();
            new TWEEN.Tween(robot.footR.position)
                .to({ x: -0.00636880612000823, y: 0.000305792083963752, z: 0.000570139964111149 }, 400 / 2)
                .easing(TWEEN.Easing.Linear.None)
                .start();
            new TWEEN.Tween(robot.footR.rotation)
                .to({ x: -1.5383691568853148 }, 400 / 2)
                .easing(TWEEN.Easing.Linear.None)
                .start();
            new TWEEN.Tween(robot.lowerLegR.rotation)
                .to({ x: 0.715752620423293, y: -4.961868483732194e-7, z: 3.4373933246063144e-7 }, 400 / 2)
                .easing(TWEEN.Easing.Linear.None)
                .start();
        })
        .start();

}

export function leftToBackWalkTween(robot) {
    new TWEEN.Tween(robot.upperArmR.rotation)
        .to({ x: -3.5 }, 400 / 2)
        .easing(TWEEN.Easing.Linear.None)
        .start();

    new TWEEN.Tween(robot.upperLegL.rotation)
        .to({ x: 3.3, y: 0.0315, z: -0.0448 }, 400 / 2)
        .easing(TWEEN.Easing.Linear.None)
        .start();

    new TWEEN.Tween(robot.footL.position)
        .to({ x: 0.007, y: 0.0012, z: -0.0066 }, 400 / 2)
        .easing(TWEEN.Easing.Linear.None)
        .start();

    new TWEEN.Tween(robot.footL.rotation)
        .to({ x: -1.4369 }, 400 / 2)
        .easing(TWEEN.Easing.Linear.None)
        .start();

    new TWEEN.Tween(robot.lowerLegL.rotation)
        .to({ x: 0.7, y: 1.630727074138696e-7, z: -2.2818463770589156e-7 }, 400 / 2)
        .easing(TWEEN.Easing.Linear.None)
        .onComplete(() => {

            new TWEEN.Tween(robot.upperArmR.rotation)
                .to({ x: -3.00467658726543 }, 400 / 2)
                .easing(TWEEN.Easing.Linear.None)
                .start();

            new TWEEN.Tween(robot.upperLegL.rotation)
                .to({ x: 2.7479580378393664, y: -0.1554260117378598, z: -0.07532355032937453 }, 400 / 2)
                .easing(TWEEN.Easing.Linear.None)
                .start();

            new TWEEN.Tween(robot.footL.position)
                .to({ x: 0.00636722007766366, y: 0.0004, z: 0.000570146774407476 }, 400 / 2)
                .easing(TWEEN.Easing.Linear.None)
                .start();

            new TWEEN.Tween(robot.footL.rotation)
                .to({ x: -1.5383691568848288 }, 400 / 2)
                .easing(TWEEN.Easing.Linear.None)
                .start();

            new TWEEN.Tween(robot.lowerLegL.rotation)
                .to({ x: 0.7157526204231796, y: 1.630727074138696e-7, z: -2.2818463770589156e-7 }, 400 / 2)
                .easing(TWEEN.Easing.Linear.None)
                .start();
        })
        .start();
}


export function rightToFrontWalkTween(robot) {

    new TWEEN.Tween(robot.upperArmL.rotation)
        .to({ x: 0.6638 }, 350 / 2)
        .easing(TWEEN.Easing.Linear.None)
        .start();

    new TWEEN.Tween(robot.upperLegR.rotation)
        .to({ x: 2.2819 }, 350 / 2)
        .easing(TWEEN.Easing.Linear.None)
        .start();

    new TWEEN.Tween(robot.footR.position)
        .to({ y: 0.0012, z: 0.0066 }, 350 / 2)
        .easing(TWEEN.Easing.Linear.None)
        .start();

    new TWEEN.Tween(robot.footR.rotation)
        .to({ x: -1.7073 }, 350 / 2)
        .easing(TWEEN.Easing.Linear.None)
        .onComplete(() => {

            new TWEEN.Tween(robot.footR.rotation)
                .to({ x: -1.4369 }, 100 / 2)
                .easing(TWEEN.Easing.Linear.None)
                .onComplete(() => {

                    //INITIAL POSITION
                    new TWEEN.Tween(robot.upperArmL.rotation)
                        .to({ x: 0.3844815830256843 }, 350 / 2)
                        .easing(TWEEN.Easing.Linear.None)
                        .start();

                    new TWEEN.Tween(robot.upperLegR.rotation)
                        .to({ x: 2.7391203645467432, y: 0.2547631701687732, z: 0.11865935999323499 }, 350 / 2)
                        .easing(TWEEN.Easing.Linear.None)
                        .start();

                    new TWEEN.Tween(robot.footR.position)
                        .to({ x: -0.00636880612000823, y: 0.000305792083963752, z: 0.000570139964111149 }, 350 / 2)
                        .easing(TWEEN.Easing.Linear.None)
                        .start();

                    new TWEEN.Tween(robot.footR.rotation)
                        .to({ x: -1.5383691568853148 }, 350 / 2)
                        .easing(TWEEN.Easing.Linear.None)
                        .start();

                    new TWEEN.Tween(robot.lowerLegR.rotation)
                        .to({ x: 0.715752620423293, y: -4.961868483732194e-7, z: 3.4373933246063144e-7 }, 350 / 2)
                        .easing(TWEEN.Easing.Linear.None)
                        .start();

                })
                .start();
        })
        .start();

}
export function bodyWalkTweenPhase1(robot) {

    robot.leftToFront = false;

    new TWEEN.Tween(robot.body.rotation)
        .to({ z: 0.0468 }, 400 / 2)
        .easing(TWEEN.Easing.Linear.None)
        .onComplete(() => {

            new TWEEN.Tween(robot.body.rotation)
                .to({ z: -8.866098996840159e-30 }, 400 / 2)
                .easing(TWEEN.Easing.Linear.None)
                .onComplete(() => {

                    robot.semaphore = true;

                })
                .start();
        })
        .start();
}

export function bodyWalkTweenPhase2(robot) {

    robot.leftToFront = true;

    new TWEEN.Tween(robot.body.rotation)
        .to({ z: -0.0307 }, 400 / 2)
        .easing(TWEEN.Easing.Linear.None)
        .onComplete(() => {

            new TWEEN.Tween(robot.body.rotation)
                .to({ z: -8.866098996840159e-30 }, 400 / 2)
                .easing(TWEEN.Easing.Linear.None)
                .onComplete(() => {

                    robot.semaphore = true;

                })
                .start();
        })
        .start();
}

export function leftToFrontWalkTween(robot) {

    new TWEEN.Tween(robot.upperArmR.rotation)
        .to({ x: -2.6 }, 350 / 2)
        .easing(TWEEN.Easing.Linear.None)
        .start();

    new TWEEN.Tween(robot.upperLegL.rotation)
        .to({ x: 2.2819 }, 350 / 2)
        .easing(TWEEN.Easing.Linear.None)
        .start();

    new TWEEN.Tween(robot.footL.position)
        .to({ y: 0.0012, z: 0.0066 }, 350 / 2)
        .easing(TWEEN.Easing.Linear.None)
        .start();

    new TWEEN.Tween(robot.footL.rotation)
        .to({ x: -1.7073 }, 350 / 2)
        .easing(TWEEN.Easing.Linear.None)
        .onComplete(() => {

            new TWEEN.Tween(robot.footL.rotation)
                .to({ x: -1.4369 }, 100 / 2)
                .easing(TWEEN.Easing.Linear.None)
                .onComplete(() => {

                    new TWEEN.Tween(robot.upperArmR.rotation)
                        .to({ x: -3.00467658726543 }, 350 / 2)
                        .easing(TWEEN.Easing.Linear.None)
                        .start();

                    new TWEEN.Tween(robot.upperLegL.rotation)
                        .to({ x: 2.7479580378393664, y: -0.1554260117378598, z: -0.07532355032937453 }, 350 / 2)
                        .easing(TWEEN.Easing.Linear.None)
                        .start();

                    new TWEEN.Tween(robot.footL.position)
                        .to({ x: 0.00636722007766366, y: 0.0004, z: 0.000570146774407476 }, 350 / 2)
                        .easing(TWEEN.Easing.Linear.None)
                        .start();

                    new TWEEN.Tween(robot.footL.rotation)
                        .to({ x: -1.5383691568848288 }, 350 / 2)
                        .easing(TWEEN.Easing.Linear.None)
                        .start();

                    new TWEEN.Tween(robot.lowerLegL.rotation)
                        .to({ x: 0.7157526204231796, y: 1.630727074138696e-7, z: -2.2818463770589156e-7 }, 350 / 2)
                        .easing(TWEEN.Easing.Linear.None)
                        .start();
                })
                .start();
        })
        .start();

}

/* Makes the robot fall to the ground with the head displaced
 to simulate the death of the robot
*/
export function deathTween(robot) {
    new TWEEN.Tween(robot.body.rotation)
        .to({ x: -1.7341 }, 500)
        .easing(TWEEN.Easing.Bounce.Out)
        .start();

    new TWEEN.Tween(robot.body.position)
        .to({ y: 0.008, z: -0.0104 }, 175)
        .easing(TWEEN.Easing.Linear.None)
        .start();

    new TWEEN.Tween(robot.head1.position)
        .to({ x: -0.005, y: 0.019, z: 0.0002 }, 175)
        .easing(TWEEN.Easing.Linear.None)
        .start();

    new TWEEN.Tween(robot.head1.rotation)
        .to({ x: 1.7225 }, 2000 / 2)
        .easing(TWEEN.Easing.Bounce.Out)
        .start();

    new TWEEN.Tween(robot.shoulderR.rotation)
        .to({ x: -0.1048, y: -0.9975, z: 2.5173 }, 175)
        .easing(TWEEN.Easing.Linear.None)
        .start();

    new TWEEN.Tween(robot.lowerArmR.rotation)
        .to({ x: 1.731, y: -0.9531, z: 1.8053 }, 175)
        .easing(TWEEN.Easing.Bounce.Out)
        .start();

    new TWEEN.Tween(robot.shoulderL.rotation)
        .to({ x: -1.4309, y: -0.8287, z: -1.9998 }, 175)
        .easing(TWEEN.Easing.Linear.None)
        .start();

    new TWEEN.Tween(robot.upperArmL.rotation)
        .to({ x: 0.3958, y: 0.1151, z: 0.9744 }, 175)
        .easing(TWEEN.Easing.Bounce.Out)
        .start();
    new TWEEN.Tween(robot.lowerArmL.rotation)
        .to({ x: 1.1675, y: 0.7418, z: -1.2969990028508354 }, 1000)
        .easing(TWEEN.Easing.Bounce.Out)
        .start();

    new TWEEN.Tween(robot.upperLegL.rotation)
        .to({ x: 3.6295 }, 175)
        .easing(TWEEN.Easing.Linear.None)
        .start();
    new TWEEN.Tween(robot.lowerLegL.rotation)
        .to({ x: -0.0305, z: 0.0891 }, 175)
        .easing(TWEEN.Easing.Linear.None)
        .start();

    new TWEEN.Tween(robot.upperLegR.rotation)
        .to({ x: 3.6295 }, 175)
        .easing(TWEEN.Easing.Linear.None)
        .start();
    new TWEEN.Tween(robot.lowerLegR.rotation)
        .to({ x: -0.0305, z: -0.1934 }, 175)
        .easing(TWEEN.Easing.Linear.None)
        .start();

}

/*Knock tween for challenge: Head tilt, left shoulder and upper arm rotated and then the lower arm 
quickly goes backward and forward twice to produce the knock
*/
export function knockTween(robot) {

    new TWEEN.Tween(robot.neck.rotation)
        .to({ z: 0.32 }, 150)
        .easing(TWEEN.Easing.Linear.None)
        .start();

    new TWEEN.Tween(robot.shoulderL.rotation)
        .to({ x: -1.7675, y: 0.1362, z: -1.7542 }, 150)
        .easing(TWEEN.Easing.Linear.None)
        .start();

    new TWEEN.Tween(robot.upperArmL.rotation)
        .to({ x: 0.712, y: -1.3084, z: 0.5608 }, 150)
        .easing(TWEEN.Easing.Linear.None)
        .start();

    new TWEEN.Tween(robot.lowerArmL.rotation)
        .to({ x: 1.3847, y: 0.8506, z: -1.4144 }, 150)
        .easing(TWEEN.Easing.Linear.None)
        .onComplete(() => {

            new TWEEN.Tween(robot.lowerArmL.rotation)
                .to({ z: -1.814 }, 150)
                .easing(TWEEN.Easing.Linear.None)
                .delay(50)
                .onComplete(() => {

                    new TWEEN.Tween(robot.lowerArmL.rotation)
                        .to({ z: -1.4144 }, 150)
                        .easing(TWEEN.Easing.Linear.None)
                        .onComplete(() => {

                            new TWEEN.Tween(robot.lowerArmL.rotation)
                                .to({ z: -1.814 }, 100)
                                .easing(TWEEN.Easing.Linear.None)
                                .onComplete(() => {
                                    //Back to initial position
                                    new TWEEN.Tween(robot.neck.rotation)
                                        .to({ z: 0.05532293059308308 }, 150)
                                        .easing(TWEEN.Easing.Linear.None)
                                        .start();

                                    new TWEEN.Tween(robot.shoulderL.rotation)
                                        .to({ x: -0.10898229518839646, y: -0.000001107503889347332, z: -2.71796254738819 }, 150)
                                        .easing(TWEEN.Easing.Linear.None)
                                        .start();

                                    new TWEEN.Tween(robot.upperArmL.rotation)
                                        .to({ x: 0.3844815830256843, y: -1.5253074224154826, z: 0.5598306368119682 }, 150)
                                        .easing(TWEEN.Easing.Linear.None)
                                        .start();

                                    new TWEEN.Tween(robot.lowerArmL.rotation)
                                        .to({ x: 1.2070851479241527, y: 0.5176693038981423, z: -1.2969990028508354 }, 150)
                                        .easing(TWEEN.Easing.Linear.None)
                                        .start();
                                })
                                .start();
                        })
                        .start();
                })
                .start();
        })
        .start();
}

/*  Open the door: Position along the z axis changed
    Add delay to be coupled with camera movement
*/

export function openFinalDoor(door) {
    new TWEEN.Tween(door.position)
        .to({ z: -200 }, 1000)
        .easing(TWEEN.Easing.Linear.None)
        .delay(1000)
        .start();
}

/*  Open the left part of the sliding doors: Position along the z axis chaged
    The part shouldn't completely vanish but a small part should remain visible
    Add delay to be coupled with camera movement
*/

export function openLeftDoor(door) {
    new TWEEN.Tween(door.position)
        .to({ z: 150 }, 1000)
        .easing(TWEEN.Easing.Linear.None)
        .delay(1000)
        .start();
}

/*  Open the right part of the sliding doors: Position along the z axis chaged
    The part shouldn't completely vanish but a small part should remain visible
    Add delay to be coupled with camera movement
*/

export function openRightDoor(door) {
    new TWEEN.Tween(door.position)
        .to({ z: -150 }, 1000)
        .easing(TWEEN.Easing.Linear.None)
        .delay(1000)
        .start();
}