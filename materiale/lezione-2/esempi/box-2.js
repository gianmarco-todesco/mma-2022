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

function createMagicBox() {
    const u = 2;

    let material1 = new BABYLON.StandardMaterial('mat',scene);
    material1.diffuseColor.set(0.8,0.4,0.1);

    let material2 = new BABYLON.StandardMaterial('mat',scene);
    material2.diffuseColor.set(0.4,0.1,0.05);

    let box = new BABYLON.TransformNode('box', scene);

    function createFace(parent) {
        let outerFace = BABYLON.MeshBuilder.CreateBox('b', {
            width:2*u, depth:2*u, height:0.1*u
        }, scene);
        outerFace.material = material1;
        let innerFace = BABYLON.MeshBuilder.CreateBox('b', {
            width:1.9*u, depth:1.9*u, height:0.1*u
        }, scene);  
        innerFace.material = material2;
        innerFace.position.set(0,0.1*u,0);
        innerFace.parent = outerFace;
        outerFace.parent = parent;
        return outerFace;    
    }

    let f0 = createFace(box);
    f0.position.set(0,-u,0);

    let f1 = createFace(box);
    f1.rotation.x = -Math.PI/2;
    f1.position.set(0,0,u);

    let f2 = createFace(box);
    f2.rotation.x = Math.PI/2;
    f2.position.set(0,0,-u);

    let f3 = createFace(box);
    f3.rotation.z = -Math.PI/2;
    f3.position.set(-u,0,0);

    let hinge = new BABYLON.TransformNode('hinge', scene);
    hinge.parent = box;
    hinge.position.set(-u,u,0)
    hinge.rotation.z = Math.PI/2;

    let f4 = createFace(hinge);
    f4.position.set(u,0,0);
    f4.rotation.z = Math.PI;

    let f5 = createFace(hinge);
    f5.rotation.z = Math.PI/2;
    f5.position.set(2*u,-u,0);
    
    box.hinge = hinge;
    

    let content = BABYLON.MeshBuilder.CreateSphere('s',{diameter:u*1.9}, scene);
    content.material = new BABYLON.StandardMaterial('s-mat',scene);
    content.material.diffuseColor.set(0.1,0.8,0.9);
    content.parent = box;

    box.setStatus = function(t) {
        if(t<1) hinge.rotation.z = 0;
        else if(t<2) hinge.rotation.z = (t-1)*Math.PI/4;
        else hinge.rotation.z = Math.PI/4;
        if(t<2) {
            content.position.set(0,0,0);
        } else {
            let x = 3*u*( 0.5 - 0.5 * Math.cos(Math.PI*(t-2)) );
            content.position.set(x,0,0);

        }
    }
    return box;
}


let box;

function populateScene() {
    createGrid(scene);

    box = createMagicBox();
    box.position.y=2;
    

    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;
        box.setStatus(3*(0.5 + 0.5*Math.sin(t*3)));
        
    });
}