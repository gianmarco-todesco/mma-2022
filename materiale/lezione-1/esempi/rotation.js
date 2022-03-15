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

let obj;

function populateScene() {
    createGrid(scene);

    obj = BABYLON.MeshBuilder.CreateBox('torus',{
        width:4, height:2, depth:1
    },scene);
    obj.material = new BABYLON.StandardMaterial('mat',scene);
    obj.material.diffuseColor.set(0.8,0.4,0.1);

    let dir;
    dir = BABYLON.MeshBuilder.CreateCylinder('cx',{diameter:0.3, height:2}, scene);
    dir.material = new BABYLON.StandardMaterial('mat',scene);
    dir.material.diffuseColor.set(0.8,0.1,0.1);
    dir.rotation.z = Math.PI/2;
    dir.position.x = 3;
    dir.parent = obj;

    dir = BABYLON.MeshBuilder.CreateCylinder('cy',{diameter:0.3, height:2}, scene);
    dir.material = new BABYLON.StandardMaterial('mat',scene);
    dir.material.diffuseColor.set(0.1,0.8,0.1);
    dir.position.y = 2;
    dir.parent = obj;

    dir = BABYLON.MeshBuilder.CreateCylinder('cz',{diameter:0.3, height:2}, scene);
    dir.material = new BABYLON.StandardMaterial('mat',scene);
    dir.material.diffuseColor.set(0.1,0.1,0.8);
    dir.rotation.x = Math.PI/2;
    dir.position.z = 1.5;
    dir.parent = obj;
    

    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;
        // blocks.forEach(b=>b.rotation.z = b.rotation.y * 0.5 + t);
    });
}