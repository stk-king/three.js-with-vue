<script setup>
import * as THREE from 'three'
import {onMounted, onUnmounted} from "vue";
import CreateThree from "@/views/baseCase/controls/thirdDemo/util/CreateThree";
import request from "@/utils/request";
import {FontLoader} from "three/addons/loaders/FontLoader.js";
import {TextGeometry} from "three/addons";
import { MapControls } from 'three/addons/controls/MapControls.js';



let createThree, camera, container,font;
let circleGroup=new THREE.Group();

const loader = new FontLoader()

onMounted( () => {
    container = document.querySelector('.container')
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 1, 1000);
    camera.position.set(0, 5, 0)
    createThree = new CreateThree(container, camera);

    const controls = new MapControls( camera, createThree.renderer.domElement );
    controls.enableDamping = true;

    createThree.createControls(controls)

    createThree.startRender();

    loader.load('/assets/font/zixiaohuncanglangxingkai_Regular.json',(e)=>{
        font=e
        createMap('/province/china')
    })
})

function createMap(url){
    request(url).then(res=>{
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        // 计算地图的边界以确定中心点
        res.features.forEach(feature => {
            if (feature.geometry && feature.geometry.coordinates) {
                const coordinates = feature.geometry.coordinates;
                coordinates.forEach(polygon => {
                    polygon[0].forEach(coord => {
                        if (coord[0] < minX) minX = coord[0];
                        if (coord[0] > maxX) maxX = coord[0];
                        if (coord[1] < minY) minY = coord[1];
                        if (coord[1] > maxY) maxY = coord[1];
                    });
                });
            }
        });

        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        const thickness=0.2;

        res.features.forEach((feature, index) => {
            let name=feature.properties.name
            if (feature.geometry && feature.geometry.coordinates) {
                const coordinates = feature.geometry.coordinates;
                coordinates.forEach(polygon => {
                    const shape = new THREE.Shape();
                    polygon[0].forEach((coord, i) => {
                        if (i === 0) {
                            shape.moveTo(coord[0] - centerX, coord[1] - centerY);
                        } else {
                            shape.lineTo(coord[0] - centerX, coord[1] - centerY);
                        }
                    });

                    // 使用 ExtrudeGeometry 创建带有厚度的几何体
                    const extrudeSettings = {
                        depth: thickness,
                        bevelEnabled: false
                    };
                    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

                    const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff, side: THREE.DoubleSide });
                    const mesh = new THREE.Mesh(geometry, material);
                    mesh.name=name

                    // 创建轮廓线
                    const lineGeometry = new THREE.EdgesGeometry(geometry);
                    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
                    const line = new THREE.LineSegments(lineGeometry, lineMaterial);
                    line.name=name+'line'
                    // 禁用线对象的拾取
                    line.raycast = () => {};

                    mesh.add(line);
                    mesh.rotation.x=-Math.PI/2
                    mesh.scale.set(2,2,2)
                    if (!createThree.scene.getObjectByName(mesh.name)){
                        createThree.scene.add(mesh)
                        // 计算区域的中心点
                        const bbox = new THREE.Box3().setFromObject(mesh);
                        const center = bbox.getCenter(new THREE.Vector3());
                        addText(center,mesh)
                        createThree.scene.add(circleGroup);
                    }
                });
            }
        })
    })
}
function addText(center,mesh) {
        const geometry = new TextGeometry(mesh.name, {
            font: font,
            size: 0.2, // 字体大小
            depth: 0.1, // 挤出文本的厚度
        })
        geometry.center() // 居中文本
        const materials = new THREE.MeshBasicMaterial({
            color: '#ffffff',
            transparent: true,
            opacity: 1,
        })
        const textMesh = new THREE.Mesh(geometry, materials)
        textMesh.position.copy(center)
        textMesh.position.y = 0.5;
        textMesh.name=mesh+'text'
        if (!createThree.scene.getObjectByName(mesh.name+'text')){
            let obj=new Object()
            obj.tick=()=>{
                textMesh.lookAt(camera.position) //设置文字始终向着相机
            }
            createThree.actionTick.push(obj)
            createThree.scene.add(textMesh)
        }
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
