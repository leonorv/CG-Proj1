/*global THREE, requestAnimationFrame, console*/
//import Wire from "./wire.js";

var camera, scene, renderer;

var light;
var wires = new Array();
var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
var cameraOrthoHelper;
var cameraFront, cameraTop, cameraSide;
var frustumSize = 150;

var keys = {
    81: false, //q
    87: false, //w
    65: false, //a
    68: false, //d
    49: false, //1
    50: false, //2
    51: false, //3
    52: false, //4
    69: false //e
}

function createWire(x, y, z, h, angleX, angleY, angleZ, scene) {
    wires.push(new Wire(x,y,z, h, angleX, angleY, angleZ, scene));
}

function createLight() {
    'use strict';
    var lamp = new THREE.CubeGeometry(5,5,5);
    light = new THREE.PointLight( 0xCA1400, 2.5, 100, 2);
    light.add( new THREE.Mesh(lamp, new THREE.MeshLambertMaterial( { color: 0xCA1400 , emissive: 0xCA1400, emissiveIntensity: 1.5} ) ) );
    light.position.set(0,5,0);
    scene.add(light); 
    return light;

}

function createScene() {
    'use strict';

    scene = new THREE.Scene();
    scene.add(new THREE.AxisHelper(10));

    var light1 = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add(light1);

    createWire(0, 45, 0, 15, 0, 0, 0, scene);
    createWire(0, -7.5, 0, 20, Math.PI/2, 0, 0, scene);
    createWire(0, -10, 5, 10, -Math.PI/2, 0, 0, scene);
    createWire(0, 10, 5, 10, -Math.PI/2, 0, 0, scene);
    createWire(0, -5, 0, 10, Math.PI/2, 0, Math.PI/2, scene);
    createWire(0, -5, 0, 10, Math.PI/2, 0, 0, scene);
    createWire(0, -5, 2.5, 5, Math.PI/2, 0, 0, scene);
    createWire(0, 5, 2.5, 5, Math.PI/2, 0, 0, scene);
    createWire(0, 5, 2.5, 5, Math.PI/2, 0, 0, scene);
    createWire(0, -5, 2.5, 5, Math.PI/2, 0, 0, scene);

    var cube1 = createLight();
    wires[8].add(cube1);

    var cube2 = createLight();
    wires[9].add(cube2);

    wires[0].add(wires[1]);
    wires[1].add(wires[2]);
    wires[1].add(wires[3]);
    wires[3].add(wires[4]);
    wires[2].add(wires[5]);
    wires[5].add(wires[6]);
    wires[5].add(wires[7]);
    wires[4].add(wires[8]);
    wires[4].add(wires[9]);

}

function createCamera() {
    'use strict';
    /*FRONT CAMERA*/
    cameraFront = new THREE.OrthographicCamera( 0.5 * frustumSize * aspect / - 2, 0.5 * frustumSize * aspect / 2, 0.5* frustumSize / 2, 0.5 * frustumSize / - 2, 2, 2000 );
    cameraFront.position.set(0,20,20);
    scene.add(cameraFront);

    /*TOP CAMERA*/
    cameraTop = new THREE.OrthographicCamera( 0.5 * frustumSize * aspect / - 2, 0.5 * frustumSize * aspect / 2, 0.5* frustumSize / 2, 0.5 * frustumSize / - 2, 2, 2000 );
    cameraTop.position.set(0,frustumSize,0);
    cameraTop.lookAt(scene.position);
    scene.add(cameraTop);

    camera = cameraTop;

    cameraOrthoHelper = new THREE.CameraHelper(camera);
    cameraOrthoHelper.visible = true;
    //scene.add( cameraOrthoHelper );
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
    camera.bottom = -0.5*  frustumSize / 2;
    camera.updateProjectionMatrix();

}

function onKeyDown(e) {
    'use strict';
    keys[e.keyCode] = true;
    if (keys[81]) wires[0].spinLeft(); //q - move 1st branch left
    else if (keys[87]) wires[0].spinRight(); //w - move 1st branch
    if (keys[65]) wires[2].spinLeft(); //a - move 2nd branch
    else if (keys[68]) wires[2].spinRight(); //d - move 2nd branch
    if (keys[49]) camera = cameraFront; //1 - front view
    if (keys[50]) camera = cameraTop; //2 - top view
    if (keys[69]) { //e - remove axis just for help
        scene.traverse(function (node) {
            if (node instanceof THREE.AxisHelper) {
                node.visible = !node.visible;
            }
        });
    }
}

function onKeyUp(e) {
    keys[e.keyCode] = false;
}

function render() {
    'use strict';
    renderer.render(scene, camera);
}

function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });


    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

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


