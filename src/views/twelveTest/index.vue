<script setup>
import * as THREE from 'three'
import {onMounted, onUnmounted} from "vue";
import CreateThree from "@/views/twelveTest/util/CreateThree";
import request from "@/utils/request";
import CheckIntersection from "@/views/twelveTest/util/checkIntersection";
import {FontLoader} from "three/addons/loaders/FontLoader.js";
import {TextGeometry} from "three/addons";



let createThree, camera, container,centerMesh;
// const css2Renderer = new CSS2DRenderer();
const circleYs = [];
let circleGroup=new THREE.Group();

const loader = new FontLoader()

onMounted( () => {
    container = document.querySelector('.container')
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 1, 1000);
    camera.position.set(2, 5, 2)
    createThree = new CreateThree(container, camera);

    createThree.createControls(null)

    createThree.startRender();

    request('/province/jiangxi').then(res=>{
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
                    createThree.scene.add(mesh)

                    // 计算区域的中心点
                    const bbox = new THREE.Box3().setFromObject(mesh);
                    const center = bbox.getCenter(new THREE.Vector3());

                    initModel(center,mesh);
                    spotCircle(center,mesh);
                    addText(center,mesh)

                    createThree.scene.add(circleGroup);
                });
            }
        })

        createThree.scene.traverse(e=>{
            if (e.type==='Mesh' && e.name==='上饶市circle'){
                // 获取mesh的世界坐标，你会发现mesh的世界坐标受到父对象group的.position影响
                e.position.set(e.position.x+1, e.position.y, e.position.z);
            }
            if (e.name==='上饶市gg'){
                // 获取mesh的世界坐标，你会发现mesh的世界坐标受到父对象group的.position影响
                e.position.set(e.position.x+1, e.position.y, e.position.z);
            }
            if (e.name==='赣州市circle'){
                centerMesh=e
            }
        })

        circleGroup.traverse(e=>{
            if (e.name!=='赣州市circle'){
                initLine(e)
            }
        })

        let obj=new Object()
        obj.tick=()=>{
            CircleRender();
        }
        createThree.actionTick.push(obj)

        // 后期讲解
        let checkIntersection=new CheckIntersection(createThree)
        window.addEventListener('pointerdown',()=>{
            if (checkIntersection.object){
                if (checkIntersection.object.position.y>0.01){
                    checkIntersection.object.position.y=0
                }else{
                    checkIntersection.object.position.y=0.03
                }
                console.log(checkIntersection.object)
            }
        })

    })

})

function addText(center,mesh) {
    loader.load('/assets/font/zixiaohuncanglangxingkai_Regular.json',(font)=>{  //要展示中文字体必须有中文格式的json文件
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
        textMesh.position.y = 1.2;
        textMesh.name=mesh+'text'
        if (!createThree.scene.getObjectByName(mesh.name+'text')){
            let obj=new Object()
            obj.tick=()=>{
                textMesh.lookAt(camera.position) //设置文字始终向着相机
            }
            createThree.actionTick.push(obj)
            createThree.scene.add(textMesh)
        }
    })
}
function spotCircle(center,mesh) {
    let group=new THREE.Group()
    // 圆
    const geometry1 = new THREE.CircleGeometry(0.15, 200)
    const material1 = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide })
    const circle = new THREE.Mesh(geometry1, material1)
    // 绘制地图时 y轴取反 这里同步
    circle.position.set(center.x, center.y+0.22, center.z)
    circle.rotation.x=-Math.PI/2

    // 圆环
    const geometry2 = new THREE.RingGeometry(0.35, 0.3, 50)
    // transparent 设置 true 开启透明
    const material2 = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true })
    const circleY = new THREE.Mesh(geometry2, material2)
    // 绘制地图时 y轴取反 这里同步
    circleY.position.set(center.x, center.y+0.22, center.z)
    circleY.rotation.x=-Math.PI/2
    createThree.scene.add(circleY)

    const geometry3 = new THREE.RingGeometry(0.16, 0.2, 50)
    // transparent 设置 true 开启透明
    const material3 = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true })
    const circleY3 = new THREE.Mesh(geometry3, material3)
    // 绘制地图时 y轴取反 这里同步
    circleY3.position.set(center.x, center.y+0.22, center.z)
    circleY3.rotation.x=-Math.PI/2

    group.add(circle,circleY,circleY3)
    group.name=mesh.name+'gg'
    circle.raycast = () => {};
    circleY.raycast = () => {};
    circleY3.raycast = () => {};

    if (!createThree.scene.getObjectByName(mesh.name+'gg')){
        createThree.scene.add(group)
    }

    circleYs.push(circleY,circleY3)
}

function CircleRender() {
    circleYs.forEach((mesh)=>{
        // 目标 圆环放大 并 透明
        mesh._s += 0.01
        mesh.scale.set(1 * mesh._s, 1 * mesh._s, 1 * mesh._s)
        if (mesh._s <= 2) {
            mesh.material.opacity = 2 - mesh._s
        } else {
            mesh._s = 1
        }
    })
}

function initModel(center,mesh){
    const circleGeometry = new THREE.ConeGeometry(0.2, 0.8,32); // 半径为 1
    const circleMaterial = new THREE.MeshBasicMaterial({ color: '#00ff73' });
    const circle = new THREE.Mesh(circleGeometry, circleMaterial);
    circle.position.set(center.x, center.y+0.1, center.z);
    circle.name=mesh.name+'circle';
    circle.raycast = () => {};
    if (!circleGroup.getObjectByName(mesh.name+'circle')){
        circleGroup.add(circle)
    }
}

// 学习GLSL基础,就可知该着色器代码什么意思，本教程不讲解，但可在顶部导航栏查找相关学习资源
const vertexShader = `
    attribute float alpha;
    attribute vec3 color;
    varying float vAlpha;
    varying vec3 vColor;
    void main() {
        vAlpha = alpha;
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
    }
`;

const fragmentShader = `
    varying float vAlpha;
    varying vec3 vColor;
    void main() {
        gl_FragColor = vec4(vColor, vAlpha);
    }
`;


function initLine(mesh) {
    const p1 = new THREE.Vector3(centerMesh.position.x, centerMesh.position.y+0.2, centerMesh.position.z);
    const p2 = new THREE.Vector3(0, 6, 0);
    const p3 = new THREE.Vector3(mesh.position.x, mesh.position.y+0.2, mesh.position.z);
    const curve = new THREE.QuadraticBezierCurve3(p1, p2, p3);
    const pointsArr = curve.getPoints(1000); // 曲线上获取点
    const geometry = new THREE.BufferGeometry().setFromPoints(pointsArr);

    // 创建 alpha 属性，用于控制渐变
    const alpha = new Float32Array(pointsArr.length);
    for (let i = 0; i < alpha.length; i++) {
        alpha[i] = 1.0 - i / alpha.length;
    }
    geometry.setAttribute('alpha', new THREE.BufferAttribute(alpha, 1));

    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true
    });

    const line = new THREE.Line(geometry, material);
    line.raycast = () => {};
    createThree.scene.add(line);

    // 动画更新
    function animate() {
        requestAnimationFrame(animate);
        // 更新 alpha 属性
        for (let i = 0; i < alpha.length; i++) {
            alpha[i] = (alpha[i] + 0.01) % 1.0; // 循环渐变
        }
        geometry.attributes.alpha.needsUpdate = true;
    }
    animate();
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
