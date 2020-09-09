//config
const menuRadius = 350;
const menuRate = 0.08;
// cooldown = milliseconds
const menuCooldown = 100;

//update
let LastUpdateTime = Date.now();
let deltaTime = 0;

//interface
let dxDataElements = [];
let currentSelectionIndex = 0;
let currentRotation = Math.PI / 2;
let targetRotation = 0;
let inputDelta = 0;
let currentCooldownTime = 0;

//threejs
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, 1, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer( { alpha: true } );
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );

//debug
let debugSVG = null;

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

	window.addEventListener("keydown", function(event) {
		if (event.code == "ArrowLeft" || event.code == "KeyA") {
			inputDelta = -1;
		} else if (event.code == "ArrowRight" || event.code == "KeyD") {
			inputDelta = 1;
		}
	})

	window.addEventListener("keyup", function(event) {
		if (event.code == "ArrowLeft" || event.code == "KeyA" || event.code == "ArrowRight" || event.code == "KeyD") {
			inputDelta = 0
		}
	})

	for(let i = 0; i < dxData.length; i += 1) {
		dxDataElements.push(createDxElement(dxData[i], 100, 100+(i*20)));
	}

	Update();
}

function createDxElement(dxData, x, y) {
	let parentelement = document.createElement("div");
	parentelement.innerHTML = "<div>"+dxData.year+"</div><div>"+dxData.name+"</div><div>"+dxData.description+"</div>";
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


/**
 * MENU CONTROLS
 */

function GetCurrentlySelectedDxData() {
	let index = currentSelectionIndex;
	while(index >= dxData.length) {
		index -= dxData.length;
	}
	while(index < 0) {
		index += dxData.length;
	}
	return dxData[index];
}


/**
 * UPDATE LOOP
 */

function Update() {
	deltaTime = Date.now() - LastUpdateTime;
	if (targetRotation == currentRotation) {
		// Menu reached destination
		currentCooldownTime -= deltaTime;
		if (inputDelta != 0 && currentCooldownTime <= 0) {
			currentSelectionIndex += inputDelta;
		}
	} else {
		// Menu travelling
		currentCooldownTime = menuCooldown;
	}
	threeDeeAnimate();
	menuAnimate();
	requestAnimationFrame (Update);
	LastUpdateTime = Date.now();
}

function threeDeeAnimate() {
	renderer.render( scene, camera );
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
}

function menuAnimate() {
	const centerX = window.innerWidth / 2;
	const centerY = window.innerHeight / 2;
	const angleDelta = (Math.PI * 2) / dxDataElements.length;

	targetRotation = currentSelectionIndex * angleDelta + Math.PI / 2;
	if (targetRotation > currentRotation) {
		currentRotation += menuRate;
	}
	if (targetRotation < currentRotation) {
		currentRotation -= menuRate;
	}
	if (Math.abs(currentRotation - targetRotation) <= menuRate) {
		currentRotation = targetRotation;
	}

	for(let i = 0; i < dxDataElements.length; i += 1) {
		let pos = radialPosition(currentRotation + i * angleDelta, menuRadius);
		pos.y *= 0.6;
		pos.x += centerX;
		pos.y += centerY;
		pos.x -= dxDataElements[i].clientWidth / 2;
		pos.y -= dxDataElements[i].clientHeight / 2;
		dxDataElements[i].style.left = pos.x+'px';
		dxDataElements[i].style.top = pos.y+'px';
	}
}

/**
 * DEBUG
 */

//Gizmos
function hackerMode(){
	createDebugCircle(window.innerWidth / 2, window.innerHeight / 2, 350);
	// window.open("https://youtu.be/VMRaCW6OtXM");
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