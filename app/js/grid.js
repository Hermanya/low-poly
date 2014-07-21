var THREE = require('./vendor/three.js'),
Triangle = require('./triangle.js');

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