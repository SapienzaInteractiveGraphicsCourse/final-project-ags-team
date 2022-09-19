import * as THREE from "../three/build/three.module.js";
import * as CANNON from "../three/libs/cannon-es.js";
import Main from "./Main.js";
import Character from "./Character.js";
import { GUI } from "../three/libs/lil-gui.module.min.js";
import Models from "./Models.js";
import MainRoom from "./MainRoom.js";
import { CORRIDOR_WIDTH, GROUND_SIZE } from "./Utils/Constants.js";
import TrophyRoom from "./TrophyRoom.js";

export default class World {
    constructor() {
        this.main = new Main();
        this.scene = this.main.scene;
        this.gui = this.main.gui;
        this.physics = this.main.physics;
        this.setWorld();
        this.setLights();
        [this.mainRoom, this.trophyRoom] = this.setRooms();
        this.setCharacter();
        this.clock = new THREE.Clock();
    }

    setWorld() {
        /**
         * GROUND
         */

        const groundBody = new CANNON.Body({
            type: CANNON.Body.STATIC, // can also be achieved by setting the mass to 0
            shape: new CANNON.Box(new CANNON.Vec3(30, 1, 30)),
        });
        groundBody.position.set(0, -1, 0);
        groundBody.name = "ground";
        this.physics.addBody(groundBody);
    }

    setLights() {
        this.directionalLight = new THREE.DirectionalLight(0x8888ff, 2);
        this.directionalLight.position.set(30, 60, 30);
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.camera.near = 10;
        this.directionalLight.shadow.camera.far = 150;
        this.directionalLight.shadow.camera.right = 60;
        this.directionalLight.shadow.camera.left = -60;
        this.directionalLight.shadow.camera.top = 60;
        this.directionalLight.shadow.camera.bottom = -60;
        this.directionalLight.shadow.mapSize.width = (1024 * 2) / 3;
        this.directionalLight.shadow.mapSize.height = (1024 * 2) / 3;
        this.directionalLight.shadow.radius = 4;
        this.directionalLight.shadow.bias = -0.0005;
        this.scene.add(this.directionalLight);

        // let directionalLightHelper = new THREE.DirectionalLightHelper(this.directionalLight);
        // this.scene.add(directionalLightHelper);

        this.directionalLight2 = new THREE.DirectionalLight(
            "cornflowerBlue",
            2
        );
        this.directionalLight2.position.set(-30, 40, 30);
        this.directionalLight2.castShadow = false;
        this.scene.add(this.directionalLight2);

        // let directionalLightHelper2 = new THREE.DirectionalLightHelper(this.directionalLight2);
        // this.scene.add(directionalLightHelper2);

        this.directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.3);
        this.directionalLight3.position.set(0, 40, 50);
        this.directionalLight3.castShadow = false;
        this.scene.add(this.directionalLight3);

        let target = new THREE.Object3D();
        target.translateX(15);
        this.directionalLight3.target = target;
        this.scene.add(target);

        // let directionalLightHelper3 = new THREE.DirectionalLightHelper(this.directionalLight3);
        // this.scene.add(directionalLightHelper3);

        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(this.ambientLight);

        this.pointLight = new THREE.PointLight("gold", 2, 120.0, 2);
        this.pointLight.position.set(0, 20, -80);
        this.scene.add(this.pointLight);

        // this.scene.add(new THREE.PointLightHelper(this.pointLight));

        this.pointLightCup = new THREE.PointLight("white", 2, 30.0);
        this.pointLightCup.position.set(0, 2, -85);
        this.scene.add(this.pointLightCup);

        // this.scene.add(new THREE.PointLightHelper(this.pointLightCup));
    }

    setRooms() {
        return [new MainRoom(), new TrophyRoom()];
    }

    setCharacter() {
        this.character = new Character();
    }

    update() {
        this.character.update();
        this.mainRoom.update();
        this.directionalLight3.target.updateMatrixWorld();
    }
}
