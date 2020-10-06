//import Wire from "./wire.js"
 class Mobile extends Wire {
    constructor(n_wires, n_lamps) {
        this.n_wires = n_wires;
        this.n_lamps = n_lamps;
        this.wires = [];
    }

    addWire(wire) {
        this.wires.push(wire);
    }

}