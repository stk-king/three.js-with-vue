<script setup>
import {onBeforeUnmount, onMounted} from "vue";
import CreateThree from "@/utils/CreateThree";
import * as THREE from 'three'
import {GUI} from "three/addons/libs/lil-gui.module.min.js";

let createThree,gui,step=0,controls,rotate=true,container,camera;
let box, circle, cone, cylinder, sphere, plane, torus;

onMounted(()=>{
    container=document.querySelector('.container');
    camera = new THREE.PerspectiveCamera(75, container.clientHeight/container.clientHeight, 1, 1000); //实例化相机
    camera.position.set(100, 100, 100);
    createThree=new CreateThree(container,camera)

    createThree.createControls(null)
    initMesh()

    //创建调试框
    controls = {
        rotate:true
    };

    gui = createThree.createGui(true);
    gui.add(controls, "rotate").name("旋转").onChange( (e)=>{
        rotate = e;
    });

    //创建一个对象用于执行动画
    let obj=new Object({tick:()=>{
        animate()
    }})

    createThree.actionTick.push(obj)
    createThree.startRender()
})
//创建模型
function initMesh() {
    let material = new THREE.MeshNormalMaterial();

    //创建立方体
    box = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), material);
    box.position.set(-50, 20, 0);

    //创建圆
    circle = new THREE.Mesh(new THREE.CircleGeometry(5, 32), material);
    circle.position.set(-20, 20, 0);

    //创建圆锥
    cone = new THREE.Mesh(new THREE.ConeGeometry(5, 20, 32), material);
    cone.position.set(20, 20, 0);

    //创建圆柱
    cylinder = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 20, 32), material);
    cylinder.position.set(50, 20, 0);

    //创建球
    sphere = new THREE.Mesh(new THREE.SphereGeometry(5, 32, 32), material);
    sphere.position.set(-35, -20, 0);

    //创建平面
    plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
    plane.position.set(0, -20, 0);

    //创建圆环
    torus = new THREE.Mesh(new THREE.TorusGeometry(10, 3, 16, 100), material);
    torus.position.set(35, -20, 0);

    createThree.scene.add(box, circle, cone, cylinder, sphere, plane, torus)
}

//创建旋转动画
function animate() {
    //判断是否可以旋转
    if(rotate){
        step += 0.02;

        //设置每一个模型的转向
        box.rotation.set(step, step, step);
        circle.rotation.set(step, step, step);
        cone.rotation.set(step, step, step);
        cylinder.rotation.set(step, step, step);
        sphere.rotation.set(step, step, step);
        plane.rotation.set(step, step, step);
        torus.rotation.set(step, step, step);
    }
}

onBeforeUnmount(()=>{
    createThree.destroy()
    gui.destroy()
})
</script>

<template>
  <div class="container"></div>
</template>

<style scoped>

</style>
