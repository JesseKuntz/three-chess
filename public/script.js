// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------

var camera, scene, renderer, controls, loader, light, raycaster, mouse, INTERSECTED, tileIntersected, currPiece;

var boardTiles = [];
var chessPieces = [];
var justMeshes = [];
var moveClock = 0;
var currentMove = [];

var pieceSelected = false;

init();
animate();

function init() {
	// Create the raycaster and mouse tracker for picking
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();

	// Create an empty scene
	scene = new THREE.Scene();

	// Create a light
	light = new THREE.PointLight( 0xffffff, 3, 100 );
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
	var boardIntersects = raycaster.intersectObjects(scene.children);

	// If the mouse is touching a piece
	if ( intersects.length > 0 ) {
		// If the piece is a NEW piece
		if ( INTERSECTED != intersects[ 0 ].object ) {
			if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
			INTERSECTED = intersects[ 0 ].object;
			INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
			INTERSECTED.material.emissive.setHex( 0xff0000 );
			if (!pieceSelected) highlightPossibleMoves();
		}
	}
	// If the mouse is NOT touching a piece
	else {
		if ( INTERSECTED ) {
			INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
			if (!pieceSelected) {
				resetBoardColors();
			}
		}
		INTERSECTED = null;
	}

	// If the mouse is touching a tile with a piece selected
	if ( boardIntersects.length > 0 && pieceSelected) {
		// If the tile is a NEW tile
		if ( tileIntersected != boardIntersects[ 0 ].object) {

			// SET IT TO BLACK OR WHITE, DEPENDING ON WHAT NUMBER IT IS?? OR SOMETHING??
			if ( tileIntersected ) tileIntersected.material.color.setHex( tileIntersected.currentColor );
			tileIntersected = boardIntersects[ 0 ].object;
			tileIntersected.currentColor = tileIntersected.material.color.getHex();
			if (boardIntersects[ 0 ].object.material.color.getHex() == 0x00ff00) tileIntersected.material.color.setHex(0x0000ff);
		}
	}
	// If the mouse is NOT touching a tile
	else {
		if ( tileIntersected ) {
			tileIntersected.material.color.setHex( tileIntersected.currentColor );
		}
		tileIntersected = null;
	}

	// If there is a piece currently making a move
	if(!(currentMove === undefined) && currentMove.length != 0) {
		moveClock += 1;
		moveSpeed = 60
		unit = currentMove[0];
		unit.getMesh().position.set((1 - moveClock / moveSpeed) * unit.position_x + (moveClock / moveSpeed) * currentMove[1] - 3.5,
			(1 - moveClock / moveSpeed) * unit.position_y + (moveClock / moveSpeed) * currentMove[2] - 3.5, 0.5)
		// If at the end of the animation, reset clock and set new position of unit.
		if(moveClock == moveSpeed) {
			moveClock = 0;
			var capturedUnit = checkBoardUnit(currentMove[1], currentMove[2]);
			if(capturedUnit) {
				justMeshes.splice( justMeshes.indexOf(capturedUnit.getMesh()), 1);
				chessPieces.splice( chessPieces.indexOf(capturedUnit), 1);
				capturedUnit.removeMesh();
			}
			unit.setPosition(currentMove[1], currentMove[2]);
			for(u = 0; u < chessPieces.length; u++) {
				chessPieces[u].getPossibleMoves();
			}
			currentMove = [];
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

		unit.setMesh(gltf.scene);
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
		// chessPieces[j].printValidMoves();
	}
}

function highlightPossibleMoves() {
	let id = INTERSECTED.uuid;
	let currentPiece = chessPieces.find(piece => piece.getMesh().uuid === id);
	let moves = currentPiece.possibleMoves;
	for (let i = 0; i < currentPiece.possibleMoves.length; i++) {
		let x = moves[i][0];
		let y = moves[i][1];
		boardTiles[x][y].material.color.set("#00ff00");
		boardTiles[x][y].material.transparent = true;
		boardTiles[x][y].material.opacity = 0.5;
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

function resetBoardColors() {
	let color = "#000000"
	for (let c = 0; c < boardTiles.length; c++) {
		for (let r = 0; r < boardTiles[0].length; r++) {
			boardTiles[c][r].material.color.set(color);

			if (color === "#ffffff") color = "#000000";
			else color = "#ffffff";

			boardTiles[c][r].material.opacity = 1.0
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
	resetBoardColors();
	pieceSelected = false;

	if (INTERSECTED) {
		let id = INTERSECTED.uuid;
		currPiece = chessPieces.find(piece => piece.getMesh().uuid === id);

		let moves = currPiece.possibleMoves;
		for(let i = 0; i < currPiece.possibleMoves.length; i++) {
			let x = moves[i][0];
			let y = moves[i][1];
			boardTiles[x][y].material.color.set("#00ff00");
			boardTiles[x][y].material.opacity = 1.0;
		}

		pieceSelected = true;
	}

	if (tileIntersected) {
		// Position in THREE.js coordinates of the tile (Vector3):
		let screenCoords = tileIntersected.position;
		// Move the piece to tileCoords and update its position:
		// Make sure the piece is not moving to its current position.
		if(screenCoords.x + 3.5 != currPiece.position_x || screenCoords.y + 3.5 != currPiece.position_y) {
			currPiece.makeMove(screenCoords.x + 3.5, screenCoords.y + 3.5);
		}
	}

}