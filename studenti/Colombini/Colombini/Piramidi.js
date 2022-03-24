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
    //dichiaro solidi 
    const MB = BABYLON.MeshBuilder;
    let meshes = [];
    let mesh1;
    let mesh2;
    let mesh3;
    //costruisco solidi
    mesh1 = MB.CreatePolyhedron('piramide1',{
        custom: {
            "vertex" : [
                [0,0,0],[ 2,0,0],[2,0, 2],[ 0,2, 0],
            ],
            "face" : [
                [0,3,1],[3,0,2],[2,1,3],
                [0,1,2]
            ]
        },
        size: 1
    },scene);
    mesh1.material = new BABYLON.StandardMaterial('smat', scene);
    mesh1.material.diffuseColor.set(1,0.3,0.3);

    meshes.push(mesh1);

    mesh2 = MB.CreatePolyhedron('piramide2',{
        custom: {
            "vertex" : [
                [0,2,0],[2,0,2],[2,2,0],[2,2,2],
            ],
            "face" : [
                [0,2,1],[1,2,3],[0,3,2],
                [3,0,1]
            ]
        },
        size: 1
    },scene);
    mesh2.material = new BABYLON.StandardMaterial('smat', scene);
    mesh2.material.diffuseColor.set(0.3,1,0.3);

    meshes.push(mesh2);

    mesh3 = MB.CreatePolyhedron('piramide',{
        custom: {
            "vertex" : [
                [2,0,0],[0,2,0],[2,2,0],[2,0,2],
            ],
            "face" : [
                [1,2,0],[0,2,3],[2,1,3],
                [3,1,0]
            ]
        },
        size: 1
    },scene);
    mesh3.material = new BABYLON.StandardMaterial('smat', scene);
    mesh3.material.diffuseColor.set(0.3,0.3,1); 

    meshes.push(mesh3);
    //Li mando in posizione centrale
    mesh1.position.x = -1;
    mesh1.position.z = -1;
    mesh2.position.x = -1;
    mesh2.position.z = -1;
    mesh3.position.z = -1;
    //movimento continuo
    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;
        meshes.forEach(meshes => {
            mesh2.position.y = (Math.sin(t)+1);
            mesh3.position.x = (Math.sin(t));
            
        });
    })
}