'use strict';

let canvas, engine, scene, camera;

window.addEventListener('DOMContentLoaded', () => {
    // il tag canvas che visualizza l'animazione
    canvas = document.getElementById('c');
    // la rotella del mouse serve per fare zoom e non per scrollare la pagina
    canvas.addEventListener('wheel', evt => evt.preventDefault());
    
    // engine & scene
    engine = new BABYLON.Engine(canvas, true);
    scene = new BABYLON.Scene(engine);
    
    // camera
    camera = new BABYLON.ArcRotateCamera('cam', 
            -Math.PI/2,0.7,
            15, 
            new BABYLON.Vector3(0,0,0), 
            scene);
    camera.attachControl(canvas,true);
    camera.wheelPrecision = 50;
    camera.lowerRadiusLimit = 3;
    camera.upperRadiusLimit = 13*2;            
    
    // luce
    let light1 = new BABYLON.PointLight('light1',new BABYLON.Vector3(0,1,0), scene);
    light1.parent = camera;
    
    // aggiungo i vari oggetti
    populateScene(scene);
    
    // main loop
    engine.runRenderLoop(()=>scene.render());

    // resize event
    window.addEventListener("resize", () => engine.resize());
});

let wheelTyreMaterial, wheelMaterial, wheelHubMaterial;

function createWheel(wheelMaterial) {
    let pivot = new BABYLON.TransformNode('wheel', scene);
    let tyre = BABYLON.MeshBuilder.CreateTorus('wheel-border',{
        diameter: 1,
        thickness: 0.2,
        tessellation: 90
    }, scene);
    tyre.material = wheelTyreMaterial;
    tyre.parent = pivot;
    let disc = BABYLON.MeshBuilder.CreateCylinder('wheel-disc',  {
        diameter:1,
        height:0.1,
    }, scene);
    disc.material = wheelMaterial;
    disc.parent = pivot;
    let hub = BABYLON.MeshBuilder.CreateCylinder('wheel-disc',  {
        diameter:0.1,
        height:0.3,
    }, scene);
    hub.material = wheelHubMaterial;
    hub.parent = pivot;
    tyre.rotation.z = Math.PI/2;
    disc.rotation.z = Math.PI/2;
    hub.rotation.z = Math.PI/2;
    return pivot;
}

function createCar() {
    let body = BABYLON.MeshBuilder.CreateBox('car', {
        height:1, width:0.7, depth:2
    }, scene);
    body.material = new BABYLON.StandardMaterial('car-mat',scene);
    body.material.diffuseColor.set(0.8,0.4,0.1);
    body.position.y = 0.75;

    const rx = 0.5, rz = 0.8;
    for(let i=0;i<4;i++) {
        let wheel = createWheel(wheelMaterial);
        wheel.position.set(
            i<2 ? -rx : rx,
            -0.25,
            i&1 ? -rz : rz
        );
        wheel.parent = body;
    }
    return body;
}

let earth;

function populateScene() {
    // const ground = BABYLON.MeshBuilder.CreateGround("ground", {width:10, height:10}, scene);
    createGrid(scene);

    let R = 2.5;
    earth = BABYLON.MeshBuilder.CreateSphere('earth', { diameter: 2*R}, scene);
    earth.material = new BABYLON.StandardMaterial('wheel-mat',scene);
    earth.material.diffuseColor.set(0.3,0.7,0.2);
    earth.material.specularColor.set(0.2,0.2,0.2)

    wheelMaterial = new BABYLON.StandardMaterial('wheel-mat',scene);
    wheelMaterial.diffuseColor.set(0.3,0.4,0.5);
    wheelTyreMaterial = new BABYLON.StandardMaterial('wheel-tyre-mat',scene);
    wheelTyreMaterial.diffuseColor.set(0.1,0.1,0.1);
    wheelHubMaterial = new BABYLON.StandardMaterial('wheel-hub-mat',scene);
    wheelHubMaterial.diffuseColor.set(0.3,0.3,0.6);


    let car1 = createCar();
    let car1Pivot = new BABYLON.TransformNode('car1-pivot', scene);
    car1.parent = car1Pivot;
    car1.position.y = R + 0.75;

    let car2 = createCar();
    let car2Pivot = new BABYLON.TransformNode('car2-pivot', scene);
    car2.parent = car2Pivot;
    car2.position.x = R + 0.75;
    car2.position.y = 0;
    car2.rotation.z = -Math.PI/2;

    let car3 = createCar();
    let car3Pivot = new BABYLON.TransformNode('car3-pivot', scene);
    car3.parent = car3Pivot;
    car3.position.x = -R - 0.75;
    car3.position.y = 0;
    car3.rotation.x = -Math.PI/2;
    car3.rotation.y = Math.PI/2;
    
    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001 * 0.5;
        let phi = Math.PI*2*t;
        let r = R + 0.75;

        car1Pivot.rotation.x = phi;
        car2Pivot.rotation.y = phi;
        car3Pivot.rotation.z = phi;
        /*

        phi = -Math.PI*2*t*0.5;
        car2.position.set(2*Math.cos(phi),0.75,2*Math.sin(phi));
        car2.rotation.y = -phi;
        */
    });
}