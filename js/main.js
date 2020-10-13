/*global THREE, requestAnimationFrame, console*/
var camera, scene, renderer;

var light, clock, delta;
var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
var cameraOrthoHelper;
var cameraFront, cameraTop, cameraSide;
var frustumSize = 220;
var un = 5;
var mobile, father, son, grandson;

var keys = {
    81: false, //q
    87: false, //w
    65: false, //a
    68: false, //d
    90: false, //z
    67: false, //c
    49: false, //1
    50: false, //2
    51: false, //3
    52: false, //4
    37: false, //left
    38: false, //top
    39: false, //right
    40: false, //bottom
}

function addLamps() {
    father.wires[7].addCylinderLamp(4, 4, 12, 30);
    father.wires[8].addCylinderLamp(2, 2, 10, 30);
    father.wires[3].addCubeLamp(5, 5, 5);
    father.wires[6].addCubeLamp(5, 5, 5);
    father.wires[4].addCylinderLamp(3, 3, 7, 30);
    son.wires[3].addCylinderLamp(6, 6, 5, 30);
    son.wires[2].addCylinderLamp(8, 8, 6, 30);
    son.wires[5].addCylinderLamp(3, 3, 7, 30);
    son.wires[6].addCylinderLamp(3, 3, 7, 30);
    grandson.wires[2].addCubeLamp(5, 5, 5);
    grandson.wires[3].addCubeLamp(8, 8, 8);
    grandson.wires[4].addCylinderLamp(3, 3, 7, 30);
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();
    scene.add(new THREE.AxisHelper(10));

    scene.add(new THREE.AmbientLight(0x404040)); //soft ambient light

    mobile = new Mobile();
    father = new Group();
    son = new Group();
    grandson = new Group();

    father.wires.push(new Wire(3*un, scene));
    father.wires[0].setPos(0, 10*un, 0, 0, 0, 0);
    father.wires.push(new Wire(10*un, scene));
    father.addWire(0, 1, 0, -father.wires[0].h/2, 0, Math.PI/2, 0, 0);
    father.wires.push(new Wire(2*un, scene));
    father.addWire(1, 2, 0, father.wires[1].h/2, father.wires[2].h/2, Math.PI/2, 0, 0);
    father.wires.push(new Wire(3/2*un, scene));
    father.addWire(1, 3, 0, (father.wires[1].h/4+(Math.sqrt(2)/4)*father.wires[3].h), -(Math.sqrt(2)/4)*father.wires[3].h, 3*Math.PI/4, 0, 0);
    father.wires.push(new Wire(3/2*un, scene));
    father.addWire(1, 4, 0, -(father.wires[1].h/2+(Math.sqrt(2)/4)*father.wires[4].h), -(Math.sqrt(2)/4)*father.wires[4].h, Math.PI/4, 0, 0);
    father.wires.push(new Wire(3*un, scene));
    father.addWire(2, 5, 0, father.wires[2].h/2, 0, -Math.PI/2, 0, -Math.PI/2);
    father.wires.push(new Wire(3/2*un, scene));
    father.addWire(5, 6, -((Math.sqrt(2)/4)*father.wires[6].h), 0, -((Math.sqrt(2)/4)*father.wires[6].h), Math.PI/2, 0, -Math.PI/4);
    father.wires.push(new Wire(3/2*un, scene));
    father.addWire(5, 7, 0, -father.wires[5].h/2, father.wires[7].h/2, -Math.PI/2, 0, 0);
    father.wires.push(new Wire(un, scene));
    father.addWire(5, 8, 0, father.wires[5].h/2, father.wires[8].h/2, -Math.PI/2, 0, 0);

    mobile.addGroup(father);

    son.wires.push(new Wire(2*un, scene));
    son.wires[0].setPos(0, -father.wires[1].h/2, son.wires[0].h/2, -Math.PI/2, 0, 0);
    son.wires.push(new Wire(6*un, scene));
    son.addWire(0, 1, 0, -son.wires[0].h/2, 0, Math.PI/2, 0, 0);
    son.wires.push(new Wire(2*un, scene));
    son.addWire(1, 2, 0, -son.wires[1].h/2, son.wires[2].h/2, -Math.PI/2, 0, 0);
    son.wires.push(new Wire(6*un, scene));
    son.addWire(1, 3, 0, 0, son.wires[3].h/2, -Math.PI/2, 0, 0);
    son.wires.push(new Wire(2*un, scene));
    son.addWire(1, 4, 0, son.wires[1].h/2, son.wires[4].h/2, Math.PI/2, 0, 0);
    son.wires.push(new Wire(2*un, scene));
    son.addWire(0, 5, son.wires[0].h/2, -son.wires[0].h/2, 0, 0, 0, Math.PI/2);
    son.wires.push(new Wire(un, scene));
    son.addWire(1, 6, 0, (son.wires[1]/2+Math.sqrt(2)/4)*son.wires[6].h, -(Math.sqrt(2)/4)*son.wires[6].h, -Math.PI/4, 0, 0);
    
    mobile.addGroup(son);
    mobile.groups[0].wires[1].add(mobile.groups[1].wires[0]);

    grandson.wires.push(new Wire(2*un, scene));
    grandson.wires[0].setPos(0, son.wires[1].h/2, grandson.wires[0].h/2, Math.PI/2, 0, 0);
    grandson.wires.push(new Wire(3*un, scene));
    grandson.addWire(0, 1, 0, grandson.wires[0].h/2, 0, Math.PI/2, 0, 0);
    grandson.wires.push(new Wire(un, scene));
    grandson.addWire(1, 2, 0, -grandson.wires[1].h/2, -grandson.wires[2].h/2, Math.PI/2, 0, 0);
    grandson.wires.push(new Wire(un, scene));
    grandson.addWire(1, 3, 0, grandson.wires[1].h/2, -grandson.wires[2].h/2, Math.PI/2, 0, 0);
    grandson.wires.push(new Wire(un, scene));
    grandson.addWire(0, 4, grandson.wires[4].h/2, grandson.wires[0].h/2, 0, 0, 0, Math.PI/2);

    mobile.addGroup(grandson);
    mobile.groups[1].wires[1].add(mobile.groups[2].wires[0]);

    addLamps();
}

