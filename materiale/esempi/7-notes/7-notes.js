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
            40, 
            new BABYLON.Vector3(0,0,0), 
            scene);
    camera.attachControl(canvas,true);
    camera.wheelPrecision = 50;
    camera.lowerRadiusLimit = 3;
    camera.upperRadiusLimit = 13*2;  
    camera.fov = 0.4;          
    
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

let sounds = [];

function populateScene(scene) {

    for(let i=0; i<7; i++) {
        let code = "CDEFGAB"[i];
        var sound = new BABYLON.Sound(code, "sounds/"+code+"4.mp3",scene, soundReady, {});
        sounds.push(sound);    
    }      
    function soundReady() {
        console.log("ready")
        
    }

    const dist = 2;
    let buttons = [];
    for(let i=0; i<7; i++) {
        let sphere = BABYLON.MeshBuilder.CreateSphere('a', {diameter:2}, scene);
        sphere.material = new BABYLON.StandardMaterial('a', scene);
        sphere.material.diffuseColor.set(0.8,0.85,0.85);
        sphere.scaling.y=0.2
        sphere.position.x = (i-3)*dist;
        buttons.push(sphere);
    }

    let ball = BABYLON.MeshBuilder.CreateSphere('a', {diameter:2}, scene);
    ball.position.y = 1.5;
    ball.material = new BABYLON.StandardMaterial('a', scene);
    ball.material.diffuseColor.set(0.85,0.4,0.03);

    let lastIt = -1;
    
    scene.registerBeforeRender(() => {
        let t = performance.now()*0.001*3;
        let it = Math.floor(t);
        let ft = t-it;

        let k = it%12;
        let sgn, tone;
        if(k<=5) {
            tone = k;
            sgn = 1;
        } else {
            tone = 12 - k;
            sgn = -1;
        }
        ball.position.x = buttons[tone].position.x + sgn * ft * dist;
        ball.position.y = 1+4*ft*(1-ft);

        buttons.forEach(button => {
            if(button.position.y < 0) {
                button.position.y += 0.01;
                if(button.position.y>0) button.position.y = 0;
            }
        });
        if(it != lastIt) { 
            lastIt = it; 
            buttons[tone].position.y = -0.1;
            sounds[tone].play();
            console.log(tone); 
        }

    });
    

}