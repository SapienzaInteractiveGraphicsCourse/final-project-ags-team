import * as THREE from "../three/build/three.module.js";
import * as CANNON from "../three/libs/cannon-es.js";
import Main from "./Main.js";
import Models from "./Models.js";
import { TWEEN } from "../three/libs/tween.module.min.js";
import CannonDebugger from "../three/libs/cannon-es-debugger.js";
import {
    leftArmJumpTween,
    rightArmJumpTween,
    knockTween,
    deathTween,
    bodyDanceTween,
    thumbsUpTween,
    waveTween,
    idleLeftUpperLegTween,
    idleLeftLowerLegTween,
    idleRightLowerLegTween,
    idleRightUpperLegTween,
    idleBodyTween,
    turnBackTween,
    turnFrontTween,
    turnLeftTween,
    turnRightTween,
    bodyWalkTweenPhase1,
    bodyWalkTweenPhase2,
    leftToFrontWalkTween,
    rightToBackWalkTween,
    leftToBackWalkTween,
    rightToFrontWalkTween,
    yesTween,
    neckTween,
    noTween,
    openLeftDoor,
    openRightDoor,
    openFinalDoor,
    leanTween,
} from "./Animations.js";

export default class Character {
    constructor() {
        this.main = new Main();
        this.models = new Models();
        this.scene = this.main.scene;
        this.gui = this.main.gui;
        this.setCharacter();
        this.setButtons();

        //CONSTANTS
        this.gravity = -0.15;
        this.drag = 0.9;

        //CHARACTER
        this.x = 0;
        this.z = -4;
        this.y = 0;
        this.deltaY = 0;
        this.jumpPower = 2.3;
        this.canJump = true;

        //WALK
        this.step = 1.15;
        this.velocity = 10;
        this.semaphore = true;
        this.leftToFront = true;

        //INTERACTION
        this.lookedInBucket = false;
    }

    setCharacter() {
        let scene = this.scene;

        let model = scene.children[0];
        let rootNode = model.children[0];
        this.cannonDebugger = new CannonDebugger(scene, this.main.physics);

        //this function traverse all the children inside the rootNode object and assigns true
        //to the castShadow property iff the children is a THREE.Mesh
        rootNode.traverse(function (node) {
            if (node instanceof THREE.Mesh) {
                node.castShadow = true;
            }
        });

        let rightHand = rootNode.children[1];
        let handR1 = rightHand.children[0];

        const bones = handR1.skeleton.bones;

        //Handle skeleton bones
        this.setBones(rootNode, bones);

        //Handle GUI
        // this.setGui();

        /* EVENT HANDLERS SECTION
         */

        // document.getElementById("dance-tween").onclick = () => {
        //     bodyDanceTween(this);
        // };

        // document.getElementById("death-tween").onclick = () => {
        //     deathTween(this);
        // };

        // document.getElementById("knock-tween").onclick = () => {
        //     knockTween(this);

        //     document.getElementById("knock-audio").play();
        // };

        // document.getElementById("idle-tween").onclick = () => {
        //     neckTween(this).start();
        //     idleBodyTween(this).start();
        //     idleLeftUpperLegTween(this).start();
        //     idleLeftLowerLegTween(this).start();
        //     idleRightUpperLegTween(this).start();
        //     idleRightLowerLegTween(this).start();
        // };

        // document.getElementById("head-tween").onclick = () =>
        //     neckTween(this).start();
        // document.getElementById("yes-tween").onclick = () => yesTween(this);
        // document.getElementById("no-tween").onclick = () => noTween(this);
        // document.getElementById("thumbsUp-tween").onclick = () =>
        //     thumbsUpTween(this).start();
        // document.getElementById("wave-tween").onclick = () => waveTween(this);
        // document.getElementById("lean-tween").onclick = () =>
        //     leanTween(this, 0.4383);
        scene.add(rootNode);

        this.characterHeight = 2.2;
        this.characterBody = new CANNON.Body({
            mass: 5,
            shape: new CANNON.Box(
                new CANNON.Vec3(1.5, this.characterHeight, 1.5)
            ),
        });
        this.characterBody.position.set(0, this.characterHeight, 0);
        this.characterBody.name = "character";
        this.main.physics.addBody(this.characterBody);

        this.characterBody.addEventListener("collide", (e) => {
            const { name } = e.body;
            const canJumpList = [
                "ground",
                "calduron",
                "crate",
                "scifi-table",
                "bucket",
            ];
            if (canJumpList.includes(name)) {
                this.canJump = true;
            } else {
                this.canJump = false;
            }
        });
    }

