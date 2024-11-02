<script setup>

import * as THREE from 'three'
import {onBeforeUnmount, onMounted} from "vue";
import CreateThree from "@/utils/CreateThree";

let createThree,camera,container,light;

onMounted(()=>{
    container=document.querySelector('.container');
    camera=new THREE.PerspectiveCamera(45,container.clientWidth/container.clientHeight,0.1,100);
    camera.position.set(10,30,20);

    createThree=new CreateThree(container,camera);
    createThree.createControls(null)

    initLight();
    initModel();
    initGui()

    createThree.startRender();
})

function initModel(){
    const planeSize = 40;
    const loader=new THREE.TextureLoader();
    const texture=loader.load('/assets/texture/light/checker.png');
    texture.wrapR=THREE.RepeatWrapping;
    texture.wrapS=THREE.RepeatWrapping
    texture.wrapT=THREE.RepeatWrapping;
    texture.magFilter=THREE.NearestFilter;
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
    const mesh3= new THREE.Mesh( sphereGeo, sphereMat );
    mesh3.position.set( - sphereRadius - 1, sphereRadius + 2, 0 );

    createThree.scene.add( mesh,mesh2,mesh3);
}

function initLight(){
    const color = 0xFFFFFF;
    const intensity = 150;
    light = new THREE.SpotLight( color, intensity );
    light.position.set( 0, 10, 0 );
    light.target.position.set( - 5, 0, 0 );

    const helper = new THREE.SpotLightHelper( light );
    createThree.scene.add( helper,light,light.target);

    light.tick=()=>{
        light.target.updateMatrixWorld();
        helper.update();
    }

    createThree.actionTick.push(light)
}

function initGui(){
    const gui = createThree.createGui(true);
    gui.addColor(light, 'color' ).name( 'color' );
    gui.add( light, 'intensity', 0, 250, 1 );
    gui.add( light, 'distance', 0, 40 );
    gui.add( light, 'angle' , 0, 90 ).name( 'angle' );
    gui.add( light, 'penumbra', 0, 1, 0.01 );

    const folder = gui.addFolder( 'position' );
    folder.add( light.position, 'x', - 10, 10 );
    folder.add( light.position, 'y', 0, 10 );
    folder.add( light.position, 'z', - 10, 10 );
    folder.open();
    const folder2 = gui.addFolder( 'target' );
    folder2.add( light.target.position, 'x', - 10, 10 );
    folder2.add( light.target.position, 'y', 0, 10 );
    folder2.add( light.target.position, 'z', - 10, 10 );
    folder2.open();

}

onBeforeUnmount(()=>{
    createThree.destroy();
})
</script>

<template>
  <div class="container"></div>
</template>

<style scoped>

</style>
