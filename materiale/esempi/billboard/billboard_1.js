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
            10, 
            new BABYLON.Vector3(0,0,0), 
            scene);
    camera.attachControl(canvas,true);
    camera.wheelPrecision = 50;
    camera.lowerRadiusLimit = 1;
    camera.upperRadiusLimit = 100;            
    
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


let face;

function populateScene(scene) {
    createGrid(scene);
    
    
    let totoroMaterial = new BABYLON.StandardMaterial('totoroMaterial', scene);
    totoroMaterial.diffuseColor.set(1,1,1);
    totoroMaterial.diffuseTexture = new BABYLON.Texture("totoro.jpg", scene);
    totoroMaterial.specularColor.set(0,0,0);

    const faces = [];
    const m = 10;
    const r = 4;
    for(let i=0; i<m; i++) {
        face = BABYLON.MeshBuilder.CreatePlane('a',{ width:2, height:1.5 },scene);    
        face.material = totoroMaterial;
        face.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
        faces.push(face);
    }


    let sphere = BABYLON.MeshBuilder.CreateSphere('s', {diameter:1}, scene);
    sphere.material = new BABYLON.StandardMaterial('smat', scene);
    sphere.material.diffuseColor.set(0.2,0.3,0.4);


    let panel = BABYLON.MeshBuilder.CreatePlane('a',{ width:1, height:0.5 },scene);  
    panel.material = new BABYLON.StandardMaterial('amat', scene);
    panel.material.specularColor.set(0,0,0);
    panel.material.diffuseColor.set(1,1,1);
    panel.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;    
    panel.position.set(0,0.7,0);

    let tx = window.tx = new BABYLON.DynamicTexture('dynamic_texture', {width:1024, height:512}, scene);
    tx.hasAlpha = true;
    panel.material.diffuseTexture = tx;
    tx.drawText("Hello!",0,400, "400px Arial", "white","transparent");

    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;
        faces.forEach((face,i) => {
            const phi = t*0.3 + 2*Math.PI*i/m;            
            face.position.set(r*Math.cos(phi),0, r*Math.sin(phi));
        })

        let ctx = tx.getContext();
        ctx.clearRect(0,0,1024,512);
        tx.drawText(t.toFixed(1),0,400, "400px Arial", "white","transparent");
        tx.update();
    });
    



}