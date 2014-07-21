var makeGrid = require('./grid.js');

var peakHeight = 180;

function Land (color) {
	this.grid = makeGrid(20, 30);
	makeIsland.call(this);
	this.mesh = this.grid.makeMergedTriangles(color);
	this.mesh.position.x += 190;
	this.mesh.position.z += 190;
}

function makeIsland (){
	var that = this,
	peak = makePeak.call(that);
	function getDistanceFromPeack (point){
		return Math.sqrt(
			Math.pow(point.x - peak.x, 2) +
			Math.pow(point.z - peak.z, 2)
			) / that.grid.distance;
	}
	that.grid.map2dArray(function(point){
		var distanceFromPeak = getDistanceFromPeack(point);
		var height = peakHeight / distanceFromPeak / 2 + Math.random() / distanceFromPeak * peakHeight;
		if (height > peakHeight * 1.5){
			height = peakHeight;
		}
		point.setY(height);
		return point;
	});

}

function makePeak () {
	var quoter = this.grid.length * this.grid.distance / 4;
	function getCoordinate () {
		return quoter + Math.random() * quoter;
	}
	return {
		x: getCoordinate(),
		z: getCoordinate(),
		y: peakHeight
	};
}

Land.prototype.addTo = function (scene){
	scene.add(this.mesh);
};

module.exports = Land;