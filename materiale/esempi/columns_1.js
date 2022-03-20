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


let material;

//
// creo una colonna
//
function createColumn(scene) {


    let column = new BABYLON.Mesh('colonna', scene);
    const h1 = 1.0;
    const h2 = 5;    
    const L1 = 0.8;
    const L2 = L1 - 0.2;
    const T = 0.15;

    let box;
    let ring;

    // blocco in basso
    box = BABYLON.MeshBuilder.CreateBox('a', {
        width:L1,depth:L1,height:h1
    }, scene);
    box.material = material;
    box.parent = column;
    box.position.y = h1/2;

    // toro in basso (appoggiato sul blocco)
    ring = BABYLON.MeshBuilder.CreateTorus('a', {
        diameter:L2,
        thickness:T,
        tessellation: 40
    }, scene);
    ring.material = material;
    ring.position.y = h1+T/2;
    ring.parent = column;

    // cilindro
    let obj = BABYLON.MeshBuilder.CreateCylinder('a', {
      diameter:L2,
      height:h2,
    }, scene);
    obj.material = material;
    obj.parent = column;
    obj.position.y = h1+h2/2;
    

    // toro in alto (sopra la colonna)
    ring = BABYLON.MeshBuilder.CreateTorus('a', {
        diameter:L2,
        thickness:T,
        tessellation: 40
    }, scene);
    ring.material = material;
    ring.position.y = h1+h2-T/2;
    ring.parent = column;

    // blocco in alto
    box = BABYLON.MeshBuilder.CreateBox('a', {
        width:L1,depth:L1,height:0.2
    }, scene);
    box.material = material;
    box.parent = column;
    box.position.y = h1+h2+0.1;
    
    return column;
}
  

//
// populate scene
// 
function populateScene(scene) {

    createGrid(scene);

    // sposto la camera
    let camera = scene.activeCamera;
    camera.target.y = 2;
    camera.beta = 1.43;
    camera.alpha = 0.3;


    material = new BABYLON.StandardMaterial('base-mat', scene);
    material.diffuseColor.set(0.4,0.5,0.6);
    material.specularColor.set(0.1,0.1,0.1);

    const h = 0.25;
    let box;
    box = BABYLON.MeshBuilder.CreateBox('a', {
        width:9, depth:9, height: h, 
      }, scene);
    box.material = material;
    box.position.y = h * 0.5;
    
    box = BABYLON.MeshBuilder.CreateBox('a', {
        width:8, depth:8, height:h, 
      }, scene);
    box.material = material;
    box.position.y = h * 1.5;
    

    let m = 3;
    for(let x = -m; x <= m; x+=2) {
        for(let z = -m; z <= m; z+=2) {
            if(Math.abs(x)<m && Math.abs(z)<m) 
                continue;
            let column;
            column = createColumn(scene);
            column.position.set(x,h * 2.0,z);
        }
    
    }




    // creo una grossa lucciola sferica
    let sphere = BABYLON.MeshBuilder.CreateSphere('s', { 
        diameter:0.8
    }, scene);
    sphere.material = new BABYLON.StandardMaterial('smat',scene);
    sphere.material.emissiveColor.set(0.3,0.3,0.3);
    
    let light = new BABYLON.PointLight("pointLight", 
        new BABYLON.Vector3(0, 0, 0), 
        scene);
    light.range = 8;
    light.parent = sphere;


    // muovo la lucciola
    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;
        t *= 0.3;
        t = (t-Math.floor(t))*2;
        let phi = Math.PI*2*t;
        if(t<1) {
            sphere.position.set(3+Math.sin(phi),4,-1+Math.cos(phi));
        } else {
            sphere.position.set(3+Math.sin(phi),4,1-Math.cos(phi));

        }
    });


}