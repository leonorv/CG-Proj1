/*global THREE, requestAnimationFrame, console*/

var camera, scene, renderer;

var geometry, material, mesh;

var wire, cube;



function createWire(x, y, z) {
    'use strict';

    wire = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0xFA6C5B, wireframe: true });
    geometry = new THREE.CylinderGeometry( 0.4, 0.4, 20, 5 );
    mesh = new THREE.Mesh(geometry, material);


    wire.add(mesh);
    wire.position.set(x, y, z);

    scene.add(wire);
}

function createCube(x,y,z) {
    'use strict';
    const loader = new THREE.TextureLoader();

    cube = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({map: loader.load('dragons2.jpg')})
    geometry = new THREE.CubeGeometry(5,5,5);
    mesh = new THREE.Mesh(geometry, material);


    cube.add(mesh);
    cube.position.set(x, y, z);

    scene.add(cube);
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();


    scene.add(new THREE.AxisHelper(10));

    createWire(0, 40, 0);
    //createCube(2,8,0);
    //wire.add(cube);
}

function createCamera() {
    'use strict';
    camera = new THREE.PerspectiveCamera(70,
                                         window.innerWidth / window.innerHeight,
                                         1,
                                         1000);
    camera.position.x = 50;
    camera.position.y = 50;
    camera.position.z = 50;
    camera.lookAt(scene.position);
}

function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }

}

function onKeyDown(e) {
    'use strict';

    switch (e.keyCode) {
    case 65: //A
    case 97: //a
        scene.traverse(function (node) {
            if (node instanceof THREE.Mesh) {
                node.material.wireframe = !node.material.wireframe;
            }
        });
        break;
    case 83:  //S
    case 115: //s
        wire.position.x+=0.1;
        break;
    case 69:  //E
    case 101: //e
        scene.traverse(function (node) {
            if (node instanceof THREE.AxisHelper) {
                node.visible = !node.visible;
            }
        });
        break;
    }
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
    window.addEventListener("resize", onResize);
}

function animate() {
    'use strict';

    wire.rotateY(0.01);
    render();

    requestAnimationFrame(animate);
}
