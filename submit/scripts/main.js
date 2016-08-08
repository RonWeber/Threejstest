var FOV = 75;
var scene;
var camera;
var renderer;
var controls;
var clock = new THREE.Clock();

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function begin() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 1000);
        
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000040);
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
    
    camera.position.z = 5;
    camera.position.x = -20;

    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.keys = [ 65, 83, 68 ];
    
    populate(scene);
}

function populate(scene) {
    //Floor
    var floorGeometry = new THREE.PlaneGeometry(1000, 1000);
    floorGeometry.rotateX(- Math.PI / 2);
    var floorMaterial = new THREE.MeshBasicMaterial({ color: 0x00a010 });
    var floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);

    //objects.push(floorMesh);
    scene.add(floorMesh);

    //Light
    var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
    light.position.set( 0.5, 1, 0.75 );
    scene.add( light );
}

function render() {
    requestAnimationFrame(render);

    var delta = clock.getDelta();
    controls.update(delta);
    
    renderer.render(scene, camera);
}

function submitButtonClick() {
    var fileInput = document.getElementById("fileName");
    var file = fileInput.files[0];
    var loader = new THREE.ColladaLoader();
    loader.loadLocal(file, function(collada) {
	importedScene = collada.scene;
	importedScene.rotateX(-Math.PI/2);
	importedScene.scale.x = importedScene.scale.y = importedScene.scale.z = 10;
	importedScene.updateMatrix();

	scene.add(importedScene);
    });
	
}

document.getElementById("submitButton").addEventListener("click", submitButtonClick);
begin();
render();
