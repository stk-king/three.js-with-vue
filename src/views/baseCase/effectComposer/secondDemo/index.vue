<script setup>
import * as THREE from 'three'
import {onMounted, onUnmounted} from "vue";
import CreateThree from "@/views/baseCase/effectComposer/secondDemo/util/CreateThree";
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
// SMAA抗锯齿通道
import {SMAAPass} from 'three/addons/postprocessing/SMAAPass.js';


let createThree, camera, container, composer;

onMounted(() => {
    container = document.querySelector('.container')
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 1, 1000);
    camera.position.set(0, 10, 30)
    createThree = new CreateThree(container, camera);

    createLight()

    let {box,cylinder,torusKnot}=initModel()
    let ll=line1()

    createThree.startRender();  //之前案例都是把这个添加到最后，后期处理要把封装好的startRender先执行才能使后期处理有效果

    createThree.createControls(null)

    //============================================================================
    composer = new EffectComposer(createThree.renderer);
    //获取.setPixelRatio()设置的设备像素比
    const pixelRatio = createThree.renderer.getPixelRatio();
    // width、height是canva画布的宽高度
    const smaaPass = new SMAAPass(container.clientWidth * pixelRatio, container.clientHeight * pixelRatio);
    composer.addPass(smaaPass);

    const renderPass = new RenderPass(createThree.scene, camera);
    composer.addPass(renderPass);

    const v2 = new THREE.Vector2(container.clientWidth, container.clientHeight);
    const unrealBloomPass = new UnrealBloomPass(v2, 3, 0.5,0);  //resolution:画布宽高, strength：发光强度, radius：光的扩散半径, threshold：决定一个像素需要多亮才能开始辉光
    // unrealBloomPass.renderToScreen = true

    composer.addPass(unrealBloomPass);

    let obj = new Object()
    obj.tick = (e) => {
        composer.render(e);   // 现在我们不再调用WebGLRenderer的render方法，而是使用EffectComposer中对应的render方法。
    }

    createThree.actionTick.push(obj)
})

function line1() {
    const geometry = new THREE.BufferGeometry();
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 6, 0),
        new THREE.Vector3(6, 0, 0)
    ]);
    const pointsArr = curve.getSpacedPoints(100);
    geometry.setFromPoints(pointsArr);

    const pos = geometry.attributes.position;
    const count = pos.count;

    const colorsArr = [];
    for (let i = 0; i < count; i++) {
        const percent = i / count;
        colorsArr.push(percent, 0, 1 - percent);
    }

    const colors = new Float32Array(colorsArr);
    geometry.attributes.color = new THREE.BufferAttribute(colors, 3);

    const material = new THREE.LineBasicMaterial({
        vertexColors: true,
    });
    const line = new THREE.Line(geometry, material);

    createThree.scene.add(line)
    return line
}

function initModel(){
    //创建方块
    const material = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff})
    const geometry = new THREE.BoxGeometry(3,3,3);
    const box = new THREE.Mesh(geometry, material);

    // 创建圆柱体
    const geometry2 = new THREE.CylinderGeometry( 2, 2, 4, 32 );
    const material2 = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff})
    const cylinder=new THREE.Mesh(geometry2,material2);
    cylinder.position.x=6

    //圆环缓冲扭结几何体
    const geometry3 = new THREE.TorusKnotGeometry( 3, 1, 100, 16 );
    const material3 = new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff} );
    const torusKnot = new THREE.Mesh( geometry3, material3 );
    torusKnot.position.x=-12

    createThree.scene.add(box,cylinder,torusKnot);

    return {box,cylinder,torusKnot}
}

function createLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3) // 创建环境光

    const directionLight = new THREE.DirectionalLight(0xffffff)
    directionLight.position.set(550, 100, 550)
    directionLight.intensity = 0.8
    createThree.scene.add(directionLight,ambientLight)
}

onUnmounted(() => {
    createThree.destroy()
})
</script>

<template>
    <div class="container"></div>
</template>

<style scoped>

</style>
