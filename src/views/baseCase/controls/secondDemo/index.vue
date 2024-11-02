<script setup>
import CreateThree from '@/views/baseCase/controls/secondDemo/util/CreateThree'
import * as THREE from 'three';
import { DragControls } from 'three/addons/controls/DragControls.js';;

import {onMounted, onUnmounted} from "vue";

let createThree,camera,container,objects=[];

onMounted(()=>{
    container=document.querySelector('.container')
    camera=new THREE.PerspectiveCamera(45,container.clientWidth/container.clientHeight,1,500);
    camera.position.set(10,10,10);
    camera.lookAt(0,0,0)

    createThree=new CreateThree(container,camera);

    createThree.createControls(null)

    // 添加灯光
    const light = new THREE.SpotLight( 0xffffff, 10000 );
    light.position.set( 0, 25, 50 );
    light.angle = Math.PI / 9;
    light.castShadow = true;
    light.shadow.camera.near = 10;
    light.shadow.camera.far = 100;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    createThree.scene.add(new THREE.AmbientLight( 0xaaaaaa ),light)


    // 添加网格地面
    const gridHelper = new THREE.GridHelper(40, 40) // 创建一个网格帮助器，参数为网格的宽度和高度
    gridHelper.material.transparent = true // 开启网格帮助器的透明度
    gridHelper.material.opacity = 0.5 // 设置网格帮助器的透明度
    createThree.scene.add(gridHelper)

    initModel(200)

    let controls = new DragControls( [ ... objects ], camera, createThree.renderer.domElement );
    controls.rotateSpeed = 2;
    controls.addEventListener('dragstart',(e)=>{
        createThree.controls.enabled=false  // 开始拖动时，停止轨道控制器（OrbitControls）
    })
    controls.addEventListener( 'dragend', ( e )=>{
        e.object.material.color.set( 0xff0000 );
        console.log(e.object)
        createThree.controls.enabled=true  // 开始拖动时，运行轨道控制器（OrbitControls）
    });

    createThree.startRender()
})

//创建一组可被拖拽的3D Objects。
function initModel(index){
    const group=new THREE.Group();
    const geometry=new THREE.BoxGeometry(0.5,0.5,0.5);

    for (let i=0;i<index;i++){
        const material=new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
        const object=new THREE.Mesh(geometry,material);

        object.position.x=Math.random()*40-20
        object.position.z=Math.random()*40-20
        object.position.y=0.5

        object.castShadow = true;
        object.receiveShadow = true;
        object.name='网格'+i
        createThree.scene.add(object)
        objects.push( object );
        group.add(object)
    }
    createThree.scene.add(group)
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
