import * as THREE from "../three/build/three.module.js";
import Main from "./Main.js";
import { OrbitControls } from "./../three/controls/OrbitControls.js";
import { TWEEN } from "../three/libs/tween.module.min.js";
import { activate_orbit_controls, get_center } from "./Utils/Functions.js";
import { openRightDoor, openLeftDoor, waveTween, idleBodyTween, idleLeftLowerLegTween, idleLeftUpperLegTween, idleRightLowerLegTween, idleRightUpperLegTween, neckTween } from "./Animations.js";
import {
    leanTween,
    noTween,
    thumbsUpTween,
    bodyDanceTween,
    turnBackTween,
    turnFrontTween,
    turnLeftTween,
    turnRightTween
} from "./Animations.js";

export default class Camera {
    constructor(_options) {
        this.main = new Main();
        this.config = this.main.config;
        this.scene = this.main.scene;
        this.targetElement = this.main.targetElement;

        this.mainCamera = this.create_main_camera();
        this.scene.add(this.mainCamera);

        this.orbitControlsCamera = this.create_orbitControls_camera();
        this.scene.add(this.orbitControlsCamera);

        this.setButton()

        this.beginning = true;
    }

    create_main_camera() {
        let camera = new THREE.PerspectiveCamera(
            45,
            this.config.width / this.config.height,
            0.1,
            999
        );
        camera.rotation.reorder("YXZ");
        camera.position.set(0, 100, 30);
        camera.lookAt(0, 0, 0);

        camera.name = "mainCamera";

        return camera;
    }

    create_orbitControls_camera() {
        let camera = this.create_main_camera()

        camera.name = "orbitControlsCamera";

        this.main.cameraControls = activate_orbit_controls(
            camera,
            this.targetElement
        );

        return camera;
    }

    setPosition(x, z) {
        this.mainCamera.position.set(x, 25, 25 + z);
    }

    setButton() {
        document.getElementById("exit-button").onclick = () => {
            this.getCameraToPosition();
            document.getElementById("exit-button").style.opacity = 0;
            document.getElementById("exit-button").style.cursor = "default";
            document.getElementById("exit-button").style.pointerEvents = "none";
            document.getElementById("dialogue-box-container").style.opacity = 0;
            document.getElementById("dialogue-box-container").style.pointerEvents = "none";
            document.getElementById("input-box-container").style.opacity = 0;
            document.getElementById("input-box-container").style.pointerEvents = "none";
            leanTween(this.main.world.character, 0);
        };
    }

    goLookRightBlueDesk() {
        const positionTween = new TWEEN.Tween(this.mainCamera.position)
            .to({ x: 15, y: 5, z: -15 })
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();
        const rotationTween = new TWEEN.Tween(this.mainCamera.rotation)
            .to({ x: 0, y: -Math.PI / 2 })
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(() => {
                noTween(this.main.world.character);
                document.getElementById("exit-button").style.opacity = 1;
                document.getElementById("exit-button").style.cursor = "pointer";
                document.getElementById("exit-button").style.pointerEvents = "initial";
                document.getElementById("dialogue-box-container").style.opacity = 1;
                document.getElementById("dialogue-box-container").style.pointerEvents = "initial";
                document.getElementById("dialogue-box-text").innerHTML = "Nothing to see here"
            })
            .start();
    }

    goLookYellowDesk() {
        const positionTween = new TWEEN.Tween(this.mainCamera.position)
            .to({
                x: 16,
                y: 5,
                z: -15,
            })
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();

        const rotationTween = new TWEEN.Tween(this.mainCamera.rotation)
            .to({ x: 0 })
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(() => {
                document.getElementById("exit-button").style.opacity = 1;
                document.getElementById("exit-button").style.cursor = "pointer";
                document.getElementById("exit-button").style.pointerEvents = "initial";
                document.getElementById("dialogue-box-container").style.opacity = 1;
                document.getElementById("dialogue-box-container").style.pointerEvents = "initial";
                document.getElementById("dialogue-box-text").innerHTML = "Wait....did I press the button?!"
            })
            .start();
    }

