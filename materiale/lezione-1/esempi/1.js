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
            30, 
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

    const m = 10;
    for(let i=0; i<m; i++) {
        let torus = BABYLON.MeshBuilder.CreateTorus('torus',{
            diameter:3,
            thickness:1,
            tessellation:70
        },scene);
        torus.material = new BABYLON.StandardMaterial('mat',scene);
        torus.material.diffuseColor.set(0.8,0.4,0.1);
        torus.position.x = 2*(i-(m-1)/2);
        torus.rotation.x = i*Math.PI/2
    }

    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;
        
    });
}