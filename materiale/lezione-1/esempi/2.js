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
            -1.2,1.0,
            40, 
            new BABYLON.Vector3(0,0,0), 
            scene);
    camera.attachControl(canvas,true);
    camera.wheelPrecision = 50;
    camera.lowerRadiusLimit = 3;
    
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


    let box = BABYLON.MeshBuilder.CreateBox('box',{
        size:0.95
    },scene);
    box.material = new BABYLON.StandardMaterial('mat',scene);
    box.material.diffuseColor.set(0.8,0.4,0.1);
    box.material.specularColor.set(0.1,0.1,0.1);
    const m = 14;
    for(let ix = -m; ix<=m; ix++) {
        for(let iy = -m; iy<=m; iy++) {
            for(let iz = -m; iz<=m; iz++) {
                if(ix*ix+iy*iy+iz*iz<m*m) {
                    let b = box.createInstance('b')
                    b.position.set(ix,iy,iz);

                } 
            }
        }
    }


    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;
        
    });
}