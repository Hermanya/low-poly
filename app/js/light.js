
function Light (){
	this.lights = [
	makeDirectionalLight(),
	makeHemisphereLight(),
	makeAmbientLight()
	];
}

function makeHemisphereLight () {
	var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
	hemiLight.color.setHSL( 0.6, 1, 1 );
	hemiLight.groundColor.setHSL( 0.095, 1, 1 );
	hemiLight.position.set( 0, 500, 0 );
	return hemiLight;
}

function makeDirectionalLight () {
	var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
	dirLight.color.setHSL( 0.55, 1, 1.1 );
	dirLight.position.set( -2, 1.75, 2 );
	dirLight.position.multiplyScalar( 50 );
	
	return dirLight;
}

function makeAmbientLight () {
	return new THREE.AmbientLight( 0x404040 );
}

Light.prototype.addTo = function (scene) {
	this.lights.forEach( function (light) {
		scene.add(light);
	});
};

module.exports = Light;

