<script setup>
import * as THREE from 'three'
import {onMounted, onUnmounted} from "vue";
import CreateThree from "@/views/baseCase/effectComposer/firstDemo/util/CreateThree";
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {OutlinePass} from 'three/addons/postprocessing/OutlinePass.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';

let createThree, camera, container, composer;

onMounted(() => {
    container = document.querySelector('.container')
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 1, 1000);
    camera.position.set(0, 10, 30)
    createThree = new CreateThree(container, camera);

    let {box,cylinder,torusKnot}=initModel()
    let ll=line1()

    createThree.startRender();  //之前案例都是把这个添加到最后，后期处理要把封装好的startRender先执行才能使后期处理有效果

    createThree.createControls(null)

    composer = new EffectComposer(createThree.renderer);
    const renderPass = new RenderPass(createThree.scene, camera);
    composer.addPass(renderPass);

    const v2 = new THREE.Vector2(container.clientWidth, container.clientHeight);
    const outlinePass = new OutlinePass(v2, createThree.scene, camera);
    //模型描边颜色，默认白色
    outlinePass.visibleEdgeColor.set(0xffff00);
    //高亮发光描边厚度，厚度要小于发光强度
    outlinePass.edgeThickness = 4;
    //高亮描边发光强度
    outlinePass.edgeStrength = 6;
    //模型闪烁频率控制，默认0不闪烁
    outlinePass.pulsePeriod = 0;

    outlinePass.selectedObjects = [box,ll,cylinder,torusKnot];
    composer.addPass(outlinePass);

    let obj = new Object()
    obj.tick = () => {
        composer.render();   // 现在我们不再调用WebGLRenderer的render方法，而是使用EffectComposer中对应的render方法。
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
    const material = new THREE.MeshBasicMaterial({color: 0xff0000})
    const geometry = new THREE.BoxGeometry(3,3,3);
    const box = new THREE.Mesh(geometry, material);

    // 创建圆柱体
    const geometry2 = new THREE.CylinderGeometry( 2, 2, 4, 32 );
    const cylinder=new THREE.Mesh(geometry2,material);
    cylinder.position.x=6

    //圆环缓冲扭结几何体
    const geometry3 = new THREE.TorusKnotGeometry( 3, 1, 100, 16 );
    const material3 = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    const torusKnot = new THREE.Mesh( geometry3, material3 );
    torusKnot.position.x=-12

    createThree.scene.add(box,cylinder,torusKnot);

    return {box,cylinder,torusKnot}
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
