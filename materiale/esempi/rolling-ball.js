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

    // creo una pallina
    let ball = BABYLON.MeshBuilder.CreateSphere('ball', {diameter:2}, scene);
    ball.material = new BABYLON.StandardMaterial('ballmat', scene);
    ball.material.diffuseColor.set(1,1,1);
    ball.position.y = 1;

    // creo la texture
    let tx = new BABYLON.DynamicTexture('dt', { width:1024, height:1024}, scene);
    let ctx = tx.getContext();

    // disegno una scacchiera
    ctx.fillStyle = 'white';
    ctx.fillRect(0,0,1024,1024);
    ctx.fillStyle = 'orange';
    ctx.fillRect(0,0,256,512);
    ctx.fillRect(512,0,256,512);
    ctx.fillRect(256,512,256,512);
    ctx.fillRect(768,512,256,512);
    tx.update();
    ball.material.diffuseTexture = tx;
    
    // animazione
    scene.registerBeforeRender(() => {
        let t = performance.now()*0.001*0.1;


        // t va da 0 a 1 e poi di nuovo a 0, periodicamente
        t = Math.abs(-1+(t%1)*2);

        // la pallina si muove lungo l'asse x, per tutta l'estensione della griglia
        ball.position.x = -5 + 10*t;

        // la rotazione (espressa in radianti) è uguale alla distanza percorsa
        // (il raggio della sfera vale 1)
        ball.rotation.z = -ball.position.x;

    });
}
