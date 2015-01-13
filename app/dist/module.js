(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./light.js":3,"./matter.js":5}],2:[function(require,module,exports){
var Triangle = require('./triangle.js');

function makeGrid (length, distance) {
	var grid = make2dArray(length);
	grid.map2dArray = map2dArray;
	grid.makeSeparateTriangles = makeSeparateTriangles;
	grid.makeMergedTriangles = makeMergedTriangles;
	grid.distance = distance;
	fillWithPoints(grid);
	return grid;
}

function make2dArray (d) {
	var array = new Array(d);
	for (var x = 0; x < d; x++) {
		array[x] = new Array(d);
	}
	return array;
}

function fillWithPoints (grid) {
	var distanceBetweenAdjacentPoints = grid.distance,
	getShift = function(x){
		return x % 2 === 0 ? 0 : distanceBetweenAdjacentPoints / 2;
	};
	grid.map2dArray(function(point, x, z){
		return  new THREE.Vector3(
			x * distanceBetweenAdjacentPoints + getShift(z),
			0,
			z * distanceBetweenAdjacentPoints
			);
	});
}

function map2dArray (fn) {
	var length = this.length, x, y;
	for (x = length - 1; x >= 0; x--) {
		for (y = length - 1; y >= 0; y--) {
			this[x][y] = fn(this[x][y], x, y);
		}
	}
}

function makeSeparateTriangles (color) {
	var triangles = [], triangle,
	material = new THREE.MeshLambertMaterial({
		color: color
	});
	material.opacity = 0.85;
	material.transparent = true;
	for (var x = 1; x < this.length; x++) {
		for (var z = 1; z < this.length; z++) {
			if (z % 2 !== 0){
				triangle = new Triangle([this[x - 1][z],this[x][z],this[x][z - 1]], material);
				triangles.push(triangle);
				triangle = new Triangle([this[x - 1][z],this[x][z - 1],this[x - 1][z - 1]], material);
				triangles.push(triangle);
			}else{
				triangle = new Triangle([this[x][z],this[x][z - 1], this[x - 1][z - 1]], material);
				triangles.push(triangle);
				triangle = new Triangle([this[x][z],this[x - 1][z - 1],this[x - 1][z]], material);
				triangles.push(triangle);
			}
		}
	}
	return triangles;
}

function makeMergedTriangles (color){
	var landGeometry = new THREE.Geometry(), triangleGeometery,
	material = new THREE.MeshLambertMaterial({
		color: color
	});
	for (var x = 1; x < this.length; x++) {
		for (var z = 1; z < this.length; z++) {
			if (z % 2 !== 0){
				triangleGeometery = Triangle.makeGeometry([this[x - 1][z],this[x][z],this[x][z - 1]], material);
				landGeometry.merge(triangleGeometery);
				triangleGeometery = Triangle.makeGeometry([this[x - 1][z],this[x][z - 1],this[x - 1][z - 1]], material);
				landGeometry.merge(triangleGeometery);
			}else{
				triangleGeometery = Triangle.makeGeometry([this[x][z],this[x][z - 1], this[x - 1][z - 1]], material);
				landGeometry.merge(triangleGeometery);
				triangleGeometery = Triangle.makeGeometry([this[x][z],this[x - 1][z - 1],this[x - 1][z]], material);
				landGeometry.merge(triangleGeometery);
			}
		}
	}
	return new THREE.Mesh(landGeometry, material);
}

module.exports = makeGrid;
},{"./triangle.js":6}],3:[function(require,module,exports){

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


},{}],4:[function(require,module,exports){
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



},{"./generator.js":1}],5:[function(require,module,exports){
var makeGrid = require('./grid.js');

var waveHeight = 100,
waterLevel = 75;

function Water (color) {
	this.grid = makeGrid(16,100);
	this.makeWaves();
	this.triangles = this.grid.makeSeparateTriangles(color);
	window.addEventListener('click', function () {
		Water.prototype.colors = [102, 205, 170];
	});
}

Water.prototype.makeWaves = function() {
	this.grid.map2dArray(function(point){
		point.isRaising = Math.random() > 0.5;
		point.setY(Math.round(waterLevel + Math.random() * waveHeight));
		point.setX(Math.round(point.x + Math.random()*20*3));
		point.setZ(Math.round(point.z + Math.random()*20*3));
		return point;
	});
};

Water.prototype.update = function(){
	this.shiftWaves();
	this.askToUpdateVertices();
	this.updateColor();
};

Water.prototype.updateColor = function () {
	var colors = Water.prototype.colors || [125, 125, 125];
	
	colors = colors.map( function (color) {
		if (color < 80){
			return 80;
		}
		else if (color > 180) {
			return 180;
		}
		else {
			return color + 3*(Math.random() > 0.5 ? 1 : -1);
		}
	});

	this.triangles[0].material.color.setRGB(
		colors[0]/255,
		colors[1]/255,
		colors[2]/255
		);

	Water.prototype.colors = colors;
	//console.log(color);
};

Water.prototype.shiftWaves = function() {
	this.grid.map2dArray(function(point){
		if (point.isRaising){
			point.setY(point.y + 0.25);
		}else{
			point.setY(point.y - 0.25);
		}

		if (point.y > waterLevel + waveHeight){
			point.isRaising = false;
		}

		if (point.y < waterLevel){
			point.isRaising = true;
		}

		return point;
	});
};

Water.prototype.askToUpdateVertices = function(){
	var geometry;
	for (var i = 0; i < this.triangles.length; i++) {
		geometry = this.triangles[i].geometry;
		geometry.verticesNeedUpdate = true;
		geometry.normalsNeedUpdate = true;
		geometry.computeFaceNormals();
		geometry.computeVertexNormals();

	}
};

Water.prototype.addTo = function (scene){
	for (var i = 0; i < this.triangles.length; i++) {
		scene.add(this.triangles[i]);
	}
};

module.exports = Water;
},{"./grid.js":2}],6:[function(require,module,exports){
function Triangle (points, material) {
	var geometry = Triangle.makeGeometry(points);
	var mesh = new THREE.Mesh(geometry, material);
	mesh.overdraw = true;
	return mesh;
}
Triangle.makeGeometry = function (points) {
	var geometry = new THREE.Geometry();
	for (var i = 0; i < points.length; i++) {
		geometry.vertices.push(points[i]);
	}
	geometry.faces.push(new THREE.Face3(0, 1, 2));
	geometry.computeFaceNormals();
	geometry.computeVertexNormals();
	return geometry;
};
module.exports = Triangle;

},{}]},{},[1,2,3,4,5,6]);