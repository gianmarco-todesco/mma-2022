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
            40, 
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

let mesh;

function populateScene() {

    createGrid(scene);
    

    let meshes = [];
    const m = 600;
    const r = 10;
    for(let i=0; i<m; i++) {

        mesh =  BABYLON.MeshBuilder.CreateBox('box',{
            width:4, height:0.1, depth:0.1,
        },scene);
        mesh.material = new BABYLON.StandardMaterial('mat',scene);
        mesh.material.diffuseColor.set(0.8,0.4,0.1);

        let phi = 2*Math.PI*i/m;
        mesh.position.x = r*Math.cos(phi);
        mesh.position.z = r*Math.sin(phi);

        mesh.rotation.z = -phi/2;
        mesh.rotation.y = -phi;
    
        meshes.push(mesh);
    }


    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;

        meshes.forEach((mesh,i) => {
            let phi = 2*Math.PI*i/m;
            mesh.rotation.z = -phi/2 + t;
        });
    });
}