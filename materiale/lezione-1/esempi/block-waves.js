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
    const u = 0.2;
    let block = BABYLON.MeshBuilder.CreateBox('box', {
        size:u*0.9
    }, scene);
    block.material = new BABYLON.StandardMaterial('mat',scene);
    block.material.diffuseColor.set(0.8,0.4,0.1);
    let blocks = [block];
    let m = 50;
    for(let i=1; i<m*m; i++) blocks.push(block.createInstance('b'+i));

    for(let i=0;i<m;i++) {
        for(let j=0;j<m;j++) {
            let b = blocks[i*m+j];
            b.position.x = u*(j-(m-1)/2);
            b.position.z = u*(i-(m-1)/2);
        }
    }
    
    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;
        blocks.forEach(b => {
            let x = b.position.x;
            let z = b.position.z;
            let r = Math.sqrt(x*x+z*z);
            b.position.y = 0.3*Math.cos(2*r-t*2);
        });
    });
}