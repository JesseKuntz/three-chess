// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------

var camera, scene, renderer, controls, loader, light;

boardTiles = [];
chessPieces = [];

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

			boardTiles.push(cube);
		}

		if (color === "#ffffff") color = "#000000";
		else color = "#ffffff";
		y--;
	}

	// Example of accessing an individual tile
	console.log(boardTiles);
	boardTiles[20].material.color.set("#ff0000");

	// Load the pieces
	loadPieces();

	// Need to figure out how to only do this AFTER every piece is loaded in.
	// I tried promises and callbacks, and neither worked... may try jQuery deferreds next.
	console.log(chessPieces);
	// chessPieces[1].rotation.y = Math.PI / 2;
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

		chessPieces.push(gltf.scene.children[0]);
	});
}

function loadPieces() {
	load('models/rook.gltf', -3.5, -3.5);
	chessPieces.push(new Rook(0, 0, colors.WHITE));
	load('models/knight.gltf', -2.5, -3.5);
	chessPieces.push(new Knight(1, 0, colors.WHITE));
	load('models/bishop.gltf', -1.5, -3.5);
	chessPieces.push(new Bishop(2, 0, colors.WHITE));
	load('models/queen.gltf', -.5, -3.5);
	chessPieces.push(new Queen(3, 0, colors.WHITE));
	load('models/king.gltf', .5, -3.5);
	chessPieces.push(new King(4, 0, colors.WHITE));
	load('models/bishop.gltf', 1.5, -3.5);
	chessPieces.push(new Bishop(5, 0, colors.WHITE));
	load('models/knight.gltf', 2.5, -3.5);
	chessPieces.push(new Knight(6, 0, colors.WHITE));
	load('models/rook.gltf', 3.5, -3.5);
	chessPieces.push(new Rook(7, 0, colors.WHITE));
	let start = -3.5
	while (start <= 3.5) {
		load('models/pawn.gltf', start, -2.5);
		start++;
	}
	for(i = 0; i <= 7; i++) {
		chessPieces.push(new Pawn(i, 1, colors.WHITE));
	}
	console.log(chessPieces.length);
	for(j = 0; j < chessPieces.length; j++) {
		console.log(chessPieces[j].constructor.name + ": X: " + chessPieces[j].position_x + ", Y: " + chessPieces[j].position_y + ", " + chessPieces[j].getPossibleMoves());
	}
}