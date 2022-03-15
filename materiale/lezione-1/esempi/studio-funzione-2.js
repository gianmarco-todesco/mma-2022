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



function curvaBella(s, t) {
    let phi = Math.PI*2*s;
    let theta = phi * 23;
    const r0 = 4.0, r1 = 1.0 + 0.5*Math.sin(5*phi + t);
    let r = Math.cos(theta) * r1 + r0;
    let y = Math.sin(theta) * r1;

    return new BABYLON.Vector3(r*Math.cos(phi), y, r*Math.sin(phi));
}

let tube;

function populateScene() {
    createGrid(scene);
    const m = 1000;

    let pts = [];
    for(let i=0;i<m;i++) pts.push(curvaBella(i/(m-1), 0.0));


    tube = BABYLON.MeshBuilder.CreateTube('tube',{
        path: pts, updatable: true, radius: 0.05
    }, scene);
    tube.material = new BABYLON.StandardMaterial('mat',scene);
    tube.material.diffuseColor.set(0.8,0.6,0.1);



    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;
        let pts = [];
        for(let i=0;i<m;i++) pts.push(curvaBella(i/(m-1), t));


        tube = BABYLON.MeshBuilder.CreateTube('tube',{
            instance:tube, path: pts
        });
        
    
        
       
    });
}