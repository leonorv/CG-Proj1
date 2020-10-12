class Wire extends THREE.Object3D {
    constructor(x,y,z,h,angleX, angleY, angleZ, scene) {
        'use strict';
        super();

        this.material = new THREE.MeshPhongMaterial({ color: 0xB5B5B0, wireframe: false});
        this.geometry = new THREE.CylinderGeometry(0.4, 0.4, h, 5);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.add(this.mesh);
        this.position.set(x, y, z);
        this.rotateX(angleX);
        this.rotateY(angleY);
        this.rotateZ(angleZ);
        this.solid;
        scene.add(this);
    }

    addCylinderLamp(y, radiusTop, radiusBottom, height, radialSegments) {
        var solid = new Solid(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments));
        var lamp = new Lamp(solid, -y);
        this.solid = solid;
        this.add(lamp);
    }

    addCubeLamp(light_pos, x, y, z) {
        var solid = new Solid(new THREE.CubeGeometry(x, y, z));
        var lamp = new Lamp(solid, -light_pos);
        this.solid = solid;
        this.add(lamp);
    }

    changeWireframe() {
        this.material.wireframe = !this.material.wireframe;
        if (this.solid) this.solid.material.wireframe = !this.solid.material.wireframe;
    }
}

class Solid extends THREE.Object3D {
    constructor(geometry) {
        'use strict';
        super();
        this.material = new THREE.MeshLambertMaterial({color: 0xCA1400 , emissive: 0xCA1400, emissiveIntensity: 1.5, wireframe: false});
        this.mesh = new THREE.Mesh(geometry, this.material);
    }
}

class Lamp extends THREE.PointLight {
    constructor(solid, y) {
        super(0xCA1400, 2.5, 100, 2);
        this.position.set(0, -y, 0);
        this.add(solid.mesh);
        scene.add(this);
    }
}

class Group {
    constructor() {
        'use strict';
        this.wires = new Array();
    }

    addWire(wire) {
        this.wires.push(wire);
    }

    addDependencies(dependencies) {
        dependencies.forEach(dep => 
            this.wires[dep[0]].add(this.wires[dep[1]]));
    }

    spinLeft(delta) {
        this.wires[0].rotation.y -= 50*delta*(Math.PI / 180);
    }

    spinRight(delta) {
        this.wires[0].rotation.y += 50*delta*(Math.PI / 180);
    }

    moveRight(delta) {
        this.wires[0].position.x += 10*delta;

    }

    moveLeft(delta) {
        this.wires[0].position.x -= 10*delta;
    }

    moveForward(delta) {
        this.wires[0].position.z -= 10*delta;
    }

    moveBackward(delta) {
        this.wires[0].position.z += 10*delta;
    }

    changeWireframe() {
        this.wires.forEach(wire => wire.changeWireframe());
    }

}