function createCamera() {
    'use strict';
    /*FRONT CAMERA*/
    cameraFront = new THREE.OrthographicCamera( 0.5 * frustumSize * aspect / - 2, 0.5 * frustumSize * aspect / 2, 0.5* frustumSize / 2, 0.5 * frustumSize / - 2, 2, 2000 );
    cameraFront.position.set(0,0,-50);
    cameraFront.lookAt(scene.position);
    scene.add(cameraFront);

    /*TOP CAMERA*/
    cameraTop = new THREE.OrthographicCamera( 0.5 * frustumSize * aspect / - 2, 0.5 * frustumSize * aspect / 2, 0.5* frustumSize / 2, 0.5 * frustumSize / - 2, 2, 2000 );
    cameraTop.position.set(0,frustumSize,0);
    cameraTop.lookAt(scene.position);
    scene.add(cameraTop);

    /*SIDE CAMERA*/
    cameraSide = new THREE.OrthographicCamera( 0.5 * frustumSize * aspect / - 2, 0.5 * frustumSize * aspect / 2, 0.5* frustumSize / 2, 0.5 * frustumSize / - 2, 2, 2000 );
    cameraSide.position.set(50,0,0);
    cameraSide.lookAt(scene.position);
    scene.add(cameraSide);

    camera = cameraFront;
}

function onResize() {
    'use strict';

    SCREEN_WIDTH = window.innerWidth;
	SCREEN_HEIGHT = window.innerHeight;
    aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

    camera.left = - 0.5 * frustumSize * aspect / 2;
    camera.right = 0.5 * frustumSize * aspect / 2;
    camera.top = 0.5 * frustumSize / 2;
    camera.bottom = - 0.5 *  frustumSize / 2;
    camera.updateProjectionMatrix();
}

function onKeyDown(e) {
    'use strict';
    keys[e.keyCode] = true;

    switch(e.keyCode) {
        case 49:
            camera = cameraFront;         
            onResize();
            break;
        case 50:
            camera = cameraTop;
            onResize();
            break;
        case 51:
            camera = cameraSide;
            onResize();
            break;
        case 52:
            mobile.changeWireframe();
            break;
    }
}

function onKeyUp(e) {
    'use strict';
    keys[e.keyCode] = false;
}

function render() {
    'use strict';
    delta = clock.getDelta();
    keyPressed(delta);
    renderer.render(scene, camera);
}

function keyPressed(delta) {
    if(keys[81]) mobile.groups[0].spinLeft(delta);
    if(keys[87]) mobile.groups[0].spinRight(delta);
    if(keys[65]) mobile.groups[1].spinLeft(delta);
    if(keys[68]) mobile.groups[1].spinRight(delta);
    if(keys[90]) mobile.groups[2].spinLeft(delta);
    if(keys[67]) mobile.groups[2].spinRight(delta);

    if(keys[37] && keys[38]) mobile.groups[0].moveNorthWest(delta);
    else if(keys[39] && keys[38]) mobile.groups[0].moveNorthEast(delta);
    else if(keys[37] && keys[40]) mobile.groups[0].moveSouthWest(delta);
    else if(keys[39] && keys[40]) mobile.groups[0].moveSouthEast(delta);

    else if(keys[37]) mobile.groups[0].moveLeft(delta);
    else if(keys[38]) mobile.groups[0].moveForward(delta);
    else if(keys[39]) mobile.groups[0].moveRight(delta);
    else if(keys[40]) mobile.groups[0].moveBackward(delta);
}

function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    clock = new THREE.Clock();
    clock.start();

    createScene();
    createCamera();

    render();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

function animate() {
    'use strict';
    render();
    requestAnimationFrame(animate);
}