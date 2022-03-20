'use strict';

let canvas, engine, scene, camera;

window.addEventListener('DOMContentLoaded', () => {
    // il tag canvas che visualizza l'animazione
    canvas = document.getElementById('renderCanvas');
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


//
// curve(t)
// Per ogni t, fra 0 e 1, la funzione restituisce 
// un punto nello spazio 
// L'insieme dei punti definisce una curva
// 
function curve(t) {
    const R = 4;
    let phi = Math.PI*2 * 7 * t;
    let theta = Math.PI * t;
    let rxz = R*Math.sin(theta);

    return new BABYLON.Vector3(
        rxz * Math.cos(phi),
        R*Math.cos(theta),
        -rxz * Math.sin(phi)    
    );
}

function populateScene(scene) {
    createGrid(scene);

    // creo un array con m punti disposti lungo la curva
    const m = 500;
    let pts = [...Array(m).keys()].map(i=>i/(m-1)).map(curve);

    // creo il materiale
    let material = new BABYLON.StandardMaterial('m', scene);
    material.diffuseColor.set(0.9,0.5,0.1);

    // disegno la curva con un "tubo"
    const tube = BABYLON.MeshBuilder.CreateTube("tube", {
        path: pts, 
        radius: 0.05, 
        sideOrientation: BABYLON.Mesh.DOUBLESIDE
    }, scene);
    tube.material = material;


    // per ora nessuna animazione
    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001 * 0.3;
        
    });



}