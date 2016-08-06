var FOV = 75;
var scene;
var camera;
var renderer;

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

    renderer.render(scene, camera);
}


begin();
render();
