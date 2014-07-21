var THREE = require('./vendor/three.js'),
Water = require('./water.js'),
Land = require('./land.js'),
Light = require('./light.js');

var scene,

themes = [{
	water: 0xB8D2Cf,
	land: 0xD1AB8C
}, {
	water: 0x2e8b57,
	land: 0x666666
}, {
	water: 0x1c6ba0,
	land: 0x60afaf
}];


function makeWater (color) {
	var water = new Water(color);
	water.addTo(scene);
	return water;
}

function makeLand (color) {
	var land = new Land(color);
	land.addTo(scene);
	return land;
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
	makeBackground(theme.water);
	makeLand(theme.land);
	makeLight();
	updatable.push(makeWater(theme.water));
	return updatable;
}
module.exports = {
	make: make
};
