<script setup>
import {onBeforeUnmount, onMounted} from "vue";
import * as THREE from 'three'
import CreateThree from "@/utils/CreateThree";

let gui, ambientLight, directionalLight,createThree,container,camera,camera1;
let debug, sphere, cube, plane;

onMounted(()=>{
    container=document.querySelector('.container');
    camera1 = new THREE.PerspectiveCamera(45, container.clientWidth/container.clientHeight, 0.1, 1000);
    camera1.position.set(0, 100, 200);
    camera1.lookAt(new THREE.Vector3(0, 0, 0));
    createThree=new CreateThree(container,camera1);
    createThree.createControls(null)
    createThree.renderer.shadowMap.enabled=true;
    createThree.renderer.type=THREE.PCFSoftShadowMap;


    gui= {
        ambientLight: "#111111", //环境光源
        directionalLight: "#ffffff", //点光源
        intensity: 1, //灯光强度
        visible: true, //是否可见
        castShadow: true, //是否开启阴影
        debug: true, //开启关闭光照辅助
        targetX: 0, //朝向x轴坐标
        targetY: 0, //朝向y轴坐标
        targetZ: 0, //朝向z轴坐标
        near: 20, //阴影渲染的最近距离
        far: 100, //阴影渲染的最远距离
        left: -50, //阴影的最左边距离
        right: 50, //阴影的最右边距离
        top: 50, //阴影的最上边距离
        bottom: -50, //阴影的最下边距离
    };

    let datGui = createThree.createGui(true);
    createGui(datGui)
    initModel()
    initLight()


    createThree.startRender();
})

function createGui(datGui){
    //将设置属性添加到gui当中，gui.add(对象，属性，最小值，最大值）
    datGui.addColor(gui, "ambientLight").name("环境光颜色").onChange(function (e) {
        ambientLight.color.set(e);
    });
    datGui.addColor(gui, "directionalLight").name("平行光颜色").onChange(function (e) {
        directionalLight.color.set(e);
    });
    datGui.add(gui, "intensity", 0, 5).name("光线强度").onChange(function (e) {
        directionalLight.intensity = e;
    });
    datGui.add(gui, "visible").name("显示平行光").onChange(function (e) {
        directionalLight.visible = e;
    });
    datGui.add(gui, "castShadow").name("显示阴影").onChange(function (e) {
        directionalLight.castShadow = e;
    });
    datGui.add(gui, "debug").name("开启光照辅助").onChange(function (e) {
        debug.visible = e;
    });

    datGui.add(gui, "targetX", -20, 20).name("焦点X坐标位置").onChange(changeSpherePosition);
    datGui.add(gui, "targetY", 0, 20).name("焦点Y坐标位置").onChange(changeSpherePosition);
    datGui.add(gui, "targetZ", -20, 20).name("焦点Z坐标位置").onChange(changeSpherePosition);


    camera = datGui.addFolder("阴影设置");

    camera.add(gui, "near", 0, 50).name("最近距离").onChange(updateShadow);
    camera.add(gui, "far", 50, 100).name("最近距离").onChange(updateShadow);
    camera.add(gui, "left", -200, 0).name("最左距离").onChange(updateShadow);
    camera.add(gui, "right", 0, 200).name("最右距离").onChange(updateShadow);
    camera.add(gui, "top", 0, 200).name("最上距离").onChange(updateShadow);
    camera.add(gui, "bottom", -200, 0).name("最下距离").onChange(updateShadow);
}
function updateShadow() {
    directionalLight.shadow.camera.near = gui.near; //产生阴影的最近距离
    directionalLight.shadow.camera.far = gui.far; //产生阴影的最远距离
    directionalLight.shadow.camera.left = gui.left; //产生阴影距离位置的最左边位置
    directionalLight.shadow.camera.right = gui.right; //最右边
    directionalLight.shadow.camera.top = gui.top; //最上边
    directionalLight.shadow.camera.bottom = gui.bottom; //最下面

    directionalLight.shadow.camera.updateProjectionMatrix();
}

//修改球体位置的方法，平行光的target就是球
function changeSpherePosition() {
    sphere.position.set(gui.targetX, gui.targetY, gui.targetZ);
}

function initModel() {
    let sphereGeometry = new THREE.SphereGeometry(5, 24, 16);
    let sphereMaterial = new THREE.MeshPhongMaterial({color: 0xff00ff});
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.castShadow = true; //开启阴影

    let cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
    let cubeMaterial = new THREE.MeshLambertMaterial({color: 0x00ffff});
    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.x = 30;
    cube.position.z = -5;
    cube.castShadow = true; //开启阴影

    let planeGeometry = new THREE.PlaneGeometry(100, 100);
    let planeMaterial = new THREE.MeshLambertMaterial({color: 0xaaaaaa});
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.y = -5;
    plane.receiveShadow = true;


    createThree.scene.add(sphere,cube,plane);
}

function initLight() {
    ambientLight = new THREE.AmbientLight("#111111");  //环境光
    // createThree.scene.add(ambientLight);

    directionalLight = new THREE.DirectionalLight("#ffffff");  //
    directionalLight.position.set(40, 60, 10);

    directionalLight.shadow.camera.near = gui.near; //产生阴影的最近距离
    directionalLight.shadow.camera.far = gui.far; //产生阴影的最远距离
    directionalLight.shadow.camera.left = -50; //产生阴影距离位置的最左边位置
    directionalLight.shadow.camera.right = 50; //最右边
    directionalLight.shadow.camera.top = 50; //最上边
    directionalLight.shadow.camera.bottom = -50; //最下面

    //这两个值决定生成阴影密度 默认512
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.mapSize.width = 1024;

    //告诉平行光需要开启阴影投射
    directionalLight.castShadow = true;

    createThree.scene.add(directionalLight);

    //添加灯光辅助
    debug = new THREE.CameraHelper(directionalLight.shadow.camera);
    debug.name = "debug";
    createThree.scene.add(debug);
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
