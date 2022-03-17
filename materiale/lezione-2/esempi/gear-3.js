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

    const r = n * 0.025;
    const h = 0.2;
    const toothLength = Math.PI*r/n;
    let material = new BABYLON.StandardMaterial('mat',scene);
    material.diffuseColor.set(0.2,0.4,0.8);
    material.specularColor.set(0.3,0.3,0.3);
    let disc = BABYLON.MeshBuilder.CreateCylinder('a', {
        diameter:2*r,
        height:h
    }, scene)
    disc.material = material;
    let hub = BABYLON.MeshBuilder.CreateCylinder('a', {
        diameter:0.2,
        height:h*2
    }, scene)
    let c = BABYLON.MeshBuilder.CreateTorus('a',{ 
        diameter:2*r-0.12,
        thickness:0.1,
        tessellation:70
    });
    c.material = material;
    c.scaling.y = 2.2;
    c.parent = disc;
    hub.material = new BABYLON.StandardMaterial('mat',scene);
    hub.material.diffuseColor.set(0.1,0.1,0.1);
    hub.parent = disc;
    for(let i=0; i<n; i++) {
        let phi = 2*Math.PI*i/n;
        let tooth = BABYLON.MeshBuilder.CreateBox('a', {
            width:0.2,
            height:h,
            depth:toothLength
        }, scene);
        tooth.material = material;
        tooth.parent = disc;
        tooth.position.set(r*Math.cos(phi),0,r*Math.sin(phi));
        tooth.rotation.y = -phi;
    
    }
    disc.radius = r + 0.05;
    disc.n = n;
    return disc;
}


let gear;

function populateScene() {
    createGrid(scene);


    const m = 21;
    let gears = [];
    for(let i=0; i<m; i++) {
        let gear = createGear(21);
        gears.push(gear);
    }
    let d = gears[0].radius*2;
    let r = 0.5*d/Math.sin(Math.PI/m);

    gears.forEach((gear,i)=>{
        let phi = Math.PI*2*i/m;
        let pivot = new BABYLON.TransformNode('a', scene);
        gear.parent = pivot;
        pivot.position.set(r*Math.cos(phi),0,r*Math.sin(phi));
        pivot.rotation.y = -phi + Math.PI/2;
        pivot.rotation.x = pivot.rotation.y*0.5;
    });

    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;
        
        gears.forEach((gear,i)=>{
            let sgn = (i%2==0) ? 1 : -1;
            gear.rotation.y = t * sgn;
        });
        
    });
}