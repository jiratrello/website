let dxDataElements = [];

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

	for(let i = 0; i < dxData.length; i += 1) {
		dxDataElements.push(createDxElement(dxData[i], 100, 100+(i*20)));
	}
}

function createDxElement(dxData, x, y) {
	let parentelement = document.createElement("div");
	parentelement.innerHTML = dxData.name;
	parentelement.className = "dxElement";
	//'px' to convert to pixels
	parentelement.style.left = x+'px';
	parentelement.style.top = y+'px';
	document.body.appendChild(parentelement);
	return parentelement;
}

function radialPosition(angle, distance) {
	
}

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
}

function menuAnimate() {
	requestAnimationFrame (menuAnimate);
	let length = 100;
	let rate = 0.001;
	let offset = 300;
	for(let i = 0; i < dxDataElements.length; i += 1) {
		let x = Math.sin(i+Date.now()*rate)*length+offset;
		dxDataElements[i].style.left = x+'px';
		// dxDataElements[i].style.top = y+'px';
	}
}