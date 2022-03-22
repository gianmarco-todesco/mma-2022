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
            -0.87,0.78,
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



class MagicBox {
    constructor() {
        const u = 2;

        let box = this.box = new BABYLON.TransformNode('box', scene);
    
        let material = new BABYLON.StandardMaterial('mat',scene);
        material.diffuseColor.set(0.8,0.4,0.1);
    
        let f0 = BABYLON.MeshBuilder.CreateBox('b', {
            width:2*u, depth:2*u, height:0.1*u
        }, scene);
        f0.material = material;
        f0.parent = box;
        f0.position.set(0,-u,0);
    
        let f1 = f0.createInstance('f1');
        f1.parent = box;
        f1.rotation.x = Math.PI/2;
        f1.position.set(0,0,u);
    
        let f2 = f0.createInstance('f2');
        f2.parent = box;
        f2.rotation.x = Math.PI/2;
        f2.position.set(0,0,-u);
    
        let f3 = f0.createInstance('f3');
        f3.parent = box;
        f3.rotation.z = Math.PI/2;
        f3.position.set(-u,0,0);
    
        let hinge = this.hinge = new BABYLON.TransformNode('hinge', scene);
        hinge.parent = box;
    
        let f4 = f0.createInstance('f4');
        f4.position.set(u,0,0);
        f4.parent = hinge;
        hinge.position.set(-u,u,0)
        hinge.rotation.z = Math.PI/2;
    
        let f5 = f0.createInstance('f5');
        f5.rotation.z = Math.PI/2;
        f5.position.set(2*u,-u,0);
        f5.parent = hinge;
    
        hinge.position.set(-u,u,0)
        hinge.rotation.z = 0;
            
        let content = this.content = BABYLON.MeshBuilder.CreateSphere('s',{diameter:u*1.9}, scene);
        content.material = new BABYLON.StandardMaterial('s-mat',scene);
        content.material.diffuseColor.set(0.1,0.8,0.9);
        content.parent = box;    
        this.parameter = 0.0;
        this.currentParameter = 0.0;

        console.log(scene)
        scene.registerBeforeRender(() => this.tick());
    }



    tick() {        
        let parameter = this.currentParameter
        let dt = engine.getDeltaTime() * 0.001;
        if(parameter < this.parameter) {
            parameter = Math.min(parameter + dt * 3, this.parameter) 
        } else if(parameter > this.parameter) {
            parameter = Math.max(parameter - dt * 3, this.parameter) 
        }
        this.currentParameter = parameter;
        this.hinge.rotation.z = smoothStep(parameter, 0.0, 0.8) * 2*Math.PI/3;
        this.content.position.x = smoothStep(parameter, 0.1, 1.0) * 8;
    }

    setAperture(t) {
        // this.hinge.rotation.z = 2*Math.PI/3 * t;
        this.parameter = t;
    }

    

}

let box;

function onKeyDown(e) {
    console.log(e.event.key);
    if(e.event.key == "a") box.setAperture(1);
    else if(e.event.key == "b") box.setAperture(0);
}

function populateScene() {
    createGrid(scene);

    box = new MagicBox();
    box.box.position.y=2;
    
    scene.onKeyboardObservable.add((kbInfo) => {
        switch (kbInfo.type) {
            case BABYLON.KeyboardEventTypes.KEYDOWN:
                if(kbInfo.event.code == "KeyA") box.setAperture(1);
                break;
            case BABYLON.KeyboardEventTypes.KEYUP:
                if(kbInfo.event.code == "KeyA") box.setAperture(0);
                break;
        }
    });

    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;
        // box.setStatus(3*(0.5 + 0.5*Math.sin(t*3)));        
        // box.setAperture(0.5 + 0.5*Math.sin(t));
    });
}