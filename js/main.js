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
    69: false, //e
    37: false, //left
    38: false, //top
    39: false, //right
    40: false, //bottom
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

    father.addWire(new Wire(0, 10*un, 0, 3*un, 0, 0, 0, scene));
    father.addWire(new Wire(0, -3*un/2, 0, 10*un, Math.PI/2, 0, 0, scene));
    father.addWire(new Wire(0, -5*un, un, 2*un, -Math.PI/2, 0, 0, scene));
    father.addWire(new Wire(0, -(5/2+3/Math.sqrt(32))*un, -un/2, 3/2*un, Math.PI/4, 0, 0, scene));
    father.addWire(new Wire(0, (5+3/Math.sqrt(32))*un, -un/2, 3/2*un, -Math.PI/4, 0, 0, scene));
    father.addWire(new Wire(0, -un, 0, 3*un, -Math.PI/2, 0, Math.PI/2, scene));
    father.addWire(new Wire(un/2, 0, un/2, 3/2*un, 0, -Math.PI/4, -Math.PI/2, scene));
    father.addWire(new Wire(0, -3/2*un, -3/4*un, 3/2*un, -Math.PI/2, 0, 0, scene));
    father.addWire(new Wire(0, 3/2*un, -un/2, un, -Math.PI/2, 0, 0, scene));

    father.addDependencies([[0,1], [1,2], [1,3], [1,4], [2,5], [5,6], [5,7], [5,8]]);
    mobile.addGroup(father);

    son.addWire(new Wire(0, 5/2*un, un, 2*un, -Math.PI/2, 0, 0, scene));
    son.addWire(new Wire(0, -un, un, 6*un, Math.PI/2, 0, 0, scene));
    son.addWire(new Wire(0, 3*un, un, 2*un, -Math.PI/2, 0, 0, scene));
    son.addWire(new Wire(0, 0, 3*un, 6*un, -Math.PI/2, 0, 0, scene));
    son.addWire(new Wire(0, -3*un, un, 2*un, Math.PI/2, 0, 0, scene));
    son.addWire(new Wire(-un, -un, 0, 2*un, 0, 0, Math.PI/2, scene));
    son.addWire(new Wire(0, (3+Math.sqrt(2)/4)*un,-(Math.sqrt(2)/4)*un , un, -Math.PI/4,0, 0, scene));
    son.addDependencies([[0,1],[1,2],[1,3], [1,4],[0,5],[1,6]]);
    
    mobile.addGroup(son);
    mobile.groups[0].wires[1].add(mobile.groups[1].wires[0]);

    grandson.addWire(new Wire(0, 3*un, un, 2*un, Math.PI/2, 0, 0, scene));
    grandson.addWire(new Wire(0, un, 0, 3*un, -Math.PI/2, 0, 0, scene));
    grandson.addWire(new Wire(0, -3/2*un, un/2, un, -Math.PI/2, 0, 0, scene));
    grandson.addWire(new Wire(0, 3/2*un, un/2, un, -Math.PI/2, 0, 0, scene));
    grandson.addWire(new Wire(un, un, 0, 2*un, 0, 0, -Math.PI/2, scene));
    grandson.addDependencies([[0,1], [1,2], [1,3],[0,4]]);

    mobile.addGroup(grandson);
    mobile.groups[1].wires[1].add(mobile.groups[2].wires[0]);

    //LAMPS
    father.wires[7].addCylinderLamp(3/2*un, 4, 4, 12, 30);
    father.wires[8].addCylinderLamp(un, 2, 2, 10, 30);
    father.wires[3].addCubeLamp(-un, 5, 5, 5);
    father.wires[6].addCubeLamp(un, 5, 5, 5);
    father.wires[4].addCylinderLamp(un, 3, 3, 7, 30);
    son.wires[3].addCylinderLamp(-3*un, 6, 6, 5, 30);
    son.wires[4].addCylinderLamp(un, 8, 8, 6, 30);
    son.wires[5].addCylinderLamp(un, 3, 3, 7, 30);
    son.wires[6].addCylinderLamp(un, 3, 3, 7, 30);
    grandson.wires[2].addCubeLamp(-un, 5, 5, 5);
    grandson.wires[3].addCubeLamp(-un, 8, 8, 8);
    grandson.wires[4].addCylinderLamp(un, 3, 3, 7, 30);
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
        case 69:
            scene.traverse(function (node) {
                if (node instanceof THREE.AxisHelper)
                    node.visible = !node.visible;
            })
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

    if(keys[37]) mobile.groups[0].moveLeft(delta);
    if(keys[38]) mobile.groups[0].moveForward(delta);
    if(keys[39]) mobile.groups[0].moveRight(delta);
    if(keys[40]) mobile.groups[0].moveBackward(delta);
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