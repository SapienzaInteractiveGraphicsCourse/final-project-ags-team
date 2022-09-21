// MODELS

const MODELS_BASE_PATH = "models/";
export const MODELS_INFO = [
    { name: "robotExpressive", path: MODELS_BASE_PATH + "RobotExpressive.glb" },
    { name: "mainRoom.sciFiCrate", path: MODELS_BASE_PATH + "sci-fi_crate/scene.gltf" },
    { name: "mainRoom.desk", path: MODELS_BASE_PATH + "desk.glb" },
    { name: "mainRoom.oscilloscope", path: MODELS_BASE_PATH + "oscilloscope.glb" },
    { name: "mainRoom.desk3", path: MODELS_BASE_PATH + "desk3.glb" },
    { name: "mainRoom.caldurun", path: MODELS_BASE_PATH + "calduron.glb" },
    { name: "mainRoom.redButton", path: MODELS_BASE_PATH + "redButton.glb" },
    { name: "mainRoom.sign", path: MODELS_BASE_PATH + "sign.glb" },
    { name: "mainRoom.bucket", path: MODELS_BASE_PATH + "bucket.glb" },
    { name: "mainRoom.hologramConsole", path: MODELS_BASE_PATH + "hologramConsole/scene.gltf" },
    { name: "mainRoom.scifiTerminal", path: MODELS_BASE_PATH + "scifiTerminal/scene.gltf" },
    { name: "mainRoom.finalDoor", path: MODELS_BASE_PATH + "finalDoor/scene.glb" },
    { name: "mainRoom.slideDoor.left.rear", path: MODELS_BASE_PATH + "slideDoor/scene.gltf" },
    { name: "mainRoom.key", path: MODELS_BASE_PATH + "key.glb" },
    { name: "mainRoom.pinPad", path: MODELS_BASE_PATH + "security_pin_pad/scene.gltf" },
    { name: "mainRoom.notepad", path: MODELS_BASE_PATH + "notepad.glb" },
    { name: "mainRoom.scifiTable", path: MODELS_BASE_PATH + "sci-fi_table.glb" },
    { name: "mainRoom.arrow", path: MODELS_BASE_PATH + "arrow.glb" },
    { name: "trophyRoom.cup", path: MODELS_BASE_PATH + "rocket_league_cuptrophy/scene.gltf" }
];

// TEXTURES

const TEXTURES_BASE_PATH = "textures/";
export const TEXTURES_INFO = [
    { name: "mainRoom.wall.baseColor", path: TEXTURES_BASE_PATH + "wall-base_color.png" },
    { name: "mainRoom.wall.normal", path: TEXTURES_BASE_PATH + "wall-normal.png" },
    { name: "mainRoom.ground.baseColor", path: TEXTURES_BASE_PATH + "ground-base_color.png" },
    { name: "mainRoom.ground.normal", path: TEXTURES_BASE_PATH + "ground-normal.png" },
    { name: "trophyRoom.ground.baseColor", path: TEXTURES_BASE_PATH + "ground-metal-base_color.jpg" },
    { name: "trophyRoom.ground.normal", path: TEXTURES_BASE_PATH + "ground-metal-normal.jpg" },
    { name: "trophyRoom.ground.metallic", path: TEXTURES_BASE_PATH + "ground-metal-metallic.jpg" },
    { name: "trophyRoom.ground.roughness", path: TEXTURES_BASE_PATH + "ground-metal-roughness.jpg" },
    { name: "trophyRoom.ground.ambientOcclusion", path: TEXTURES_BASE_PATH + "ground-metal-ambient_occlusion.jpg" }
];

// OBJECTS PARAMS

// Dimensions

export const GROUND_SIZE = { width: 60, height: 60 };
export const PERIMETER_WALL_SIZE = { width: GROUND_SIZE.width, height: 15, depth: 1 };
export const FINAL_DOOR_SCALE_FACTOR = 0.08
export const SLIDE_DOOR_SCALE_FACTOR = 0.03;
export const DOOR_WIDTH = 4;
export const CORRIDOR_WIDTH = 10.94;

export const WALL_COLOR = "sandybrown";


// DIFFICULTY PARAMETERS
export const EASY_TIMER = 241;
export const MEDIUM_TIMER = 121;
export const HARD_TIMER = 91;