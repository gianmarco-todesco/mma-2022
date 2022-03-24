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

        this.targetParameter = 0.0;
        this.currentParameter = 0.0;
        const me = this;

        scene.registerBeforeRender(() => {
            let parameter = me.currentParameter;
            let dt = engine.getDeltaTime() * 0.001;
            if(me.targetParameter > parameter) {
                parameter = Math.min(
                        me.targetParameter, 
                        parameter + dt * 3)
            } else if(me.targetParameter < parameter) {
                parameter = Math.max(
                        me.targetParameter, 
                        parameter - dt * 1)
            }
            me.currentParameter = parameter;
            this.hinge.rotation.z    =  2 * (smoothStep(parameter, 0, 0.3) - step(parameter, 0.6, 1.0));
            this.content.position.x  = 10 * smoothStep(parameter, 0.2, 1.0);
            
        });
    }

    setAperture(t) {

        // this.hinge.rotation.z = t * 2;
        this.targetParameter = t;
    }


    setSmile(t) {

    }

    

}

let box;

let box2;
function populateScene() {
    createGrid(scene);

    box = new MagicBox();
    box.box.position.y=2;

    box2 = new MagicBox();
    box2.box.position.set(0,2,6);
    
    scene.onKeyboardObservable.add((kbInfo) => {
        switch (kbInfo.type) {
            case BABYLON.KeyboardEventTypes.KEYDOWN:
                if(kbInfo.event.code == "KeyA") box.setAperture(1);
                else if(kbInfo.event.code == "KeyS") box2.setAperture(1);
                
                break;
            case BABYLON.KeyboardEventTypes.KEYUP:
                if(kbInfo.event.code == "KeyA") box.setAperture(0);
                else if(kbInfo.event.code == "KeyS") box2.setAperture(0);
                break;
        }
    });

    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;
        // box.setStatus(3*(0.5 + 0.5*Math.sin(t*3)));        
        // box.setAperture(0.5 + 0.5*Math.sin(t));
    });
}