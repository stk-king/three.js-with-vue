<script setup>
import * as THREE from 'three'
import {onBeforeUnmount, onMounted} from "vue";
import initThree from "@/views/baseCase/animation/secondDemo/util";


let createThree,container,camera,gui,cube;

onMounted(()=>{
    container=document.querySelector('.container');
    camera=new THREE.PerspectiveCamera(45,container.clientWidth/container.clientHeight,1,500);
    camera.position.set(0,20,50);
    camera.lookAt(0,0,0);
    createThree=new initThree(container,camera);
    createThree.createControls(null)

    initLight();
    initMode();
    initGui();

    createThree.startRender()

})

//创建gui
function initGui(){
    let guiConfig = {
        influence1: 0.01,
        influence2: 0.01,
        update: function () {
            if (cube) {
                cube.morphTargetInfluences[0] = guiConfig.influence1;
                cube.morphTargetInfluences[1] = guiConfig.influence2;
            }
        }
    };

    let datGui = createThree.createGui(true);

    // 将设置属性添加到gui当中，gui.add(对象，属性，最小值，最大值）
    datGui.add(guiConfig, 'influence1', 0, 10).onChange(guiConfig.update).name('纵向');
    datGui.add(guiConfig, 'influence2', 0, 10).onChange(guiConfig.update).name('横向');
}
//创建灯光
function initLight(){
    let ambientLight=new THREE.AmbientLight(0xffffff);

    let directionalLight=new THREE.DirectionalLight(0xffffff);
    directionalLight.shadow.camera.near = 1; //产生阴影的最近距离
    directionalLight.shadow.camera.far = 400; //产生阴影的最远距离
    directionalLight.shadow.camera.left = -50; //产生阴影距离位置的最左边位置
    directionalLight.shadow.camera.right = 50; //最右边
    directionalLight.shadow.camera.top = 50; //最上边
    directionalLight.shadow.camera.bottom = -50; //最下面
    //这两个值决定生成阴影密度 默认512
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.mapSize.width = 1024;
    //告诉平行光需要开启阴影投射
    directionalLight.castShadow = true;

    createThree.scene.add(ambientLight,directionalLight)
}
//创建模型
function initMode() {
    // 底部平面
    let planeGeometry = new THREE.PlaneGeometry(100, 100);
    let planeMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.y = -0.1;
    plane.receiveShadow = true; // 可以接收阴影

    // 创建显示的立方体
    let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    let cubeMaterial = new THREE.MeshLambertMaterial({ morphTargets: true, color: 0x00ffff });

    // 创建两个影响立方体的变形目标
    let cubeTarget1 = new THREE.BoxGeometry(2, 10, 2);
    let cubeTarget2 = new THREE.BoxGeometry(8, 2, 8);

    // 设置变形目标
    cubeGeometry.morphAttributes.position = [
        cubeTarget1.attributes.position,
        cubeTarget2.attributes.position
    ];

    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(0, 10, 0);

    createThree.scene.add(plane, cube);
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
