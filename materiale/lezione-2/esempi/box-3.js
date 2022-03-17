'use strict';

let canvas, engine, scene, camera;
let shadowGenerator;

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
            -0.87,0.78,
            15, 
            new BABYLON.Vector3(0,0,0), 
            scene);
    camera.attachControl(canvas,true);
    camera.wheelPrecision = 50;
    camera.lowerRadiusLimit = 3;
    camera.upperRadiusLimit = 13*2;            
    
    // luce
    var light = new BABYLON.PointLight("light", new BABYLON.Vector3(-2, 2, -1), scene);
	light.parent = camera;
    

    // aggiungo i vari oggetti
    populateScene(scene);
    
    // main loop
    engine.runRenderLoop(()=>scene.render());

    // resize event
    window.addEventListener("resize", () => engine.resize());
});



class MagicBox {

    constructor(u, content) {
        this.u = u;
        this.content = content;
        let material1 = this.outerMaterial = new BABYLON.StandardMaterial('out-mat',scene);
        material1.diffuseColor.set(0.8,0.4,0.1);
    
        let material2 = this.innerMaterial = new BABYLON.StandardMaterial('in-mat',scene);
        material2.diffuseColor.set(0.4,0.1,0.05);
    
        let box = this.box = new BABYLON.TransformNode('box', scene);
    
        let f0 = this.createFace(box);
        f0.position.set(0,-u,0);

        let f1 = this.createFace(box);
        f1.rotation.x = -Math.PI/2;
        f1.position.set(0,0,u);

        let f2 = this.createFace(box);
        f2.rotation.x = Math.PI/2;
        f2.position.set(0,0,-u);

        let f3 = this.createFace(box);
        f3.rotation.z = -Math.PI/2;
        f3.position.set(-u,0,0);

        let hinge = this.hinge = new BABYLON.TransformNode('hinge', scene);
        hinge.parent = box;
        hinge.position.set(-u,u,0)
        // hinge.rotation.z = Math.PI/2;

        let f4 = this.createFace(hinge);
        f4.position.set(u,0,0);
        f4.rotation.z = Math.PI;

        let f5 = this.createFace(hinge);
        f5.rotation.z = Math.PI/2;
        f5.position.set(2*u,-u,0);
    

        /*

        */

        content.parent = box;
    }

    createFace(parent) {
        const u = this.u;
        let outerFace = BABYLON.MeshBuilder.CreateBox('b', {
            width:2*u, depth:2*u, height:0.1*u
        }, scene);
        outerFace.material = this.outerMaterial;
        let innerFace = BABYLON.MeshBuilder.CreateBox('b', {
            width:1.9*u, depth:1.9*u, height:0.1*u
        }, scene);  
        innerFace.material = this.innerMaterial;
        innerFace.position.set(0,0.1*u,0);
        innerFace.parent = outerFace;
        outerFace.parent = parent;
        //shadowGenerator.getShadowMap().renderList.push(outerFace);
        return outerFace;    
    }

    
    setStatus(t) {
        const u = this.u;
        this.hinge.rotation.z = 1.1 * smoothStep(t,0,0.3);
        this.content.position.set(3*u*smoothStep(t,0.2,0.6),0,0);
        this.content.rotation.y = Math.PI/3*smoothStep(t,0.5,1.0);
        
    }
}

let box;

function populateScene() {
    createGrid(scene);

    let content = BABYLON.MeshBuilder.CreateSphere('s',{diameter:1}, scene);
    content.material = new BABYLON.StandardMaterial('s-mat',scene);
    content.material.diffuseColor.set(0.1,0.8,0.9);
    //shadowGenerator.getShadowMap().renderList.push(content);

    const m = 5;

    let box = new MagicBox(0.5,content);

    let boxes = [box];
    for(let i = 1; i<m; i++) {
        box = new MagicBox(0.5 + 0.2*i,box.box);
        boxes.push(box);
    }

    for(let i=0; i<m; i++) {
        let phi = Math.PI*i/(m-1);
        boxes[i].outerMaterial.diffuseColor.set(
            0.5+0.5*Math.cos(phi),
            0.5+0.5*Math.sin(phi),
            0.5+0.25*Math.sin(phi/2));
        
    }

    box.box.position.set(-3,1.5,-3);
    box.box.rotation.y = -Math.PI/3;
    

    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001 * 0.1;
        t = (t - Math.floor(t))*2;
        if(t>1)t=2-t;

        boxes.forEach((box,i) => {
            let j = m-1-i;
            box.setStatus(smoothStep(t, j/m, (j+1)/m));
        })
        
        
    });
}