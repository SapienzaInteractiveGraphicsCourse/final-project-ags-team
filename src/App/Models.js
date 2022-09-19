import * as THREE from "../three/build/three.module.js";
import { GLTFLoader } from "../three/loaders/GLTFLoader.js";
import { MODELS_INFO, TEXTURES_INFO } from "./Utils/Constants.js";

export default class Models {
    constructor(manager) {
        this.gltfLoader = new GLTFLoader(manager);
        this.textureLoader = new THREE.TextureLoader();
    }

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

    setupModel(data, name) {
        let model = data.scene;
        model.name = name;

        return model;
    }

    setupTexture(data, name) {
        data.name = name;

        return data;
    }
}
