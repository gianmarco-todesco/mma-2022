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


function populateScene() {
    

    createGrid(scene);
    
    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;
    });

        // per risparmiare fatica :-)
    const MB = BABYLON.MeshBuilder;
    let meshes = [];
    let mesh;
    //------------------------------------------
    // sfera
    //------------------------------------------
    mesh = MB.CreateSphere('sphere',{
        diameter:1.5
    },scene);
    meshes.push(mesh);


    //------------------------------------------
    // sfera schiacciata
    //------------------------------------------
    mesh = MB.CreateSphere('sphere',{
        diameter:1.5
    },scene);
    mesh.scaling.set(1,0.2,1);
    meshes.push(mesh);

    //------------------------------------------
    // sfera schiacciata (2)
    //------------------------------------------
    mesh = MB.CreateSphere('sphere',{
        diameter:1.5
    },scene);
    mesh.scaling.set(0.2,1,0.2);
    meshes.push(mesh);

    //------------------------------------------
    // cubo
    //------------------------------------------
    mesh = MB.CreateBox('cube',{
        size:1.2
    },scene);
    meshes.push(mesh);

    //------------------------------------------
    // parallelepipedo
    //------------------------------------------
    mesh = MB.CreateBox('box',{
        width:0.6, height:1.2, depth:0.2
    },scene);
    meshes.push(mesh);

    //------------------------------------------
    // cilindro
    //------------------------------------------
    mesh = MB.CreateCylinder('cylinder',{
        diameter:1.0, height:1.2
    },scene);
    meshes.push(mesh);

    //------------------------------------------
    // cilindro 2
    //------------------------------------------
    mesh = MB.CreateCylinder('cylinder2',{
        diameter:1.2, height:0.2
    },scene);
    meshes.push(mesh);

    //------------------------------------------
    // cono 
    //------------------------------------------
    mesh = MB.CreateCylinder('cone',{
        diameterTop:0, 
        diameterBottom:1.2, 
        height:1.2
    },scene);
    meshes.push(mesh);

    //------------------------------------------
    // tronco di cono 
    //------------------------------------------
    mesh = MB.CreateCylinder('cone',{
        diameterTop:0.6, 
        diameterBottom:1.2, 
        height:1.2
    },scene);
    meshes.push(mesh);

    //------------------------------------------
    // ciambella
    //------------------------------------------
    mesh = MB.CreateTorus('torus',{
        diameter:1.5, 
        tickness:0.5, 
        tessellation:40
    },scene);
    meshes.push(mesh);

    //------------------------------------------
    // ciambella schiacciata
    //------------------------------------------
    mesh = MB.CreateTorus('torus',{
        diameter:1.5, 
        tickness:0.5, 
        tessellation:40
    },scene);
    mesh.scaling.set(1,0.2,0.5);
    meshes.push(mesh);

    //------------------------------------------
    // dodecaedro (ci sono quindici poliedri
    // predefiniti : vedi https://doc.babylonjs.com/divingDeeper/mesh/creation/polyhedra/polyhedra_by_numbers)
    //------------------------------------------
    mesh = MB.CreatePolyhedron('dod',{
        type: 2,
        size: 0.8
    },scene);
    meshes.push(mesh);

    //------------------------------------------
    // questo è un altro poliedro predefinito
    //------------------------------------------
    mesh = MB.CreatePolyhedron('rhombicuboctahedron',{
        type: 4,
        size: 0.8
    },scene);
    meshes.push(mesh);

    //------------------------------------------
    // un poliedro "custom"
    //------------------------------------------
    mesh = MB.CreatePolyhedron('tronco-piramide',{
        custom: {
            "vertex" : [
                [-1,-1,-1],[ 1,-1,-1],[-1,-1, 1],[ 1,-1, 1],
                [-0.5,1,-0.5],[ 0.5,1,-0.5],[-0.5,1, 0.5],[ 0.5,1, 0.5]
            ],
            "face" : [
                [0,1,3,2],[4,6,7,5],[1,0,4,5],
                [3,1,5,7],[2,3,7,6],[0,2,6,4]
            ]
        },
        size: 0.6
    },scene);
    meshes.push(mesh);

    //------------------------------------------
    // un secondo poliedro "custom"
    //------------------------------------------
    mesh = MB.CreatePolyhedron('cuneo',{
        custom: {
            "vertex" : [
                [-1,-1,-1],[-1,-1, 1],[ 1,-1,-1],[ 1,-1, 1],
                [-1, 1,-1],[-1, 1, 1],
            ],
            "face" : [
                [1,0,2,3],[3,2,4,5],[5,4,0,1],
                [0,4,2],[1,3,5]
            ]
        },
        size: 0.6
    },scene);
    meshes.push(mesh);

    //------------------------------------------
    // un tubo
    // see: https://doc.babylonjs.com/divingDeeper/mesh/creation/param/tube
    //------------------------------------------
    function makeSpringPath(n,k,r,h) {
        let pts = [];
        for(let i=0;i<n;i++) {
            let t = i/(n-1); // t va da 0 a 1
            let phi = k*Math.PI*2*t; // phi va da 0 a 2kPI
            pts.push(new BABYLON.Vector3(
                r*Math.cos(phi), 
                h*(-0.5+t), 
                r*Math.sin(phi)
            ));
        }
        return pts;
    }
    mesh = MB.CreateTube('molla',{
        path: makeSpringPath(200,5,0.5,1.5),
        radius: 0.1,
        cap: BABYLON.Mesh.CAP_ALL
    }, scene);
    meshes.push(mesh);

    //------------------------------------------
    // un altro tubo
    //------------------------------------------
    function makeSpiralPath(n,k,r0,a) {
        let pts = [];
        for(let i=0;i<n;i++) {
            let t = i/(n-1); // t va da 0 a 1
            let phi = k*Math.PI*2*t; // phi va da 0 a 2kPI
            let r = r0 * Math.exp(-a*phi);
            pts.push(new BABYLON.Vector3(
                r*Math.cos(phi), 
                r*Math.sin(phi),
                0
            ));
        }
        return pts;
    }
    mesh = MB.CreateTube('molla',{
        path: makeSpiralPath(200,5,1,0.1),
        radiusFunction: (i,dist) => 0.2/(1.0+0.5*dist),
        cap: BABYLON.Mesh.CAP_ALL
    }, scene);
    meshes.push(mesh);


    //------------------------------------------
    // una mesh completamente custom
    //------------------------------------------
    function makeSurfaceVertexData(f, scene) {
        let nx = 30, nz = 30;
        let vd = new BABYLON.VertexData();
        vd.positions = [];
        vd.indices = [];
        for(let iz=0;iz<nz;iz++) {
            let z = -1+2*iz/(nz-1);
            for(let ix=0;ix<nx;ix++) {
                let x = -1+2*ix/(nx-1);
                let y = f(x,z);
                vd.positions.push(x,y,z);                
            }
        }
        for(let iz=0;iz+1<nz;iz++) {
            for(let ix=0;ix+1<nx;ix++) {
                let k = iz*nx+ix;
                vd.indices.push(k,k+1,k+1+nx, k,k+1+nx,k+nx);
            }
        }
        vd.normals = [];
        BABYLON.VertexData.ComputeNormals(
            vd.positions, 
            vd.indices, 
            vd.normals);
        mesh = new BABYLON.Mesh('surface', scene);
        vd.applyToMesh(mesh);
        return mesh;    
    }
    mesh = makeSurfaceVertexData(
        (x,z) => {
            let r = 9*Math.sqrt(x*x+z*z);
            return 0.6*Math.sin(r)/r;
        }, scene);
    meshes.push(mesh);

    //------------------------------------------
    // CSG: cubo meno sfera
    //------------------------------------------
    function csg1() {
        let mesh1 = MB.CreateBox('a',{size:1},scene);
        let mesh2 = MB.CreateSphere('b',{diameter:1.1},scene);
        let result = BABYLON.CSG.FromMesh(mesh1)
            .subtract(BABYLON.CSG.FromMesh(mesh2));
        let mesh = result.toMesh('csg1', null, scene);
        mesh1.dispose();
        mesh2.dispose();
        return mesh;        
    }
    let t0 = performance.now();
    mesh = csg1();
    console.log(performance.now() - t0);
    meshes.push(mesh);

    //------------------------------------------
    // CSG: cilindro meno cilindro meno box
    //------------------------------------------
    function csg2() {
        let mesh1 = MB.CreateCylinder('a',{diameter:1, height:1.6},scene);
        let mesh2 = MB.CreateCylinder('b',{diameter:0.9, height:1.7},scene);
        let mesh3 = MB.CreateBox('c',{size:2},scene);
        mesh3.position.x = 1;
        let result = BABYLON.CSG.FromMesh(mesh1)
            .subtract(BABYLON.CSG.FromMesh(mesh2))
            .subtract(BABYLON.CSG.FromMesh(mesh3));
        let mesh = result.toMesh('csg1', null, scene);
        mesh1.dispose();
        mesh2.dispose();
        mesh3.dispose();
        return mesh;        
    }
    t0 = performance.now();
    mesh = csg2();
    mesh.rotation.z = Math.PI/2;
    console.log(performance.now() - t0);
    meshes.push(mesh);


    //------------------------------------------
    // fine
    //------------------------------------------


    // assegno colori diversi alle mesh
    meshes.forEach((mesh,i) => {
        let phi = Math.PI*2*i/meshes.length;
        let mat = mesh.material = new BABYLON.StandardMaterial(
            mesh.name + "_mat", scene);
        mat.diffuseColor.set(
            0.5 + 0.4 * Math.cos(phi),
            0.5 + 0.4 * Math.sin(phi),
            0.5 + 0.4 * Math.sin(2*phi)
        );
    });

    // piazzo le mesh sulla griglia
    meshes.forEach((mesh,i) => {
        let row = Math.floor(i/5);
        let col = i%5;
        mesh.position.set(-4+2*col,1,-4+2*row*5/4);
    });

    
}