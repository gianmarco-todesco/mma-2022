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

class MagicBox {
    constructor(size, content) {
        this.content = content;
        let box = this.box = new BABYLON.TransformNode('hinge', scene);

        let material = this.material = new BABYLON.StandardMaterial('mat',scene);
        material.diffuseColor.set(0.8,0.4,0.1);
    
        let face0 = BABYLON.MeshBuilder.CreateBox('b', {
            width:2*size, depth:2*size, height:0.1*size
        }, scene);
        face0.material = material;
        face0.parent = box;
        face0.position.set(0,-1*size,0);
    
        let f1 = face0.createInstance('f1');
        f1.parent = box;
        f1.rotation.x = Math.PI/2;
        f1.position.set(0,0,1*size);
        let f2 = face0.createInstance('f2');
        f2.parent = box;
        f2.rotation.x = Math.PI/2;
        f2.position.set(0,0,-1*size);
        let f3 = face0.createInstance('f3');
        f3.parent = box;
        f3.rotation.z = Math.PI/2;
        f3.position.set(-1*size,0,0);
    
        let hinge = this.hinge = new BABYLON.TransformNode('hinge', scene);
        hinge.parent = box;
        let f4 = face0.createInstance('f4');
        f4.position.set(1*size,0,0);
        f4.parent = hinge;
        hinge.position.set(-1*size,1*size,0)
        hinge.rotation.z = Math.PI/2;
        let f5 = face0.createInstance('f5');
        f5.rotation.z = Math.PI/2;
        f5.position.set(2*size,-1*size,0);
        f5.parent = hinge;
        hinge.position.set(-1*size,1*size,0)
        hinge.rotation.z = 0;
    
    }

    setStatus(status) {
        if(status<0) this.hinge.rotation.z = 0;
        else if(status<1) this.hinge.rotation.z = status*Math.PI/2;
        else {
            this.hinge.rotation.z = Math.PI/2;
        }
    }
}


function populateScene() {
    createGrid(scene);

    let sphere = BABYLON.MeshBuilder.CreateSphere('a', {diameter:1}, scene);
    let box = new MagicBox(1, sphere);
    let box1 = new MagicBox(1.2, box);
    box1.material.diffuseColor.set(0.2,0.4,0.8);

    //let box1 = createBox();
    //box1.scaling.set(0.6,0.6,0.6);
    /*   
    let pivot = new BABYLON.TransformNode('hinge', scene);
    faces[5].position.set(1,0,0);
    faces[5].parent = pivot;
    pivot.position.set(-1,2,0)
    */

    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;
        // pivot.rotation.z = Math.PI/2 * (0.5 + 0.5 * Math.sin(t));
        box.setStatus(0.5 + 0.5*Math.sin(t))
        box1.setStatus(0.5 + 0.5*Math.sin(t))
    });
}