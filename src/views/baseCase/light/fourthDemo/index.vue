<script setup>
import * as THREE from 'three';
import {onBeforeUnmount, onMounted} from "vue";
import CreateThree from "@/utils/CreateThree";
import {RectAreaLightHelper} from 'three/addons/helpers/RectAreaLightHelper.js'

let createThree,camera,container,light;

onMounted(()=>{
    container=document.querySelector('.container');
    camera=new THREE.PerspectiveCamera(45,container.clientWidth/container.clientHeight,1,100);
    camera.position.set( 0, 30, 20 );

    createThree=new CreateThree(container,camera);
    createThree.createControls(null)

    initLight();
    initModel();
    initGui();

    createThree.startRender();
})

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
    });

    const cubeSize = 4;
    const cubeGeo = new THREE.BoxGeometry( cubeSize, cubeSize, cubeSize );
    const cubeMat = new THREE.MeshStandardMaterial( { color: '#8AC' } );
    const mesh2 = new THREE.Mesh( cubeGeo, cubeMat );
    mesh2.position.set( cubeSize + 1, cubeSize / 2, 0 );

    const mesh=new THREE.Mesh(planeGeo,planeMat)
    mesh.rotation.x = Math.PI * - .5;

    const sphereRadius = 3;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereGeometry( sphereRadius, sphereWidthDivisions, sphereHeightDivisions );
    const sphereMat = new THREE.MeshStandardMaterial( { color: '#CA8' } );
    const mesh3 = new THREE.Mesh( sphereGeo, sphereMat );
    mesh3.position.set( - sphereRadius - 1, sphereRadius + 2, 0 );


    createThree.scene.add(mesh,mesh2,mesh3);
}

function initLight(){
    const color = 0xFFFFFF;
    const intensity = 5;
    const width = 12;
    const height = 4;
    light = new THREE.RectAreaLight( color, intensity, width, height );  //矩形区域光（RectAreaLight）
    light.position.set( 0, 10, 0 );
    light.rotation.x = THREE.MathUtils.degToRad( - 90 ); //将度转化为弧度。

    const helper = new RectAreaLightHelper( light );
    light.add( helper );

    createThree.scene.add( light );
}

function initGui(){
    const gui = createThree.createGui(true);
    gui.addColor(light, 'color').name( 'color' );
    gui.add( light, 'intensity', 0, 10, 0.01 );
    gui.add( light, 'width', 0, 20 );
    gui.add( light, 'height', 0, 20 );
    gui.add(light.rotation, 'x', - 180, 180 ).name( 'x rotation' );
    gui.add(light.rotation, 'y', - 180, 180 ).name( 'y rotation' );
    gui.add(light.rotation, 'z', - 180, 180 ).name( 'z rotation' );
    const folder = gui.addFolder( 'position' );
    folder.add( light.position, 'x', - 10, 10 );
    folder.add( light.position, 'y', 0, 10 );
    folder.add( light.position, 'z', - 10, 10 );
    folder.open();
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
