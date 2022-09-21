import Main from "./Main.js";
import * as THREE from "../three/build/three.module.js";
import * as CANNON from "../three/libs/cannon-es.js";
import {
    add_axes_helper,
    add_box_helper,
    get_center,
    get_measure,
    enableShadows,
    focus_on,
    configure_texture,
    apply_texture,
    clone_texture,
} from "./Utils/Functions.js";
import {
    SLIDE_DOOR_SCALE_FACTOR,
    GROUND_SIZE,
    PERIMETER_WALL_SIZE,
    WALL_COLOR,
    FINAL_DOOR_SCALE_FACTOR,
    CORRIDOR_WIDTH,
} from "./Utils/Constants.js";
import { create_ground, create_wall } from "./Utils/RoomFunctions.js";

export default class TrophyRoom {
    constructor() {
        this.main = new Main();
        this.scene = this.main.scene;
        this.physics = this.main.physics;
        this.objects = this.get_room_objects();
        [this.finalDoorSize, this.groundsSize, this.wallsSize] =
            this.compute_objects_sizes();
        this.add_bodies();

        this.init();
    }

    get_room_objects() {
        let objects = {};

        for (const object of this.scene.children) {
            const name = object.name;
            if (name.includes("trophyRoom") || name == "mainRoom.finalDoor") {
                objects[name] = object;

                //XXX debugging
                // add_axes_helper(object);
                // add_box_helper(object);
            }
        }

        return objects;
    }

    compute_objects_sizes() {
        let groundsSize = {};
        let wallsSize = {};

        const finalDoor = this.objects["mainRoom.finalDoor"].clone();
        finalDoor.scale.set(
            FINAL_DOOR_SCALE_FACTOR,
            FINAL_DOOR_SCALE_FACTOR,
            FINAL_DOOR_SCALE_FACTOR
        );
        const finalDoorMeasure = get_measure(finalDoor);
        const finalDoorSize = {
            width: finalDoorMeasure.x,
            height: finalDoorMeasure.y,
            depth: finalDoorMeasure.z,
        };

        groundsSize["trophyRoom.hallway.ground"] = {
            width: finalDoorSize.width,
            height: (2 / 3) * GROUND_SIZE.height,
        };
        groundsSize["trophyRoom.ground"] = {
            width: GROUND_SIZE.width / 2,
            height: GROUND_SIZE.height / 2,
        };

        const wallHeight = PERIMETER_WALL_SIZE.height;
        const wallDepth = PERIMETER_WALL_SIZE.depth;
        wallsSize["mainRoom.wall.perimeter.rear.withDoor"] = {
            width: PERIMETER_WALL_SIZE.width,
            height: wallHeight,
            depth: finalDoorSize.depth,
        };
        wallsSize["trophyRoom.hallway.wall.left"] = {
            width: groundsSize["trophyRoom.hallway.ground"].height,
            height: wallHeight,
            depth: wallDepth,
        };
        wallsSize["trophyRoom.hallway.wall.right"] =
            wallsSize["trophyRoom.hallway.wall.left"];
        wallsSize["trophyRoom.wall.left"] = {
            width: groundsSize["trophyRoom.ground"].height,
            height: wallHeight,
            depth: wallDepth,
        };
        wallsSize["trophyRoom.wall.right"] = wallsSize["trophyRoom.wall.left"];
        wallsSize["trophyRoom.wall.rear"] = {
            width: groundsSize["trophyRoom.ground"].width + wallDepth,
            height: wallHeight,
            depth: wallDepth,
        };
        wallsSize["trophyRoom.wall.front.left"] = {
            width:
                (groundsSize["trophyRoom.ground"].width -
                    groundsSize["trophyRoom.hallway.ground"].width) /
                    2 +
                wallDepth -
                0.6,
            height: wallHeight,
            depth: wallDepth,
        };
        wallsSize["trophyRoom.wall.front.right"] =
            wallsSize["trophyRoom.wall.front.left"];

        return [finalDoorSize, groundsSize, wallsSize];
    }

