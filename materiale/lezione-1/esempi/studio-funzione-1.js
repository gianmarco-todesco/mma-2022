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


function populateScene() {
    createGrid(scene);
    const m = 1000;
    let dots = [];
    let dot = BABYLON.MeshBuilder.CreateSphere('sphere',{
        diameter:0.05
    },scene);
    dot.material = new BABYLON.StandardMaterial('mat',scene);
    dot.material.diffuseColor.set(0.8,0.6,0.1);


    dots.push(dot);
    for(let i=1; i<m; i++) dots.push(dot.createInstance('i'+i));


    dots.forEach((dot,i) => {
        let t = i/(m-1);
        dot.position.x = 5.0*(-1+t*2);
    })


    scene.registerBeforeRender(() => {

        let t = performance.now() * 0.001;
        dots.forEach((dot,i) => {
            let x = dot.position.x ;
            let y = Math.sin(x)*Math.sin(x*5+2*t);
            dot.position.z = y;
        })
       
    });
}