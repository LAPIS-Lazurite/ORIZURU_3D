var scene,
    camera,
    light,
    ambient,
    axis,
    renderer;

if (rx_data === undefined) {
	var rx_data;
}
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();

function　init (){

    // scene
	var	width = $('#orizuru_3D').width(),
		height = $('#orizuru_3D').height();

    const scene = new THREE.Scene();

    // bird
	const bird = new THREE.Mesh( new Bird(), new THREE.MeshLambertMaterial(
					{color: 0xffffff, side: THREE.DoubleSide}));
	bird.phase = Math.floor( Math.random() * 62.83 );
	bird.castShadow = true;
	scene.add( bird );

	// light
    var light = new THREE.DirectionalLight(0xffffff,1);
    light.position.set(0, 100, 0);
    light.castShadow = true;
    scene.add(light);

    ambient = new THREE.AmbientLight(0xf0f0f0);
    scene.add(ambient);

    // camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
    camera.position.set(15, 10, 15);
	camera.lookAt(scene.position);

	// surface
	var pgeometry = new THREE.PlaneGeometry(3000,3000);
	var pmaterial = new THREE.MeshLambertMaterial(
						{color:0x002030,side:THREE.DoubleSide});
	var plane = new THREE.Mesh(pgeometry, pmaterial);
	plane.position.set(0,-6,0);
	plane.rotation.x = 90 * Math.PI / 180;
	plane.receiveShadow = true;
	scene.add(plane);

    // hepler
    const axis = new THREE.AxisHelper(20);
    axis.position.set(0,0,0);
    scene.add(axis);
//	var directionalLightShadowHelper = new THREE.CameraHelper( light.shadow.camera );
//	scene.add( directionalLightShadowHelper);
//	var directionalLightHelper = new THREE.DirectionalLightHelper( light );
//	scene.add( directionalLightHelper);

    // renderer
    const renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize(width, height);
        renderer.setClearColor(0x589EAD, 1);
        renderer.shadowMap.enabled = true;

    // DOM
    document.getElementById('orizuru_3D').appendChild(renderer.domElement);
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );

	// camera control
	var controls = new THREE.OrbitControls(camera, renderer.domElement);

	animate();

	function onDocumentMouseMove( event ) {

		mouseX = ( event.clientX - windowHalfX ) / 2;
		mouseY = ( event.clientY - windowHalfY ) / 2;

	}
	// flap fast=3, mid=6,slow=10,stop=100
	var flap=100,cnt = 0;

	function animate() {
		requestAnimationFrame(animate);

		if (rx_data !== undefined) {
			var q = new THREE.Quaternion().setFromEuler(
						new THREE.Euler(-rx_data.data.roll*Math.PI/180,
						0,
						(rx_data.data.pitch)*Math.PI/180));
			bird.quaternion.copy(q);
			if ((rx_data.data.corr_flap !== undefined) &&
				(flap != Math.floor(rx_data.data.corr_flap))) {
				flap = Math.floor(rx_data.data.corr_flap);
				cnt = 0;
			}
		}
		if (flap > 0 && flap < 100) cnt++;
		if (cnt == flap) {
			bird.geometry.verticesNeedUpdate = true;
			bird.geometry.vertices[ 12 ].y = bird.geometry.vertices[ 11 ].y = -4;
		} else if (cnt == flap*2) {
			bird.geometry.verticesNeedUpdate = true;
			bird.geometry.vertices[ 12 ].y = bird.geometry.vertices[ 11 ].y = 12;
			cnt=0;
		}
		renderer.render(scene, camera);
		controls.update();
	}
}