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


function populateScene(scene) {

    createGrid(scene);

    const w = 4; // drums distance
    const h = 4; // max ball height
    const period = 1; // seconds between two consecutive bounces

    let ball = BABYLON.MeshBuilder.CreateSphere('ball', {diameter:2}, scene);
    ball.material = new BABYLON.StandardMaterial('ballmat', scene);
    ball.material.diffuseColor.set(0.9,0.1,0.1);


    scene.registerBeforeRender(() => {

        // secondi dall'inizio
        let seconds = performance.now() * 0.001;

        
        // t e dir controllano l'animazione
        // t va da 0 a 1; dir vale 1 (movimento verso destra) o -1 (sinistra)
        let t, dir;

        t = 0.5 * seconds / period; 
        t = 2*(t-Math.floor(t)); // t va da 0 a 2
        if(t<1) { dir = 1; }
        else { t-=1; dir = -1; }


        // legge del moto:

        // la x si muove linearmente fra -w e e w 
        // (il verso dipende da dir)
        ball.position.x = dir * (-0.5+t)  * w; 

        // la y ha un andamento parabolico, con un massimo per t=0.5 e minimo per t=0 e t=1
        // il valore minimo di y è 1 (la palla, con raggio=1,  tocca il pavimento)
        ball.position.y = 1 + h * 4 * t * (1-t);


    });

}