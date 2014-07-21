define(['vendor/three', 'grid'],function (THREE, makeGrid) {

	var waveHeight = 20,
	waterLevel = 75;
	
	function Water (color) {
		this.grid = makeGrid(8,100);
		this.makeWaves();
		this.triangles = this.grid.makeSeparateTriangles(color);
	}

	Water.prototype.makeWaves = function() {
		this.grid.map2dArray(function(point){
			point.isRaising = Math.random() > 0.5;
			point.setY(Math.round(waterLevel + Math.random() * waveHeight));
			return point;
		});
	};
	
	Water.prototype.update = function(){
		this.shiftWaves();
		this.askToUpdateVertices();
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

	return Water;
});