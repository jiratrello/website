import * as THREE from './three.module.js';
import{GLTFLoader} from './GLTFLoader.js'; 

//config
const menuRadius = 350;
const menuRate = 0.08;
const menuCooldown = 100; //in milliseconds
const colors = [
	"0000ff",
	"00ff00",
	"ff0000",
	"ffaa22",
	"aa22ff",
	"aaff22",
	"22ffaa",
];
const lightcolors = [
	0x0000ff,
	0x00ff00,
	0xff0000,
	0xffaa22,
	0xaa22ff,
	0xaaff22,
	0x22ffaa,
];

//update
let LastUpdateTime = Date.now();
let deltaTime = 0;
let menuMoving = true;

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
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
let currentGeo;

//debug
let debugSVG = null;

camera.position.z = 5;

//init

const light = new THREE.DirectionalLight (0x0000ff, 5);
scene.add(light);

window.onload = function() {
	const container = document.getElementById("threeDee");
	renderer.setSize( container.clientWidth, container.clientHeight );

	camera.aspect = container.clientWidth / container.clientHeight;
	// update projection matrix to apply new aspect ratio
	camera.updateProjectionMatrix();
	
	container.appendChild( renderer.domElement );

	document.getElementById("enterButton").addEventListener("mousedown", openSelected);

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
	parentelement.innerHTML = "<div>"+dxData.shortname+"</div>";
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

function openSelected() {
	window.open(GetCurrentlySelectedDxData().url, "_blank");
}

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
		if (menuMoving == true) {
			// Initialise on new selection
			menuMoving = false;
			displayDxData(GetCurrentlySelectedDxData());
		}
		if (inputDelta != 0 && currentCooldownTime <= 0) {
			currentSelectionIndex += inputDelta;
		}
	} else {
		// Menu travelling
		menuMoving = true;
		currentCooldownTime = menuCooldown;
	}
	threeDeeAnimate();
	menuAnimate();
	requestAnimationFrame (Update);
	LastUpdateTime = Date.now();
}

function displayDxData(theData) {
	document.getElementById("SelectionName").innerText = theData.name;
	document.getElementById("SelectionYear").innerText = theData.year;
	document.getElementById("SelectionDescription").innerText = theData.description;
	// geo
	if (theData.geo != "") {
		const gltfLoader = new GLTFLoader();
		const url = theData.geo;
		gltfLoader.load(url, (gltf) => {
			scene.remove(currentGeo);
			currentGeo = gltf.scene;
			scene.add(currentGeo);
		});
	}
	// when the option is changed
	// let color1 = lightcolors[Math.floor(Math.random() * lightcolors.length)];
	// let color2 = colors[Math.floor(Math.random() * colors.length)];
	// light.color = new THREE.Color(color1);
	// document.body.style.background = "#"+color2;
	document.body.style["background-image"] = `url(${theData.background})`;
}

function threeDeeAnimate() {
	renderer.render( scene, camera );
	if (currentGeo != null) {
		currentGeo.rotation.x += 0.01;
		currentGeo.rotation.y += 0.01;
	}
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
		let pos = radialPosition(currentRotation - i * angleDelta, menuRadius);
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