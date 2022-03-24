let canvas, engine, camera, obj;
let scene;

window.addEventListener('DOMContentLoaded', (event) => {
	
    canvas = document.getElementById("renderCanvas"); // Get the canvas element
    engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
	camera;

		
    let texture, light1, light2;
    
    scene = new BABYLON.Scene(engine);
    camera = new BABYLON.ArcRotateCamera("Camera", 
        1.0, 
        1.13, 
        10, new BABYLON.Vector3(0,0,0), scene);
    camera.wheelPrecision = 40;
    camera.lowerRadiusLimit = 5;
    camera.attachControl(canvas, true);

    light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
    light1.intensity = 0.5;
    light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 0, -4), scene);   
    light2.intensity = 0.5;
    light2.parent = camera;
        
    
    let skulls = [];
    BABYLON.SceneLoader.Append("./", "skull.obj", scene, function (scene) {
        console.log("Sono qui! Sono qui!");
        
        obj = scene.meshes[0];
        console.log("scene = ", obj);
        const m = 20;
        const r = 4;
        for(let i=0; i<m; i++) {
            let sk = obj.createInstance('sk'+i);
            skulls.push(sk);
            let sc = 0.3;
            sk.scaling.set(sc,sc,sc);
            let phi = 2*Math.PI*i/m;
            sk.position.set(r*Math.cos(phi),0,r*Math.sin(phi));
        }
        scene.registerBeforeRender(() => {
            let t = performance.now() * 0.001;
            skulls.forEach((skull,i) => skull.rotation.y = t + 4*Math.PI*i/m);
            scene.meshes[0].position.y = Math.sin(t);
        })


    });
            
	engine.runRenderLoop(() => scene.render());

    window.addEventListener("resize", function () { engine.resize();});
});

