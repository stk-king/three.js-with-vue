<script setup>
import * as THREE from 'three'
import {onBeforeUnmount, onMounted} from "vue";
import initThree from "@/views/tenthTest/util";
import {DRACOLoader} from 'three/addons/loaders/DRACOLoader.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {CCDIKSolver,CCDIKHelper} from 'three/addons/animation/CCDIKSolver.js';
import {TransformControls} from "three/addons/controls/TransformControls.js";
import CheckIntersection from "@/utils/checkIntersection";

let createThree,container,camera,gui,cube,stats, conf,orbitControls,transformControls,mirrorSphereCamera,checkIntersection;
const OOI = {};
let IKSolver;

const v0 = new THREE.Vector3();

onMounted(()=>{
    container=document.querySelector('.container');
    camera = new THREE.PerspectiveCamera( 75, container.clientWidth / container.clientHeight, 1, 5000 );
    camera.position.set( -5,6,0);
    createThree=new initThree(container,camera);
    createThree.createControls(null);
    createThree.scene.fog = new THREE.FogExp2( 0xffffff, .17 );
    createThree.scene.background = new THREE.Color( 0xffffff );


    initLight()
    initModel()


    createThree.startRender()
})

//创建灯光
function initLight(){
    const ambientLight = new THREE.AmbientLight( 0xffffff, 8 );
    createThree.scene.add( ambientLight );
}

//加载模型
async function initModel(){
    conf = {
        followSphere: false,
        turnHead: true,
        ik_solver: true,
        update: updateIK
    };
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/assets/jsm/draco/');
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader( dracoLoader );

    const gltf = await gltfLoader.loadAsync( '/assets/models/tenthTest/kira.glb' );
    gltf.scene.traverse( n => {
        if ( n.name === 'head' ) OOI.head = n;
        if ( n.name === 'lowerarm_l' ) OOI.lowerarm_l = n;
        if ( n.name === 'Upperarm_l' ) OOI.Upperarm_l = n;
        if ( n.name === 'hand_l' ) OOI.hand_l = n;
        if ( n.name === 'target_hand_l' ) OOI.target_hand_l = n;

        if ( n.name === 'boule' ) OOI.sphere = n;
        if ( n.name === 'Kira_Shirt_left' ) OOI.kira = n;

    } );
    createThree.scene.add( gltf.scene );
    OOI.hand_l.attach( OOI.sphere );
    createMirror()
    initControls()
    // 精确检测物体
    // checkIntersection=new CheckIntersection(gltf.scene,camera,container)
    // window.addEventListener('pointerdown',()=>{
    //     if (checkIntersection.object){
    //         checkIntersection.object.material.color.set( 0x000000 );
    //     }
    //     console.log(checkIntersection.object)
    // })
    console.log(gltf.scene)
    let obj=new Object({
        tick:()=>{
            animate()
        }
    })
    createThree.actionTick.push(obj)
}
//创建镜面立方体相机
function createMirror(){
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 1024 );
    mirrorSphereCamera = new THREE.CubeCamera( 0.05, 50, cubeRenderTarget );

    const mirrorSphereMaterial = new THREE.MeshBasicMaterial( { envMap: cubeRenderTarget.texture } );
    OOI.sphere.material = mirrorSphereMaterial;

    OOI.kira.add( OOI.kira.skeleton.bones[ 0 ] );
    const iks = [
        {
            target: 22, // "target_hand_l"
            effector: 6, // "hand_l"
            links: [
                {
                    index: 5, // "lowerarm_l"
                    rotationMin: new THREE.Vector3( 1.2, - 1.8, - .4 ),
                    rotationMax: new THREE.Vector3( 1.7, - 1.1, .3 )
                },
                {
                    index: 4, // "Upperarm_l"
                    rotationMin: new THREE.Vector3( 0.1, - 0.7, - 1.8 ),
                    rotationMax: new THREE.Vector3( 1.1, 0, - 1.4 )
                },
            ],
        }
    ];
    IKSolver = new CCDIKSolver( OOI.kira, iks );
    const ccdikhelper = new CCDIKHelper( OOI.kira, iks, 0.01 );

    createThree.scene.add( mirrorSphereCamera,ccdikhelper);
}

//设置控制器参数
function initControls(){
    const targetPosition = OOI.sphere.position.clone();
    orbitControls = createThree.controls
    orbitControls.minDistance = 0.2;
    orbitControls.maxDistance = 1.5;
    orbitControls.enableDamping = true;
    orbitControls.target.copy( targetPosition );

    //在创建一个相机
    transformControls = new TransformControls( camera, createThree.renderer.domElement );
    transformControls.size = 0.75;
    transformControls.showX = false;
    transformControls.space = 'world';
    transformControls.attach( OOI.target_hand_l );
    createThree.scene.add( transformControls );

    transformControls.addEventListener( 'mouseDown', () => orbitControls.enabled = false );
    transformControls.addEventListener( 'mouseUp', () => orbitControls.enabled = true );

    //设置了控制器，这些代码必须写，否则会一直看向原点
    let v = new THREE.Vector3(2, 1.1044765132727201, 0)
    createThree.controls.target = v
    camera.lookAt(v)
}

function animate( ) {
    if ( OOI.sphere && mirrorSphereCamera ) {
        OOI.sphere.visible = false;
        OOI.sphere.getWorldPosition( mirrorSphereCamera.position );
        mirrorSphereCamera.update( createThree.renderer, createThree.scene );
        OOI.sphere.visible = true;
    }
    if ( OOI.sphere && conf.followSphere ) {
        OOI.sphere.getWorldPosition( v0 );
        orbitControls.target.lerp( v0, 0.1 );
    }

    if ( OOI.head && OOI.sphere && conf.turnHead ) {
        OOI.sphere.getWorldPosition( v0 );
        OOI.head.lookAt( v0 );
        OOI.head.rotation.set( OOI.head.rotation.x, OOI.head.rotation.y + Math.PI, OOI.head.rotation.z );
    }

    if ( conf.ik_solver ) {
        updateIK();
    }
    orbitControls.update();
    createThree.renderer.render( createThree.scene, createThree.camera );
}

function updateIK() {
    if ( IKSolver ) IKSolver.update();
    createThree.scene.traverse(( object )=>{
        if ( object.isSkinnedMesh ) object.computeBoundingSphere();
    } );

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
