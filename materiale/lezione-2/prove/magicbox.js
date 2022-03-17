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

function createMagicBox(param) {
    const u = 2;

    let group = new BABYLON.TransformNode('box', scene);

    let material = new BABYLON.StandardMaterial('mat',scene);
    material.diffuseColor.set(0.8,0.4,0.2);

    let mesh = BABYLON.MeshBuilder.CreateBox('face',{
        width:2,height:0.1,depth:2
    }, scene);
    mesh.material = material;

    let faces = [mesh];
    for(let i=1; i<6; i++) faces.push(mesh.createInstance('b'+i));

    faces.forEach((face, i) => {
        face.parent = group;
    })

    let f;
    f = faces[1];
    f.position.set(1,1,0);
    f.rotation.z = Math.PI/2;
    f = faces[2];
    f.position.set(-1,1,0);
    f.rotation.z = Math.PI/2;
    f = faces[3];
    f.position.set(0,1,1);
    f.rotation.x = Math.PI/2;

    
    let perno = window.perno = new BABYLON.TransformNode('box', scene);
    perno.parent = group;

    f = faces[4];
    f.parent = perno;
    f.position.z = -1;

    f = faces[5];
    f.parent = perno;
    f.position.set(0,-1,-2);
    f.rotation.x = Math.PI/2;



    perno.position.set(0,2,1);

    perno.rotation.x = 0.4;
    scene.registerBeforeRender(() => {
        let t = performance.now()*0.001 * 2 + param * Math.PI*2;
        perno.rotation.x = 0.7 * (1 + Math.sin(t))/2;
    });

    let sphere = BABYLON.MeshBuilder.CreateSphere('s', {
        diameter:2
    }, scene);
    sphere.parent = group;
    sphere.position.y = 1;
    return group;
}


let box;

function populateScene() {
    createGrid(scene);

    let boxes = [];
    const m = 15;
    const r = 10;
    for(let i=0;i<m; i++) {
        box = createMagicBox(i/m);
        let phi = 2*Math.PI*i/m;
        box.rotation.y = -phi;
        box.position.set(r*Math.cos(phi),0, r*Math.sin(phi))
        boxes.push(box);
    }
    
    scene.registerBeforeRender(() => {
        let t = performance.now()*0.001;

        boxes.forEach((box,i) => {
            box.rotation.y = 2*Math.PI*i/m + t;
        });
    });
}