<script setup>
import {onMounted, onUnmounted} from "vue";
import * as THREE from 'three'
import CreateThree from "@/views/baseCase/physics/thirdDemo/util/CreateThree";
import {Sky} from 'three/addons/objects/Sky.js';
import {MathUtils, Vector3} from "three";
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {Octree} from 'three/addons/math/Octree.js';
import {OctreeHelper} from "three/addons/helpers/OctreeHelper";
import {Capsule} from "three/addons/math/Capsule";

let createThree, container, camera, controls;
const obj = new Object({
    tick: () => {}
});
let worldOctree,helper,gui;
let playerOnFloor = true;  //是否在地面上
const playerVelocity = new THREE.Vector3();  //玩家速度
const playerDirection = new THREE.Vector3();  //玩家方向
const GRAVITY = 60;  //重力

let mouseTime = 0;
let keyStates={}
// 初始化玩家的碰撞体积
const R = 0.4;//胶囊半径
const H = 1.7;//胶囊总高度
const start = new THREE.Vector3(0, R, 0);//底部半球球心坐标
const end = new THREE.Vector3(0, H - R, 0);//顶部半球球心坐标
const playerCollider = new Capsule(start, end, R);
const capsuleHelper = CapsuleHelper(R, H);

const textureLoader = new THREE.TextureLoader();
const cameraGroup = new THREE.Group();


onMounted(() => {
    container = document.querySelector('.container')
    camera = new THREE.PerspectiveCamera( 70, container.clientWidth/container.clientHeight, 0.1, 1000 );
    camera.rotation.order = 'YXZ';
    camera.position.y=6
    camera.position.z=-4
    createThree = new CreateThree(container, camera);
    // createThree.createControls(null)

    let {mesh,light,sky}=creatWorld(createThree.scene,textureLoader);
    initListener();

    //创建可视化胶囊体
    createThree.scene.add(capsuleHelper);
    cameraGroup.add(camera);
    capsuleHelper.add(cameraGroup)
    createThree.startRender();

    const glbLoader = new GLTFLoader();
    glbLoader.load('/assets/models/baseCase/physics/world2.glb', (e) => {
        e.scene.add(mesh)
        console.log(e.scene)
        worldOctree.fromGraphNode(e.scene);
        helper = new OctreeHelper(worldOctree);
        helper.visible = false;
        createThree.scene.add(e.scene,light,sky,helper);
    })
    gui=createThree.createGui(true)
    gui.add( { debug: false }, 'debug' ).onChange( function ( value ) {
        helper.visible = value;
    });

    obj.tick = (e) => {
        updatePlayer( e );
        keyControls(e);
        console.log(capsuleHelper.position.y)
        if (capsuleHelper.position.y<-40){
            console.log("重置")
            capsuleHelper.position.set(0,R,0)
            const start = new THREE.Vector3(0, R, 0);//底部半球球心坐标
            const end = new THREE.Vector3(0, H - R, 0);//顶部半球球心坐标
            playerCollider.start=start
            playerCollider.end=end
        }
    }

    createThree.actionTick.push(obj)

})
//更新玩家
const updatePlayer=( deltaTime )=>{
    let damping = Math.exp( - 4 * deltaTime ) - 1;

    //更新碰撞体位置
    playerVelocity.addScaledVector( playerVelocity, damping );
    const deltaPosition = playerVelocity.clone().multiplyScalar( deltaTime );
    playerCollider.translate( deltaPosition );
    // 复制 playerCollider 的位置和尺寸，更新 可视化胶囊体
    const { start, end, radius } = playerCollider;
    capsuleHelper.position.set((start.x + end.x) / 2, start.y-0.4, (start.z + end.z) / 2);
    capsuleHelper.scale.set(radius, end.distanceTo(start) / 2, radius);
    camera.lookAt(capsuleHelper.position.x,capsuleHelper.position.y+1,capsuleHelper.position.z);



    if (!playerOnFloor){
        playerVelocity.y -= GRAVITY * deltaTime;
    }

    //更新相机位置


    playerCollisions();
}
//玩家碰撞
const playerCollisions=()=> {
    // capsuleIntersect 方法用于检测胶囊体碰撞器与 Octree 中的物体是否相交。这个方法返回一个相交结果，通常包括一些信息，例如相交点、相交深度等。
    const result = worldOctree.capsuleIntersect( playerCollider );
    // console.log(result.depth,result.normal)
    playerOnFloor = false;
    if ( result ) {
        playerOnFloor = true;
        playerVelocity.addScaledVector( result.normal, - result.normal.dot( playerVelocity ) );
        if ( result.depth >= 1e-10 ) {
            // 将胶囊体沿碰撞法线方向移动，使其脱离碰撞
            playerCollider.translate( result.normal.multiplyScalar( result.depth ));
        }
    }else {
        playerOnFloor = false;
    }
}

