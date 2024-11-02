<script setup>
import {onMounted, onUnmounted} from "vue";
import CreateThree from "@/utils/CreateThree";
import * as THREE from 'three'
import { AmmoPhysics } from 'three/addons/physics/AmmoPhysics.js';


let physics, position ,createThree,camera,container;
let boxes,floor;

onMounted(()=>{
    init().then(()=>{
        position = new THREE.Vector3();
        container=document.querySelector('.container');
        camera = new THREE.PerspectiveCamera( 50, container.clientWidth / container.clientHeight, 0.1, 100 );
        camera.position.set( 10, 10, 10 );
        camera.lookAt( 0, 0.5, 0 );

        createThree=new CreateThree(container,camera);

        createThree.createControls(null)


        initLight()
        initFloor()
        initModel()


        physics.addScene( createThree.scene );
        let obj=new Object()
        obj.tick=(e)=>{
            let index = Math.floor( Math.random() * boxes.count );
            position.set( 0, Math.random()*6 + 1, 0 );
            physics.setMeshPosition( boxes, position, index );
        }

        createThree.actionTick.push(obj)


        createThree.startRender()
    })

})

async function init(){
    physics =await AmmoPhysics();
}

//创建灯光
function initLight(){
    const hemiLight = new THREE.HemisphereLight();
    const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
    dirLight.position.set( 5, 5, 5 );
    dirLight.castShadow = true;
    dirLight.shadow.camera.zoom = 2;

    createThree.scene.add(hemiLight,dirLight);
}


//创建地板
function initFloor(){
    const floor = new THREE.Mesh(
        new THREE.BoxGeometry( 4, 4 ,0.2),
        new THREE.MeshStandardMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            opacity: 0.4,
            transparent: false
        })
    );
    floor.rotation.x=-Math.PI/2
    floor.receiveShadow = true;
    floor.userData.physics = { mass: 0 };
    createThree.scene.add(floor)
}
function initModel(){
    const material = new THREE.MeshLambertMaterial();
    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();
    const geometryBox = new THREE.BoxGeometry( 0.075, 0.075, 0.075 );
    boxes = new THREE.InstancedMesh( geometryBox, material, 200 );
    boxes.instanceMatrix.setUsage( THREE.DynamicDrawUsage ); // will be updated every frame
    boxes.castShadow = true;
    boxes.receiveShadow = true;
    boxes.userData.physics = { mass: 10 };
    for ( let i = 0; i < boxes.count; i ++ ) {
        matrix.setPosition( Math.random() - 0.5, Math.random() * 2, Math.random() - 0.5 );
        boxes.setMatrixAt( i, matrix );
        boxes.setColorAt( i, color.setHex( 0xffffff * Math.random() ) );
    }
    createThree.scene.add(boxes);
}

onUnmounted(()=>{
    createThree.destroy()
})
</script>

<template>
    <div class="container"></div>
</template>

<style scoped>

</style>
