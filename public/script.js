// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------

var camera, scene, renderer, controls, loader, light;

init();
animate();

function init() {
	loader = new THREE.GLTFLoader();

	// Create an empty scene
	scene = new THREE.Scene();

	// Create a light
	light = new THREE.PointLight( 0xff0000, 3, 100 );
	light.position.set(0, -10, 5 );
	scene.add(light);

	// Create a basic perspective camera
	camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 1000);
	camera.position.z = 8;

	// Create a renderer with Antialiasing
	renderer = new THREE.WebGLRenderer({antialias:true});
	// Configure renderer clear color
	renderer.setClearColor("#B9E0D9");
	// Configure renderer size
	renderer.setSize(window.innerWidth, window.innerHeight);
	// Append Renderer to DOM
	document.body.appendChild(renderer.domElement);

	// Trackball
	controls = new THREE.TrackballControls(camera);
	controls.rotateSpeed = 3.0;
	controls.zoomSpeed = 1.2;
	controls.panSpeed = 0.8;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;
	controls.addEventListener('change', render);

	window.addEventListener('resize', onWindowResize, false);
	render();

	// ------------------------------------------------
	// FUN STARTS HERE
	// ------------------------------------------------

	// Load the board
	var geometry = new THREE.BoxGeometry(1, 1, 1);

	let y = 3.5;
	let color = "#ffffff"
	for (let r = 0; r < 8; r++) {
		let x = -3.5;

		for (let c = 0; c < 8; c++) {
			let material = new THREE.MeshBasicMaterial({color: color});
			let cube = new THREE.Mesh(geometry, material);
			scene.add(cube);

			cube.position.set(x, y, 0)
			x++;

			if (color === "#ffffff") color = "#000000";
			else color = "#ffffff";
		}

		if (color === "#ffffff") color = "#000000";
		else color = "#ffffff";
		y--;
	}

	// Load the pieces
	load('models/rook.gltf', -3.5, -3.5);
	load('models/knight.gltf', -2.5, -3.5);
	load('models/bishop.gltf', -1.5, -3.5);
	load('models/queen.gltf', -.5, -3.5);
	load('models/king.gltf', .5, -3.5);
	load('models/bishop.gltf', 1.5, -3.5);
	load('models/knight.gltf', 2.5, -3.5);
	load('models/rook.gltf', 3.5, -3.5);
	let start = -3.5
	while (start <= 3.5) {
		load('models/pawn.gltf', start, -2.5);
		start++;
	}
}

function animate() {
	requestAnimationFrame(animate);
	controls.update();
	renderer.render(scene, camera);
}

function render() {
	renderer.render(scene, camera);
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// From https://github.com/mrdoob/three.js/blob/master/examples/misc_controls_trackball.html
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	controls.handleResize();
	render();
}

function load(url, x, y) {
	loader.load(url, function (gltf) {
		scene.add(gltf.scene);
		gltf.scene.children[0].scale.set(.05, .05, .05);
		gltf.scene.children[0].rotation.x = Math.PI / 2;
		gltf.scene.children[0].position.set(x, y, .5);
});
}