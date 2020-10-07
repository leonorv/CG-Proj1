class Mobile {
    constructor() {
        this.groups = [];
    }

    addGroup(group) {
        this.groups.add(group);
    }

    spinLeft(index) {
        this.groups[index].rotateY(0.1);
    }

    spinRight(index) {
        this.groups[index].rotateY(-0.1);
    }

    move(index) {
        this.groups[index].position.x+=0.1;
    }

}
