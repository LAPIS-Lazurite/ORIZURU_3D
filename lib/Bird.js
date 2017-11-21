var Bird = function () {

	var scope = this;

	THREE.Geometry.call( this );

	v(   4,   0,   0 );
	v(   8,   9,   0 );
	v(   10,  9,   0 );
	v(   8,   10,  0 );

	v(   3,   4,   0 );
	v(   0,   5,   0 );
	v(   -3,   4,   0 );
	v( - 8,   12,   0 );

	v(   -4,   0,   0 );
	v(   5, 4,   0 );
	v(  -5, 4,   0 );
	v(  0, 12,   6 );

	v(  0, 12,   -6 );

	f3( 1, 2, 3 );
	f3( 0, 8, 4 );
	f3( 0, 1, 3 );
	f3( 0, 3, 4 );
	f3( 4, 5, 6 );
	f3( 4, 6, 8 );
	f3( 6, 7, 8 );

	f3( 9, 10, 11 );
	f3( 9, 10, 12 );

	this.computeFaceNormals();

	function v( x, y, z ) {

		scope.vertices.push( new THREE.Vector3( x, y, z ) );

	}

	function f3( a, b, c ) {

		scope.faces.push( new THREE.Face3( a, b, c ) );

	}

}

Bird.prototype = Object.create( THREE.Geometry.prototype );
Bird.prototype.constructor = Bird;
