

function init(){
    var container;
    var scene;
    var cameraMain;
    var protal;
    var controls;
    var lights;
    var meshes;
    var renderer;

    container = document.querySelector( '#scene-container' );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x8FBCD4 );

    /////////////////////////////////////////////////
    //  
    //  INSERTION BLOCK
    //
    //  This is to set up the different elements that
    //  are created, NOT for creating them directly
    //
    //  Please refer to the functions if you want to
    //  change the scene(s). Only change this section
    //  if you are changing how the objects are
    //  inserted into the scene(s).
    //
    /////////////////////////////////////////////////

    lights = createLights();
    for(light of lights){
        scene.add(light);
    }

    distance = -10;
    
    meshes = createMeshes(distance);
    for (i in meshes){
        scene.add(meshes[i]);
    }

    myKnot = meshes["knot"];
    cameraMain = createCameras(container);

    renderer = createRenderer(container);
    controls = createControls(cameraMain, container);

    portal = createPortal(distance);
    scene.add(portal.box)

    renderer.setAnimationLoop( () => {

        update(knot);
        render(renderer, scene, camera, portal);

    });

    window.addEventListener( 'resize', function(){onWindowResize(container);} );
}

function createCameras(usedContainer){

    fov = 35;
    near = .1;
    far = 200;
    cameraPosition = new THREE.Vector3(-4,4,10);

    camera = new THREE.PerspectiveCamera(fov, usedContainer.clientWidth / usedContainer.clientHeight, near, far,);

    camera.position.set(-4, 4, 10);

    return camera;

}

function createLights() {

    lights = []

    const ambientLight = new THREE.HemisphereLight(
      0xddeeff, // sky color
      0x202020, // ground color
      3, // intensity
    );
    lights.push(ambientLight);
  
    const mainLight = new THREE.DirectionalLight( 0xffffff, 5 );
    mainLight.position.set( 10, 0, 10 );
    lights.push(mainLight);
  
    return lights
  
}

function createMeshes(seenObjectDepth){

    let halfWay = seenObjectDepth / 2;

    
    //Main scene
    const knotGeometry = new THREE.TorusKnotGeometry();
    const knotMaterial = new THREE.MeshStandardMaterial({color: 0x999999});

    knot = new THREE.Mesh( knotGeometry, knotMaterial );
    knot.translateY(seenObjectDepth);

    const dividerGeometry = new THREE.PlaneGeometry( 50, 50, 1 );
    const dividerMaterial = new THREE.MeshBasicMaterial( {color: 0x0d8f32, side: THREE.DoubleSide} );

    divider = new THREE.Mesh( dividerGeometry, dividerMaterial );
    divider.translateY(halfWay);
    divider.rotateX(Math.PI / 2);

    const backGroundMaterial = new THREE.MeshBasicMaterial( {color: 0xfcba03, side: THREE.DoubleSide} );

    background = new THREE.Mesh( dividerGeometry, backGroundMaterial );
    background.translateY(seenObjectDepth + halfWay);
    background.rotateX(Math.PI / 2);

    let mesh = {
        knot: knot,
        divider: divider,
        background: background
    }

    return mesh

}

function createRenderer(container){
    
    renderer = new THREE.WebGLRenderer( {antialias: true});
    renderer.setSize( container.clientWidth, container.clientHeight );

    renderer.setPixelRatio( window.devicePixelRatio );

    container.appendChild( renderer.domElement );

    return renderer;


}

function createPortal(seenObjectDepth){

    let halfWay = seenObjectDepth / 2;
    //The Camera that makes the Render Target

    portalWidth = 512;
    portalHeight = 512;

    let renderTarget = new THREE.WebGLRenderTarget(portalWidth, portalHeight);

    let portalCamera = new THREE.PerspectiveCamera(75, portalWidth / portalHeight, .1, 100);
    portalCamera.translateY(halfWay);
    //portalCamera.translateZ(5);
    portalCamera.lookAt(new THREE.Vector3(0,seenObjectDepth,0));
    
    
    //The box that will have the Render Target
    const boxGeometry = new THREE.BoxBufferGeometry( 2, 2, 2 );
    const boxMaterial = new THREE.MeshBasicMaterial({
        map: renderTarget.texture
    });

    box = new THREE.Mesh( boxGeometry, boxMaterial );

    /*************************
     * This part is what makes the protal work
     * without having to call it up in the render function
     * **************************/

    box.onBeforeRender = function(renderer, scene, camera, geometry, material, group){
        renderer.setRenderTarget(portal.target);
        renderer.render(scene, portalCamera);
        renderer.setRenderTarget(null);
    }

    return {
        box: box,
        target: renderTarget,
        camera: portalCamera
    }

}

function createControls(camera, container){

    return new THREE.OrbitControls( camera, container );
    
}

function update(knot){
    knot.rotateX(.01);
}

function render(renderer, scene, camera, portal){

    renderer.render( scene, camera );

}



function onWindowResize(container) {

    // set the aspect ratio to match the new browser window aspect ratio
    camera.aspect = container.clientWidth / container.clientHeight;
  
    // update the camera's frustum
    camera.updateProjectionMatrix();
  
    // update the size of the renderer AND the canvas
    renderer.setSize( container.clientWidth, container.clientHeight );
  
}
  
