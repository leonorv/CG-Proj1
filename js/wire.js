class Wire extends THREE.Object3D {
    constructor(h, scene) {
        'use strict';
        super();

        this.material = new THREE.MeshPhongMaterial({ color: 0xB5B5B0, wireframe: false});
        this.geometry = new THREE.CylinderGeometry(0.4, 0.4, h, 5);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.h = h;
        this.angleX;
        this.angleY;
        this.angleZ;
        this.father;
        this.add(this.mesh);
        this.position.set(this.x, this.y, this.z);
        this.solid;
        scene.add(this);
    }

    setPos(x, y, z, angleX, angleY, angleZ) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.angleX = angleX;
        this.angleY = angleY;
        this.angleZ = angleZ;
        this.rotateX(angleX);
        this.rotateY(angleY);
        this.rotateZ(angleZ);
        this.position.set(x, y, z);
        
    }

    addCylinderLamp(radiusTop, radiusBottom, height, radialSegments) {
        var solid = new Solid(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments), height);
        var lamp = new Lamp(solid, this.h);
        this.solid = solid;
        this.add(lamp);
    }

    addCubeLamp(x, y, z) {
        var solid = new Solid(new THREE.CubeGeometry(x, y, z), z);
        var lamp = new Lamp(solid, this.h);
        this.solid = solid;
        this.add(lamp);
    }

    changeWireframe() {
        this.material.wireframe = !this.material.wireframe;
        if (this.solid) this.solid.material.wireframe = !this.solid.material.wireframe;
    }

    addFather(father) {
        this.father = father;
        this.father.add(this);
    }
}

class Solid extends THREE.Object3D {
    constructor(geometry, height) {
        'use strict';
        super();
        this.material = new THREE.MeshLambertMaterial({color: 0xB80109, emissive: 0xB80109, emissiveIntensity: 1.0, wireframe: false});
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.height =  height;
    }
}

class Lamp extends THREE.PointLight {
    constructor(solid, h) {
        super(0xCA1400, 2.5, 100, 2);
        this.position.set(0, -h/2 - solid.height/2, 0);
        this.add(solid.mesh);
        scene.add(this);
    }
}

class Group {
    constructor() {
        'use strict';
        this.wires = new Array();
    }

    addWire(father_id, son_id, x, y, z, angleX, angleY, angleZ) {
        this.wires[son_id].addFather(this.wires[father_id]);
        this.wires[son_id].setPos(x, y, z, angleX, angleY, angleZ);
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

    moveNorthWest(delta){
        this.wires[0].position.x -= Math.sqrt(2)/2*10*delta;
        this.wires[0].position.z -= Math.sqrt(2)/2*10*delta;
    }

    moveNorthEast(delta){
        this.wires[0].position.x += Math.sqrt(2)/2*10*delta;
        this.wires[0].position.z -= Math.sqrt(2)/2*10*delta;
    }

    moveSouthWest(delta){
        this.wires[0].position.x -= Math.sqrt(2)/2*10*delta;
        this.wires[0].position.z += Math.sqrt(2)/2*10*delta;
    }

    moveSouthEast(delta){
        this.wires[0].position.x += Math.sqrt(2)/2*10*delta;
        this.wires[0].position.z += Math.sqrt(2)/2*10*delta;
    }

    changeWireframe() {
        this.wires.forEach(wire => wire.changeWireframe());
    }

}
