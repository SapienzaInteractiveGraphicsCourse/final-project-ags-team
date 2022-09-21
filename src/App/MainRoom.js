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
} from "./Utils/Functions.js";
import {
    SLIDE_DOOR_SCALE_FACTOR,
    GROUND_SIZE,
    PERIMETER_WALL_SIZE,
    FINAL_DOOR_SCALE_FACTOR,
    DOOR_WIDTH,
    CORRIDOR_WIDTH,
} from "./Utils/Constants.js";
import {
    create_ground,
    create_wall,
    create_wall_with_door,
} from "./Utils/RoomFunctions.js";
import { openLeftDoor, openRightDoor, openFinalDoor } from "./Animations.js";
export default class MainRoom {
    constructor() {
        this.main = new Main();
        this.scene = this.main.scene;
        this.physics = this.main.physics;
        this.objects = this.get_room_objects();
        [
            this.wallSizeMap,
            this.finalDoorSize,
            this.slideDoorSize,
            this.bodies,
        ] = this.compute_walls_and_doors_sizes();
        this.init();
    }

    get_room_objects() {
        let objects = {};

        for (const object of this.scene.children) {
            const name = object.name;
            if (name.includes("mainRoom")) {
                objects[name] = object;

                //XXX debugging
                // add_axes_helper(object);
                // add_box_helper(object);
            }
        }

        return objects;
    }

    compute_walls_and_doors_sizes() {
        const slideDoor = this.objects["mainRoom.slideDoor.left.rear"].clone();
        slideDoor.scale.set(
            SLIDE_DOOR_SCALE_FACTOR,
            SLIDE_DOOR_SCALE_FACTOR,
            SLIDE_DOOR_SCALE_FACTOR
        );
        const slideDoorMeasure = get_measure(slideDoor);
        const slideDoorSize = {
            width: slideDoorMeasure.z,
            height: slideDoorMeasure.y,
            depth: slideDoorMeasure.x,
        };

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

        const wallsSize = new Map([
            [
                "mainRoom.wall.perimeter.rear.withDoor",
                {
                    width: PERIMETER_WALL_SIZE.width,
                    height: PERIMETER_WALL_SIZE.height,
                    depth: finalDoorSize.depth,
                },
            ],
            [
                "mainRoom.wall.small.horizontal",
                {
                    width: GROUND_SIZE.width / 3,
                    height: PERIMETER_WALL_SIZE.height,
                    depth: slideDoorSize.depth,
                },
            ],
            [
                "mainRoom.wall.small.vertical.rear.withDoor",
                {
                    width: GROUND_SIZE.height / 2,
                    height: PERIMETER_WALL_SIZE.height,
                    depth: slideDoorSize.depth,
                },
            ],
            [
                "mainRoom.wall.small.vertical.front.withDoor",
                {
                    width: GROUND_SIZE.height / 2,
                    height: PERIMETER_WALL_SIZE.height,
                    depth: slideDoorSize.depth,
                },
            ],
            [
                "mainRoom.wall.big.vertical.withDoor",
                {
                    width: GROUND_SIZE.height,
                    height: PERIMETER_WALL_SIZE.height,
                    depth: slideDoorSize.depth,
                },
            ],
            [
                "mainRoom.wall.big.vertical.right",
                {
                    width: slideDoorSize.depth,
                    height: PERIMETER_WALL_SIZE.height,
                    depth: GROUND_SIZE.height,
                },
            ],
            [
                "mainRoom.wall.big.vertical.left",
                {
                    width: slideDoorSize.depth,
                    height: PERIMETER_WALL_SIZE.height,
                    depth: GROUND_SIZE.height,
                },
            ],
        ]);

        const bodies = new Map([
            [
                "mainRoom.wall.perimeter.rear.withDoor",
                {
                    size: {
                        width: PERIMETER_WALL_SIZE.width,
                        height: PERIMETER_WALL_SIZE.height,
                        depth: finalDoorSize.depth,
                    },
                },
            ],
            [
                "mainRoom.wall.small.horizontal.body",
                {
                    size: {
                        width: GROUND_SIZE.width / 3,
                        height: slideDoorSize.height,
                        depth: slideDoorSize.depth,
                    },
                },
            ],
            [
                "mainRoom.wall.big.vertical.right",
                {
                    size: {
                        width: slideDoorSize.depth,
                        height: PERIMETER_WALL_SIZE.height,
                        depth: GROUND_SIZE.height,
                    },
                },
            ],
            [
                "mainRoom.wall.big.vertical.left",
                {
                    size: {
                        width: slideDoorSize.depth,
                        height: PERIMETER_WALL_SIZE.height,
                        depth: GROUND_SIZE.height,
                    },
                },
            ],
        ]);

        return [wallsSize, finalDoorSize, slideDoorSize, bodies];
    }

