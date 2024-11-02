<script setup>
import * as THREE from 'three'
import {onMounted, onUnmounted} from "vue";
import CreateThree from "@/views/baseCase/loader/firstDemo/util/CreateThree";
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import {Sky} from 'three/addons/objects/Sky.js';
import {MathUtils, Vector3} from "three";
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader';

let createThree, camera, container, objLoader;

onMounted(() => {
    container = document.querySelector('.container')
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 1, 100);
    camera.position.set(10, 10, 10)
    createThree = new CreateThree(container, camera);

    createThree.createControls(null)
    createThree.renderer.logarithmicDepthBuffer = true


    // create2()
    initLight()
    initModel()

    createThree.startRender()
})

function initLight() {
    const light = new THREE.AmbientLight(0xffffff, 1)
    const light2 = new THREE.DirectionalLight(0xffffff, 3)
    light2.position.set(-100, 100, -100)
    const light3 = light2.clone()
    light3.position.set(10, 10, 10)
    createThree.scene.add(light, light2)
}

function initModel() {
    const sky = new Sky()
    sky.scale.setScalar(450000);

    const phi = MathUtils.degToRad(90);
    const theta = MathUtils.degToRad(180);
    const sunPosition = new Vector3().setFromSphericalCoords(1, phi, theta);

    sky.material.uniforms.sunPosition.value = sunPosition;

    createThree.scene.add(sky);

    const loader = new THREE.TextureLoader();
    const texture2 = loader.load(
        require('@/views/project/thirdProject/util/water.jpg'),
        () => {
            texture2.mapping = THREE.EquirectangularReflectionMapping;
            texture2.colorSpace = THREE.SRGBColorSpace;
        });
    const material = new THREE.MeshBasicMaterial({
        map: texture2
    })
    const geometry = new THREE.PlaneGeometry(400, 600)
    const mesh = new THREE.Mesh(geometry, material)
    mesh.rotation.x = -Math.PI / 2
    createThree.scene.add(mesh)


    // objLoader = new OBJLoader();
    // const mtlLoader = new MTLLoader();
    // mtlLoader.load('/assets/OBJ1/CasteliaCity.mtl', (mtl) => {
    //     mtl.preload();
    //     objLoader.setMaterials(mtl);
    //     objLoader.load('/assets/OBJ1/CasteliaCity.obj', (root) => {
    //         console.log(root)
    //         root.castShadow = true
    //         // root.scene.traverse((child) => {
    //         //     if(child.isMesh) {
    //         //         child.material.emissive =  child.material.color;
    //         //         child.material.emissiveMap = child.material.map ;
    //         //     }
    //         // })
    //         root.scale.set(0.0001, 0.0001, 0.0001)
    //         createThree.scene.add(root);
    //     });
    // })

    // const dracoLoader = new DRACOLoader(); //
    // const gltfLoader = new GLTFLoader();
    // dracoLoader.setDecoderPath( '/assets/jsm/draco/' );
    // dracoLoader.preload(); //初始化_initDecoder 解码器
    // gltfLoader.setDRACOLoader(dracoLoader); //gltfloader使用dracoLoader
    // const url = '/assets/OBJ1/result.gltf';
    // gltfLoader.load(url, (gltf) => {
    //     const root = gltf.scene;
    //     console.log(gltf)
    //     root.scale.set(0.0001,0.0001,0.0001)
    //     createThree.scene.add(root);
    // });
}

function create2() {
    const loader = new THREE.TextureLoader();

    const texture2 = loader.load(
        require('@/views/project/thirdProject/util/water.jpg'),
        () => {
            texture2.mapping = THREE.EquirectangularReflectionMapping;
            texture2.colorSpace = THREE.SRGBColorSpace;
            createThree.scene.background = texture2;
        });
}

onUnmounted(() => {
    createThree.destroy()
})
</script>

<template>
    <div className="container"></div>
</template>

<style scoped>

</style>
