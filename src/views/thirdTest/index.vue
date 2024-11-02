<script setup>
import {onBeforeUnmount, onMounted} from "vue";
import * as THREE from 'three'
import CreateThree from "@/views/thirdTest/util/CreateThree";
import {DirectionalLight} from "three";

let createThree;
onMounted(()=>{
    let dom=document.querySelector('.container');
    const camera=new THREE.PerspectiveCamera(10,dom.clientWidth/dom.clientHeight,10,1000);
    camera.position.set(0,20,60);
    camera.lookAt(0,0,0)

    const directionalLight = new DirectionalLight('#00ff74', 10);
    const light = new THREE.AmbientLight('white', 10);
    directionalLight.position.set(10, 10, 10);

    createThree=new CreateThree(dom,camera);
    let robot,animations,mixer;
    createThree.loaderModel('/assets/Tribal.gltf').then(res=>{
        animations=res.animations
        let animation=animations[9]
        robot=res.scene
        mixer=createThree.loaderAnimation(res.scene,animation)
        robot.tick=(e)=>{
            mixer.update(e)
        }
        createThree.actionTick.push(robot)
        createThree.scene.add(robot)
    })


    createThree.scene.add(light,directionalLight)
    createThree.startRender()


})
onBeforeUnmount(()=>{
    createThree.destroy()
})
</script>

<template>
  <div class="container"></div>
</template>

<style scoped>

</style>
