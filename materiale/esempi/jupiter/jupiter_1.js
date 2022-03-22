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



// Questo esempio mostra come applicare una texture su una superficie sferica
// la texture di giove è stata scaricata da https://www.solarsystemscope.com/textures/


function populateScene(scene) {
    
    let camera = scene.activeCamera;
    camera.radius = 3;
    camera.beta = 1.2;

    let jupiter = BABYLON.MeshBuilder.CreateSphere('jupiter', {diameter:2},scene);
    let material = jupiter.material = new BABYLON.StandardMaterial('jupiter-material', scene,);
    material.diffuseColor.set(0.9,0.9,0.9);
    material.specularColor.set(0.01,0.01,0.01);
    material.diffuseTexture = new BABYLON.Texture("2k_jupiter.jpg", scene, null, false);
    let skyDome = new BABYLON.PhotoDome("testdome", 
        "./sky.png",
        {
            resolution: 128,
            size: 1000
        },scene);

    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:100.0}, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./skybox", scene, 
        ["_px.png","_py.png","_pz.png","_nx.png","_ny.png","_nz.png"]);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;


    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;

        jupiter.rotation.y = t*0.5;
    });
    



}