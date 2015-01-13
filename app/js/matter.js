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