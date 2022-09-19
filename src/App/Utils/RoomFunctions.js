import * as THREE from "../../three/build/three.module.js";

export function create_ground(w, h, texture) {
    let mesh

    const geometry = new THREE.PlaneBufferGeometry(w, h);
    if(texture != null) {
        const material = new THREE.MeshPhongMaterial({ 
            map: texture.baseColor,
            bumpMap: texture.normal
        });
        mesh = new THREE.Mesh(geometry, material);
    }
    else
        mesh = new THREE.Mesh(geometry);

    return mesh;

    //XXX deleteMe
    // this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
    // this.ground.rotation.x = -Math.PI / 2;
    // this.ground.receiveShadow = true;
    // this.ground.castShadow = true;
    // this.ground.name = "ground";
    // this.scene.add(this.ground);
}

export function create_wall(w, h, d, segments, texture) {
    const geometry = new THREE.BoxBufferGeometry(w, h, d, segments, segments, segments);
    //XXX deleteMe
    // let material = new THREE.MeshStandardMaterial({
    //     color: color,
    // });
    const material = new  THREE.MeshPhongMaterial({ 
        map: texture.baseColor,
        bumpMap: texture.normal
    }); 

    return new THREE.Mesh(geometry, material);
}

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
    //XXX deleteMe
    // const material = new THREE.MeshStandardMaterial({
    //     color: color
    // });

    // it's necessary to apply these settings in order to correctly display the texture on a shape geometry
    //XXX ??? parameters to be studied
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 0.05, 0.05 );
    const material = new THREE.MeshPhongMaterial({ 
        map: texture
    });
    const wall = new THREE.Mesh(extrudeGeometry, material);
    
    return wall;
}

