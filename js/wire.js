class Wire extends THREE.Object3D {
    constructor(x,y,z,h,angleX, angleY, angleZ, scene) {
        'use strict';
        super();

        this.material = new THREE.MeshPhongMaterial({ color: 0xB5B5B0});
        this.geometry = new THREE.CylinderGeometry( 0.4, 0.4, h, 5);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.add(this.mesh);
        this.position.set(x, y, z);
        this.rotateX(angleX);
        this.rotateY(angleY);
        this.rotateZ(angleZ);
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

    spinLeft() {
        this.wires[0].rotateY(0.1);
    }

    spinRight() {
        this.wires[0].rotateY(-0.1);
    }

    move() {
        this.wires[0].position.x+=0.1;
    }

}