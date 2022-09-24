import * as THREE from "../three/build/three.module.js";
import { GUI } from "../three/libs/lil-gui.module.min.js";
import Stats from "../three/libs/stats.module.js";
import { TWEEN } from "../three/libs/tween.module.min.js";
import * as CANNON from "../three/libs/cannon-es.js";

import Camera from "./Camera.js";
import Models from "./Models.js";
import World from "./World.js";

import { deathTween } from "./Animations.js";

import { EASY_TIMER, HARD_TIMER, MEDIUM_TIMER } from "./Utils/Constants.js";

export default class Main {
    static async build() {
        let scene = await setScene();
        let textures = await setTextures();
        let physics = setPhysics();
        /**
         * DIFFICULTY
         * 1 = EASY
         * 2 = MEDIUM
         * 3 = HARD
         */
        const params = window.location.search;
        const urlParams = new URLSearchParams(params);
        let difficulty = urlParams.get("diff");
        return new Main({
            targetElement: document.querySelector(".main"),
            scene: scene,
            textures: textures,
            physics: physics,
            difficulty: difficulty,
        });
    }

    static instance;

    constructor(args = {}) {
        if (Main.instance) {
            return Main.instance;
        }
        Main.instance = this;

        this.targetElement = args.targetElement;

        if (!this.targetElement) {
            console.warn("Missing 'targetElement' property");
            return;
        }

        this.scene = args.scene;
        this.textures = args.textures;
        this.physics = args.physics;
        this.closeUpActive = true;
        this.pinPadActive = false;
        this.difficulty = args.difficulty;

        this.frontLeftDoorOpen = false;
        this.rearLeftDoorOpen = false;
        this.rightDoorOpen = false;
        this.finalDoorOpen = false;
        this.gameWon = false;

        // this.gui = new GUI();
        // this.gui.close();
        this.stats = new Stats();
        document
            .getElementById("controls-container")
            .appendChild(this.stats.dom);

        this.setConfig();
        this.setCamera();
        this.setRenderer();
        this.setWorld();

        // this.activeCamera = this.camera.orbitControlsCamera;
        this.activeCamera = this.camera.mainCamera;

        this.maxClockValue = EASY_TIMER;
        this.startingAlertClock = this.maxClockValue * 0.1;
        this.clock = new THREE.Clock();
        this.started = false;
        this.gameOver = 0;
        this.turn = 0;

        //ACTIVE TIMER
        this.active = true;

        this.setDifficultyParameters();

        this.update();
    }

    setDifficultyParameters() {
        if (this.difficulty === "1") {
            this.scene.getObjectByName("mainRoom.arrow").visible = true;
            this.scene.getObjectByName("mainRoom.arrowBucket").visible = true;
            this.scene.getObjectByName("mainRoom.arrowPinpad").visible = true;
            this.scene.getObjectByName("mainRoom.arrowButton").visible = true;
            this.maxClockValue = EASY_TIMER;
            this.startingAlertClock = this.maxClockValue * 0.1;
        } else if (this.difficulty === "2") {
            this.scene.getObjectByName("mainRoom.arrow").visible = true;
            this.scene.getObjectByName("mainRoom.arrowBucket").visible = false;
            this.scene.getObjectByName("mainRoom.arrowPinpad").visible = true;
            this.scene.getObjectByName("mainRoom.arrowButton").visible = false;
            this.maxClockValue = MEDIUM_TIMER;
            this.startingAlertClock = this.maxClockValue * 0.1;
        } else {
            this.scene.getObjectByName("mainRoom.arrow").visible = false;
            this.scene.getObjectByName("mainRoom.arrowBucket").visible = false;
            this.scene.getObjectByName("mainRoom.arrowPinpad").visible = false;
            this.scene.getObjectByName("mainRoom.arrowButton").visible = false;
            this.maxClockValue = HARD_TIMER;
            this.startingAlertClock = this.maxClockValue * 0.1;
        }
    }

