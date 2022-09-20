# Markdown Tutorial

-   elenco puntato
-   elenco puntato

1. elenco numerato
2. elenco numerato

_corsivo_
**grassetto**

`codice inline`

```
codice block
```

Immagine:
![Hierarchy Graph](https://drive.google.com/uc?export=view&id=1VCxoD21S64IP4Z4D9WBu0c8XVd3u0-1x)

## Bonus

$$
\begin{align}
E_1 = \Delta U_1 T + \Delta V_1 B \\
E_2 = \Delta U_2 T + \Delta V_2 B
\end{align}
$$

# Objects

The entire scene is composed by the following objects:
//TODO

## Grounds

There are actually three flat grounds:

-   the ground of the main space subdivided in smaller room;
-   the ground of the narrow hallway beyond the final room;
-   the ground of the final space reachable through the above-mentioned hallway.

### Create

All the three ones are realized as `PlaneBufferGeometry` with `MeshPhongMaterial`; a specific texture is bound to the material.

The code for realizing them is put in common with the help of a function in `src > App > Utils > RoomFunctions.js`:

```
export function create_ground(w, h, texture) {
    const geometry = new THREE.PlaneBufferGeometry(w, h);
    const material = new  THREE.MeshPhongMaterial({
        map: texture.baseColor,
        bumpMap: texture.normal
    });

    return new THREE.Mesh(geometry, material);
}
```

### Instantiate

The rectangular shapes are put in place exploiting some transformations. As an example, let's see some snippets of code for instantiating the ground of the final space from `src > App > Utils > ThrophyRoom.js`:

```
[...]
		targetName = "trophyRoom.ground";
        object = this.objects[targetName];
        objectSize = this.groundsSize[targetName];

        referenceName = "trophyRoom.hallway.ground";
        referencePosition = get_center(this.objects[referenceName]);
        referenceSize = this.groundsSize[referenceName];

        object.position.set(referencePosition.x, referencePosition.y, referencePosition.z);
        object.rotation.x = -Math.PI/2;
        object.translateY(referenceSize.height/2 + objectSize.height/2);
[...]
```

Note that the actual transformations are parameterized by the dimensions of the other objects of the scene, thus becoming robust to an eventual resizing of the environment.

## Walls

Within the scene there are 14 walls. We can classify them among two main groups:

-   Standard walls, i.e. the flat ones, without holes.
-   Walls with doors, i.e. the ones which have a hole in correspondence of the respective door.

### Standard

#### Create

They are realized as `BoxBufferGeometry` with `MeshPhongMaterial`; a specific texture is bound to the material.

The code for realizing them is put in common with the help of a function in `src > App > Utils > RoomFunctions.js`:

```
export function create_wall(w, h, d, segments, texture) {
    const geometry = new THREE.BoxBufferGeometry(w, h, d, segments, segments, segments);
    const material = new  THREE.MeshPhongMaterial({
        map: texture.baseColor,
        bumpMap: texture.normal
    });

    return new THREE.Mesh(geometry, material);
}
```

#### Instantiate

The parallelepipeds are put in place exploiting some transformations. As an example, let's see some snippets of code for instantiating one of the standard walls of the main space from `src > App > Utils > MainRoom.js`:

```
[...]
        object = this.objects["mainRoom.wall.big.vertical.right"];
        object.translateY(PERIMETER_WALL_SIZE.height / 2);
        object.translateX(GROUND_SIZE.width / 2 + this.wallSizeMap.get("mainRoom.wall.big.vertical.right").width / 2);
[...]
```

Note that the actual transformations are parameterized by the dimensions of the other objects of the scene, thus becoming robust to an eventual resizing of the environment.

### With Door

#### Create

They are realized as `ExtrudeGeometry` (_ThreeJS_ object for extruding a 2D shape to a 3D geometry), on the basis of a custom-defined `Shape`, paired with `MeshPhongMaterial`; a specific texture is bound to the material.

The code for realizing them is put in common with the help of a function in `src > App > Utils > RoomFunctions.js`:

```
export function create_wall_with_door(wallSize, doorSize, texture) {
    const wallPoints = {
        A: {x: -wallSize.width/2, y: 0},
        B: {x: wallSize.width/2, y: 0},
        C: {x: wallSize.width/2, y: wallSize.height},
        D: {x: -wallSize.width/2, y: wallSize.height}
    };
    const doorPoints = {
        A: {x: -doorSize.width/2, y: 0},
        B: {x: doorSize.width/2, y: 0},
        C: {x: doorSize.width/2, y: doorSize.height},
        D: {x: -doorSize.width/2, y: doorSize.height}
    };

    const wallShape = new THREE.Shape();
    wallShape.moveTo(wallPoints.A.x, wallPoints.A.y);
    wallShape.lineTo(wallPoints.B.x, wallPoints.B.y);
    wallShape.lineTo(wallPoints.C.x, wallPoints.C.y);
    wallShape.lineTo(wallPoints.D.x, wallPoints.D.y);

    const doorPath = new THREE.Path();
    doorPath.moveTo(doorPoints.A.x, doorPoints.A.y);
    doorPath.lineTo(doorPoints.B.x, doorPoints.B.y);
    doorPath.lineTo(doorPoints.C.x, doorPoints.C.y);
    doorPath.lineTo(doorPoints.D.x, doorPoints.D.y);

    wallShape.holes.push(doorPath);
    const extrudeGeometry = new THREE.ExtrudeGeometry(wallShape, {depth: wallSize.depth, bevelEnabled: false})

    // it's necessary to apply these settings in order to correctly display the texture on a shape geometry
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 0.05, 0.05 );
    const material = new THREE.MeshPhongMaterial({
        map: texture
    });
    const wall = new THREE.Mesh(extrudeGeometry, material);

    return wall;
}
```

The basic shape and the hole within it are modeled respecting this planar points pattern:

![Extrude Geometry Shape - Wall](TODO)

#### Instantiate

The extruded parallelepipeds are put in place exploiting some transformations. As an example, let's see some snippets of code for instantiating one of the walls with hole of the main space from `src > App > Utils > MainRoom.js`:

```
[...]
        objectName = "mainRoom.wall.big.vertical.withDoor";
        object = this.objects[objectName];
        object.rotation.y = Math.PI / 2;
        objectMeasure = get_measure(object);
        object.translateZ((GROUND_SIZE.width / 2 - this.wallSizeMap.get("mainRoom.wall.small.horizontal").width));

[...]
```

Note that the actual transformations are parameterized by the dimensions of the other objects of the scene, thus becoming robust to an eventual resizing of the environment.

## //TODO Imported Models

The imported models used in the project are located in `src > models`.

Here a complete list of them, with the indication of their original source (the names used in the list recall the ones assigned to the corresponding _ThreeJS_ objects after the import):

-   [robotExpressive](https://github.com/mrdoob/three.js/tree/master/examples/models/gltf/RobotExpressive)
-   [sciFiCrate](https://sketchfab.com/3d-models/gart-130-task-2-sci-fi-crate-b0e057741926412fbcebb4bc74fd775d)
-   [desk](https://sketchfab.com/3d-models/lab-table-a6585466b3bb4417bd0338c74328b209)
-   [oscilloscope](https://sketchfab.com/3d-models/oscillograph-2e045af8198542a4b8d06d1d736c840b)
-   [desk2](https://sketchfab.com/3d-models/lab-bench-1ac2a62c52a848bbaf746146dc7253f8)
-   [desk3](https://sketchfab.com/3d-models/lab-bench-1ac2a62c52a848bbaf746146dc7253f8)
-   [caldurun](https://market.pmnd.rs/model/cauldron)
-   [redButton](https://sketchfab.com/3d-models/red-button-e7685cccf7364682bc6a7883d0b8c503)
-   [sign](TODO)
-   [bucket](https://market.pmnd.rs/model/wood-bucket)
-   [hologramConsole](https://sketchfab.com/3d-models/hologram-console-bfbbb481e98e4be38774b1d0204c192c)
-   [scifiTerminal](https://sketchfab.com/3d-models/sci-fi-terminal-04af7eacb07541fe848bc8a258577858)
-   [finalDoor](https://sketchfab.com/3d-models/sci-fi-door-c6a6ef337b6c4f51ba68c2f0708c9622)
-   [slideDoor](https://sketchfab.com/3d-models/blast-doors-59ecab6f05a14ab490a11f4107384324)
-   [key](https://sketchfab.com/3d-models/key-7a0f6aaffe604d65bb560955990ce68b)
-   [pinPad](https://sketchfab.com/3d-models/security-pin-pad-2d72f06a3ce64fdab40b858b5107f843)
-   [notepad](https://sketchfab.com/3d-models/notepad-b09de807134b49eeb6e752ac2dc4e853)
-   [scifiTable](https://sketchfab.com/3d-models/sci-fi-table-simple-f7c3a3e44a144cb190bdd318da293b10)
-   [arrow](https://sketchfab.com/3d-models/arrow-7b62dae60f2c4443b9f499c833171ca5)
-   [cup](https://sketchfab.com/3d-models/rocket-league-cuptrophy-1bffb11f751641048ceb5f4704448d1a)

### Load

All the models are loaded with the help of `GLTFLoader` according with and asynchronous workflow whose progress is tracked with `LoadingManager`. The source code is located in a dedicated JS class `src > App > Models.js`:

```
async loadModels() {
	let promises, models;
	promises = models = [];

	for(const info of MODELS_INFO) {
		promises = promises.concat(this.gltfLoader.loadAsync(info.path))
	}
	const rawModels = await Promise.all(promises);

	for(let i=0; i<rawModels.length; i++) {
		models = models.concat(this.setupModel(rawModels[i], MODELS_INFO[i].name));
	}

	return models;
}
```

For letting the user start the interaction with the full scene already loaded, the above-mentioned functions are awaited since the whole application start-up.

`src > index.js`:

```
import Main from "./App/Main.js";

init();

async function init() {
    await Main.build();
}
```

`src > App > Main.js`:

```
static async build() {
	let scene = await setScene();
	[...]
	return new Main({
		[...]
		scene: scene,
		[...]
	});
}

[...]

async function setScene() {
    let scene = new THREE.Scene();
    [...]
    let progressBar = document.getElementById("progress-bar");

    const manager = new THREE.LoadingManager();

    manager.onProgress = (url, loaded, total) => {
        progressBar.value = (loaded / total) * 100;
    };

    manager.onLoad = function () {
        console.log("Just finished loading models");
        document.getElementById("loading-screen").style.opacity = 0;
        document.getElementById("landing-page").style.opacity = 1;
    };

    // Wait for models to be loaded
    const models = await new Models(manager).loadModels();

    for (const model of models) {
        scene.add(model);
    }

    return scene;
}
```

### Instantiate

The static objects are put in place exploiting some transformations. As an example, let's see some snippets of code for instantiating one of the slide doors of the main space from `src > App > Utils > MainRoom.js`:

```
[...]
        object = this.objects["mainRoom.slideDoor.left.rear"];
        object.scale.set(SLIDE_DOOR_SCALE_FACTOR, SLIDE_DOOR_SCALE_FACTOR, SLIDE_DOOR_SCALE_FACTOR);
        objectSize = get_measure(object);
        position = get_center(this.objects["mainRoom.wall.small.vertical.rear.withDoor"]);
        object.position.set(position.x, 0, position.z);
[...]
```

Note that the actual transformations are parameterized by the dimensions of the other objects of the scene, thus becoming robust to an eventual resizing of the environment.

## Utils

Several different functions are exploited to accomplish common tasks relative to object instantiation, etc.
We report here some of the most meaningful

### get_center

`src > App > Utils > Functions.js`:

```
export function get_center(object) {
    [...]
    let center = new vec3();
    let box = new THREE.Box3().setFromObject(object);
    box.getCenter(center);
    [...]
    return center;
}
```

This function exploits the properties of _ThreeJS_ bounding boxes for computing the position center of a given object.

### get_measure

`src > App > Utils > Functions.js`:

```
export function get_measure(object) {
    [...]
    let measure = new vec3();
    let box = new THREE.Box3().setFromObject(object);
    box.getSize(measure);
    [...]
    return measure;
}
```

This function exploits the properties of _ThreeJS_ bounding boxes for computing the sizes of a given object with respect to the three cardinal axes.

# Lights and Textures

## Lights

//TODO

## Textures

The imported textures used in the project are located in `src > textures`.

Here a complete list of them, with the indication of their original source:

-   [ground](https://sketchfab.com/3d-models/star-wars-the-clone-wars-venator-prefab-8a1e1760391c4ac6a50373c2bf5efa2e)
-   [ground-metal](https://3dtextures.me/2021/09/23/sci-fi-metal-plate-003/)
-   [wall](https://sketchfab.com/3d-models/star-wars-the-clone-wars-venator-prefab-8a1e1760391c4ac6a50373c2bf5efa2e)

### Load

All the textures are loaded with the help of `TextureLoader` according with an asynchronous workflow. The source code is located in a dedicated JS class `src > App > Models.js`:

```
async loadTextures() {
	let promises, textures;
	promises = textures = [];

	for(const info of TEXTURES_INFO) {
		promises = promises.concat(this.textureLoader.loadAsync(info.path))
	}
	const rawTextures = await Promise.all(promises);

	for(let i=0; i<rawTextures.length; i++) {
		textures = textures.concat(this.setupTexture(rawTextures[i], TEXTURES_INFO[i].name));
	}

	return textures;
}
```

For letting the user start the interaction with the full scene already loaded, the above-mentioned functions are awaited since the whole application start-up.

`src > index.js`:

```
import Main from "./App/Main.js";

init();

async function init() {
    await Main.build();
}
```

`src > App > Main.js`:

```
static async build() {
	let textures = await setTextures();
	[...]
	return new Main({
		[...]
		textures: textures,
		[...]
	});
}

[...]

async function setTextures() {
    return new Models().loadTextures();
}
```

### Apply

#### Ground

The texture named _ground_ is applied to the ground of the main space, providing also a bump mapping. We can see here some code snippets from `src > App > MainRoom.js`:

```
[...]
	create() {
        let mesh, texture;

        /**
         * Ground
         */

        texture = {
            baseColor: this.main.textures.find(e => e.name == "mainRoom.ground.baseColor"),
            normal: this.main.textures.find(e => e.name == "mainRoom.ground.normal")
        }

        mesh = create_ground(GROUND_SIZE.width, GROUND_SIZE.height, texture);
        [...]
    }
```

and from `src > App > Utils > RoomFunctions.js`:

```
export function create_ground(w, h, texture) {
	[...]
	const material = new  THREE.MeshPhongMaterial({
        map: texture.baseColor,
        bumpMap: texture.normal
    });
	[...]
}
```

#### Ground-Metal

The texture named _ground-metal_ is applied to the ground of the rear space, the one which contains the trophy, providing also:

-   normal mapping,
-   roughness mapping,
-   metalness mapping,
-   ambient occlusion mapping.

We can see here some code snippets from `src > App > TrophyRoom.js`:

```
[...]
	create() {
        let objectName, mesh, size, texture;

        /**
         * Grounds
         */

        texture = new Map([
            ["baseColor", this.main.textures.find(e => e.name == "trophyRoom.ground.baseColor")],
            ["normal", this.main.textures.find(e => e.name == "trophyRoom.ground.normal")],
            ["metallic", this.main.textures.find(e => e.name == "trophyRoom.ground.metallic")],
            ["roughness", this.main.textures.find(e => e.name == "trophyRoom.ground.roughness")],
            ["ambientOcclusion", this.main.textures.find(e => e.name == "trophyRoom.ground.ambientOcclusion")]
        ]);
        for(let [label, tex] of texture) {
            configure_texture(tex, {u: 7, v: 15}, THREE.RepeatWrapping);
        }

        objectName = "trophyRoom.hallway.ground";
        size = this.groundsSize[objectName];
        mesh = create_ground(size.width, size.height, null);
        apply_texture(texture, mesh);
        mesh.name = objectName;

        [...]

        texture = clone_texture(texture);
        for(let [label, tex] of texture) {
            configure_texture(tex, {u: 12, v: 12}, THREE.RepeatWrapping);
        }

        objectName = "trophyRoom.ground";
        size = this.groundsSize[objectName];
        mesh = create_ground(size.width, size.height, null);
        apply_texture(texture, mesh);
    }
```

Observe that this texture is applied following a repetition pattern which has different parameters for the hallway ground and for the main room ground, with the aim of adapting the theme to the different planar dimensions.

#### Wall

The texture named _wall_ is applied to all the walls within the scene, but with different mappings for the flat walls and the extruded ones.

The standard walls receive the texture exactly with the same bump mapping already discussed for the ground.

Texture application on the extruded walls, instead, consists in a custom mapping which exploits texture's base color only in `src > App > Utils > RoomFunctions.js`:

```
export function create_wall_with_door(wallSize, doorSize, texture) {
	[...]
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 0.05, 0.05 );
    const material = new THREE.MeshPhongMaterial({
        map: texture
    });
    const wall = new THREE.Mesh(extrudeGeometry, material);
    [...]
}
```

The reason why these adjustments are needed can be summarized stating that `ShapeGeometry` uses vertex position values in order to generate UV data; this means the texture coordinates of `ShapeGeometry` exceed the usual range of \[0,1\]; thus without scaling you won’t get proper results.

### Utils

Several different functions are exploited to accomplish common tasks relative to textures.
We report here some of the most meaningful

#### configure_texture

```
export function configure_texture(texture, repeat, wrap) {
    texture.repeat.set(repeat.u, repeat.v);
    texture.wrapS = texture.wrapT = wrap;

    return texture;
}
```

`wrapS` and `wrapT` properties define, respectively, how the texture is wrapped horizontally/vertically and corresponds to "U"/"V" in UV mapping. Wrapping parameters determine what happens if the texture coordinates _s_ and _t_ are outside the (0,1) range. In many cases in this project the "repeat" approach is adopted: the texture repeats itself infinite times along both axes.
`repeat` property defines how many times the texture is repeated across the surface, in each direction U and V.

#### apply_texture

```
export function apply_texture(texture, mesh) {
    if(texture.get("normal") != null
        && texture.get("metallic") != null
        && texture.get("roughness") != null
        && texture.get("ambientOcclusion") != null) {
            mesh.material = new THREE.MeshStandardMaterial({
                map: texture.get("baseColor"),
                normalMap: texture.get("normal"),
                roughnessMap: texture.get("roughness"),
                metalnessMap: texture.get("metallic"),
                aoMap: texture.get("ambientOcclusion")
            });
    }
    else if(texture.get("normal") != null) {
        mesh.material = new THREE.MeshPhongMaterial({
            map: texture.get("baseColor"),
            bumpMap: texture.get("normal")
        });
    }
    else {
        mesh.material = new THREE.MeshPhongMaterial({
            map: texture.get("baseColor"),
        });
    }

    return mesh;
}
```

It applies the given texture to the given mesh. Note that `texture` parameter is actually a `Map` which could contain information about several mappings to be bound to the texture. If many mappings are present, the mesh needs a `MeshStandardMaterial` for a correct application of all of them. On the contrary, if the texture is paired with just a normal mapping, a `MeshPhongMaterial` with a bump mapping is chosen as performance-saving solution.

# Physical Engine

In order to give a realistic feel to the game we decided to implement a physical engine. After some research we elected `cannon-es` as best candidate. `Cannon-es` is a lightweight engine and a maintained fork of the more famous library cannon.js. It creates an alternative world where physics is present and each object inside this world is affected by the laws of physics decided by the parameters. Any object in the physical world is called `body` and it can be linked to any three.js mesh. In this way we obtained a realistic game with gravity and collisions. Each body have different properties like mass or material. If a body has a mass equals to 0 it means that it is a static and it will not be affected by any kind of force. In the following image we can appreciate all the bodies linked with threejs meshes in the scene.

![Physical Bodies](images/collision%20boxes.png?raw=true)

It's clearly visible that the lateral walls are higher that the meshes, this is to prevent the player falling out of the map.
There is also an invisible wall in front of the map that has the same scope.

## Robot collision box

In order to make the robot interact with the environment we created a body that act like a collision box, then we linked them movement of the collision box to the movement of the robot’s mesh. The movement of the box is obtained by updating the velocity of the body along the x and z axis.

## Jump

In the same way as we update the horizontal velocity to make the robot move, we can update the y velocity to make the robot perform a jump. In order to not make the robot jump even when it’s in the air we created a list that contains the objects on top of which the robot can jump. Every time the robot collide with one of this the variable “canJump” is updated to true. Clearly when the robot is touching the ground the variable “canJump” is always true.

# User Interaction

# Animation

## Robot Animation
