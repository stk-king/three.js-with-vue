<script setup>
import {onBeforeUnmount, onMounted, render} from "vue";
import * as THREE from 'three'
import CreateThree from "@/utils/CreateThree";
import {useRouter} from "vue-router";


let createThree,container,camera,controls,light;

onMounted(()=>{
    container=document.querySelector('.container');

    camera = new THREE.PerspectiveCamera( 45, container.clientWidth / container.clientHeight, 2, 100 );
    camera.position.set( 0, 30, 40 );

    createThree=new CreateThree(container,camera);
    createThree.createControls(null)

    initLight();
    initMode();
    initTextureLoader();
    initGui()

    createThree.startRender();
})

//创建模型
function initMode(){
    const cubeSize = 4;
    const cubeGeo = new THREE.BoxGeometry( cubeSize, cubeSize, cubeSize );
    const cubeMat = new THREE.MeshPhongMaterial( { color: '#8AC' } );
    const mesh = new THREE.Mesh( cubeGeo, cubeMat );
    mesh.position.set( cubeSize + 1, cubeSize / 2, 0 );

    const sphereRadius = 3;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereGeometry( sphereRadius, sphereWidthDivisions, sphereHeightDivisions );
    const sphereMat = new THREE.MeshPhongMaterial( { color: '#CA8' } );
    const mesh2 = new THREE.Mesh( sphereGeo, sphereMat );
    mesh2.position.set( - sphereRadius - 1, sphereRadius + 2, 0 );

    createThree.scene.add( mesh,mesh2);
}

//创建平行光源
function initLight(){
    const dirLight = new THREE.DirectionalLight( 0xffffff, 0.15 );
    dirLight.position.set( 0, - 1, 0 ).normalize();
    dirLight.color.setHSL( 0.1, 0.7, 0.5 );

    const color = 0xFFFFFF;
    const intensity = 150;
    light = new THREE.PointLight( color, intensity );
    light.position.set( 0, 10, 0 );

    const helper = new THREE.PointLightHelper( light );
    helper.tick=()=>{
        helper.update()
    }
    createThree.actionTick.push(helper)

    createThree.scene.add( dirLight,light,helper);
}

//加载贴图
function initTextureLoader(){
    const planeSize = 40;

    const loader = new THREE.TextureLoader();
    const texture = loader.load( 'https://threejs.org/manual/examples/resources/images/checker.png' );
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
    });
    const mesh = new THREE.Mesh( planeGeo, planeMat );
    mesh.rotation.x = Math.PI * - .5;
    createThree.scene.add(mesh)
}

function initGui(){
    let vector3=light.position
    const gui=createThree.createGui(true);
    gui.addColor(light, 'color').onChange((e)=>{
        light.color.set(e);
    }).name('color');
    gui.add( light, 'intensity', 0, 250, 1 );
    gui.add( light, 'distance', 0, 40 );
    const folder = gui.addFolder('position');
    folder.add( vector3, 'x', - 10, 10 );
    folder.add( vector3, 'y', 0, 10 );
    folder.add( vector3, 'z', - 10, 10 );
    folder.open();
}
function onChangeFn(){}

onBeforeUnmount(()=>{
    createThree.destroy();
})
</script>

<template>
  <div class="container"></div>
</template>

<style scoped>

</style>