    init() {
        this.create();
        this.instantiate();
    }

    create() {
        let mesh, texture;

        /**
         * Ground
         */

        texture = {
            baseColor: this.main.textures.find(
                (e) => e.name == "mainRoom.ground.baseColor"
            ),
            normal: this.main.textures.find(
                (e) => e.name == "mainRoom.ground.normal"
            ),
        };

        mesh = create_ground(GROUND_SIZE.width, GROUND_SIZE.height, texture);
        mesh.name = "mainRoom.ground";
        this.objects["mainRoom.ground"] = mesh;
        mesh.position.set(0, -0.1, 0);
        mesh.receiveShadow = true;
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
        const shapeGeomTexture = texture.baseColor.clone();

        for (const [name, size] of this.wallSizeMap) {
            if (name.includes("withDoor")) {
                let doorSize = null;
                if (name.includes("perimeter")) {
                    doorSize = this.finalDoorSize;
                } else {
                    doorSize = this.slideDoorSize;
                }
                mesh = create_wall_with_door(size, doorSize, shapeGeomTexture);
            } else {
                mesh = create_wall(
                    size.width,
                    size.height,
                    size.depth,
                    32,
                    texture
                );
            }

            mesh.name = name;
            this.objects[name] = mesh;
            this.scene.add(mesh);
        }
    }