    init() {
        this.create();
        this.instantiate();
    }

    create() {
        let objectName, mesh, size, texture;

        /**
         * Grounds
         */

        texture = new Map([
            [
                "baseColor",
                this.main.textures.find(
                    (e) => e.name == "trophyRoom.ground.baseColor"
                ),
            ],
            [
                "normal",
                this.main.textures.find(
                    (e) => e.name == "trophyRoom.ground.normal"
                ),
            ],
            [
                "metallic",
                this.main.textures.find(
                    (e) => e.name == "trophyRoom.ground.metallic"
                ),
            ],
            [
                "roughness",
                this.main.textures.find(
                    (e) => e.name == "trophyRoom.ground.roughness"
                ),
            ],
            [
                "ambientOcclusion",
                this.main.textures.find(
                    (e) => e.name == "trophyRoom.ground.ambientOcclusion"
                ),
            ],
        ]);
        for (let [label, tex] of texture) {
            configure_texture(tex, { u: 7, v: 15 }, THREE.RepeatWrapping);
        }

        objectName = "trophyRoom.hallway.ground";
        size = this.groundsSize[objectName];
        mesh = create_ground(size.width, size.height, null);
        apply_texture(texture, mesh);
        mesh.name = objectName;
        this.objects[objectName] = mesh;
        this.scene.add(mesh);

        texture = clone_texture(texture);
        for (let [label, tex] of texture) {
            configure_texture(tex, { u: 12, v: 12 }, THREE.RepeatWrapping);
        }

        objectName = "trophyRoom.ground";
        size = this.groundsSize[objectName];
        mesh = create_ground(size.width, size.height, null);
        apply_texture(texture, mesh);
        mesh.name = objectName;
        this.objects[objectName] = mesh;
        this.scene.add(mesh);

        /**
         * Walls
         */

        texture = {
            baseColor: this.main.textures.find(
                (e) => e.name == "mainRoom.wall.baseColor"
            ),
            normal: this.main.textures.find(
                (e) => e.name == "mainRoom.wall.normal"
            ),
        };

        for (var name in this.wallsSize) {
            if (!name.includes("trophyRoom")) continue;

            const size = this.wallsSize[name];
            mesh = create_wall(
                size.width,
                size.height,
                size.depth,
                32,
                texture
            );
            mesh.name = name;
            this.objects[name] = mesh;
            this.scene.add(mesh);
        }

        /**
         * Cup
         */

        let cup = this.objects["trophyRoom.cup"];
        let scaleFactor = 40;
        cup.scale.set(scaleFactor, scaleFactor, scaleFactor);
        cup.position.set(0, 0, -92);
        //XXX debugging
        // focus_on(cup, this.main.cameraControls);
    }