    setConfig() {
        this.config = {};

        // Pixel ratio
        this.config.pixelRatio = Math.min(
            Math.max(window.devicePixelRatio, 1),
            2
        );

        // Width and height
        // const boundings = this.targetElement.getBoundingClientRect();
        this.config.width = window.innerWidth;
        this.config.height = window.innerHeight;
    }

    setCamera() {
        this.camera = new Camera();
    }

    setRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            alpha: false,
            antialias: true,
        });
        this.renderer.setPixelRatio(this.config.pixelRatio * 0.8);
        this.renderer.setSize(this.config.width, this.config.height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.VSMShadowMap;
        this.targetElement.appendChild(this.renderer.domElement);
    }

    setWorld() {
        this.world = new World();
    }

    update() {
        if (this.camera) {
            this.camera.update();
            if (this.renderer)
                this.renderer.render(this.scene, this.activeCamera);
        }
        if (this.world) this.world.update();

        window.requestAnimationFrame(() => {
            if (window.innerWidth !== this.config.width) this.resize();
            TWEEN.update();
            this.stats.update();
            this.physics.fixedStep();
            this.update();
        });

        if (this.started && this.active) {
            var s = this.maxClockValue - this.clock.getElapsedTime();
            if (s <= 0) {
                this.clock.stop();
                if (this.gameOver === 0) {
                    this.gameOver = 1;
                    document.getElementById("timer-box-text").innerHTML =
                        (s - (s %= 60)) / 60 +
                        (10 < s ? ":" : ":0") +
                        Math.trunc(s);
                    deathTween(this.world.character);
                    this.closeUpActive = true;
                    //document.getElementById("game-over").style.opacity = 1;
                    let boxOver = document.getElementById(
                        "game-over-container"
                    );
                    boxOver.className = "landing-page";
                    //boxOver.style.pointerEvents = "";
                    let dummy = { x: 0 };
                    new TWEEN.Tween(dummy)
                        .to({ x: 1 }, 3000)
                        .onUpdate(() => (boxOver.style.opacity = dummy.x))
                        .start();
                }
            } else if (s <= this.startingAlertClock && s > 0) {
                document.getElementById("timer-button").style.backgroundColor =
                    "red";
                document.getElementById("timer-box-text").style.color = "white";
                document.getElementById("timer-box-text").style.fontSize =
                    "300%";
                document.getElementById("timer-box-text").innerHTML =
                    (s - (s %= 60)) / 60 +
                    (10 < s ? ":" : ":0") +
                    Math.trunc(s);
            } else {
                document.getElementById("timer-box-text").innerHTML =
                    (s - (s %= 60)) / 60 +
                    (10 < s ? ":" : ":0") +
                    Math.trunc(s);
            }
        }
    }

    resize() {
        this.config.width = window.innerWidth;
        this.config.height = window.innerHeight;

        this.renderer.setSize(this.config.width, this.config.height);

        if (this.camera) this.camera.resize();
    }

    destroy() {}
}

function setPhysics() {
    let physics = new CANNON.World();
    physics.gravity.set(0, -25, 0);
    // physics.defaultContactMaterial.contactEquationStiffness = 1e9;
    // physics.defaultContactMaterial.contactEquationRelaxation = 4;
    // physics.solver.tolerance = 0.01;
    physics.frictionGravity = new CANNON.Vec3(0, 0, 0);
    return physics;
}

async function setScene() {
    let scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222244);
    //in order to obtain a good effect the fog color and the background color needs to be the same
    //starting parameters = THREE.Fog(0x222244, 1, 30)
    scene.fog = new THREE.Fog(0x222244, 50, 300);

    let progressBar = document.getElementById("progress-bar");

    const manager = new THREE.LoadingManager();

    manager.onProgress = (url, loaded, total) => {
        progressBar.value = (loaded / total) * 100;
    };

    manager.onLoad = function () {
        // document.getElementById("loading-screen").style.opacity = 0;
        // document.getElementById("landing-page").style.opacity = 1;
    };

    // Wait for models to be loaded
    const models = await new Models(manager).loadModels();

    for (const model of models) {
        scene.add(model);
    }

    return scene;
}

async function setTextures() {
    return new Models().loadTextures();
}
