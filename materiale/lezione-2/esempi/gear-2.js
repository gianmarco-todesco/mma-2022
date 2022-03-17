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
            -0.87,0.78,
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

function createGear(n) {

    const r = n * 0.1;
    const h = 0.2;
    let material = new BABYLON.StandardMaterial('mat',scene);
    material.diffuseColor.set(0.8,0.4,0.1);
    let disc = BABYLON.MeshBuilder.CreateCylinder('a', {
        diameter:2*r,
        height:h
    }, scene)
    disc.material = material;
    let hub = BABYLON.MeshBuilder.CreateCylinder('a', {
        diameter:0.2,
        height:h*2
    }, scene)
    hub.material = new BABYLON.StandardMaterial('mat',scene);
    hub.material.diffuseColor.set(0.1,0.1,0.1);
    hub.parent = disc;
    for(let i=0; i<n; i++) {
        let phi = 2*Math.PI*i/n;
        let tooth = BABYLON.MeshBuilder.CreateBox('a', {
            width:0.4,
            height:h,
            depth:0.3
        }, scene);
        tooth.material = material;
        tooth.parent = disc;
        tooth.position.set(r*Math.cos(phi),0,r*Math.sin(phi));
        tooth.rotation.y = -phi;
    
    }
    disc.radius = r + 0.1;
    disc.n = n;
    return disc;

    
}


let gear;

function populateScene() {
    createGrid(scene);

    let gear1 = createGear(11);
    let gear2 = createGear(21);
    let dist12 = gear1.radius + gear2.radius;
    gear2.position.x = -dist12/2;
    gear1.position.x =  dist12/2;


    let gear3 = createGear(7);
    gear3.material.diffuseColor.set(0.2,0.6,0.1);
    gear3.position.set(gear2.position.x,0.2,gear2.position.z);

    let gear4 = createGear(31);
    gear4.material.diffuseColor.set(0.2,0.6,0.1);
    let dist34 = gear3.radius + gear4.radius;
    gear4.position.set(gear3.position.x, gear3.position.y, gear3.position.z + dist34);
    
    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;
        gear1.rotation.y = t * 5;
        gear2.rotation.y = -gear1.rotation.y * gear1.n/gear2.n;
        gear3.rotation.y = gear2.rotation.y;
        gear4.rotation.y = -gear2.rotation.y * gear3.n/gear4.n + Math.PI/gear4.n;
        
    });
}