    instantiate() {
        let object,
            objectSize,
            targetName,
            referenceName,
            referenceSize,
            referencePosition,
            scaleFactor;

        /**
         * Grounds
         */

        // Hallway Ground

        targetName = "trophyRoom.hallway.ground";
        object = this.objects[targetName];
        objectSize = this.groundsSize[targetName];

        referenceName = "mainRoom.wall.perimeter.rear.withDoor";
        referenceSize = this.wallsSize[referenceName];

        object.rotation.x = -Math.PI / 2;
        object.translateY(
            GROUND_SIZE.height / 2 + referenceSize.depth + objectSize.height / 2
        );

        // Room Ground

        targetName = "trophyRoom.ground";
        object = this.objects[targetName];
        objectSize = this.groundsSize[targetName];

        referenceName = "trophyRoom.hallway.ground";
        referencePosition = get_center(this.objects[referenceName]);
        referenceSize = this.groundsSize[referenceName];

        object.position.set(
            referencePosition.x,
            referencePosition.y,
            referencePosition.z
        );
        object.rotation.x = -Math.PI / 2;
        object.translateY(referenceSize.height / 2 + objectSize.height / 2);

        /**
         * Walls
         */

        // Hallway Left Wall

        targetName = "trophyRoom.hallway.wall.left";
        object = this.objects[targetName];
        objectSize = this.wallsSize[targetName];

        object.position.set(
            referencePosition.x,
            referencePosition.y,
            referencePosition.z
        );
        object.rotation.y = -Math.PI / 2;
        object.translateY(objectSize.height / 2);
        object.translateZ(referenceSize.width / 2 + 0.6);

        // Hallway Right Wall

        targetName = "trophyRoom.hallway.wall.right";
        object = this.objects[targetName];
        objectSize = this.wallsSize[targetName];

        object.position.set(
            referencePosition.x,
            referencePosition.y,
            referencePosition.z
        );
        object.rotation.y = -Math.PI / 2;
        object.translateY(objectSize.height / 2);
        object.translateZ(-referenceSize.width / 2 - 0.6);

        // Room Left Wall

        targetName = "trophyRoom.wall.left";
        object = this.objects[targetName];
        objectSize = this.wallsSize[targetName];

        referenceName = "trophyRoom.ground";
        referencePosition = get_center(this.objects[referenceName]);
        referenceSize = this.groundsSize[referenceName];

        object.position.set(
            referencePosition.x,
            referencePosition.y,
            referencePosition.z
        );
        object.rotation.y = -Math.PI / 2;
        object.translateY(objectSize.height / 2);
        object.translateZ(referenceSize.width / 2);

        // Room Right Wall

        targetName = "trophyRoom.wall.right";
        object = this.objects[targetName];
        objectSize = this.wallsSize[targetName];

        object.position.set(
            referencePosition.x,
            referencePosition.y,
            referencePosition.z
        );
        object.rotation.y = -Math.PI / 2;
        object.translateY(objectSize.height / 2);
        object.translateZ(-referenceSize.width / 2);

        // Room Rear Wall

        targetName = "trophyRoom.wall.rear";
        object = this.objects[targetName];
        objectSize = this.wallsSize[targetName];

        object.position.set(
            referencePosition.x,
            referencePosition.y,
            referencePosition.z
        );
        object.translateY(objectSize.height / 2);
        object.translateZ(-referenceSize.height / 2);

        // Room Front Left Wall

        targetName = "trophyRoom.wall.front.left";
        object = this.objects[targetName];
        objectSize = this.wallsSize[targetName];

        object.position.set(
            referencePosition.x,
            referencePosition.y,
            referencePosition.z
        );
        object.translateY(objectSize.height / 2);
        object.translateZ(referenceSize.height / 2);
        object.translateX(
            -(
                referenceSize.width / 2 -
                objectSize.width / 2 +
                objectSize.depth / 2
            )
        );

        // Room Front Left Wall

        targetName = "trophyRoom.wall.front.right";
        object = this.objects[targetName];
        objectSize = this.wallsSize[targetName];

        object.position.set(
            referencePosition.x,
            referencePosition.y,
            referencePosition.z
        );
        object.translateY(objectSize.height / 2);
        object.translateZ(referenceSize.height / 2);
        object.translateX(
            referenceSize.width / 2 -
                objectSize.width / 2 +
                objectSize.depth / 2
        );
    }

