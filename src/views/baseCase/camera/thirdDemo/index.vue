<script setup>
import * as THREE from 'three';
import {onMounted,onUnmounted} from "vue";
import InitThree from "@/views/baseCase/camera/thirdDemo/util/initThree";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

let createThree,container,view1Elem,view2Elem,camera1,camera2,cameraHelper;

onMounted(()=>{
    container=document.querySelector('.container');
    view1Elem = document.querySelector( '#view1' );
    view2Elem = document.querySelector( '#view2' );
    //初始化相机
    initCamera()
    createThree=new InitThree(container,camera1);

    const controls = new OrbitControls( camera1, view1Elem );
    controls.target.set( 0, 5, 0 );
    controls.update();
    createThree.createControls(controls)

    createThree.scene.add(cameraHelper)
    iniLight();
    initModel();
    initGui()
    let obj=new Object();
    obj.tick=()=>{
        resizeRendererToDisplaySize()
        updateCamera1()
        updateCamera2()
    }
    createThree.actionTick.push(obj)

    createThree.startRender();
})

function initCamera(){
    const size = 1;
    const near = 5;
    const far = 50;
    camera1 = new THREE.OrthographicCamera( - size, size, size, - size, near, far );  //正交摄像机 OrthographicCamera
    camera1.zoom = 0.2;  //获取或者设置摄像机的缩放倍数，其默认值为1。
    camera1.position.set( 0, 10, 20 );
    cameraHelper = new THREE.CameraHelper( camera1 );

    camera2 = new THREE.PerspectiveCamera(
        60, // fov
        2, // aspect
        0.1, // near
        500, // far
    );
    camera2.position.set( 16, 28, 40 );
    camera2.lookAt( 0, 5, 0 );

    const controls2 = new OrbitControls( camera2, view2Elem );
    controls2.target.set( 0, 5, 0 );
    controls2.update();
}

function iniLight(){
    const color = 0xFFFFFF;
    const intensity = 3;
    const light = new THREE.DirectionalLight( color, intensity );
    light.position.set( 0, 10, 0 );
    light.target.position.set( - 5, 0, 0 );
    createThree.scene.add( light );
    createThree.scene.add( light.target );
}
function initGui(){
    const gui = createThree.createGui(true);
    gui.add( camera1, 'zoom', 0.01, 1, 0.01 ).listen();
    gui.add( camera1, 'near', 0.1, 50, 0.1 ).name( 'near' );
    gui.add( camera1, 'far', 0.1, 100, 0.1 ).name( 'far' );
}
function initModel(){
    const planeSize = 40;
    const loader = new THREE.TextureLoader();
    const texture = loader.load( '/assets/texture/light/checker.png' );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    const repeats = planeSize / 2;
    texture.repeat.set( repeats, repeats );

    const planeGeo = new THREE.PlaneGeometry( planeSize, planeSize );
    const planeMat = new THREE.MeshPhongMaterial( {
        map: texture,
        side: THREE.DoubleSide,
    } );
    const mesh = new THREE.Mesh( planeGeo, planeMat );
    mesh.rotation.x = Math.PI * - .5;

    const cubeSize = 4;
    const cubeGeo = new THREE.BoxGeometry( cubeSize, cubeSize, cubeSize );
    const cubeMat = new THREE.MeshPhongMaterial( { color: '#8AC' } );
    const mesh2 = new THREE.Mesh( cubeGeo, cubeMat );
    mesh2.position.set( cubeSize + 1, cubeSize / 2, 0 );

    const sphereRadius = 3;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereGeometry( sphereRadius, sphereWidthDivisions, sphereHeightDivisions );
    const sphereMat = new THREE.MeshPhongMaterial( { color: '#CA8' } );
    const mesh3 = new THREE.Mesh( sphereGeo, sphereMat );
    mesh3.position.set( - sphereRadius - 1, sphereRadius + 2, 0 );

    createThree.scene.add( mesh,mesh2,mesh3);
}
//正交相机
function updateCamera1(){
    const aspect = setScissorForElement( view1Elem );

    camera1.aspect = aspect;
    camera1.updateProjectionMatrix();
    cameraHelper.visible = false;
    createThree.scene.background=new THREE.Color(0xff0000);
    createThree.renderer.render( createThree.scene, camera1 );
}
// 透视相机
function updateCamera2(){
    const aspect = setScissorForElement( view2Elem );
    camera2.aspect = aspect;
    camera2.updateProjectionMatrix();
    cameraHelper.visible = true;
    createThree.scene.background=new THREE.Color( 0x000040 );
    createThree.renderer.render( createThree.scene, camera2 );
}
function setScissorForElement( elem ) {

    const canvasRect = container.getBoundingClientRect();
    const elemRect = elem.getBoundingClientRect();

    const right = Math.min( elemRect.right, canvasRect.right ) - canvasRect.left;
    const left = Math.max( 0, elemRect.left - canvasRect.left );
    const bottom = Math.min( elemRect.bottom, canvasRect.bottom ) - canvasRect.top;
    const top = Math.max( 0, elemRect.top - canvasRect.top );

    const width = Math.min( canvasRect.width, right - left );
    const height = Math.min( canvasRect.height, bottom - top );

    const positiveYUpBottom = canvasRect.height - bottom;
    createThree.renderer.setScissor( left, positiveYUpBottom, width, height );
    createThree.renderer.setViewport( left, positiveYUpBottom, width, height );

    return width / height;
}
function resizeRendererToDisplaySize( ) {
    let renderer=createThree.renderer
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if ( needResize ) {
        renderer.setSize( width, height, false );
    }
    return needResize;
}

onUnmounted(() => {
    createThree.destroy()
});

</script>

<template>
    <div style="position:relative;">
        <div class="container"></div>
        <div class="split">
            <div id="view1" tabindex="2"></div>
            <div id="view2" tabindex="2"></div>
        </div>
    </div>
</template>

<style scoped>
.split {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
}
.split>div {
    width: 100%;
    height: 100%;
}
</style>
