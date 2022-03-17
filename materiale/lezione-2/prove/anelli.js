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
            -1.4,1.1,
            15, 
            new BABYLON.Vector3(0,0,0), 
            scene);
    camera.attachControl(canvas,true);
    camera.wheelPrecision = 50;
    camera.lowerRadiusLimit = 3;
    camera.upperRadiusLimit = 13*2;            

    //camera = new BABYLON.UniversalCamera('a', new BABYLON.Vector3(0,0,-10), scene)
    //camera.attachControl(canvas,true);

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

const radius = 3;

function createRingGroup(scene, r,g,b) {
    let group = new BABYLON.TransformNode('a', scene);

    let mesh = BABYLON.MeshBuilder.CreateTorus('torus',{
        diameter: 1.5,
        thickness:0.3,
        tessellation:70
    }, scene);
    mesh.material = new BABYLON.StandardMaterial('mat',scene);
    mesh.material.diffuseColor.set(r,g,b);
    let rings = [mesh];
    for(let i=0;i<3;i++) rings.push(mesh.createInstance('inst'+i));
    
    rings.forEach((ring,i) => {
        ring.parent = group;
        ring.translate(BABYLON.Axis.X, radius);
        ring.rotateAround(
            BABYLON.Vector3.Zero(), 
            BABYLON.Axis.Z, 
            i*Math.PI/2 + Math.PI/4);
    });
        
    return group;
}

function createBallGroup(scene, r,g,b, dt) {
    let group = new BABYLON.TransformNode('ballGroup', scene);
    
    let mesh = BABYLON.MeshBuilder.CreateSphere('sphere',{
        diameter:0.6,
    },scene);
    mesh.material = new BABYLON.StandardMaterial('mat',scene);
    mesh.material.diffuseColor.set(r,g,b);
    let balls = [mesh];
    let m = 10;
    for(let i=1;i<m;i++) balls.push(mesh.createInstance('b'+i));

    let pivots = [];
    balls.forEach((ball,i) => {
        let pivot = new BABYLON.TransformNode('ballPivot', scene);
        pivots.push(pivot);
        pivot.parent = group;
    
        ball.parent = pivot;
        ball.position.x = radius;
    });
    

    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;
        pivots.forEach((pivot, i) => {
            pivot.rotation.z = t*0.1 + i * 2*Math.PI/m + dt;
        });
    });
    return group;
}

function populateScene() {

    createGrid(scene);
    
    let p;
    p = createRingGroup(scene, 1,0,0);

    p = createRingGroup(scene, 0,1,0);
    p.rotate(BABYLON.Axis.Z, Math.PI/2, BABYLON.Space.WORLD);
    p.rotate(BABYLON.Axis.Y, Math.PI/2, BABYLON.Space.WORLD);
    p = createRingGroup(scene, 0,0,1);
    p.rotate(BABYLON.Axis.Y, Math.PI/2, BABYLON.Space.WORLD);
    p.rotate(BABYLON.Axis.Z, Math.PI/2, BABYLON.Space.WORLD);

    let ball1 = createBallGroup(scene, 0.6,0,0, 0);
    let ball2 = createBallGroup(scene, 0,0.6,0, 0);
    ball2.rotation.z = Math.PI/2;
    ball2.rotation.y = Math.PI/2;
    let ball3 =  window.ball = createBallGroup(scene, 0,0,0.6, 0);
    ball3.rotation.x = Math.PI/2;
    ball3.rotation.y = Math.PI/2;

    let sphere = BABYLON.MeshBuilder.CreateSphere('sphere',{
        diameter:radius *2 - 2,
    },scene);
    sphere.material = new BABYLON.StandardMaterial('mat',scene);
    sphere.material.diffuseColor.set(0.8,0.75,0.7);
    sphere.material.specularColor.set(0.2,0.2,0.2);
    
    sphere.visibility = 0.9;

}