// 获取向前向量
const getForwardVector=()=>{
    camera.getWorldDirection( playerDirection );
    playerDirection.y = 0;
    playerDirection.normalize();
    return playerDirection;
}
const getSideVector=()=>{
    camera.getWorldDirection( playerDirection ); //获取相机的朝向（方向向量）
    playerDirection.y = 0;
    playerDirection.normalize();
    playerDirection.cross( camera.up );
    return playerDirection;
}

const keyControls=( deltaTime )=>{
    const speedDelta = deltaTime * ( playerOnFloor ? 25 : 8 );  //可设置玩家速度
    if ( keyStates[ 'KeyW' ] ) {
        playerVelocity.add( getForwardVector().multiplyScalar( speedDelta ) );
    }

    if ( keyStates[ 'KeyS' ] ) {
        playerVelocity.add( getForwardVector().multiplyScalar( - speedDelta ) );
    }

    if ( keyStates[ 'KeyA' ] ) {
        playerVelocity.add( getSideVector().multiplyScalar( - speedDelta ) );
    }

    if ( keyStates[ 'KeyD' ] ) {
        playerVelocity.add( getSideVector().multiplyScalar( speedDelta ) );
    }

    if ( playerOnFloor ) {
        if ( keyStates[ 'Space' ] ) {
            playerVelocity.y = 25;
            playerOnFloor=false
        }
    }
}
const initListener=()=>{
    worldOctree = new Octree();  //用于碰撞检测
    document.addEventListener( 'keydown', ( event ) => {
        keyStates[ event.code ] = true;
    });

    document.addEventListener( 'keyup', ( event ) => {
        keyStates[ event.code ] = false;
    });

    container.addEventListener( 'mousedown', () => {
        //用于请求将鼠标指针锁定到特定的元素上。在锁定后，鼠标指针将隐藏，并且鼠标移动事件将提供相对于锁定元素的移动数据，
        document.body.requestPointerLock();
        //是一个高精度计时方法，它返回自浏览器启动到调用该方法的时间，单位为毫秒。
        mouseTime = performance.now();
    });


    document.body.addEventListener( 'mousemove', ( event ) => {
        //如果鼠标被锁定，移动鼠标就要改变相机方向，500相当于灵敏度
        if ( document.pointerLockElement === document.body ) {
            camera.rotation.y -= event.movementX / 500;
            camera.rotation.x -= event.movementY / 500;
            capsuleHelper.rotation.y -= event.movementX/500


            const angleMin = THREE.MathUtils.degToRad(-45);//角度转弧度
            const angleMax = THREE.MathUtils.degToRad(45);
            cameraGroup.rotation.x += event.movementY / 600;
            // 一旦判断.rotation.x小于-15，就设置为-15，大于15，就设置为15
            if (cameraGroup.rotation.x < angleMin) {
                cameraGroup.rotation.x = angleMin;
            }
            if (cameraGroup.rotation.x > angleMax) {
                cameraGroup.rotation.x = angleMax
            }
        }
    });
}

const creatWorld=(scene,textureLoader)=>{
    const light = new THREE.AmbientLight(0xffffff);
    const light2 = new THREE.DirectionalLight(0xffffff);
    light2.position.set(100, 100, 0)

    const sky = new Sky();
    sky.scale.setScalar(450000);
    const phi = MathUtils.degToRad(90);
    const theta = MathUtils.degToRad(180);
    sky.material.uniforms.sunPosition.value = new Vector3().setFromSphericalCoords(1, phi, theta);

    const texture=textureLoader.load("https://threejs.org/manual/examples/resources/images/checker.png")
    texture.wrapS=THREE.RepeatWrapping
    texture.wrapT=THREE.RepeatWrapping
    texture.magFilter = THREE.NearestFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.repeat.set( 20, 20 );
    const material=new THREE.MeshBasicMaterial({
        map:texture,
        side:THREE.DoubleSide
    })
    const geometry=new THREE.BoxGeometry(40,40,0.1);
    const mesh=new THREE.Mesh(geometry,material)
    mesh.rotation.x=-Math.PI/2
    return {mesh,light,sky}
}
//创建胶囊体
function CapsuleHelper(R,H){
    const group = new THREE.Group();
    const material = new THREE.MeshLambertMaterial({
        color: 0xff0000,
    });
    // 底部半球
    const geometry = new THREE.SphereGeometry(R, 25, 25, 0, 2 * Math.PI, 0, Math.PI / 2);
    geometry.rotateX(Math.PI);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = R;
    group.add(mesh);
    // 顶部半球
    const geometry2 = new THREE.SphereGeometry(R, 25, 25, 0, 2 * Math.PI, 0, Math.PI / 2);
    const mesh2 = new THREE.Mesh(geometry2, material);
    mesh2.position.set(0, H - R, 0)
    group.add(mesh2)
    // 中间圆柱
    const h = H - 2 * R
    const geometry3 = new THREE.CylinderGeometry(R, R, h,32,1,true);
    geometry3.translate(0, h / 2+R,0)
    const mesh3 = new THREE.Mesh(geometry3, material);
    group.add(mesh3)
    return group;
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
