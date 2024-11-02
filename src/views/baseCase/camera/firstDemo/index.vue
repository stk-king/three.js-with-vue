<script setup>
import {onBeforeUnmount, onMounted} from "vue";
import * as THREE from 'three'
import CreateThree from "@/views/baseCase/camera/firstDemo/util/CreateThree";
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from "three/addons/controls/OrbitControls";

let createThree,container,AMOUNT=3,ASPECT_RATIO,WIDTH,HEIGHT,cameras=[];


onMounted(()=>{
    container=document.querySelector('.container');
    ASPECT_RATIO = container.clientWidth / container.clientHeight;
    WIDTH = ( container.clientWidth / AMOUNT ) * window.devicePixelRatio;
    HEIGHT = (container.clientHeight / AMOUNT ) * window.devicePixelRatio;

    initCamera()

    for (let i=0;i<cameras.length;i++){
        let control=new OrbitControls(cameras[i],createThree.renderer.domElement);
        let obj=new Object({
            tick:()=>{
                control.update()
            }
        })
        createThree.actionTick.push(obj)
    }

    createThree.scene.add( new THREE.AmbientLight( 0x999999 ) );

    const light = new THREE.DirectionalLight( 0xffffff, 3 );
    light.position.set( 0.5, 0.5, 1 );
    light.castShadow = true;
    light.shadow.camera.zoom = 4; // tighter shadow map
    createThree.scene.add( light );


    // const objLoader=new OBJLoader();
    // const mtlLoader = new MTLLoader();
    // mtlLoader.load('/assets/models/baseCase/camera/alienAnimal.mtl', (mtl) => {
    //     mtl.preload();
    //     objLoader.setMaterials(mtl);
    //     console.log(mtl)
    //     objLoader.load('/assets/models/baseCase/camera/alienAnimal.obj', (root) => {
    //         createThree.scene.add(root);
    //         console.log(root)
    //     });
    // });

    const loader=new GLTFLoader();
    loader.load('/assets/models/baseCase/camera/vefq.glb',(gltf)=>{
        console.log(gltf.animations)
        createThree.scene.add(gltf.scene)
        gltf.scene.scale.set(4,4,4)
        gltf.scene.position.set(0,-1,0)
    })


    createThree.startRender();
})

function initCamera(){
    for ( let y = 0; y < AMOUNT; y ++ ) {
        for ( let x = 0; x < AMOUNT; x ++ ) {
            const subcamera = new THREE.PerspectiveCamera( 40, ASPECT_RATIO, 0.1, 10 );
            subcamera.viewport = new THREE.Vector4( Math.floor( x * WIDTH ), Math.floor( y * HEIGHT ), Math.ceil( WIDTH ), Math.ceil( HEIGHT ) );
            subcamera.position.x = ( x / AMOUNT ) - 0.5;
            subcamera.position.y = 0.5 - ( y / AMOUNT );
            subcamera.position.z = 1.5;
            subcamera.position.multiplyScalar( 2 );
            subcamera.lookAt( 0, 0, 0 );
            subcamera.updateMatrixWorld();
            cameras.push( subcamera );
        }
    }
    const camera = new THREE.ArrayCamera( cameras );
    camera.position.z = 3;
    createThree=new CreateThree(container,camera);
}

onBeforeUnmount(()=>{
    createThree.destroy()
})
</script>

<template>
  <div class="container"></div>
</template>

<style scoped>

</style>
