<script setup>
import * as THREE from 'three'
import {onMounted, onUnmounted} from "vue";
import CreateThree from "@/views/twelveTest/util/CreateThree";
import {GLTFLoader} from "three/addons";
import {Sky} from "three/addons/objects/Sky.js";
import {Vector3} from "three";
let createThree, camera, container,centerMesh;

onMounted( () => {
  container = document.querySelector('.container')
  camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 1, 1000);
  camera.position.set(0, 100, 0)
  createThree = new CreateThree(container, camera);

  createThree.createControls(null)

  addLight()
  loadModel().then(model=>{
    model.position.set(0,0,0)
    //旋转45°
    model.rotateY(Math.PI/4)
    model.scale.set(0.01,0.01,0.01)
    createThree.scene.add(model)
  })

  createThree.startRender();
})


//加载glb模型
const loadModel = () => {
  return new Promise((resolve, reject)=>{
    const loader = new GLTFLoader();
    loader.load(
        'assets/models/game/5v5_map.glb',
        function (gltf) {
          const model = gltf.scene;
          resolve(model)
        }
    );
  })
}

//添加灯光
const addLight = () => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  //直射光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(0, 100, 0)

  const sky = new Sky();
  sky.scale.setScalar( 450000 );

  const phi = THREE.MathUtils.degToRad( 90 );
  const theta = THREE.MathUtils.degToRad( 180 );
  const sunPosition =new Vector3().setFromSphericalCoords( 1, phi, theta );
  sky.material.uniforms.sunPosition.value = sunPosition;


  createThree.scene.add(ambientLight,directionalLight,sky);
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
