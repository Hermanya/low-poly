var Matter = require('./matter.js'),
Light = require('./light.js');

var scene,

themes = [{
	matter: 'rgb(102, 205, 170)'
}];


function makeMatter (color) {
	var matter = new Matter(color);
	matter.addTo(scene);
	return matter;
}


function makeLight () {
	var light = new Light();
	light.addTo(scene);
	return light;
}

function makeBackground (color) {
	var groundGeo = new THREE.PlaneGeometry( 10000, 10000 );
	var groundMat = new THREE.MeshPhongMaterial({
		ambient: 0xffffff,
		color: 0xffffff,
		specular: 0x050505
	});
	groundMat.color.setHex(color);

	var ground = new THREE.Mesh( groundGeo, groundMat );
	ground.rotation.x = -Math.PI/2;
	ground.position.y = -33;
	scene.add( ground );
}



function make (givenScene) {
	var themeIndex = Math.floor(Math.random() * themes.length),
	theme = themes[themeIndex];
	var updatable = [];
	scene = givenScene;
	makeBackground(theme.matter);
	makeLight();
	updatable.push(makeMatter(theme.matter));
	return updatable;
}
module.exports = {
	make: make
};