    setButtons() {
        window.addEventListener("keydown", this.handleKeyPress.bind(this));
        window.addEventListener("keyup", this.handleKeyPress.bind(this));
    }

    doNothing() { }

    handleKeyPress(e) {
        const { keyCode, type } = e;
        const state = type === "keydown";
        if (keyCode === 32) {
            this.keyboardSpace = state;
        }
        if (keyCode === 39 || keyCode === 68) {
            //RIGHT ARROW
            this.keyboardRight = state;
            if (state === false) {
                this.characterBody.velocity.x = 0;
            }
        }
        if (keyCode === 37 || keyCode === 65) {
            //LEFT ARROW
            this.keyboardLeft = state;
            if (state === false) {
                this.characterBody.velocity.x = 0;
            }
        }
        if (keyCode === 40 || keyCode === 83) {
            //DOWN ARROW
            this.keyboardDown = state;
            if (state === false) {
                this.characterBody.velocity.z = 0;
            }
        }
        if (keyCode === 38 || keyCode === 87) {
            this.keyboardUp = state;
            if (state === false) {
                this.characterBody.velocity.z = 0;
            }
        }
        if (keyCode === 69) {
            //E
            this.keyboardE = state;
        }
    }

    setBones(rootNode, bones) {
        this.rootNode = rootNode;
        this.bones = bones;

        //Set all bones
        this.bone = bones[0];
        this.footL = bones[1];
        this.body = bones[2];
        this.hips = bones[3];
        this.abdomen = bones[4];
        this.torso1 = bones[5];
        this.neck = bones[6];
        this.head1 = bones[7];
        this.shoulderL = bones[8];
        this.upperArmL = bones[9];
        this.lowerArmL = bones[10];
        this.palm2L = bones[11];
        this.middle1L = bones[12];
        this.middle2L = bones[13];
        this.thumbL = bones[14];
        this.thumb2L = bones[15];
        this.palm1L = bones[16];
        this.indexL = bones[17];
        this.index2L = bones[18];
        this.palm3L = bones[19];
        this.ring1L = bones[20];
        this.ring2L = bones[21];
        this.shoulderR = bones[22];
        this.upperArmR = bones[23];
        this.lowerArmR = bones[24];
        this.palm2R = bones[25];
        this.middle1R = bones[26];
        this.middle2R = bones[27];
        this.thumbR = bones[28];
        this.thumb2R = bones[29];
        this.palm1R = bones[30];
        this.indexR = bones[31];
        this.index2R = bones[32];
        this.palm3R = bones[33];
        this.ring1R = bones[34];
        this.ring2R = bones[35];
        this.upperLegL = bones[36];
        this.lowerLegL = bones[37];
        this.upperLegR = bones[38];
        this.lowerLegR = bones[39];
        this.poleTargetL = bones[40];
        this.footR = bones[41];
        this.poleTargetR = bones[42];
    }

