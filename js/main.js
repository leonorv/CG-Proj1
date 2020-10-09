/*global THREE, requestAnimationFrame, console*/
var camera, scene, renderer;

var light, clock, delta;
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
    90: false, //z
    67: false, //c
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
    grandson.addWire(new Wire(un/2, un, 0, un, 0, 0, -Math.PI/2, scene));
    grandson.addDependencies([[0,1], [1,2], [1,3],[0,4]]);

    mobile.addGroup(grandson);
    mobile.groups[1].wires[1].add(mobile.groups[2].wires[0]);

    //LAMPS

    var solid1 = new Solid(new THREE.CylinderGeometry(4, 4, 12, 30), -3/2*un);
    father.wires[7].add(solid1);

    var solid2 = new Solid(new THREE.CylinderGeometry(2, 2, 10, 30), -un);
    father.wires[8].add(solid2);

    var solid3 = new Solid(new THREE.CubeGeometry(5, 5, 5), un);
    father.wires[3].add(solid3);

    var solid4 = new Solid(new THREE.CubeGeometry(5, 5, 5), -un);
    father.wires[6].add(solid4);

    var solid5 = new Solid(new THREE.CylinderGeometry(3, 3, 7, 30), -un);
    father.wires[4].add(solid5);

    var solid6 = new Solid(new THREE.CylinderGeometry(6, 6, 5, 30), 3*un);
    son.wires[3].add(solid6);

    var solid7 = new Solid(new THREE.CylinderGeometry(8, 8, 6, 30), -un);
    son.wires[4].add(solid7);

    var solid8 = new Solid(new THREE.CubeGeometry(5, 5, 5), un);
    grandson.wires[2].add(solid8);

    var solid9 = new Solid(new THREE.CubeGeometry(8, 8, 8), un);
    grandson.wires[3].add(solid9);

    var solid10 = new Solid(new THREE.CylinderGeometry(3, 3, 7, 30), -un);
    grandson.wires[4].add(solid10);

    var solid11 = new Solid(new THREE.CylinderGeometry(3, 3, 7, 30), -un);
    son.wires[5].add(solid11);

    var solid12 = new Solid(new THREE.CylinderGeometry(3, 3, 7, 30), -un);
    son.wires[6].add(solid12);
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

    /*SIDE CAMERA*/
    cameraSide = new THREE.OrthographicCamera( 0.5 * frustumSize * aspect / - 2, 0.5 * frustumSize * aspect / 2, 0.5* frustumSize / 2, 0.5 * frustumSize / - 2, 2, 2000 );
    cameraSide.position.set(frustumSize,-frustumSize,frustumSize);
    cameraSide.lookAt(scene.position);
    scene.add(cameraSide);

    camera = cameraFront;

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
    camera.bottom = - 0.5 *  frustumSize / 2;
    camera.updateProjectionMatrix();

}

function onKeyDown(e) {
    'use strict';
    keys[e.keyCode] = true;

    switch(e.keyCode) {
        case 49:
            camera = cameraFront;                 //1 - front view
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
        case 69:
            scene.traverse(function (node) {
                if (node instanceof THREE.AxisHelper)
                    node.visible = !node.visible;
            })
            break;
        case 37:
        case 38:
        case 39:
        case 40:

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

function keyPressed(delta) {

    if(keys[81]) mobile.groups[0].spinLeft(delta);
    if(keys[87]) mobile.groups[0].spinRight(delta);
    if(keys[65]) mobile.groups[1].spinLeft(delta);
    if(keys[68]) mobile.groups[1].spinLeft(delta);
    if(keys[90]) mobile.groups[2].spinLeft(delta);
    if(keys[67]) mobile.groups[2].spinRight(delta);
}


