
import * as THREE from 'https://cdn.skypack.dev/three@0.130.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.130.0/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'https://cdn.skypack.dev/three@0.130.0/examples/jsm/loaders/FBXLoader.js'

var scene = new THREE.Scene();
scene.background = new THREE.Color(0x404040)

const rendererWidth = window.innerWidth
const rendererHeight = window.innerHeight
const renderer = new THREE.WebGLRenderer()
renderer.setSize(rendererWidth, rendererHeight)
document.getElementById('WebGLOutput').appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(75, rendererWidth / rendererHeight, 0.1, 1000)
camera.position.set(10,10,10)

const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, 4, 0)
controls.minDistance = 5
controls.maxDistance = 10
controls.maxPolarAngle = Math.PI/2

function Lighting(){

    const ambientLight = new THREE.AmbientLight( 0x808080 , 1); // soft white light
    scene.add( ambientLight );

    const ambient = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1);
    scene.add( ambient );

    var spotLight = new THREE.SpotLight( 0x7777FF, 4 );
    spotLight.position.set( 0, 12, 15 );
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 1;
    spotLight.decay = 2;
    spotLight.distance = 30;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 10;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.focus = 1;
    scene.add( spotLight );

    var lightHelper = new THREE.SpotLightHelper( spotLight );
    scene.add( lightHelper );

    var pointLight = new THREE.PointLight( 0x808080, .1, 30 );
    pointLight.position.set(0,7.5,.5);
    scene.add(pointLight);

    var pointLight2 = new THREE.PointLight( 0x808080, .1, 30 );
    pointLight2.position.set(0,7.5,-9.5);
    scene.add(pointLight2);

    var pointLight3 = new THREE.PointLight( 0x0000FF, 2, 3);
    pointLight3.position.set(0, 4, 1);
    scene.add(pointLight3);
    

    const sphereSize = 1;
    const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
    scene.add( pointLightHelper );

    const pointLightHelper2 = new THREE.PointLightHelper( pointLight2, sphereSize );
    scene.add( pointLightHelper2 );

    // const pointLightHelper3 = new THREE.PointLightHelper( pointLight3, sphereSize );
    // scene.add( pointLightHelper3 );
}

Lighting()


function createPathStrings(filename){
    const basePath = "galaxy/"
    // const baseFilename = basePath + filename;
    const baseFilename = basePath;
    const fileType = ".tga";
    const sides = ["aaa.jpg","aaa.jpg","aaa.jpg","aaa.jpg","aaa.jpg","aaa.jpg"];
    const pathStrings = sides.map(side=>{
        // return baseFilename + side + fileType;
        return baseFilename + side;
    })
    return pathStrings;
}


function createMaterialArray(filename) {
  const skyboxImagepaths = createPathStrings(filename);
  const materialArray = skyboxImagepaths.map(image => {
    let texture = new THREE.TextureLoader().load(image);

    return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
  });
  return materialArray;
}

const skyboxImage = "galaxy";
const materialArray = createMaterialArray(skyboxImage);
let skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000);
let skybox = new THREE.Mesh(skyboxGeo, materialArray);
skybox.position.set(0,0,0);
scene.add(skybox);

var clock = new THREE.Clock();

const loadingManager = new THREE.LoadingManager( () => {
    const loadingScreen = document.getElementById( 'loadingScreen' );
    loadingScreen.classList.add( 'fade-out' );
    loadingScreen.addEventListener( 'transitionend', onTransitionEnd );
} );

function onTransitionEnd( event ) {
    event.target.remove();
}

const fbxLoader = new FBXLoader(loadingManager)

const fileNames = ['AssetsCent_v2.fbx','AssetsDer_v2.fbx','AssetsIzq_v2.fbx','CofreMetal_v2.fbx','Lamparas_V3.fbx','Librero_v2.fbx','MesotaDer_v2.fbx','MesotaIzq_v2.fbx','Pared_V8.fbx', 'Piso_v2.fbx','Puerta_v2.fbx','PhilWizard_Idle_Ver6.fbx']
for(let i = 0; i < fileNames.length; i++){
    let filePath = 'models/' + fileNames[i]
    fbxLoader.load(filePath, (object) =>{

        // if (fileNames[i] == 'Pared_V5.fbx'){
        //     object.traverse(function (child) {
        //         if (child.isMesh) {
        //             child.normalMap = new THREE.TextureLoader().load( 'models/Pared_Normal.png' );
        //             child.receiveShadow = true;
        //             child.castShadow = true;
        //             console.log(child)
        //         }
        //     })
        // }
        
        object.scale.set(.01, .01, .01);
        if (fileNames[i] == 'PhilWizard_Idle_Ver6.fbx'){
            object.position.y = .8
        }
        scene.add(object)
        console.log('Loaded ' + fileNames[i])
    })
}

window.addEventListener("resize", onResize, false);

update()

function update() {

    controls.update();
    renderer.render(scene, camera);

    requestAnimationFrame(update);
}

function onResize() {
    if (camera != null) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    }
}
