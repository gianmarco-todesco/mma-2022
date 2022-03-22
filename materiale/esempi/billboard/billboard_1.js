MYLIB.initialize('renderCanvas', populateScene);

let face;

function populateScene(scene) {
    MYLIB.createGrid(scene);
    

    let camera = scene.activeCamera;
    camera.radius = 5;
    
    face = BABYLON.MeshBuilder.CreatePlane('a',{
        width:4, height:3
    },scene);    
    let material = new BABYLON.StandardMaterial(
        'mat', scene);
    material.diffuseColor.set(1,1,1);
    material.diffuseTexture = new BABYLON.Texture("totoro.jpg", scene);
    material.specularColor.set(0,0,0);
    face.material = material;
    face.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;



    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;


    });
    



}