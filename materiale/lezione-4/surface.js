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


const R0 = 4, R1 = 1;

function f(u,v,t) {
    let phi = Math.PI*2*v;
    let theta = Math.PI*2*u;

    let r1 = R1 +  0.1 * Math.sin(theta*5 + 2*Math.sin(3*t)*Math.sin(phi*5));
    let r = R0 + Math.cos(theta) * r1;
    return new BABYLON.Vector3(
        Math.cos(phi) * r, 
        Math.sin(theta) * r1, 
        Math.sin(phi) * r);

    
};


function populateScene() {


    /*
    material = mesh.material = new BABYLON.StandardMaterial('mat', scene);
    material.backFaceCulling = false;
    material.twoSidedLighting = true;
    material.diffuseColor.set(0.4,0.7,0.8);
    material.specularColor.set(0.1,0.1,0.1);
    */

    let nu = 120, nv = 120;

    let vd = new BABYLON.VertexData();
    vd.positions = [];
    vd.indices = [];
    vd.normals = [];
    vd.uvs = [];
    for(let i=0; i<nu; i++) {
        let u = i/nu;
        for(let j=0;j<nv; j++) {
            let v = j/nv;
            vd.uvs.push(u,v);
            let p = f(u,v,0);
            vd.positions.push(p.x,p.y,p.z);
        }
    }
    for(let i=0; i<nu; i++) {
        let i1 = (i+1)%nu;
        for(let j=0;j<nv; j++) {
            let j1 = (j+1)%nv;
            let k00 = i*nv+j;
            let k01 = i*nv+j1;
            let k10 = i1*nv+j;
            let k11 = i1*nv+j1;
            vd.indices.push(k00, k01, k11, k00, k11, k10);
        }
    }
    vd.normals = [];
    BABYLON.VertexData.ComputeNormals(vd.positions, vd.indices, vd.normals);   
    let mesh = new BABYLON.Mesh('surface', scene);
    vd.applyToMesh(mesh, true);

    mesh.material = new BABYLON.StandardMaterial('mat',scene);
    mesh.material.diffuseColor.set(0.8,0.4,0.1);

    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;
        // mesh.rotation.x = t;        
        for(let i=0; i<nu*nv;i++) {
            let u = vd.uvs[i*2], v = vd.uvs[i*2+1];
            let p = f(u,v,t);
            let k = i*3;
            vd.positions[k] = p.x;
            vd.positions[k+1] = p.y;
            vd.positions[k+2] = p.z;            
        }; 
        BABYLON.VertexData.ComputeNormals(vd.positions, vd.indices, vd.normals); 
        mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, vd.positions);
        mesh.updateVerticesData(BABYLON.VertexBuffer.NormalKind, vd.normals);    

    });
}