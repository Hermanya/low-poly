var THREE = require('./vendor/three.js');

function Light (){
	this.dirLight = makeDirectionalLight();
	this.hemiLight = makeHemisphereLight();
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
	dirLight.position.set( -1, 1.75, 1 );
	dirLight.position.multiplyScalar( 50 );
	return dirLight;
}

Light.prototype.addTo = function (scene) {
	scene.add(this.hemiLight);
	scene.add(this.dirLight);
};

module.exports = Light;

