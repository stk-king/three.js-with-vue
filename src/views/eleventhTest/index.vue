<script setup>
import * as THREE from 'three'
import {onUnmounted,onMounted} from "vue";
import CreateThree from "@/utils/CreateThree";
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'

let createThree,container,camera;

onMounted(()=>{
    container=document.querySelector('.container');
    const fov = 75;
    const aspect = 2;
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.z = 3;
    createThree=new CreateThree(container,camera);
    createThree.renderer.alpha=true;


    const controls = new OrbitControls( camera, container );
    controls.target.set( 0, 0, 0 );
    controls.update();
    createThree.createControls(controls);

    const color = 0xFFFFFF;
    const intensity = 3;
    const light = new THREE.DirectionalLight( color, intensity );
    light.position.set( - 10, 2, 4 );
    createThree.scene.add( light );


    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshStandardMaterial();

    const cube = new THREE.Mesh( geometry, createTexture() );
    createThree.scene.add( cube );
    cube.position.y = 0;


    create1()
    // create2()

    createThree.startRender();
})
// 第一种场景贴图的方法(正方体贴图)
function create1(){
    const loader=new THREE.CubeTextureLoader();
    const texture=loader.load([
        require('@/views/eleventhTest/assets/pos-x.jpg'),
        require('@/views/eleventhTest/assets/neg-x.jpg'),
        require('@/views/eleventhTest/assets/pos-y.jpg'),
        require('@/views/eleventhTest/assets/neg-y.jpg'),
        require('@/views/eleventhTest/assets/pos-z.jpg'),
        require('@/views/eleventhTest/assets/neg-z.jpg'),
    ])
    createThree.scene.background = texture;
}
//第二种方法
function create2(){
    const loader = new THREE.TextureLoader();
    const texture2 = loader.load(
        require('@/views/eleventhTest/assets/tears_of_steel_bridge_2k.jpg'),
        () => {
            texture2.mapping = THREE.EquirectangularReflectionMapping;
            texture2.colorSpace = THREE.SRGBColorSpace;
            createThree.scene.background = texture2;
        });
}


//为立方体贴图
function createTexture(){
    const loader = new THREE.TextureLoader();
    let cc=[]
    let maps=[
        require('@/views/eleventhTest/assets/pos-x.jpg'),
        require('@/views/eleventhTest/assets/neg-x.jpg'),
        require('@/views/eleventhTest/assets/pos-y.jpg'),
        require('@/views/eleventhTest/assets/neg-y.jpg'),
        require('@/views/eleventhTest/assets/pos-z.jpg'),
        require('@/views/eleventhTest/assets/neg-z.jpg'),
    ]

    maps.forEach(item=>{
        let texture = loader.load(item);
        let mes=new THREE.MeshBasicMaterial({
            map: texture,
            side:THREE.DoubleSide //内外都有360全景视角
        })
        cc.push(mes)
    })
    return cc
}

onUnmounted(()=>{
    createThree.destroy()
})
</script>
<template>
    <div class="container"></div>
</template>

<style scoped>

</style>
