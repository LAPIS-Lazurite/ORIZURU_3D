var Bird = function () {
	var scope = this;
	THREE.Geometry.call( this );
	//胴
	v(   0,   1,   0 );
	v(   5, 0.5,   0 );
	v(   6,   6,   0 );
	//首、頭
	v(  13,   8,   0 );
	v(  11,  12,   0 );
	v(   9,  12,   0 );
	v(   3,   7,   0 );
	//胴
	v(   0,  10,   0 );
	v(  -6,   5,   0 );
	//尾
	v( -12, 5.4,   0 );
	v(  -5,   4,   0 );
	v( -20,   7,   0 );
	v( -19,   5,   0 );
	v(  -5,   0,   0 );
	//羽
	v(   6,  -6,  10 );
	v(   6,  -6, -10 );
	//尾羽
	v( -16,   7,   6 );
	v( -16,   7,  -6 );
	//胴
	f3(  0,   1,   2 );
	f3(  0,   8,  13 );
	f3(  0,   2,   8 );
	f3(  2,   7,   8 );
	//首、頭
	f3(  2,   4,   5 );
	f3(  3,   4,   5 );
	f3(  2,   5,   6 );
	//尾
	f3(  8,   9,  10 );
	f3( 10,  11,  12 );
	f3( 10,  12,  13 );
	//羽
	f3( 14,   2,   8 );
	f3( 15,   2,   8 );
	//尾羽
	f3( 9,   16,   17 );

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
