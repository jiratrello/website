const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, 1, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer( /*{ alpha: true }*/ );


const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

window.onload = function() {
	const container = document.getElementById("threeDee");
	renderer.setSize( container.clientWidth, container.clientHeight );

	camera.aspect = container.clientWidth / container.clientHeight;
	// update projection matrix to apply new aspect ratio
	camera.updateProjectionMatrix();
	
	container.appendChild( renderer.domElement );

	window.addEventListener("resize", function() {
		renderer.setSize( container.clientWidth, container.clientHeight );
		camera.aspect = container.clientWidth / container.clientHeight;
		// update projection matrix to apply new aspect ratio
		camera.updateProjectionMatrix();
	});

	animate();
}

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
}
