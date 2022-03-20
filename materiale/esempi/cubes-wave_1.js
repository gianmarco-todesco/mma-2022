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



function populateScene(scene) {
    createGrid(scene);
    

    let material = new BABYLON.StandardMaterial('mat', scene);
    material.diffuseColor.set(0.9,0.5,0.2);
    let cubes = [];
    
    const n = 20;
    for(let i=0; i<n; i++) {
        for(let j=0; j<n; j++) {
            let obj = BABYLON.MeshBuilder.CreateBox('a',{ size:0.3}, scene);
            obj.material = material;
            obj.position.x = 4*(-1+2*j/(n-1));
            obj.position.z = 4*(-1+2*i/(n-1));
            cubes.push(obj);
        }
    }

    
    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;

        cubes.forEach(cube => {
            cube.rotation.x = t - cube.position.length()*0.5;
        });

    });




}