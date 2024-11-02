<script setup>
import {onMounted} from "vue";
import * as THREE from 'three'
import CreateThree from "@/views/baseCase/sceneLabeling/firstDemo/util/createThree";
import {OBJLoader} from "three/addons/loaders/OBJLoader.js";
import {houseUrls} from "../../../../../public/assets/models/baseCase/sceneLabeling/modelUrls";
import {MTLLoader} from "three/addons/loaders/MTLLoader.js";
import {Group, MathUtils, Vector3} from "three";
import {Sky} from "three/addons/objects/Sky.js";
import {CSS2DObject, CSS2DRenderer} from "three/addons";


let createTree,container,camera;
const css2Renderer = new CSS2DRenderer();
let obj=new Object({tick:()=>{}})


onMounted(()=>{
    container=document.querySelector('.container')
    camera=new THREE.PerspectiveCamera(75,container.clientWidth/container.clientHeight,1,1000);
    camera.position.set(10,10,10)

    createTree=new CreateThree(container,camera);
    createTree.renderer.domElement.style.zIndex = -1;
    createTree.createControls(null);

    //创建渲染器
    css2Renderer.setSize(container.clientWidth,container.clientHeight);
    css2Renderer.domElement.style.position = 'absolute';
    css2Renderer.domElement.style.top = '0px';
    css2Renderer.domElement.style.pointerEvents = 'none';
    container.appendChild(css2Renderer.domElement);

    initLight();
    //加载模型并创建标签
    loadModel().then(()=>{
        obj.tick=(e)=>{
            css2Renderer.render(createTree.scene,camera);
        }
        createTree.actionTick.push(obj)
    });
    initWorld();

    createTree.startRender();
})

//创建灯光
function initLight(){
    const light1=new THREE.AmbientLight(0xffffff);
    const light2=new THREE.DirectionalLight(0xffffff,2);
    const light3=new THREE.DirectionalLight(0xffffff,3);
    const pointLight = new THREE.PointLight(0xffffff, 1); // 点光源
    pointLight.position.set(50, 50, 50); // 设置点光源位置
    light1.position.set( -10, -10, -10 );
    light2.position.set( -10, 10, 10 );
    light3.position.set( 10, 10, 10 );
    // light2.target.position.set( - 5, 0, 0 );
    createTree.scene.add(light1,light2,light3,pointLight)
}
//初始化世界场景
function initWorld(){
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
    const mesh = new THREE.Mesh( planeGeo, planeMat );
    mesh.rotation.x = Math.PI * - .5;
    mesh.position.y=-0.1

    const sky = new Sky();
    sky.scale.setScalar(45);
    const phi=MathUtils.degToRad(90);
    const theta=MathUtils.degToRad(180);
    const sunPosition=new Vector3().setFromSphericalCoords(1,phi,theta);
    sky.material.uniforms.sunPosition.value=sunPosition;

    createTree.scene.add(mesh,sky)
}
//导入模型
async function loadModel() {
    const loader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    const group = new Group();
    let i=0

    for (const item of houseUrls) {
        await new Promise((resolve, reject) => {
            mtlLoader.load(`/assets/models/baseCase/sceneLabeling/HouseObj/${item.url}.mtl`, (mtl) => {
                mtl.preload();
                mtl.materials.side = THREE.DoubleSide;
                loader.setMaterials(mtl);

                loader.load(`/assets/models/baseCase/sceneLabeling/HouseObj/${item.url}.obj`, (model) => {
                    i++;
                    // 模型自发光
                    const material = model.children[0].material;
                    material.emissive = material.color;
                    material.emissiveMap = material.map;
                    material.emissiveIntensity = 3;
                    model.name = 'house' + i;
                    model.position.set(item.position.x, item.position.y, item.position.z);
                    initCssRender(model);

                    group.add(model);
                    console.log(model)
                    resolve();
                }, undefined, (error) => {
                    reject(error);
                });
            }, undefined, (error) => {
                reject(error);
            });
        });
    }
    createTree.scene.add(group);
}

//创建Css2D标签
function initCssRender(model){
    const div = document.getElementById('tag');
    div.style.display = 'block';
    // HTML元素转化为threejs的CSS2模型对象
    const tag = new CSS2DObject(div);
    let {height,width}=measureUtil(model)
    tag.position.set(model.position.x,model.position.y+height+5,model.position.z);
    tag.name='标签'+model.name
    model.add(tag);
}

//测量工具
function measureUtil(model){
     // 计算模型的包围盒
    const boundingBox = new THREE.Box3().setFromObject(model);
    // 获取包围盒的尺寸（即模型的高度）
    const height = boundingBox.max.y - boundingBox.min.y;
    const width = boundingBox.max.x - boundingBox.min.x;
    return {height,width}
}
</script>

<template>
    <div style="position:relative;">
        <div class="container"></div>
        <div id="tag"></div>
    </div>
</template>

<style scoped>
#tag{
    position: absolute;
    width: 80px;
    height: 30px;
    border-radius: 10px;
    background: #fff;
    border: 3px solid #fd0000;
    display: none;
    z-index: 100;
}
</style>
