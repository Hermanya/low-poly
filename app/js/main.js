require([
	'vendor/three',
	'generator',
	], function(THREE, generator) {
		var camera, scene, renderer;
		var updatable;
		init();

		renderer.render(scene, camera);
		animate();
		window.addEventListener( 'resize', onWindowResize, false );

		function init() {
			camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -5000, 1000000 );
			//camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000000000);
			camera.position.y = 1850;
			camera.position.x = -3000;
			camera.position.z = -3000;
			camera.rotation.order = 'YXZ';
			camera.rotation.y -= Math.PI / 4 * 3;
			camera.rotation.x -= Math.PI / 9;
			scene = new THREE.Scene();

			updatable = generator.make(scene);

			renderer =  new THREE.WebGLRenderer( { antialias: true } );
			renderer.setSize(window.innerWidth, window.innerHeight);
		//	renderer.setClearColor( scene.fog.color, 1 );

			renderer.gammaInput = true;
			renderer.gammaOutput = true;

			renderer.shadowMapEnabled = true;
			renderer.shadowMapCullFace = THREE.CullFaceBack;

			document.body.appendChild(renderer.domElement);

		}

		function animate() {

			requestAnimationFrame(animate);

			for (var i = 0; i < updatable.length; i++) {
				updatable[i].update();
			}

			renderer.render(scene, camera);
		}

		function onWindowResize() {

			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();

			renderer.setSize( window.innerWidth, window.innerHeight );

		}
		
	});
