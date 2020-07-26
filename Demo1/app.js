let container;
let camera1;
let camera2;
let renderer;
let scene;
let controls1;
let controls2;
let globalPlane;

function init(){
    let mesh;

    container1 = document.querySelector( '#scene-container1' );
    container2 = document.querySelector( '#scene-container2' );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x8FBCD4 );

    globalPlane = new THREE.Plane( new THREE.Vector3( 0, -0.1, 0 ), 0 );

    createCameras();
    createControls();
    createLights();
    mesh = createMeshes();
    for (it of mesh){
        scene.add(it);
    }
    createRenderer();

    renderer1.setAnimationLoop( () => {

        update();
        render();

    });

}


function createCameras(){

    fov = 35;
    near = .1;
    far = 100;
    cameraPosition = new THREE.Vector3(-4,4,10);

    camera1 = new THREE.PerspectiveCamera(fov, container1.clientWidth / container1.clientHeight, near, far,);
    camera2 = new THREE.PerspectiveCamera(fov, container2.clientWidth / container2.clientHeight, near, far,);

    camera1.position.set(-4, 4, 10);
    camera2.position.set(-4, 4, 10);

}

function createLights() {

    const ambientLight = new THREE.HemisphereLight(
      0xddeeff, // sky color
      0x202020, // ground color
      5, // intensity
    );
  
    const mainLight = new THREE.DirectionalLight( 0xffffff, 5 );
    mainLight.position.set( 10, 10, 10 );
  
    scene.add( ambientLight, mainLight );
  
}

function createMeshes(){

    const geometry1 = new THREE.BoxBufferGeometry( 2, 2, 2 );
    const material1 = new THREE.MeshStandardMaterial({color: 0x800080, side: THREE.DoubleSide});

    mesh1 = new THREE.Mesh( geometry1, material1 );

    const geometry2 = new THREE.BoxBufferGeometry( 1, 1, 1 );
    const material2 = new THREE.MeshStandardMaterial({color: 0x999999, side: THREE.DoubleSide});

    mesh2 = new THREE.Mesh( geometry2, material2 );

    mesh = [mesh1, mesh2]

    //scene.add( mesh );
    return mesh

}

function createRenderer(){
    
    renderer1 = new THREE.WebGLRenderer( {antialias: true});
    renderer1.setSize( container1.clientWidth, container1.clientHeight );
    renderer1.setPixelRatio( window.devicePixelRatio );

    renderer2 = new THREE.WebGLRenderer( {antialias: true});
    renderer2.setSize( container2.clientWidth, container2.clientHeight );
    renderer2.setPixelRatio( window.devicePixelRatio );

    //Clip plane
    var globalPlanes = [ globalPlane ];
    renderer2.clippingPlanes = globalPlanes;


    container1.appendChild( renderer1.domElement );
    container2.appendChild( renderer2.domElement );


}

function createControls(){

    controls1 = new THREE.OrbitControls( camera1, container1 );
    controls2 = new THREE.OrbitControls( camera2, container2 );

}

function update(){

}

function render(){

    renderer1.render( scene, camera1 );
    renderer2.render( scene, camera2 );

}



function onWindowResize() {

    // set the aspect ratio to match the new browser window aspect ratio
    camera1.aspect = container1.clientWidth / container1.clientHeight;
    camera2.aspect = container2.clientWidth / container2.clientHeight;
  
    // update the camera's frustum
    camera1.updateProjectionMatrix();
    camera2.updateProjectionMatrix();
  
    // update the size of the renderer AND the canvas
    renderer1.setSize( container1.clientWidth, container1.clientHeight );
    renderer2.setSize( container2.clientWidth, container2.clientHeight );
  
}
  
window.addEventListener( 'resize', onWindowResize );