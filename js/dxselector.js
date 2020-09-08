//interface
let dxDataElements = [];
let debugSVG = null;

//threejs
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, 1, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer( { alpha: true } );
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );

scene.add( cube );
camera.position.z = 5;

//init
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

	for(let i = 0; i < dxData.length; i += 1) {
		dxDataElements.push(createDxElement(dxData[i], 100, 100+(i*20)));
	}

	animate();
	menuAnimate();
}

//debug gizmos
function hackerMode(){
	createDebugCircle(window.innerWidth / 2, window.innerHeight / 2, 350);
	// window.open("https://youtu.be/VMRaCW6OtXM");
}

function createDxElement(dxData, x, y) {
	let parentelement = document.createElement("div");
	parentelement.innerHTML = "<div>"+dxData.name+"</div><div>"+dxData.description+"</div>";
	parentelement.className = "dxElement";
	//'px' to convert to pixels
	parentelement.style.left = x+'px';
	parentelement.style.top = y+'px';
	document.body.appendChild(parentelement);
	return parentelement;
}

function radialPosition(angle, distance) {
	let x = Math.cos(angle)*distance;
	let y = Math.sin(angle)*distance;
	return {x: x, y: y};
}

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
}

function createDebugCircle(x, y, radius)
{
	if (debugSVG == null)
	{
		debugSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		debugSVG.style.position = "absolute";
		debugSVG.setAttribute("width", "100%");
		debugSVG.setAttribute("height", "100%");
		document.body.appendChild(debugSVG);
	}

	let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

	circle.setAttribute("cx", x);
	circle.setAttribute("cy", y);
	circle.setAttribute("r", radius);
	circle.setAttribute("fill", "none");
	circle.setAttribute("stroke", "black");

	debugSVG.appendChild(circle);
}

function menuAnimate() {
	requestAnimationFrame (menuAnimate);
	const distance = 350;
	const rate = 0.001;
	const centerX = window.innerWidth / 2;
	const centerY = window.innerHeight / 2;
	const angleDelta = (Math.PI * 2) / dxDataElements.length;

	for(let i = 0; i < dxDataElements.length; i += 1) {
		let pos = radialPosition(Date.now()*rate+i*angleDelta, distance);
		pos.x += centerX;
		pos.y += centerY;
		pos.x -= dxDataElements[i].clientWidth / 2;
		pos.y -= dxDataElements[i].clientHeight / 2;
		dxDataElements[i].style.left = pos.x+'px';
		dxDataElements[i].style.top = pos.y+'px';
	}
}