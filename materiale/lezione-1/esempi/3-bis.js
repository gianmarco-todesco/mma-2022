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
            25, 
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
    let torus = BABYLON.MeshBuilder.CreateTorus('torus',{
        diameter:6,
        thickness:1,
        tessellation:70

    },scene);
    torus.material = new BABYLON.StandardMaterial('mat',scene);
    torus.material.diffuseColor.set(0.8,0.4,0.1);

    let spheres = [];
    const m = 17;
    for(let i=0; i<m; i++) {
        let sphere = BABYLON.MeshBuilder.CreateSphere('sphere',{
            diameter:4
        },scene);
        sphere.material = new BABYLON.StandardMaterial('mat',scene);
        let theta = Math.PI*2*i/m;
        sphere.material.diffuseColor.set(
            0.5 + 0.4*Math.cos(theta),
            0.5 + 0.4*Math.sin(theta),
            0.5 + 0.1*Math.sin(theta));
        spheres.push(sphere);
    }
    
    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001 * 0.5;
        spheres.forEach((sphere,i) => {
            let theta = 2*Math.PI*(t + i/spheres.length);
            let y = 4*Math.cos(theta);
            let r = 3 + 2*Math.sin(theta);
            let phi = Math.PI*2*i/spheres.length ;
            sphere.position.set(
                Math.cos(phi)*r,
                y,
                Math.sin(phi)*r
            );
        });
    });
}