class Mobile {
    constructor() {
        this.groups = new Array();
        this.lamps = new Array();
        this.wireframe = false;
    }

    addGroup(group) {
        this.groups.push(group);
    }

    changeWireframe() {
        this.groups.forEach(group => group.changeWireframe());
    }

}
