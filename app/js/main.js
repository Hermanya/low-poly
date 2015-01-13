var generator = require('./generator.js');

var camera, scene, renderer;
var updatable;
init();

renderer.render(scene, camera);
animate();
window.addEventListener( 'resize', onWindowResize, false );

function init() {
	camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -5000, 1000000 );
	camera.position.y = 500;
	camera.position.x = 800;
	camera.position.z = 500;
	camera.rotation.x -= Math.PI / 2;
	scene = new THREE.Scene();

	updatable = generator.make(scene);

	renderer =  new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize(window.innerWidth, window.innerHeight);

	renderer.gammaInput = true;
	renderer.gammaOutput = true;

	renderer.shadowMapEnabled = true;
	renderer.shadowMapCullFace = THREE.CullFaceBack;

	document.body.appendChild(renderer.domElement);

}

function animate() {
	updatable.forEach(function (updatable) {
		updatable.update();
	});

	renderer.render(scene, camera);

	/*
      var dataURL = canvas.toDataURL();
      document.getElementById('canvasImg').src = dataURL;
	*/
 
	requestAnimationFrame(animate);
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}


