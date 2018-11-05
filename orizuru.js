if (rx_data === undefined) {
	var rx_data = {};
	rx_data.data = {};
}
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();

function init() {
	// scene
	let width = $('#orizuru_3D').width();
	let height = $('#orizuru_3D').height();
	let scene = new THREE.Scene();

	var light1TargetObject = new THREE.Object3D();
	light1TargetObject.position.set( 0, 10, -20 );
	scene.add(light1TargetObject);

	// light1
	let light1 = new THREE.DirectionalLight(0xffffff,1.2);
	light1.position.set(-35,5,20);
	light1.target = light1TargetObject;
	scene.add(light1);

	// light2
	let light2 = new THREE.DirectionalLight(0xffffff,1);
	light2.position.set(0,50,5);
	light2.castShadow = true;
	light2.shadow.camera.right = 30;
	light2.shadow.camera.left = -30;
	light2.shadow.camera.top = -30;
	light2.shadow.camera.bottom = 30;
	scene.add(light2);

	// ambient light
	ambient = new THREE.AmbientLight(0xffffff);
	scene.add(ambient);

	// camera
	let camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
	camera.position.set(20, 15, 20);
	camera.lookAt(scene.position);

	// surface
	let pgeometry = new THREE.PlaneGeometry(3000,3000);
	let pmaterial = new THREE.MeshLambertMaterial(
		{color:0x002030,side:THREE.DoubleSide});
	let plane = new THREE.Mesh(pgeometry, pmaterial);
	plane.position.set(0,-15,0);
	plane.rotation.x = 90 * Math.PI / 180;
	plane.receiveShadow = true;
	scene.add(plane);

	// hepler
	let axis = new THREE.AxesHelper(20);
	axis.position.set(0,0,0);
	scene.add(axis);
	//	var directionalLightShadowHelper = new THREE.CameraHelper( light2.shadow.camera );
	//	scene.add( directionalLightShadowHelper);
	//	var directionalLightHelper = new THREE.DirectionalLightHelper( light2 );
	//	scene.add( directionalLightHelper);

	// material
	let material = new THREE.MeshStandardMaterial({
		color: 0xFFD700,
		side: THREE.DoubleSide,
		roughness: 0.15,
		metalness: 0.65
	});

	// bird
	let bird = new THREE.Mesh( new Bird(), material);
	bird.castShadow = true;
	scene.add( bird );

	// renderer
	let renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize(width, height);
	renderer.setClearColor(0x589EAD, 1);
	renderer.shadowMap.enabled = true;

	// DOM
	document.getElementById('orizuru_3D').appendChild(renderer.domElement);
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

	// camera control
	let controls = new THREE.OrbitControls(camera, renderer.domElement);

	function onDocumentMouseMove( event ) {
		mouseX = ( event.clientX - windowHalfX ) / 2;
		mouseY = ( event.clientY - windowHalfY ) / 2;
	}
	// flap fast=3, mid=6,slow=10,stop=100
	let flap=100,cnt = 0;
	let sign = 1;

	function animate() {
		requestAnimationFrame(animate);

		if (rx_data.data.pitch !== undefined) {
			let q = new THREE.Quaternion().setFromEuler(
				new THREE.Euler(-rx_data.data.roll*Math.PI/180,
					0,
					(rx_data.data.pitch)*Math.PI/180));
			bird.quaternion.copy(q);
		}
		if ((rx_data.data.flap !== undefined) &&
			(flap != Math.floor(rx_data.data.flap))) {
			flap = Math.floor(rx_data.data.flap);
			cnt = flap;
		}
		if (flap > 0 && flap < 100) {
			if (sign === 1) {
				cnt++;
			} else {
				cnt--;
			}
			if (cnt > flap) {
				bird.geometry.verticesNeedUpdate = true;
				bird.geometry.vertices[ 14 ].y = -6;
				bird.geometry.vertices[ 14 ].z = 10;
				bird.geometry.vertices[ 15 ].y = -6;
				bird.geometry.vertices[ 15 ].z = -10;
				sign = -1;
			} else if (cnt == flap/2) {
				bird.geometry.verticesNeedUpdate = true;
				bird.geometry.vertices[ 14 ].y = 0;
				bird.geometry.vertices[ 14 ].z = 13;
				bird.geometry.vertices[ 15 ].y = 0;
				bird.geometry.vertices[ 15 ].z = -13;
			} else if (cnt == 0) {
				bird.geometry.verticesNeedUpdate = true;
				bird.geometry.vertices[ 14 ].y = 6;
				bird.geometry.vertices[ 14 ].z = 15.6;
				bird.geometry.vertices[ 15 ].y = 6;
				bird.geometry.vertices[ 15 ].z = -15.6;
			} else if (cnt == -flap/2) {
				bird.geometry.verticesNeedUpdate = true;
				bird.geometry.vertices[ 14 ].y = 12;
				bird.geometry.vertices[ 14 ].z = 13;
				bird.geometry.vertices[ 15 ].y = 12;
				bird.geometry.vertices[ 15 ].z = -13;
			} else if (cnt < -flap) {
				bird.geometry.verticesNeedUpdate = true;
				bird.geometry.vertices[ 14 ].y = 18;
				bird.geometry.vertices[ 14 ].z = 10;
				bird.geometry.vertices[ 15 ].y = 18;
				bird.geometry.vertices[ 15 ].z = -10;
				sign = 1;
			}
		}
		renderer.render(scene, camera);
		controls.update();
	}

	animate();
}
