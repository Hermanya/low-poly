var THREE = require('./vendor/three.js');
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
