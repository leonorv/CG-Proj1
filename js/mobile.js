import Wire from "./wire.js"
export default class Mobile extends THREE.Object3D {
    constructor(n_wires, n_lamps) {
        this.n_wires = n_wires;
        this.n_lamps = n_lamps;
        this.wires = [];
    }

    addWire(wire) {
        this.wires.push(wire);
    }

}