    setGui() {
        /**
         * GUI CONTROLS SECTION
         * Set for each bone the controls for at least the rotations
         */
        let boneFolder = this.gui.addFolder("Bone");
        boneFolder
            .add(this.bone.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        boneFolder
            .add(this.bone.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        boneFolder
            .add(this.bone.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        boneFolder.close();

        let footLFolder = this.gui.addFolder("FootL");
        footLFolder
            .add(this.footL.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        footLFolder
            .add(this.footL.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        footLFolder
            .add(this.footL.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        footLFolder.add(this.footL.position, "x").min(-1).max(1).step(0.0001);
        footLFolder.add(this.footL.position, "y").min(-1).max(1).step(0.0001);
        footLFolder.add(this.footL.position, "z").min(-1).max(1).step(0.0001);
        footLFolder.close();

        let bodyFolder = this.gui.addFolder("Body");
        bodyFolder
            .add(this.body.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        bodyFolder
            .add(this.body.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        bodyFolder
            .add(this.body.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        bodyFolder
            .add(this.body.position, "y")
            .min(0.01)
            .max(0.02)
            .step(0.0001);
        bodyFolder.close();

        let hipsFolder = this.gui.addFolder("Hips");
        hipsFolder
            .add(this.hips.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        hipsFolder
            .add(this.hips.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        hipsFolder
            .add(this.hips.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        hipsFolder.close();

        let abdomenFolder = this.gui.addFolder("Abdomen");
        abdomenFolder
            .add(this.abdomen.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        abdomenFolder
            .add(this.abdomen.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        abdomenFolder
            .add(this.abdomen.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        abdomenFolder.close();

        let torso1Folder = this.gui.addFolder("Torso1");
        torso1Folder
            .add(this.torso1.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        torso1Folder
            .add(this.torso1.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        torso1Folder
            .add(this.torso1.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        torso1Folder.close();

        let neckFolder = this.gui.addFolder("Neck");
        neckFolder
            .add(this.neck.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        neckFolder
            .add(this.neck.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        neckFolder
            .add(this.neck.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        neckFolder.close();

        let headFolder = this.gui.addFolder("Head1");
        headFolder
            .add(this.head1.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        headFolder
            .add(this.head1.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        headFolder
            .add(this.head1.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        headFolder.close();

        let shoulderLFolder = this.gui.addFolder("ShoulderL");
        shoulderLFolder
            .add(this.shoulderL.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        shoulderLFolder
            .add(this.shoulderL.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        shoulderLFolder
            .add(this.shoulderL.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        shoulderLFolder.close();

        let upperArmLFolder = this.gui.addFolder("UpperArmL");
        upperArmLFolder
            .add(this.upperArmL.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        upperArmLFolder
            .add(this.upperArmL.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        upperArmLFolder
            .add(this.upperArmL.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        upperArmLFolder.close();

        let lowerArmLFolder = this.gui.addFolder("LowerArmL");
        lowerArmLFolder
            .add(this.lowerArmL.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        lowerArmLFolder
            .add(this.lowerArmL.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        lowerArmLFolder
            .add(this.lowerArmL.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        lowerArmLFolder.close();

        let palm2LFolder = this.gui.addFolder("Palm2L");
        palm2LFolder
            .add(this.palm2L.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        palm2LFolder
            .add(this.palm2L.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        palm2LFolder
            .add(this.palm2L.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        palm2LFolder.close();

        let middle1LFolder = this.gui.addFolder("Middle1L");
        middle1LFolder
            .add(this.middle1L.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        middle1LFolder
            .add(this.middle1L.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        middle1LFolder
            .add(this.middle1L.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        middle1LFolder.close();

        let middle2LFolder = this.gui.addFolder("Middle2L");
        middle2LFolder
            .add(this.middle2L.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        middle2LFolder
            .add(this.middle2L.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        middle2LFolder
            .add(this.middle2L.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        middle2LFolder.close();

        let thumbLFolder = this.gui.addFolder("ThumbL");
        thumbLFolder
            .add(this.thumbL.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        thumbLFolder
            .add(this.thumbL.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        thumbLFolder
            .add(this.thumbL.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        thumbLFolder.close();

        let thumb2LFolder = this.gui.addFolder("Thumb2L");
        thumb2LFolder
            .add(this.thumb2L.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        thumb2LFolder
            .add(this.thumb2L.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        thumb2LFolder
            .add(this.thumb2L.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        thumb2LFolder.close();

        let palm1LFolder = this.gui.addFolder("Palm1L");
        palm1LFolder
            .add(this.palm1L.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        palm1LFolder
            .add(this.palm1L.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        palm1LFolder
            .add(this.palm1L.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        palm1LFolder.close();

        let indexLFolder = this.gui.addFolder("IndexL");
        indexLFolder
            .add(this.indexL.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        indexLFolder
            .add(this.indexL.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        indexLFolder
            .add(this.indexL.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        indexLFolder.close();

        let index2LFolder = this.gui.addFolder("Index2L");
        index2LFolder
            .add(this.index2L.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        index2LFolder
            .add(this.index2L.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        index2LFolder
            .add(this.index2L.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        index2LFolder.close();

        let palm3LFolder = this.gui.addFolder("Palm3L");
        palm3LFolder
            .add(this.palm3L.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        palm3LFolder
            .add(this.palm3L.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        palm3LFolder
            .add(this.palm3L.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        palm3LFolder.close();

        let ring1LFolder = this.gui.addFolder("Ring1L");
        ring1LFolder
            .add(this.ring1L.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        ring1LFolder
            .add(this.ring1L.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        ring1LFolder
            .add(this.ring1L.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        ring1LFolder.close();

        let ring2LFolder = this.gui.addFolder("Ring2L");
        ring2LFolder
            .add(this.ring2L.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        ring2LFolder
            .add(this.ring2L.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        ring2LFolder
            .add(this.ring2L.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        ring2LFolder.close();

        let shoulderRFolder = this.gui.addFolder("ShoulderR");
        shoulderRFolder
            .add(this.shoulderR.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        shoulderRFolder
            .add(this.shoulderR.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        shoulderRFolder
            .add(this.shoulderR.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        shoulderRFolder.close();

        let upperArmRFolder = this.gui.addFolder("UpperArmR");
        upperArmRFolder
            .add(this.upperArmR.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        upperArmRFolder
            .add(this.upperArmR.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        upperArmRFolder
            .add(this.upperArmR.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        upperArmRFolder.close();

        let lowerArmRFolder = this.gui.addFolder("LowerArmR");
        lowerArmRFolder
            .add(this.lowerArmR.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        lowerArmRFolder
            .add(this.lowerArmR.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        lowerArmRFolder
            .add(this.lowerArmR.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        lowerArmRFolder.close();

        let palm2RFolder = this.gui.addFolder("Palm2R");
        palm2RFolder
            .add(this.palm2R.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        palm2RFolder
            .add(this.palm2R.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        palm2RFolder
            .add(this.palm2R.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        palm2RFolder.close();

        let middle1RFolder = this.gui.addFolder("Middle1R");
        middle1RFolder
            .add(this.middle1R.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        middle1RFolder
            .add(this.middle1R.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        middle1RFolder
            .add(this.middle1R.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        middle1RFolder.close();

        let middle2RFolder = this.gui.addFolder("Middle2R");
        middle2RFolder
            .add(this.middle2R.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        middle2RFolder
            .add(this.middle2R.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        middle2RFolder
            .add(this.middle2R.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        middle2RFolder.close();

        let thumbRFolder = this.gui.addFolder("ThumbR");
        thumbRFolder
            .add(this.thumbR.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        thumbRFolder
            .add(this.thumbR.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        thumbRFolder
            .add(this.thumbR.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        thumbRFolder.close();

        let thumb2RFolder = this.gui.addFolder("Thumb2R");
        thumb2RFolder
            .add(this.thumb2R.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        thumb2RFolder
            .add(this.thumb2R.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        thumb2RFolder
            .add(this.thumb2R.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        thumb2RFolder.close();

        let palm1RFolder = this.gui.addFolder("Palm1R");
        palm1RFolder
            .add(this.palm1R.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        palm1RFolder
            .add(this.palm1R.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        palm1RFolder
            .add(this.palm1R.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        palm1RFolder.close();

        let indexRFolder = this.gui.addFolder("IndexR");
        indexRFolder
            .add(this.indexR.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        indexRFolder
            .add(this.indexR.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        indexRFolder
            .add(this.indexR.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        indexRFolder.close();

        let index2RFolder = this.gui.addFolder("Index2R");
        index2RFolder
            .add(this.index2R.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        index2RFolder
            .add(this.index2R.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        index2RFolder
            .add(this.index2R.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        index2RFolder.close();

        let palm3RFolder = this.gui.addFolder("Palm3R");
        palm3RFolder
            .add(this.palm3R.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        palm3RFolder
            .add(this.palm3R.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        palm3RFolder
            .add(this.palm3R.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        palm3RFolder.close();

        let ring1RFolder = this.gui.addFolder("Ring1R");
        ring1RFolder
            .add(this.ring1R.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        ring1RFolder
            .add(this.ring1R.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        ring1RFolder
            .add(this.ring1R.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        ring1RFolder.close();

        let ring2RFolder = this.gui.addFolder("Ring2R");
        ring2RFolder
            .add(this.ring2R.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        ring2RFolder
            .add(this.ring2R.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        ring2RFolder
            .add(this.ring2R.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        ring2RFolder.close();

        let upperLegLFolder = this.gui.addFolder("UpperLegL");
        upperLegLFolder
            .add(this.upperLegL.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        upperLegLFolder
            .add(this.upperLegL.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        upperLegLFolder
            .add(this.upperLegL.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        upperLegLFolder.close();

        let lowerLegLFolder = this.gui.addFolder("LowerLegL");
        lowerLegLFolder
            .add(this.lowerLegL.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        lowerLegLFolder
            .add(this.lowerLegL.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        lowerLegLFolder
            .add(this.lowerLegL.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        lowerLegLFolder.close();

        let upperLegRFolder = this.gui.addFolder("UpperLegR");
        upperLegRFolder
            .add(this.upperLegR.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        upperLegRFolder
            .add(this.upperLegR.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        upperLegRFolder
            .add(this.upperLegR.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        upperLegRFolder.close();

        let lowerLegRFolder = this.gui.addFolder("LowerLegR");
        lowerLegRFolder
            .add(this.lowerLegR.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        lowerLegRFolder
            .add(this.lowerLegR.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        lowerLegRFolder
            .add(this.lowerLegR.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        lowerLegRFolder.close();

        let poleTargetLFolder = this.gui.addFolder("PoleTargetL");
        poleTargetLFolder
            .add(this.poleTargetL.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        poleTargetLFolder
            .add(this.poleTargetL.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        poleTargetLFolder
            .add(this.poleTargetL.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        poleTargetLFolder.close();

        let footRFolder = this.gui.addFolder("FootR");
        footRFolder
            .add(this.footR.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        footRFolder
            .add(this.footR.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        footRFolder
            .add(this.footR.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        footRFolder.add(this.footR.position, "x").min(-1).max(1).step(0.0001);
        footRFolder.add(this.footR.position, "y").min(-1).max(1).step(0.0001);
        footRFolder.add(this.footR.position, "z").min(-1).max(1).step(0.0001);
        footRFolder.close();

        let poleTargetRFolder = this.gui.addFolder("PoleTargetR");
        poleTargetRFolder
            .add(this.poleTargetR.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        poleTargetRFolder
            .add(this.poleTargetR.rotation, "y")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        poleTargetRFolder
            .add(this.poleTargetR.rotation, "z")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        poleTargetRFolder.close();
    }

    update() {
        if (!this.main.started) {
            this.main.started = true;
            this.main.camera.getCameraToPosition();
            document.getElementById("timer-button").style.opacity = 1;
            console.log("start");
        }
        /**
         * MOVEMENT
         */
        const { x, y, z } = this.characterBody.position;
        if (!this.main.closeUpActive) {
            if (
                (this.keyboardSpace &&
                    this.canJump &&
                    Math.abs(
                        Math.round(this.characterBody.velocity.y) === 0
                    )) ||
                (this.keyboardSpace &&
                    Math.round(this.characterBody.position.y) === 2)
            ) {
                leftArmJumpTween(this).start();
                rightArmJumpTween(this).start();
                this.characterBody.velocity.y = 14;
                this.canJump = false;
            }

            if (this.keyboardRight && this.semaphore && this.canJump) {
                this.semaphore = false;
                turnRightTween(this).start();
                if (this.leftToFront) {
                    this.leftToFront = false;
                    bodyWalkTweenPhase1(this);
                    leftToFrontWalkTween(this);
                    rightToBackWalkTween(this);
                } else {
                    this.leftToFront = true;
                    bodyWalkTweenPhase2(this);
                    rightToFrontWalkTween(this);
                    leftToBackWalkTween(this);
                }
                this.x += this.step;
                this.characterBody.velocity.x = this.velocity;
            }

            if (this.keyboardLeft && this.semaphore && this.canJump) {
                this.semaphore = false;
                turnLeftTween(this).start();
                if (this.leftToFront) {
                    bodyWalkTweenPhase1(this);
                    leftToFrontWalkTween(this);
                    rightToBackWalkTween(this);
                } else {
                    bodyWalkTweenPhase2(this);
                    rightToFrontWalkTween(this);
                    leftToBackWalkTween(this);
                }
                this.x -= this.step;
                this.characterBody.velocity.x = -this.velocity;
            }
            if (this.keyboardUp && this.semaphore && this.canJump) {
                this.semaphore = false;
                turnBackTween(this).start();
                if (this.leftToFront) {
                    bodyWalkTweenPhase1(this);
                    leftToFrontWalkTween(this);
                    rightToBackWalkTween(this);
                } else {
                    bodyWalkTweenPhase2(this);
                    rightToFrontWalkTween(this);
                    leftToBackWalkTween(this);
                }
                this.z -= this.step;
                this.characterBody.velocity.z = -this.velocity;
            }
            if (this.keyboardDown && this.semaphore && this.canJump) {
                this.semaphore = false;
                turnFrontTween(this).start();
                if (this.leftToFront) {
                    bodyWalkTweenPhase1(this);
                    leftToFrontWalkTween(this);
                    rightToBackWalkTween(this);
                } else {
                    bodyWalkTweenPhase2(this);
                    rightToFrontWalkTween(this);
                    leftToBackWalkTween(this);
                }
                this.z += this.step;
                this.characterBody.velocity.z = this.velocity;
            }

            if (this.keyboardRight && this.semaphore && !this.canJump) {
                turnRightTween(this).start();
                this.x += this.step;
                this.characterBody.velocity.x = this.velocity;
            }
            if (this.keyboardLeft && this.semaphore && !this.canJump) {
                turnLeftTween(this).start();
                this.x -= this.step;
                this.characterBody.velocity.x = -this.velocity;
            }
            if (this.keyboardUp && this.semaphore && !this.canJump) {
                turnBackTween(this).start();
                this.z -= this.step;
                this.characterBody.velocity.z = -this.velocity;
            }
            if (this.keyboardDown && this.semaphore && !this.canJump) {
                turnFrontTween(this).start();
                this.z += this.step;
                this.characterBody.velocity.z = this.velocity;
            }

            if (!this.keyboardLeft && !this.keyboardRight)
                this.characterBody.velocity.x = 0;
            if (!this.keyboardDown && !this.keyboardUp)
                this.characterBody.velocity.z = 0;

            /**
             * INTERACTION WITH OBJECTS
             */

            if (this.keyboardE) {
                //BLUE DESK ON THE RIGHT
                if (z < -10.0 && z > -17.0 && x > 22.5) {
                    this.main.camera.goLookRightBlueDesk();
                    this.main.closeUpActive = true;
                }

                //YELLOW DESK ON THE RIGHT
                else if (x > 12.9 && x < 19.7 && z < -22.0) {
                    this.main.camera.goLookYellowDesk();
                    this.main.closeUpActive = true;
                }

                //BUCKET FRONT
                else if (x > -28.0 && x < -25.5 && z < -22.0 && z > -24.0) {
                    this.main.closeUpActive = true;
                    this.main.camera.goLookBucket();
                    this.lookedInBucket = true;
                }

                //BUCKET LATERAL
                else if (x < -22.5 && x > -24.0 && z > -28.5 && z < -25.5) {
                    this.main.closeUpActive = true;
                    this.main.camera.goLookBucketLateral();
                    this.lookedInBucket = true;
                }

                //PINPAD
                else if (
                    z > 5.3 &&
                    z < 9.6 &&
                    x > 6.4 &&
                    x < 8.2 &&
                    !this.main.rightDoorOpen
                ) {
                    if (!this.main.closeUpActive)
                        this.main.camera.goLookPinPad();
                    this.main.closeUpActive = true;
                    this.main.pinPadActive = true;
                }

                //NOTEPAD
                else if (x < -26.0 && z > 13.5 && z < 17.2) {
                    turnLeftTween(this).start();
                    document.getElementById(
                        "dialogue-box-container"
                    ).style.opacity = 1;
                    document.getElementById(
                        "dialogue-box-container"
                    ).style.pointerEvents = "initial";
                    document.getElementById("dialogue-box-text").innerHTML =
                        "3579.....I wonder what that means";
                    setTimeout(() => {
                        document.getElementById(
                            "dialogue-box-container"
                        ).style.opacity = 0;
                        document.getElementById(
                            "dialogue-box-container"
                        ).style.pointerEvents = "none";
                    }, 2000);
                }

                //RED BUTTON
                else if (
                    z > 20.0 &&
                    z < 24.5 &&
                    x > 27.5 &&
                    !this.main.rearLeftDoorOpen
                ) {
                    if (this.characterBody.position.y > 11.0) {
                        this.main.closeUpActive = true;
                        this.main.rearLeftDoorOpen = true;
                        this.main.physics.bodies.filter(
                            (object) =>
                                object.name === "mainRoom.slideDoor.left.rear"
                        )[0].collisionFilterMask = 0;
                        turnRightTween(this).start();
                        let l = this.scene.getObjectByName(
                            "mainRoom.slideDoor.left.rear"
                        ).children[0].children[0].children[0];
                        let r = this.scene.getObjectByName(
                            "mainRoom.slideDoor.left.rear"
                        ).children[0].children[0].children[1];
                        openLeftDoor(l);
                        openRightDoor(r);
                        this.main.camera.goLookLeftRearDoor();
                    }
                } else if (
                    /**
                     * FINAL DOOR
                     */
                    this.characterBody.position.z <= -25.4 &&
                    this.characterBody.position.z > -28.5 &&
                    this.lookedInBucket &&
                    !this.main.finalDoorOpen
                ) {
                    if (
                        this.characterBody.position.x >= -6.0 &&
                        this.characterBody.position.x <= 6.0
                    ) {
                        console.log("FINAL DOOR KNOCK");
                        this.main.closeUpActive = true;
                        this.main.camera.goLookFinalDoor();
                        document.getElementById("knock-audio").play();
                        knockTween(this);
                        this.main.physics.bodies.filter(
                            (object) => object.name === "mainRoom.finalDoor"
                        )[0].collisionFilterMask = 0;
                        let door =
                            this.main.scene.getObjectByName(
                                "mainRoom.finalDoor"
                            ).children[0].children[0].children[0];
                        let elem1 = door.children[0].children[0].children[1];
                        openFinalDoor(elem1);

                        //this.main.camera.goFollowRobot();
                        console.log(this.characterBody.position);
                    }
                }
                /*else if (this.characterBody.position.z <= -28.5) {
                        console.log(this.characterBody.position)
                    }*/
                //TROPHY
                else if (
                    this.characterBody.position.z <= -83 &&
                    this.characterBody.position.z > -88 &&
                    this.characterBody.position.x > -2 &&
                    this.characterBody.position.x < 2 &&
                    !this.main.gameWon
                ) {
                    this.main.clock.stop();
                    this.main.closeUpActive = true;
                    turnFrontTween(this).start();
                    bodyDanceTween(this);
                    this.main.closeUpActive = true;
                    this.main.camera.goToDistance();
                } else {
                    noTween(this);
                }
            }
        }

        // this.cannonDebugger.update();

        this.characterBody.quaternion.y = 0;
        this.characterBody.quaternion.z = 0;
        this.characterBody.quaternion.x = 0;

        //FINAL SET OF POSITION COORDINATES
        if (this.rootNode) {
            if (
                !this.main.closeUpActive &&
                this.main.activeCamera.name == "mainCamera"
            )
                this.main.camera.setPosition(
                    this.characterBody.position.x,
                    this.characterBody.position.z
                );

            this.rootNode.position.x = this.characterBody.position.x;
            this.rootNode.position.y =
                this.characterBody.position.y - this.characterHeight;
            this.rootNode.position.z = this.characterBody.position.z;

            if (this.characterBody.position.y <= 2.2) this.canJump = true;

            if (this.main.closeUpActive) {
                this.characterBody.velocity.x = 0;
                this.characterBody.velocity.y = 0;
                this.characterBody.velocity.z = 0;
            }

            /**
             * ACTIVATION OF HELPER BOX
             */

            //BLUE DESK ON THE RIGHT
            if (z < -10.0 && z > -17.0 && x > 22.5) {
                document.getElementById("help-box").style.opacity = 1;
            }

            //YELLOW DESK ON THE RIGHT
            else if (x > 12.9 && x < 19.7 && z < -22.0) {
                document.getElementById("help-box").style.opacity = 1;
            }

            //BUCKET FRONT
            else if (x > -28.0 && x < -25.5 && z < -22.0 && z > -24.0) {
                document.getElementById("help-box").style.opacity = 1;
            }

            //BUCKET LATERAL
            else if (x < -22.5 && x > -24.0 && z > -28.5 && z < -25.5) {
                document.getElementById("help-box").style.opacity = 1;
            }

            //PINPAD
            else if (
                z > 5.3 &&
                z < 9.6 &&
                x > 6.4 &&
                x < 8.2 &&
                !this.main.rightDoorOpen
            ) {
                document.getElementById("help-box").style.opacity = 1;
            }

            //NOTEPAD
            else if (x < -26.0 && z > 13.5 && z < 17.2) {
                document.getElementById("help-box").style.opacity = 1;
            }

            //RED BUTTON
            else if (
                z > 20.0 &&
                z < 24.5 &&
                x > 27.5 &&
                y > 11.0 &&
                !this.main.rearLeftDoorOpen
            ) {
                document.getElementById("help-box").style.opacity = 1;
            }

            //JUMP
            else if (x > 19.0 && x < 30 && z > 4.0 && z < 13.0) {
                document.getElementById("spacebar-help-box").style.opacity = 1;
            }

            //TROPHY
            else if (
                z <= -83 &&
                z > -88 &&
                x > -2 &&
                x < 2 &&
                !this.main.gameWon
            ) {
                document.getElementById("help-box").style.opacity = 1;
            }

            //FINAL DOOR
            else if (
                z <= -25.4 &&
                z > -28.5 &&
                x >= -6.0 &&
                x <= 6.0 &&
                this.lookedInBucket &&
                !this.main.finalDoorOpen
            ) {
                document.getElementById("help-box").style.opacity = 1;
            } else {
                document.getElementById("help-box").style.opacity = 0;
                document.getElementById("spacebar-help-box").style.opacity = 0;
            }

            /**
             * KEY
             */
            if (x < -4.8 && x > -7.6) {
                if (z < -22.0 && z > -28.0) {
                    if (
                        !this.main.closeUpActive &&
                        !this.main.frontLeftDoorOpen
                    ) {
                        //KEY COLLECTED!
                        this.main.scene.getObjectByName(
                            "mainRoom.key"
                        ).visible = false;
                        this.main.closeUpActive = true;
                        this.main.frontLeftDoorOpen = true;
                        this.main.physics.bodies.filter(
                            (object) =>
                                object.name === "mainRoom.slideDoor.left.front"
                        )[0].collisionFilterMask = 0;
                        this.main.camera.goLookLeftFrontDoor();
                        let l = this.scene.getObjectByName(
                            "mainRoom.slideDoor.left.front"
                        ).children[0].children[0].children[0];
                        let r = this.scene.getObjectByName(
                            "mainRoom.slideDoor.left.front"
                        ).children[0].children[0].children[1];
                        openLeftDoor(l);
                        openRightDoor(r);
                    }
                }
            }
        }
    }
}
