/*global THREE, requestAnimationFrame, console*/
var camera, scene, renderer;

var light;
var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
var cameraOrthoHelper;
var cameraFront, cameraTop, cameraSide;
var frustumSize = 150;
var un = 5;
var mobile, father, son, grandson;

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

function createLight(y) {
    'use strict';
    var lamp = new THREE.CubeGeometry(5,5,5);
    light = new THREE.PointLight( 0xCA1400, 2.5, 100, 2);
    light.add(new THREE.Mesh(lamp, new THREE.MeshLambertMaterial( {color: 0xCA1400 , emissive: 0xCA1400, emissiveIntensity: 1.5})));
    light.position.set(0,-y,0);
    scene.add(light); 
    return light;
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();
    scene.add(new THREE.AxisHelper(10));

    var light1 = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add(light1);

    mobile = new Mobile();
    father = new Group();
    son = new Group();
    grandson = new Group();

    father.addWire(new Wire(0, 10*un, 0, 3*un, 0, 0, 0, scene));
    father.addWire(new Wire(0, -3*un/2, 0, 4*un, Math.PI/2, 0, 0, scene));
    father.addWire(new Wire(0, -2*un, un, 2*un, -Math.PI/2, 0, 0, scene));
    father.addDependencies([[0,1],[1,2]]);

    son.addWire(new Wire(0, 2*un, un, 2*un, -Math.PI/2, 0, 0, scene));
    son.addWire(new Wire(0, -un, 0, 4*un, Math.PI/2, 0, Math.PI/2, scene));
    son.addWire(new Wire(0, 2*un, un, 2*un, -Math.PI/2, 0, 0, scene));
    son.addWire(new Wire(0, 0, 2*un, 6*un, -Math.PI/2, 0, 0, scene));
    son.addWire(new Wire(0, -2*un, un, 2*un, -Math.PI/2, 0, 0, scene));
    son.addWire(new Wire(0, -un, 0, 2*un, Math.PI/2, 0, 0, scene));
    son.addWire(new Wire(0, -un, un/2, un, -Math.PI/2, 0, 0, scene));
    son.addWire(new Wire(0, un, un/2, un, -Math.PI/2, 0, 0, scene));
    son.addDependencies([[0,1],[1,2],[1,3],[1,4],[4,5],[5,6],[5,7]]);

    var cube1 = createLight(5);
    father.wires[2].add(cube1);

    var cube2 = createLight(5);
    son.wires[2].add(cube2);

    var cube3 = createLight(15);
    son.wires[3].add(cube3);

    var cube4 = createLight(5);
    son.wires[6].add(cube4);

    mobile.addGroup(father);
    mobile.addGroup(son);
    mobile.groups[0].wires[1].add(mobile.groups[1].wires[0]);

    //wires[0].add(wires[1]);
    //wires[1].add(wires[2]);
    //wires[1].add(wires[3]);
    //wires[3].add(wires[4]);
    //wires[4].add(wires[5]);
    //wires[4].add(wires[6]);
    //wires[4].add(wires[7]);
    //wires[7].add(wires[8]);
    //wires[8].add(wires[9]);
    //wires[8].add(wires[10]);
    //wires[2].add(wires[5]);
    //wires[5].add(wires[6]);
    //wires[5].add(wires[7]);
    //wires[4].add(wires[8]);
    //wires[4].add(wires[9]);

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
    if (keys[81]) mobile.groups[0].spinLeft();          //q - move 1st branch left
    else if (keys[87]) mobile.groups[0].spinRight();    //w - move 1st branch
    if (keys[65]) mobile.groups[1].spinLeft();          //a - move 2nd branch
    else if (keys[68]) mobile.groups[1].spinRight();    //d - move 2nd branch
    if (keys[49]) camera = cameraFront;                 //1 - front view
    if (keys[50]) camera = cameraTop;                   //2 - top view
    if (keys[69]) {                                     //e - remove axis just for help
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