    goToDistance() {
        const oldPosition = this.mainCamera.position;
        console.log(this.mainCamera.rotation);
        document.getElementById("dance-audio").play();
        document.getElementById("timer-button").style.backgroundColor = "green";
        document.getElementById("timer-box-text").style.color = "white";
        document.getElementById("timer-box-text").style.fontSize = "300%";
        new TWEEN.Tween(this.mainCamera.rotation)
            .to({
                x: 0//y: -Math.PI / 2


            }, 8000)
            .onComplete(() => {
                this.main.gameWon = true;
                let boxWon = document.getElementById("game-won-container");
                boxWon.className = "landing-page";
                let dummy = { x: 0 };
                new TWEEN.Tween(dummy).to({ x: 1 }, 3000)
                    .onUpdate(() => boxWon.style.opacity = dummy.x)
                    .start();

            })
            .start();
        new TWEEN.Tween(this.mainCamera.position)
            .to({
                y: 5,
                z: -70

            }, 4000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();

    }

    goLookBucket() {
        turnBackTween(this.main.world.character).start();
        const oldPosition = this.mainCamera.position;
        const positionTween = new TWEEN.Tween(this.mainCamera.position)
            .to({
                x: -18,
                y: 3,
                z: -26,
            })
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();

        const rotationTween = new TWEEN.Tween(this.mainCamera.rotation)
            .to({ x: 0, y: Math.PI / 2 })
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(() => {
                document.getElementById("exit-button").style.opacity = 1;
                document.getElementById("exit-button").style.cursor = "pointer";
                document.getElementById("exit-button").style.pointerEvents = "initial";
                document.getElementById("dialogue-box-container").style.opacity = 1;
                document.getElementById("dialogue-box-container").style.pointerEvents = "initial";
                document.getElementById("dialogue-box-text").innerHTML = "A wise bucket once said: Sometimes you just have to knock"


                leanTween(this.main.world.character, 0.4383);
            })
            .start();
    }

    goLookBucketLateral() {
        turnLeftTween(this.main.world.character).start();
        const positionTween = new TWEEN.Tween(this.mainCamera.position)
            .to({
                x: -25,
                y: 3,
                z: -18,
            })
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();

        const rotationTween = new TWEEN.Tween(this.mainCamera.rotation)
            .to({ x: 0 })
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(() => {
                document.getElementById("exit-button").style.opacity = 1;
                document.getElementById("exit-button").style.cursor = "pointer";
                document.getElementById("exit-button").style.pointerEvents = "initial";
                document.getElementById("dialogue-box-container").style.opacity = 1;
                document.getElementById("dialogue-box-container").style.pointerEvents = "initial";
                document.getElementById("dialogue-box-text").innerHTML = "A wise bucket once said: Sometimes you just have to knock"


                leanTween(this.main.world.character, 0.4383);
            })
            .start();
    }

    /**
     * DOORS
     */

    goLookLeftFrontDoor() {
        const positionTween = new TWEEN.Tween(this.mainCamera.position)
            .to({
                x: -this.main.scene.getObjectByName("mainRoom.slideDoor.left.front").position.x - 2,
                y: 5,
                z: 15,
            })
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();

        const rotationTween = new TWEEN.Tween(this.mainCamera.rotation)
            .to({ x: 0, y: Math.PI / 2 })
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(() => {
                document.getElementById("sliding-audio").play();
                this.main.scene.getObjectByName("bulbLeftFront").material.color.set(0x00ff00);

                setTimeout(() => {

                    // this.getCameraToPosition();
                    this.goLookCharacterFromRight();

                }, 1200);
            })
            .start();
    }

    goLookLeftRearDoor() {
        const positionTween = new TWEEN.Tween(this.mainCamera.position)
            .to({
                x: -this.main.scene.getObjectByName("mainRoom.slideDoor.left.rear").position.x - 2,
                y: 5,
                z: -15,
            })
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();

        const rotationTween = new TWEEN.Tween(this.mainCamera.rotation)
            .to({ x: 0, y: Math.PI / 2 })
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(() => {
                this.main.scene.getObjectByName("bulbLeftRear").material.color.set(0x00ff00);
                document.getElementById("sliding-audio").play();
                setTimeout(() => {
                    this.getCameraToPosition();
                }, 1200);
            })
            .start();
    }

    goLookRightDoor() {
        const positionTween = new TWEEN.Tween(this.mainCamera.position)
            .to({
                x: -this.main.scene.getObjectByName("mainRoom.slideDoor.right").position.x + 1,
                y: 5,
                z: 0,
            })
            .easing(TWEEN.Easing.Quadratic.InOut)

            .start();

        const rotationTween = new TWEEN.Tween(this.mainCamera.rotation)
            .to({ x: 0, y: -Math.PI / 2 })
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(() => {
                this.main.scene.getObjectByName("bulbRight").material.color.set(0x00ff00);
                document.getElementById("sliding-audio").play();
                setTimeout(() => {
                    this.getCameraToPosition();
                }, 1200);
            })
            .start();
    }

    goLookFinalDoor() {
        const positionTween = new TWEEN.Tween(this.mainCamera.position)
            .to({
                x: 0,
                y: 5,
                z: -5,
            })
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();

        const rotationTween = new TWEEN.Tween(this.mainCamera.rotation)
            .to({ x: 0 })
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(() => {
                this.main.finalDoorOpen = true;
                document.getElementById("sliding-audio").play();
                setTimeout(() => {
                    this.getCameraToPosition();
                }, 1200);
            })
            .start();
    }

    /**
     * END OF DOORS
     */

    goLookPinPad() {
        turnRightTween(this.main.world.character).start();
        const positionTween = new TWEEN.Tween(this.mainCamera.position)
            .to({
                x: this.main.scene.getObjectByName("mainRoom.pinPad").position.x - 10,
                y: 6,
                z: this.main.scene.getObjectByName("mainRoom.pinPad").position.z,
            })
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();

        const rotationTween = new TWEEN.Tween(this.mainCamera.rotation)
            .to({ x: 0, y: -Math.PI / 2 })
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(() => {
                document.getElementById("input-box-container").style.opacity = 1;
                document.getElementById("input-box-container").style.pointerEvents = "initial";
                document.getElementById("exit-button").style.opacity = 1;
                document.getElementById("exit-button").style.cursor = "pointer";
                document.getElementById("exit-button").style.pointerEvents = "initial";
                document.getElementById("input-box").focus();
                console.log("Code = ?")
                let code;
                window.addEventListener("keydown", (e) => {
                    const { keyCode } = e;
                    if (keyCode === 13 && this.main.closeUpActive && this.main.pinPadActive) {
                        code = document.getElementById("input-box").value;
                        console.log(code)
                        if (code == 3579) {
                            document.getElementById("input-box-container").style.opacity = 0;
                            document.getElementById("input-box-container").style.pointerEvents = "none";
                            document.getElementById("exit-button").style.opacity = 0;
                            document.getElementById("exit-button").style.cursor = "initial";
                            document.getElementById("exit-button").style.pointerEvents = "none";
                            console.log("CORRECT!");
                            this.main.rightDoorOpen = true;
                            this.main.physics.bodies.find(object => object.name === "mainRoom.slideDoor.right").collisionFilterMask = 0;
                            let l = this.scene.getObjectByName("mainRoom.slideDoor.right").children[0].children[0].children[0];
                            let r = this.scene.getObjectByName("mainRoom.slideDoor.right").children[0].children[0].children[1];
                            openLeftDoor(l);
                            openRightDoor(r);
                            turnLeftTween(this.main.world.character).start();
                            thumbsUpTween(this.main.world.character).start();
                            this.goLookRightDoor();
                            this.main.pinPadActive = false;
                        }
                        else {
                            document.getElementById("dialogue-box").style.backgroundColor = "crimson";
                            setTimeout(() => {
                                document.getElementById("dialogue-box").style.backgroundColor = "white";
                            }, 200);
                            setTimeout(() => {
                                document.getElementById("dialogue-box").style.backgroundColor = "crimson";
                            }, 400);
                            setTimeout(() => {
                                document.getElementById("dialogue-box").style.backgroundColor = "white";
                            }, 600);
                            setTimeout(() => {
                                document.getElementById("dialogue-box").style.backgroundColor = "crimson";
                            }, 800);
                            setTimeout(() => {
                                document.getElementById("dialogue-box").style.backgroundColor = "white";
                            }, 1000);
                        }
                    }
                })
            })
            .start();

    }

    getCameraToPosition() {
        const { x, z } = this.main.world.character.characterBody.position;
        const returnToPositionTween = new TWEEN.Tween(this.mainCamera.position)
            .to({ x: x, y: 25, z: 25 + z }, 800)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(() => {
                if (this.beginning) {
                    waveTween(this.main.world.character);
                    this.beginning = false;
                }
                else {
                    this.main.closeUpActive = false;
                }
            })
            .start();

        const returnToRotationTween = new TWEEN.Tween(this.mainCamera.rotation)
            .to({ x: -0.7853981633974485, y: 0, z: 0 }, 800)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();
    }

    goLookCharacterFromRight() {
        const { x, z } = this.main.world.character.characterBody.position;
        this.main.world.character.rootNode.rotation.y = Math.PI / 2;
        const positionTween = new TWEEN.Tween(this.mainCamera.position)
            .to({
                x: x + 10,
                y: 4,
                z: z,
            })
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();

        const rotationTween = new TWEEN.Tween(this.mainCamera.rotation)
            .to({ x: 0, y: Math.PI / 2 })
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(() => {
                thumbsUpTween(this.main.world.character).start();
                setTimeout(() => {
                    this.getCameraToPosition();
                }, 1500);
            })
            .start();
    }

    update() {
        this.mainCamera.updateWorldMatrix();
    }

    resize() {
        this.mainCamera.aspect = window.innerWidth / window.innerHeight;
        this.mainCamera.updateProjectionMatrix();
    }
}
