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
            -1.2,0.78,
            7, 
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


function createEye() {
    let eye = new BABYLON.TransformNode();

    // il globo oculare (con iride e pupilla disegnati)
    let ball = BABYLON.MeshBuilder.CreateSphere('eye-ball', { diameter: 0.5}, scene);
    ball.parent = eye;
    ball.material = new BABYLON.StandardMaterial('eye-ball-mat', scene);
    ball.material.diffuseColor.set(0.9,0.9,0.9);
    ball.material.specularColor.set(0.2,0.2,0.2);
    ball.material.diffuseTexture = new BABYLON.Texture("eye.jpg", scene);
    ball.material.diffuseTexture.uScale=2;
    ball.material.diffuseTexture.vScale=1;

    // la palpebra
    let eyelid = createHemisphere(0.51,scene);
    eyelid.parent = eye;
    eyelid.material = new BABYLON.StandardMaterial('eyelid-mat', scene);
    eyelid.material.diffuseColor.set(0.5,0.4,0.4);

    let ring = BABYLON.MeshBuilder.CreateTorus('t', {
        diameter: 0.5,
        thickness: 0.1,
        tessellation: 70
    })
    ring.rotation.x = Math.PI/2;
    ring.parent = eye;
    ring.scaling.y = 2;
    ring.material = eyelid.material;

    // imposto il movimento dell'occhio: la pupilla segue la camera; la palpebra si chiude e si riapre
    scene.registerBeforeRender(() => {
        // trovo la posizione della telecamera nel sistema di riferimento dell'occhio
        let p = BABYLON.Vector3.TransformCoordinates(camera.position, 
                eye.getWorldMatrix().clone().invert());
        
        if(p.z<2) {
            // se la camera è davanti all'occhio
            let angle, maxAngle;
            maxAngle = 0.6;
            let r = Math.sqrt(p.z*p.z+p.x*p.x);
            angle = Math.max(-maxAngle, Math.min(maxAngle, 2*Math.atan2(p.y,r)));
            ball.rotation.x = angle;    
            maxAngle = 1.2;
            angle = Math.max(-maxAngle, Math.min(maxAngle, -2*Math.atan2(p.x,Math.abs(p.z))));
            ball.rotation.y = angle;
        } else {
            // la camera è dietro
            ball.rotation.y = ball.rotation.x = 0;
        }
        // batto la palpebra
        let t = performance.now() * 0.001 * 0.5;
        t = t - Math.floor(t);
        eyelid.rotation.x = 0.9 - 1.9 * Math.sin(Math.PI*step(t,0.0,0.1));
    });
    
    return eye;
}

function createHead() {
    let head = BABYLON.MeshBuilder.CreateSphere('head', { diameter: 2}, scene);
    head.material = new BABYLON.StandardMaterial('head-mat', scene);
    head.material.diffuseColor.set(0.9,0.7,0.5);
    head.material.specularColor.set(0.2,0.2,0.2);
    head.scaling.z=0.8;
    let leftEye = createEye();
    leftEye.parent = head;
    let rightEye = createEye();
    rightEye.parent = head;
    let x = 0.3, y = 0.1, z = -0.95;
    leftEye.position.set(-x,y,z);
    rightEye.position.set(x,y,z);
    return head;
}

function createLeg() {
    let leg = new BABYLON.TransformNode('leg', scene);
    let cyl = BABYLON.MeshBuilder.CreateCylinder('c',{diameter:0.3, height:0.99},scene);
    cyl.material = new BABYLON.StandardMaterial('head-mat', scene);
    cyl.material.diffuseColor.set(0.9,0.7,0.5);
    cyl.position.y = -0.5;
    cyl.parent = leg;
    let foot = createHemisphere(1, scene);
    foot.scaling.set(0.5,0.8,1);
    foot.parent = leg;
    foot.position.set(0,-1,-0.1);
    foot.material = new BABYLON.StandardMaterial("foot-mat", scene);
    foot.material.diffuseColor.set(0.2,0.1,0.1);
    
    return leg;
}

function createFred() {
    let fred = new BABYLON.TransformNode('f',scene);
    let head = createHead();
    head.parent = fred;
    head.position.y = 0.5;
    // legs
    let leftLeg = createLeg();
    leftLeg.parent = fred;
    leftLeg.position.set(0.3,0,0);
    let rightLeg = createLeg();
    rightLeg.parent = fred;
    rightLeg.position.set(-0.3,0,0);
    return fred;
}


function populateScene() {
    createGrid(scene);

    let a = createFred();
    a.position.y = 1;

    let b = createFred();
    b.position.y = 1;
    b.position.x = -2;

    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;
        //b.position.x = 10*Math.sin(t);
    });
}