    add_bodies() {
        let newBody, object, objectSize;

        /**
         * HALLWAY WALLS BODIES
         */
        objectSize = this.wallsSize["trophyRoom.hallway.wall.left"];

        newBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(
                new CANNON.Vec3(
                    objectSize.depth / 2,
                    objectSize.height / 2,
                    objectSize.width / 2
                )
            ),
        });
        newBody.position.y = objectSize.height / 2;
        newBody.position.x = CORRIDOR_WIDTH - 1.5;
        newBody.position.z = -50;
        this.physics.addBody(newBody);

        newBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(
                new CANNON.Vec3(
                    objectSize.depth / 2,
                    objectSize.height / 2,
                    objectSize.width / 2
                )
            ),
        });
        newBody.position.y = objectSize.height / 2;
        newBody.position.x = -(CORRIDOR_WIDTH - 1.5);
        newBody.position.z = -50;
        this.physics.addBody(newBody);

        // ADDON HALLWAY WALL LEFT
        newBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(
                new CANNON.Vec3(objectSize.depth / 2, objectSize.height / 2, 3)
            ),
        });
        newBody.position.y = objectSize.height / 2;
        newBody.position.x = -(CORRIDOR_WIDTH - 1.5);
        newBody.position.z = -74;
        this.physics.addBody(newBody);

        // ADDON HALLWAY WALL RIGHT
        newBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(
                new CANNON.Vec3(objectSize.depth / 2, objectSize.height / 2, 3)
            ),
        });
        newBody.position.y = objectSize.height / 2;
        newBody.position.x = CORRIDOR_WIDTH - 1.5;
        newBody.position.z = -74;
        this.physics.addBody(newBody);

        /**
         * HALLWAY GROUND BODY
         */
        objectSize = this.groundsSize["trophyRoom.hallway.ground"];
        newBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(
                new CANNON.Vec3(objectSize.width / 2, 1, objectSize.height / 2)
            ),
        });
        newBody.position.z = -50;
        newBody.position.y = -1;
        this.physics.addBody(newBody);

        newBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(objectSize.width / 2, 1, 4)),
        });
        newBody.position.z = -74;
        newBody.position.y = -1;
        this.physics.addBody(newBody);

        /**
         * ROOM BODIES
         */

        // GROUND
        objectSize = this.groundsSize["trophyRoom.ground"];
        newBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(
                new CANNON.Vec3(objectSize.width / 2, 1, objectSize.height / 2)
            ),
        });
        newBody.position.z = -91.5;
        newBody.position.y = -1;
        this.physics.addBody(newBody);

        //WALLS

        //RIGHT WALL
        objectSize = this.wallsSize["trophyRoom.wall.right"];
        newBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(
                new CANNON.Vec3(
                    objectSize.depth / 2,
                    objectSize.height / 2,
                    objectSize.width / 2
                )
            ),
        });
        newBody.position.z = -91.5;
        newBody.position.y = objectSize.height / 2;
        newBody.position.x = 15;
        this.physics.addBody(newBody);

        //LEFT WALL
        objectSize = this.wallsSize["trophyRoom.wall.right"];
        newBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(
                new CANNON.Vec3(
                    objectSize.depth / 2,
                    objectSize.height / 2,
                    objectSize.width / 2
                )
            ),
        });
        newBody.position.z = -91.5;
        newBody.position.y = objectSize.height / 2;
        newBody.position.x = -15;
        this.physics.addBody(newBody);

        //REAR WALL
        newBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(
                new CANNON.Vec3(
                    objectSize.width / 2,
                    objectSize.height / 2,
                    objectSize.depth / 2
                )
            ),
        });
        newBody.position.z = -106.5;
        newBody.position.y = objectSize.height / 2;
        this.physics.addBody(newBody);

        //ADDON LEFT FRONT WALL SMALL
        newBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(
                new CANNON.Vec3(3, objectSize.height / 2, objectSize.depth / 2)
            ),
        });
        newBody.position.y = objectSize.height / 2;
        newBody.position.x = -(CORRIDOR_WIDTH + 1.5);
        newBody.position.z = -76.5;
        this.physics.addBody(newBody);

        //ADDON RIGHT FRONT WALL SMALL
        newBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(
                new CANNON.Vec3(3, objectSize.height / 2, objectSize.depth / 2)
            ),
        });
        newBody.position.y = objectSize.height / 2;
        newBody.position.x = CORRIDOR_WIDTH + 1.5;
        newBody.position.z = -76.5;
        this.physics.addBody(newBody);

        /**
         * CUP
         */
        newBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(3, 10, 3)),
        });
        newBody.position.x = 0;
        newBody.position.y = 0;
        newBody.position.z = -92;
        this.physics.addBody(newBody);
    }
}