    instantiate() {
        let object,
            body,
            newBody,
            objectSize,
            objectName,
            scaleFactor,
            position;

        /**
         * Ground
         */

        object = this.objects["mainRoom.ground"];
        object.rotation.x = -Math.PI / 2;

        /**
         * Walls
         */

        newBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(
                new CANNON.Vec3(GROUND_SIZE.width / 2, 10, 1)
            ),
        });
        newBody.position.y = 10;
        newBody.position.z = GROUND_SIZE.height / 2 + 0.5;
        this.physics.addBody(newBody);

        /**
         * WALL REAR WITH DOOR
         */
        objectName = "mainRoom.wall.perimeter.rear.withDoor";
        object = this.objects[objectName];
        object.translateZ(
            -(GROUND_SIZE.height / 2 + this.wallSizeMap.get(objectName).depth)
        );

        let finalDoor = this.objects["mainRoom.finalDoor"];
        objectSize = get_measure(finalDoor);

        body = this.bodies.get("mainRoom.wall.big.vertical.right");
        newBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(
                new CANNON.Vec3(
                    body.size.depth / 6,
                    body.size.height / 2,
                    body.size.width / 2
                )
            ),
        });
        newBody.position.z =
            -GROUND_SIZE.height / 2 -
            this.wallSizeMap.get("mainRoom.wall.big.vertical.right").width / 2;
        newBody.position.y = this.wallSizeMap.get(objectName).height / 2;
        newBody.position.x -= 20;
        this.physics.addBody(newBody);

        newBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(
                new CANNON.Vec3(
                    body.size.depth / 6,
                    body.size.height / 2,
                    body.size.width / 2
                )
            ),
        });
        newBody.position.z =
            -GROUND_SIZE.height / 2 -
            this.wallSizeMap.get("mainRoom.wall.big.vertical.right").width / 2;
        newBody.position.y = this.wallSizeMap.get(objectName).height / 2;
        newBody.position.x += 20;
        this.physics.addBody(newBody);

        /**
         * BODY OF FINAL DOOR
         */

        this.finalDoorBody = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Box(
                new CANNON.Vec3(4.0, body.size.height / 2, objectSize.z * 0.04)
            ),
        });
        this.finalDoorBody.position.z =
            -GROUND_SIZE.height / 2 - (objectSize.z * 0.08) / 2;
        this.finalDoorBody.position.y =
            this.wallSizeMap.get(objectName).height / 2;
        this.finalDoorBody.name = "mainRoom.finalDoor";
        this.physics.addBody(this.finalDoorBody);

        // document.getElementById("open-final-door").onclick = () => {
        //     this.finalDoorBody.collisionFilterMask = 0;
        //     let door =
        //         this.scene.getObjectByName("mainRoom.finalDoor").children[0]
        //             .children[0].children[0];
        //     let elem1 = door.children[0].children[0].children[1];
        //     console.log(elem1);
        //     openFinalDoor(elem1);
        // };

        newBody = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Box(
                new CANNON.Vec3(4.0, body.size.height / 2, objectSize.z * 0.04)
            ),
        });
        newBody.position.z =
            -GROUND_SIZE.height / 2 - (objectSize.z * 0.08) / 2;
        newBody.position.y = this.wallSizeMap.get(objectName).height / 2;
        newBody.position.x = 8.0;
        this.physics.addBody(newBody);

        newBody = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Box(
                new CANNON.Vec3(4.0, body.size.height / 2, objectSize.z * 0.04)
            ),
        });
        newBody.position.z =
            -GROUND_SIZE.height / 2 - (objectSize.z * 0.08) / 2;
        newBody.position.y = this.wallSizeMap.get(objectName).height / 2;
        newBody.position.x = -8.0;
        this.physics.addBody(newBody);

        /**
         * WALL RIGHT
         */
        object = this.objects["mainRoom.wall.big.vertical.right"];
        object.translateY(PERIMETER_WALL_SIZE.height / 2);
        object.translateX(
            GROUND_SIZE.width / 2 +
                this.wallSizeMap.get("mainRoom.wall.big.vertical.right").width /
                    2
        );

        body = this.bodies.get("mainRoom.wall.big.vertical.right");
        newBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(
                new CANNON.Vec3(
                    body.size.width / 2,
                    body.size.height,
                    body.size.depth / 2
                )
            ),
        });
        newBody.position.y = PERIMETER_WALL_SIZE.height;
        newBody.position.x =
            GROUND_SIZE.width / 2 +
            this.wallSizeMap.get("mainRoom.wall.big.vertical.right").width / 2;
        this.physics.addBody(newBody);

        /**
         * WALL LEFT
         */
        object = this.objects["mainRoom.wall.big.vertical.left"];
        object.translateY(PERIMETER_WALL_SIZE.height / 2);
        object.translateX(
            -GROUND_SIZE.width / 2 -
                this.wallSizeMap.get("mainRoom.wall.big.vertical.right").width /
                    2
        );

        body = this.bodies.get("mainRoom.wall.big.vertical.left");
        newBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(
                new CANNON.Vec3(
                    body.size.width / 2,
                    body.size.height,
                    body.size.depth / 2
                )
            ),
        });
        newBody.position.y = PERIMETER_WALL_SIZE.height;
        newBody.position.x =
            -GROUND_SIZE.width / 2 -
            this.wallSizeMap.get("mainRoom.wall.big.vertical.right").width / 2;
        this.physics.addBody(newBody);

        /**
         * WALL SMALL HORIZONTAL
         */
        objectName = "mainRoom.wall.small.horizontal";
        object = this.objects[objectName];
        object.translateY(this.wallSizeMap.get(objectName).height / 2);
        object.translateX(-this.wallSizeMap.get(objectName).width);

        body = this.bodies.get("mainRoom.wall.small.horizontal.body");
        newBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(
                new CANNON.Vec3(
                    body.size.width / 2,
                    body.size.height / 2,
                    body.size.depth / 2
                )
            ),
        });
        newBody.position.y = this.wallSizeMap.get(objectName).height / 2;
        newBody.position.x = -this.wallSizeMap.get(objectName).width;
        this.physics.addBody(newBody);

        /**
         * WALL SMALL VERTICAL REAR WITH DOOR
         */
        objectName = "mainRoom.wall.small.vertical.rear.withDoor";
        object = this.objects[objectName];
        let objectMeasure = get_measure(object);
        object.rotation.y = Math.PI / 2;
        object.translateX(this.wallSizeMap.get(objectName).width / 2);
        object.translateZ(
            -(
                GROUND_SIZE.width / 2 -
                this.wallSizeMap.get("mainRoom.wall.small.horizontal").width
            ) - this.wallSizeMap.get(objectName).depth
        );

        newBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(
                new CANNON.Vec3(
                    objectMeasure.z / 2,
                    objectMeasure.y / 2,
                    objectMeasure.x / 4 - DOOR_WIDTH / 2
                )
            ),
        });
        newBody.position.z =
            object.position.z + 2 * DOOR_WIDTH + objectMeasure.z;
        newBody.position.x = -CORRIDOR_WIDTH;
        newBody.position.y = objectMeasure.y / 2;
        this.physics.addBody(newBody);

        newBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(
                new CANNON.Vec3(
                    objectMeasure.z / 2,
                    objectMeasure.y / 2,
                    objectMeasure.x / 4 - DOOR_WIDTH / 2
                )
            ),
        });
        newBody.position.z =
            object.position.z - 2 * DOOR_WIDTH - objectMeasure.z;
        newBody.position.x = -CORRIDOR_WIDTH;
        newBody.position.y = objectMeasure.y / 2;
        this.physics.addBody(newBody);

        /**
         * WALL SMALL VERTICAL FRONT WITH DOOR
         */
        objectName = "mainRoom.wall.small.vertical.front.withDoor";
        object = this.objects[objectName];
        object.rotation.y = Math.PI / 2;
        object.translateX(-this.wallSizeMap.get(objectName).width / 2);
        object.translateZ(
            -(
                GROUND_SIZE.width / 2 -
                this.wallSizeMap.get("mainRoom.wall.small.horizontal").width
            ) - this.wallSizeMap.get(objectName).depth
        );

        newBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(
                new CANNON.Vec3(
                    objectMeasure.z / 2,
                    objectMeasure.y / 2,
                    objectMeasure.x / 4 - DOOR_WIDTH / 2
                )
            ),
        });
        newBody.position.z =
            object.position.z + 2 * DOOR_WIDTH + objectMeasure.z;
        newBody.position.x = -CORRIDOR_WIDTH;
        newBody.position.y = objectMeasure.y / 2;
        this.physics.addBody(newBody);

        newBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(
                new CANNON.Vec3(
                    objectMeasure.z / 2,
                    objectMeasure.y / 2,
                    objectMeasure.x / 4 - DOOR_WIDTH / 2
                )
            ),
        });
        newBody.position.z =
            object.position.z - 2 * DOOR_WIDTH - objectMeasure.z;
        newBody.position.x = -CORRIDOR_WIDTH;
        newBody.position.y = objectMeasure.y / 2;
        this.physics.addBody(newBody);

        /**
         * WALL BIG VERTICAL WITH DOOR
         */
        objectName = "mainRoom.wall.big.vertical.withDoor";
        object = this.objects[objectName];
        object.rotation.y = Math.PI / 2;
        objectMeasure = get_measure(object);
        object.translateZ(
            GROUND_SIZE.width / 2 -
                this.wallSizeMap.get("mainRoom.wall.small.horizontal").width
        );

        newBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(
                new CANNON.Vec3(
                    objectMeasure.x / 2,
                    objectMeasure.y / 2,
                    objectMeasure.z / 4 - DOOR_WIDTH / 2
                )
            ),
        });
        newBody.position.y = objectMeasure.y / 2;
        newBody.position.x = CORRIDOR_WIDTH;
        newBody.position.z =
            get_center(
                this.objects["mainRoom.wall.small.vertical.rear.withDoor"]
            ).z - 2.5;
        this.physics.addBody(newBody);

        newBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(
                new CANNON.Vec3(
                    objectMeasure.x / 2,
                    objectMeasure.y / 2,
                    objectMeasure.z / 4 - DOOR_WIDTH / 2
                )
            ),
        });
        newBody.position.y = objectMeasure.y / 2;
        newBody.position.x = CORRIDOR_WIDTH;
        newBody.position.z =
            -get_center(
                this.objects["mainRoom.wall.small.vertical.rear.withDoor"]
            ).z + 2.5;
        this.physics.addBody(newBody);

        /**
         * Slide Doors
         */

        /**
         * SLIDE DOOR REAR LEFT
         */
        object = this.objects["mainRoom.slideDoor.left.rear"];
        object.scale.set(
            SLIDE_DOOR_SCALE_FACTOR,
            SLIDE_DOOR_SCALE_FACTOR,
            SLIDE_DOOR_SCALE_FACTOR
        );
        objectSize = get_measure(object);
        position = get_center(
            this.objects["mainRoom.wall.small.vertical.rear.withDoor"]
        );
        object.position.set(position.x, 0, position.z);

        const newRearLeftDoorBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(
                get_measure(object).divide(new CANNON.Vec3(2, 2, 2))
            ),
        });
        newRearLeftDoorBody.position.copy(object.position);
        newRearLeftDoorBody.position.y = position.y / 2;
        newRearLeftDoorBody.name = "mainRoom.slideDoor.left.rear";
        this.physics.addBody(newRearLeftDoorBody);

        // document.getElementById("open-left-rear-door").onclick = () => {
        //     newRearLeftDoorBody.collisionFilterMask = 0;
        //     let l = this.scene.getObjectByName("mainRoom.slideDoor.left.rear")
        //         .children[0].children[0].children[0];
        //     let r = this.scene.getObjectByName("mainRoom.slideDoor.left.rear")
        //         .children[0].children[0].children[1];
        //     console.log(l);
        //     console.log(r);
        //     openLeftDoor(l);
        //     openRightDoor(r);
        // };

        /**
         * SLIDE DOOR FRONT LEFT
         */
        object = object.clone();
        object.name = "mainRoom.slideDoor.left.front";
        this.objects["mainRoom.slideDoor.left.front"] = object;
        this.scene.add(object);
        position = get_center(
            this.objects["mainRoom.wall.small.vertical.front.withDoor"]
        );
        object.position.set(position.x, 0, position.z);

        const newFrontLeftDoorBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(
                get_measure(object).divide(new CANNON.Vec3(2, 2, 2))
            ),
        });
        newFrontLeftDoorBody.position.copy(object.position);
        newFrontLeftDoorBody.position.y = position.y / 2;
        newFrontLeftDoorBody.name = "mainRoom.slideDoor.left.front";
        this.physics.addBody(newFrontLeftDoorBody);

        // document.getElementById("open-left-front-door").onclick = () => {
        //     newFrontLeftDoorBody.collisionFilterMask = 0;
        //     let l = this.scene.getObjectByName("mainRoom.slideDoor.left.front")
        //         .children[0].children[0].children[0];
        //     let r = this.scene.getObjectByName("mainRoom.slideDoor.left.front")
        //         .children[0].children[0].children[1];
        //     openLeftDoor(l);
        //     openRightDoor(r);
        // };

        // add_axes_helper(object);
        // add_box_helper(object);
        // const target = get_center(object)
        // this.main.cameraControls.target.set(target.x, target.y, target.z);

        let door = object.children[0].children[0];
        let leftDoor = door.children[0];
        let rightDoor = door.children[1];

        /**
         * SLIDE DOOR RIGHT
         */
        object = object.clone();
        object.name = "mainRoom.slideDoor.right";
        this.objects["mainRoom.slideDoor.right"] = object;
        this.scene.add(object);
        position = get_center(
            this.objects["mainRoom.wall.big.vertical.withDoor"]
        );
        object.position.set(position.x, 0, position.z);

        const newRightDoorBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(
                get_measure(object).divide(new CANNON.Vec3(2, 2, 2))
            ),
        });
        newRightDoorBody.position.copy(object.position);
        newRightDoorBody.position.y = position.y / 2;
        newRightDoorBody.name = "mainRoom.slideDoor.right";
        this.physics.addBody(newRightDoorBody);

        // document.getElementById("open-right-door").onclick = () => {
        //     newRightDoorBody.collisionFilterMask = 0;
        //     let l = this.scene.getObjectByName("mainRoom.slideDoor.right")
        //         .children[0].children[0].children[0];
        //     let r = this.scene.getObjectByName("mainRoom.slideDoor.right")
        //         .children[0].children[0].children[1];
        //     openLeftDoor(l);
        //     openRightDoor(r);
        // };

        /**
         * Desk
         */

        object = this.scene.getObjectByName("mainRoom.desk");

        object.position.set(16, 1.5, -28);
        enableShadows(object);
        object.scale.set(3, 3, 3);

        let height = 5;

        newBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(4, height, 2)),
        });
        newBody.position.copy(object.position);
        newBody.position.y = height;
        this.physics.addBody(newBody);


        /**
         * Desk3
         */

        object = this.scene.getObjectByName("mainRoom.desk3");

        object.position.set(28.5, 1.5, -15);
        object.rotation.y = -Math.PI / 2;
        enableShadows(object);
        object.scale.set(3, 3, 3);

        height = 5;

        newBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(1.5, height, 4)),
        });
        newBody.position.copy(object.position);
        newBody.position.y = height;
        this.physics.addBody(newBody);

        /**
         * Oscilloscope
         */

        object = this.scene.getObjectByName("mainRoom.oscilloscope");

        object.scale.set(0.1, 0.1, 0.1);
        object.position.set(-CORRIDOR_WIDTH - 2, 0, 5);
        enableShadows(object);

        newBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(1, 1.5, 1.5)),
        });
        newBody.position.copy(object.position);
        newBody.position.y = get_measure(object).y / 2;
        this.physics.addBody(newBody);

        /**
         * Caldurun
         */

        object = this.scene.getObjectByName("mainRoom.caldurun");

        object.position.set(
            -CORRIDOR_WIDTH + 2.2 * get_measure(object).x,
            0,
            0
        );
        enableShadows(object);
        object.scale.set(2.5, 2.5, 2.5);

        newBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(1.5, 1.5, 1.5)),
        });
        newBody.position.copy(object.position);
        newBody.position.y = get_measure(object).y / 2;
        newBody.name = "calduron";
        this.physics.addBody(newBody);

        /**
         * Red Button
         */

        object = this.scene.getObjectByName("mainRoom.redButton");

        object.position.set(30, 13, 23);
        object.scale.set(0.5, 0.5, 0.5);
        object.rotation.z = Math.PI / 2;
        enableShadows(object);

        /**
         * Sign
         */

        object = this.scene.getObjectByName("mainRoom.sign");

        object.position.set(23, 0, -27);
        object.rotation.set(-Math.PI / 10, -Math.PI / 2, 0);
        object.scale.set(1.8, 1.8, 1.8);
        enableShadows(object);

        /**
         * Bucket
         */

        object = this.scene.getObjectByName("mainRoom.bucket");

        object.position.set(-27, 1, -27);
        object.scale.set(3.5, 2.7, 3.5);
        enableShadows(object);

        height = 1;

        newBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(1.5, height, 1.5)),
        });
        newBody.position.copy(object.position);
        newBody.position.y = height;
        newBody.name = "bucket";
        this.physics.addBody(newBody);

        const bucketLight = new THREE.PointLight("deeppink", 2, 4);
        bucketLight.position.copy(object.position);
        bucketLight.castShadow = false;
        this.scene.add(bucketLight);

        /**
         * Final Door
         */

        object = this.objects["mainRoom.finalDoor"];

        // Scale
        scaleFactor = 0.08;
        object.scale.set(scaleFactor, scaleFactor, scaleFactor);

        objectSize = get_measure(object);

        // Translate
        object.translateZ(-(GROUND_SIZE.height / 2 + objectSize.z / 4));

        /**
         * Hologram Console
         */

        object = this.objects["mainRoom.hologramConsole"];

        object.scale.set(2.5, 2.5, 2.5);
        objectSize = get_measure(object);
        object.rotation.y = -Math.PI / 2;

        object.translateY(objectSize.y / 2);
        object.position.x = -28;
        object.position.z = 26;

        height = 5;

        newBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(1.5, height, 3)),
        });
        newBody.position.copy(object.position);
        newBody.position.y = height;
        this.physics.addBody(newBody);

        /**
         * Sci-fi Terminal
         */

        this.sciFiTerminal = this.objects["mainRoom.scifiTerminal"];
        this.sciFiTerminal.scale.set(2.5, 4.3, 2.5);
        objectSize = get_measure(this.sciFiTerminal);
        this.sciFiTerminal.translateX(
            -GROUND_SIZE.width / 2 + objectSize.x / 2
        );
        this.sciFiTerminal.translateZ(GROUND_SIZE.height / 4);
        this.sciFiTerminal.traverse(function (node) {
            if (node instanceof THREE.Mesh) {
                node.castShadow = true;
            }
        });

        height = 6;

        this.sciFiTerminalBody = new CANNON.Body({
            mass: 80,
            shape: new CANNON.Box(new CANNON.Vec3(1.5, height, 1.5)),
            material: new CANNON.Material({ friction: 1000 }),
        });

        this.sciFiTerminalBody.position.copy(this.sciFiTerminal.position);
        this.sciFiTerminalBody.position.y = height;
        this.physics.addBody(this.sciFiTerminalBody);

        /**
         * Key
         */

        object = this.scene.getObjectByName("mainRoom.key");
        object.scale.set(0.05, 0.05, 0.05);
        object.position.set(-4.5, 1, -26);
        object.rotation.z = Math.PI / 2;

        /**
         * PinPad
         */

        object = this.objects["mainRoom.pinPad"];
        object.scale.set(0.3, 0.3, 0.3);
        object.rotation.y = -Math.PI / 2;
        object.position.set(CORRIDOR_WIDTH - 1, 3, 8);

        /**
         * NotePad
         */

        object = this.objects["mainRoom.notepad"];
        object.position.set(-29.4, 0.8, 15);
        object.rotation.y = Math.PI;
        object.rotation.z = Math.PI / 2.5;

        /**
         * Sci-fi Crate [on the ground]
         */

        object = this.scene.getObjectByName("mainRoom.sciFiCrate");
        object.scale.set(0.7, 0.7, 0.7);
        object.position.set(28, 0.5, 15);
        object.traverse(function (node) {
            if (node instanceof THREE.Mesh) {
                node.castShadow = true;
            }
        });

        let crateHeight = 1.8;

        newBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(1.6, crateHeight, 1.6)),
        });
        newBody.position.copy(object.position);
        newBody.position.x -= 0.6;
        newBody.position.z -= 0.7;
        newBody.position.y = crateHeight;
        newBody.name = "crate";
        this.physics.addBody(newBody);

        /**
         * Pile of 2 crates
         */

        object = object.clone();
        object.position.x -= 8;
        this.scene.add(object);

        object = object.clone();
        object.position.y += crateHeight * 2;
        this.scene.add(object);

        newBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(1.6, 2 * crateHeight, 1.6)),
        });
        newBody.position.copy(object.position);
        newBody.position.x -= 0.6;
        newBody.position.z -= 0.7;
        newBody.position.y = 2 * crateHeight;
        newBody.name = "crate";
        this.physics.addBody(newBody);

        /**
         * Pile of 3 crates
         */

        object = object.clone();
        object.position.z += 8;
        object.position.y = 0.5;
        this.scene.add(object);

        object = object.clone();
        object.position.y += crateHeight * 2;
        this.scene.add(object);

        object = object.clone();
        object.position.y += crateHeight * 2;
        this.scene.add(object);

        newBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(1.6, 3 * crateHeight, 1.6)),
        });
        newBody.position.copy(object.position);
        newBody.position.x -= 0.6;
        newBody.position.z -= 0.7;
        newBody.position.y = 3 * crateHeight;
        newBody.name = "crate";
        this.physics.addBody(newBody);

        object = object.clone();
        object.position.x += 8;
        object.position.y = 0.5;
        this.scene.add(object);

        object = object.clone();
        object.position.y += crateHeight * 2;
        this.scene.add(object);

        object = object.clone();
        object.position.y += crateHeight * 2;
        this.scene.add(object);

        newBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(1.6, 3 * crateHeight, 1.6)),
        });
        newBody.position.copy(object.position);
        newBody.position.x -= 0.6;
        newBody.position.z -= 0.7;
        newBody.position.y = 3 * crateHeight;
        newBody.name = "crate";
        this.physics.addBody(newBody);

        /**
         * Sci-fi Table
         */

        object = this.objects["mainRoom.scifiTable"];
        scaleFactor = 0.028;
        object.scale.set(scaleFactor, scaleFactor, scaleFactor);
        objectSize = get_measure(object);

        object.rotation.y = -Math.PI / 2;
        object.translateZ(-(GROUND_SIZE.width / 2 - objectSize.z / 2));
        object.traverse(function (node) {
            if (node instanceof THREE.Mesh) {
                node.castShadow = true;
            }
        });

        newBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(
                new CANNON.Vec3(
                    objectSize.z / 2,
                    objectSize.y / 2 - 0.8,
                    objectSize.x / 2
                )
            ),
        });
        newBody.position.copy(object.position);
        newBody.position.y = (objectSize.y - 0.9) / 2;
        newBody.name = "scifi-table";
        this.physics.addBody(newBody);

        /**
         * Arrow
         */

        object = this.objects["mainRoom.arrow"];
        object.scale.set(0.5, 0.5, 0.5);
        object.position.set(-30, 6, 18);
        object.rotation.y = Math.PI;
        object.rotation.z = Math.PI / 2;
        object.visible = false;

        /**
         * Arrow bucket
         */

        object = object.clone();
        object.name = "mainRoom.arrowBucket";
        this.objects["mainRoom.arrowBucket"] = object;
        object.position.set(-30, 9, -21);
        object.rotation.x = (3 * Math.PI) / 4;
        //object.visible = true;
        //object.rotation.y = Math.PI;

        //object.rotation.z = Math.PI / 2;
        this.scene.add(object);

        /**
         * Arrow pinpad
         */
        object = object.clone();
        object.name = "mainRoom.arrowPinpad";
        this.objects["mainRoom.arrowPinpad"] = object;
        object = object.clone();
        object.position.set(8, -0.2, 7);
        object.rotation.x = Math.PI;
        object.rotation.y = Math.PI / 2;
        object.rotation.z = Math.PI;
        this.scene.add(object);

        /**
         * Arrow button
         */

        object = object.clone();
        object.name = "mainRoom.arrowButton";
        this.objects["mainRoom.arrowButton"] = object;
        object.position.set(30, 13, 19);
        object.rotation.y = 2 * Math.PI;
        object.rotation.z = Math.PI / 2;
        this.scene.add(object);
        //object.scale.set(0.5, 0.5, 0.5)

        /**
         * Cube bulb right
         */

        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        object = new THREE.Mesh(geometry, material);
        object.name = "bulbRight";
        this.objects["bulbRight"] = object;
        object.position.set(10.1, 11.5, 0);
        //object.material.color.set(0x00ff00);
        this.scene.add(object);

        /**
         * Cube bulb left rear
         */
        object = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.5, 0.5),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
        );
        object.name = "bulbLeftRear";
        this.objects["bulbLeftRear"] = object;
        object.position.set(-10.1, 11.5, -15);
        //object.material.color.set(0x006600);
        this.scene.add(object);

        /**
         * Cube bulb left front
         *
         */
        object = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.5, 0.5),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
        );
        object.name = "bulbLeftFront";
        this.objects["bulbLeftFront"] = object;
        object.position.set(-10.1, 11.5, 15);
        //object.material.color.set(0x006600);
        this.scene.add(object);
    }

    update() {
        this.sciFiTerminalBody.position.x = this.sciFiTerminal.position.x;
        this.sciFiTerminal.position.z = this.sciFiTerminalBody.position.z;
        if (this.sciFiTerminalBody.position.z <= 4.0)
            this.sciFiTerminalBody.position.z = 4.0;
    }
}
