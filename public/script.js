// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------

var camera, scene, renderer, controls, loader, light, raycaster, mouse, INTERSECTED;

var boardTiles = [];
var chessPieces = [];
var justMeshes = [];
var moveClock = 0;
var currentMove = [];

init();
animate();

function init() {
	// Create the raycaster and mouse tracker for picking
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();

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
	window.addEventListener('mousemove', onMouseMove, false);
	document.addEventListener('mousedown', onMouseDown, false);
	document.addEventListener('keypress', moveTest, false);

	// ------------------------------------------------
	// FUN STARTS HERE
	// ------------------------------------------------

	// Load the board
	loadBoard();

	// Load the pieces
	loadPieces();
}

function animate() {
	requestAnimationFrame(animate);
	controls.update();

	// update the picking ray with the camera and mouse position
	raycaster.setFromCamera( mouse, camera );

	// calculate objects intersecting the picking ray
	var intersects = raycaster.intersectObjects(justMeshes);

	// If the mouse is touching a piece
	if ( intersects.length > 0 ) {
		// If the piece is a NEW piece
		if ( INTERSECTED != intersects[ 0 ].object ) {
			if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
			INTERSECTED = intersects[ 0 ].object;
			INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
			INTERSECTED.material.emissive.setHex( 0xff0000 );

			highlightPossibleMoves();
		}
	}
	// If the mouse is NOT touching a piece
	else {
		if ( INTERSECTED ) {
			INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
			resetBoardColors();
		}
		INTERSECTED = null;
	}
	if(!(currentMove === undefined) && currentMove.length != 0) {
		moveClock += 1;
		moveSpeed = 60
		unit = currentMove[0];
		console.log(moveClock);
		unit.mesh.position.set((1 - moveClock / moveSpeed) * unit.position_x + (moveClock / moveSpeed) * currentMove[1] - 3.5,
			(1 - moveClock / moveSpeed) * unit.position_y + (moveClock / moveSpeed) * currentMove[2] - 3.5, 0.5)
		// If at the end of the animation, reset clock and set new position of unit.
		if(moveClock == moveSpeed) {
			moveClock = 0;
			unit.setPosition(currentMove[1], currentMove[2]);
			currentMove = [];
			unit.getPossibleMoves();
		}
	}
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

function load(url, x, y, unit) {
	loader.load(url, function (gltf) {
		scene.add(gltf.scene);
		gltf.scene.children[0].scale.set(.05, .05, .05);
		gltf.scene.children[0].rotation.x = Math.PI / 2;
		gltf.scene.children[0].position.set(x, y, .5);

		unit.setMesh(gltf.scene.children[0]);
		justMeshes.push(gltf.scene.children[0]);
	});
	chessPieces.push(unit);
}

function loadPieces() {
	// Create the loader
	loader = new THREE.GLTFLoader();

	var unit = new Rook(0, 0, colors.WHITE)
	load('models/rook.gltf', -3.5, -3.5, unit);
	unit = new Knight(1, 0, colors.WHITE);
	load('models/knight.gltf', -2.5, -3.5, unit);
	unit = new Bishop(2, 0, colors.WHITE);
	load('models/bishop.gltf', -1.5, -3.5, unit);
	unit = new Queen(3, 0, colors.WHITE);
	load('models/queen.gltf', -.5, -3.5, unit);
	unit = new King(4, 0, colors.WHITE);
	load('models/king.gltf', .5, -3.5, unit);
	unit = new Bishop(5, 0, colors.WHITE);
	load('models/bishop.gltf', 1.5, -3.5, unit);
	unit = new Knight(6, 0, colors.WHITE);
	load('models/knight.gltf', 2.5, -3.5, unit);
	unit = new Rook(7, 0, colors.WHITE);
	load('models/rook.gltf', 3.5, -3.5, unit);
	let start = -3.5
	while (start <= 3.5) {
		unit = new Pawn(parseInt(start + 3.5), 1, colors.WHITE);
		load('models/pawn.gltf', start, -2.5, unit);
		start++;
	}

	unit = new Rook(6, 6, colors.BLACK);
	load('models/rook.gltf', 2.5, 2.5, unit);
	unit = new Pawn(0, 2, colors.BLACK);
	load('models/pawn.gltf', -3.5, -1.5, unit);
	unit = new Pawn(1, 3, colors.BLACK);
	load('models/pawn.gltf', -2.5, -0.5, unit);
	unit = new Queen(3, 3, colors.BLACK);
	load('models/queen.gltf', -0.5, -0.5, unit);
	for(j = 0; j < chessPieces.length; j++) {
		chessPieces[j].getPossibleMoves();
		chessPieces[j].printValidMoves();
	}
}

function loadBoard() {
	var geometry = new THREE.BoxGeometry(1, 1, 1);

	let x = -3.5;
	let color = "#000000"
	for (let c = 0; c < 8; c++) {
		let y = -3.5;
		let col = [];

		for (let r = 0; r < 8; r++) {
			let material = new THREE.MeshBasicMaterial({color: color});
			let cube = new THREE.Mesh(geometry, material);
			scene.add(cube);

			cube.position.set(x, y, 0)
			y++;

			if (color === "#ffffff") color = "#000000";
			else color = "#ffffff";

			col.push(cube);
		}

		if (color === "#ffffff") color = "#000000";
		else color = "#ffffff";
		x++;

		boardTiles.push(col);
	}
}

function highlightPossibleMoves() {
	let id = INTERSECTED.uuid;
	let currPiece = chessPieces.find(piece => piece.mesh.uuid === id);

	let moves = currPiece.possibleMoves;
	for(let i = 0; i < currPiece.possibleMoves.length; i++) {
		let x = moves[i][0];
		let y = moves[i][1];
		boardTiles[x][y].material.color.set("#00ff00")
	}
}

function resetBoardColors() {
	let color = "#000000"
	for (let c = 0; c < boardTiles.length; c++) {
		for (let r = 0; r < boardTiles[0].length; r++) {
			boardTiles[c][r].material.color.set(color);

			if (color === "#ffffff") color = "#000000";
			else color = "#ffffff";
		}

		if (color === "#ffffff") color = "#000000";
		else color = "#ffffff";
	}
}

function onMouseMove(event) {
	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

// For now, not actually necessary. But we will change things up soon.
function onMouseDown(event) {
	if (INTERSECTED !== null) {
		let id = INTERSECTED.uuid;
		let currPiece = chessPieces.find(piece => piece.mesh.uuid === id);

		let moves = currPiece.possibleMoves;
		for(let i = 0; i < currPiece.possibleMoves.length; i++) {
			let x = moves[i][0];
			let y = moves[i][1];
			boardTiles[x][y].material.color.set("#00ff00")
		}
	}
}

function moveTest(event) {
	chessPieces[19].makeMove(chessPieces[19].position_x + 2, 3);
}