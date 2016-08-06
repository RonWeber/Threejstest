var FOV = 75;
var scene;
var camera;
var renderer;
var controls;
var groundCollisionRaycaster;

var prevTime = performance.now();
var velocity = new THREE.Vector3();
var canJump = false;

var controlsEnabled = false;

var objects = [];

function getPointerLock() {
    var blocker = document.getElementById( 'blocker' );
    var instructions = document.getElementById( 'instructions' );
    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
    var element = document.body;
    if (havePointerLock) {
	var pointerlockchange = function(event) {
	    if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
		controlsEnabled = true;
		controls.enabled = true;
		blocker.style.display = 'none';
	    } else {
		controls.enabled = false;
		blocker.style.display = '-webkit-box';
		blocker.style.display = '-moz-box';
		blocker.style.display = 'box';
		instructions.style.display = '';
	    }
	}
	var pointerlockerror = function ( event ) {
	    instructions.style.display = '';
	};
	document.addEventListener( 'pointerlockchange', pointerlockchange, false );
	document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
	document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );
	document.addEventListener( 'pointerlockerror', pointerlockerror, false );
	document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
	document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

	instructions.addEventListener( 'click', function ( event ) {
	    instructions.style.display = 'none';
	    // Ask the browser to lock the pointer
	    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
	    if ( /Firefox/i.test( navigator.userAgent ) ) {
		var fullscreenchange = function ( event ) {
		    if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {
			document.removeEventListener( 'fullscreenchange', fullscreenchange );
			document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
			element.requestPointerLock();
		    }
		};
		document.addEventListener( 'fullscreenchange', fullscreenchange, false );
		document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );
		element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
		element.requestFullscreen();
	    } else {
		element.requestPointerLock();
	    }
	}, false );
    }  else {
	instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function begin() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 1000);

    controls = new THREE.PointerLockControls(camera);
    scene.add(controls.getObject());
    
    getPointerLock();
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000040);
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('keydown', function (event) {
	if (event.keyCode == 32) jump();
    }, false);
    
    camera.position.z = 5;

    groundCollisionRaycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

    populate(scene);
}

function jump() {
    if (canJump) velocity.y += 200;
    canJump = false;
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
    
    //Some cube
    cubeGeometry = new THREE.BoxGeometry(20, 20, 20);
    for (var i = 0; i < cubeGeometry.faces.length; i++) {
	var face = cubeGeometry.faces[i];
	face.vertexColors[0] = new THREE.Color(0, 0, 1);
	face.vertexColors[1] = new THREE.Color(0, 1, 0);
	face.vertexColors[2] = new THREE.Color(1, 0, 0);
    }
    cubeMaterial = new THREE.MeshPhongMaterial({vertexColors: THREE.VertexColors, specular: 0xffffff, shading: THREE.FlatShading, color: 0x00a0ff});
    var cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cubeMesh.position.x = 20;
    cubeMesh.position.y = 2;
    cubeMesh.position.z = 10;
    
    objects.push(cubeMesh);
    scene.add(cubeMesh);

    //Question mark
    var loader = new THREE.ColladaLoader();
    loader.load('models/QuestionMark.dae', function(collada) {
	importedScene = collada.scene;
	importedScene.rotateX(-Math.PI/2);
	importedScene.translateX(-3);
	importedScene.translateY(10);
	importedScene.scale.x = importedScene.scale.y = importedScene.scale.z = 10;
	importedScene.updateMatrix();

	importedScene.traverse(function(node){
	    if (node instanceof THREE.Mesh)
		objects.push(node);
	});

	scene.add(importedScene);
    });

}

function render() {
    requestAnimationFrame(render);

    if (controlsEnabled) {
	groundCollisionRaycaster.ray.origin.copy(controls.getObject().position);
	groundCollisionRaycaster.ray.origin.y -= 10;

	var intersections = groundCollisionRaycaster.intersectObjects(objects);

	var isOnObject = intersections.length > 0;
	var time = performance.now();
	var delta = ( time - prevTime ) / 1000;
	velocity.x -= velocity.x * 10.0 * delta;
	velocity.z -= velocity.z * 10.0 * delta;

	velocity.y -= 9.8 * 45 * delta;

	if (wPressed) velocity.z -= 400.0 * delta;
	if (sPressed) velocity.z += 400.0 * delta;

	if (aPressed) velocity.x -= 400.0 * delta;
	if (dPressed) velocity.x += 400.0 * delta;

	if (isOnObject || controls.getObject().position.y <= 10) {
	    velocity.y = Math.max( 0, velocity.y );
	    canJump = true;
	}

	if (controls.getObject().position.y <= 10) controls.getObject().position.y = 10;
	
	controls.getObject().translateX(velocity.x * delta );
	controls.getObject().translateY(velocity.y * delta );
	controls.getObject().translateZ(velocity.z * delta );
	
	prevTime = time;

    }
	
    renderer.render(scene, camera);
}


begin();
render();
