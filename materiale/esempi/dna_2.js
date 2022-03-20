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


function populateScene(scene) {
    // createGrid(scene);

    // sistemo la posizione iniziale della telecamera
    scene.activeCamera.beta = 1.3;


    let pieces = [];

    // parametri modello
    const W = 1;
    const R1 = 0.05;
    const R2 = 0.15;
    const m = 100;
    const H = 12;
    const y0 = -H/2;
    const dy = H/m;

    // creo le due parti (sinistra e destra) di ogni
    // elemento della catena.
    // ogni parte è formata da una sfera e un cilindro
    // di connessione
    
    for(let i=0;i<2;i++) {
        let sgn = -1+2*i; // sgn = -1 e 1
   
        // cilindro di connessione
        let cyl = BABYLON.MeshBuilder.CreateCylinder('c',{
            diameter: 2*R1,
            height:W * 0.8
        }, scene);
        cyl.rotation.z = Math.PI/2;
        cyl.position.x = -sgn * W / 2;
        cyl.material = new BABYLON.StandardMaterial('m',scene);
        cyl.material.diffuseColor.set(0.5,0.5,0.5);
    
        // sfera
        let sphere = BABYLON.MeshBuilder.CreateSphere('c',{
            diameter: 2*R2,
        }, scene);
        sphere.position.x = -sgn*W;
        sphere.material = new BABYLON.StandardMaterial('m',scene);
        if(i==0)
            sphere.material.diffuseColor.set(0.9,0.4,0.03);
        else
            sphere.material.diffuseColor.set(0.2,0.4,0.9);
    
        let piece = BABYLON.Mesh.MergeMeshes([cyl,sphere], 
            true, true, undefined, false, true);
        pieces.push(piece);
    }

    // creo i due filamenti
    let dnaLeft = [pieces[0]], dnaRight = [pieces[1]];
    for(let i=1; i<m; i++) {
        dnaLeft.push(pieces[0].createInstance('i'));
        dnaRight.push(pieces[1].createInstance('i'));        
    }

    // li dispongo verticalmente

    for(let i=0;i<m;i++) {
        let y = y0 + i*dy;
        dnaLeft[i].position.y = dnaRight[i].position.y = y;        
    }
    

    // movimento
    scene.registerBeforeRender(() => {
        // t è il numero di secondi dall'inizio
        let t = performance.now() * 0.001;

        // regolo la velocità della rotazione
        t *= 0.1;

        // faccio in modo che t vari periodicamente
        // da 0 a 1 
        t = t-Math.floor(t);

        // numeri di avvolgimenti
        let K = 3;

        // per ogni periodo (t : 0 => 1) l'angolo psi
        // fa 2*K rotazioni complete
        // (il fattore due deriva dal fatto che voglio
        // aprire e poi chiudere)
        let psi = t * (Math.PI*2) * K * 2;
        
        // posiziono gli m elementi
        for(let i=0;i<m;i++) {

            // il parametro s vara linearmente:
            // 0 per il primo elemento e (quasi) 1 per l'ultimo
            let s = i/m;

            // calcolo la rotazione di ogni elemento
            let phi = s * K * (Math.PI*2) + psi;

            // ruoto le due parti
            dnaLeft[i].rotation.y = dnaRight[i].rotation.y = phi;

            // il fattore di separazione (dx)
            // dipende da s e t
            let d = 0.1;
            let dx = 1.2*(
                split(s-(1-t)*2,-1-d,-1+d)-
                split(s-(1-t)*2,-d,d));

            dnaLeft[i].position.x = dx;
            dnaRight[i].position.x = -dx;
          
      }
  });
}


// questa funzione modella l'effetto "zip":
// il valore vale 0 per t<t0, 1 per t>t1
// e cresce in maniera morbida da 0 a 1 per t da t0 a t1
function split(t, t0,t1) {
    if(t<=t0) return 0;
    else if(t>=t1) return 1;
    let s = (t-t0)/(t1-t0);
    return 0.5*(1-Math.cos(Math.PI*s));
}
