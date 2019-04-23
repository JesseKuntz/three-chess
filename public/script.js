// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------

var camera, scene, renderer, controls, loader;

init();
animate();

function init() {
	loader = new THREE.OBJLoader();

	// Create an empty scene
	scene = new THREE.Scene();

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

	// load a the king -- doesn't work yet
	// loader.load(
	// 	// resource URL
	// 	'models/king.obj',
	// 	// called when resource is loaded
	// 	function ( object ) {
	// 		scene.add( object );
	// 	},
	// 	// called when loading is in progresses
	// 	function ( xhr ) {
	// 		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	// 	},
	// 	// called when loading has errors
	// 	function ( error ) {
	// 		console.log( 'An error happened' );
	// 	}
	// );

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