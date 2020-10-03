export default class Wire extends THREE.Object3D {
    constructor(x,y,z,h,angleX, angleY, angleZ, scene) {
        'use strict';
        super();
        this.material = new THREE.MeshBasicMaterial({ color: 0xB5B5B0, wireframe: true });
        this.geometry = new THREE.CylinderGeometry( 0.4, 0.4, h, 5);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.add(this.mesh);
        this.position.set(x, y, z);
        this.rotateX(angleX);
        this.rotateY(angleY);
        this.rotateZ(angleZ);
        scene.add(this);
        
    }
    spinny() {
        this.rotateY(0.1);
    }
    move() {
        this.position.x+=0.1;
    }
    createSon(son) {
        this.add(son);
    }
}