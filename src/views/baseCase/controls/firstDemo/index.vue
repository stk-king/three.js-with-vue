<script setup>
import {onMounted, onUnmounted} from "vue";
import * as THREE from "three";
import CreateThree from "@/views/baseCase/controls/firstDemo/util/CreateThree";
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let createThree,container,view1,view2,camera;

onMounted(()=>{
    container=document.querySelector('.container')
    view1=document.querySelector('.view1')
    view2=document.querySelector('.view2')

    camera = new THREE.PerspectiveCamera( 45, container.clientWidth/container.clientHeight, 1, 500 );
    camera.position.set( 5, 5, 5 );
    camera.lookAt( 0, 0, 0 );

    createThree=new CreateThree(container,camera);
    createThree.createControls(null)

    const sceneInfo1 = setupScene1();
    const sceneInfo2 = setupScene2();

    let obj=new Object();
    obj.tick=(e)=>{
        createThree.renderer.setScissorTest(false);
        createThree.renderer.clear(true, true);
        createThree.renderer.setScissorTest(true);

        sceneInfo1.mesh.rotation.y += e;
        sceneInfo2.mesh.rotation.y += e;

        renderSceneInfo(sceneInfo1);
        renderSceneInfo(sceneInfo2);

        sceneInfo1.controls.update()
        sceneInfo2.controls.update()

    }

    createThree.actionTick.push(obj)

    createThree.startRender();
})

// 创建场景
function makeScene(elem) {
    const scene = new THREE.Scene();
    const fov = 45;
    const aspect = elem.clientWidth/elem.clientHeight;
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;
    camera.position.set(3, 3, 3);
    camera.lookAt(0, 0, 0);

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    }
    return {scene, camera, elem};
}
// 初始化第一个场景，使用轨道控制器（OrbitControls）
function setupScene1() {
    const sceneInfo = makeScene(view1);
    sceneInfo.scene.background = new THREE.Color('#00018f');
    sceneInfo.controls = new OrbitControls( sceneInfo.camera, view1 );
    sceneInfo.controls.noZoom = true;
    sceneInfo.controls.noPan = true;

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({color: 'red'});
    const mesh = new THREE.Mesh(geometry, material);
    sceneInfo.scene.add(mesh);
    let axesHelper=new THREE.AxesHelper(500);
    sceneInfo.scene.add(axesHelper);
    sceneInfo.mesh = mesh;
    return sceneInfo;
}
// 初始化第二个场景,使用轨迹球控制器（TrackballControls）
function setupScene2() {
    const sceneInfo = makeScene(view2);
    sceneInfo.scene.background = new THREE.Color('#8e0202');
    sceneInfo.controls = new TrackballControls( sceneInfo.camera, view2 );
    sceneInfo.controls.noZoom = true;
    sceneInfo.controls.noPan = true;
    sceneInfo.controls.rotateSpeed=4

    const radius = .8;
    const widthSegments = 4;
    const heightSegments = 2;
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const material = new THREE.MeshPhongMaterial({
        color: 'blue',
        flatShading: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    sceneInfo.scene.add(mesh);
    let axesHelper=new THREE.AxesHelper(500);
    sceneInfo.scene.add(axesHelper);
    sceneInfo.mesh = mesh;
    return sceneInfo;
}

// 创建视图信息获取函数
function renderSceneInfo(sceneInfo) {
    const {scene, camera, elem} = sceneInfo;

    const {left, right, top, bottom, width, height} = elem.getBoundingClientRect();

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    createThree.renderer.setScissor(left-200, 0, container.clientWidth/2, container.clientHeight);
    createThree.renderer.setViewport(left-200, 0, container.clientWidth/2, container.clientHeight);

    createThree.renderer.render(scene, camera);
}

onUnmounted(()=>{
    createThree.destroy()
})
</script>

<template>
    <div class="box">
        <div class="container"></div>
        <div class="view1">
            <h1 class="title">轨道控制器（OrbitControls）</h1>
        </div>
        <div class="view2">
            <h1 class="title">轨迹球控制器（TrackballControls）</h1>
        </div>
        <div style="position:absolute;left: 50%;top: 10px;transform: translateX(-50%);color: white;font-size: 40px">VS</div>
    </div>
</template>

<style scoped>
.box{
    position: relative;
    width: 100%;
    height: 100%;
}
.container{
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
}
.view1{
    position: absolute;
    left: 0;
    top: 0;
    border-right: 1px solid #ffffff;
}
.view2{
    position: absolute;
    right: 0;
    top: 0;
    border-left: 1px solid #ffffff;
}
.view1{
    width: 50%;
    height: 100%;
}

.view2{
    width: 50%;
    height: 100%;
}
.title{
    position:absolute;left: 50%;top: 10px;transform: translateX(-50%);color: white
}
</style>
