<script setup>
import {onMounted, onUnmounted} from "vue";
import * as THREE from 'three'
import CreateThree from "@/utils/CreateThree";
import { Sky } from 'three/addons/objects/Sky.js';
import {MathUtils, Vector3} from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {PointerLockControls} from "three/addons/controls/PointerLockControls";
import { Octree } from 'three/addons/math/Octree.js';
import {OctreeHelper} from "three/addons/helpers/OctreeHelper";
import {Capsule} from "three/addons/math/Capsule";
import CheckIntersection from "@/utils/checkIntersection";

let createThree,container,camera,controls;
const obj=new Object({tick:()=>{}});
let objects=[];
let raycaster;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
let prevTime = performance.now();
let position;
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();
const worldOctree = new Octree();
let helper;
// 初始化玩家的碰撞体积
const playerCollider = new Capsule(
    new THREE.Vector3(0, 1, 0), // 玩家胶囊的底部
    new THREE.Vector3(0, 2, 0), // 玩家胶囊的顶部
    0.5 // 胶囊的半径
);
const textureLoader=new THREE.TextureLoader();


onMounted(()=>{
    container=document.querySelector('.container')
    camera=new THREE.PerspectiveCamera(45,container.clientWidth/container.clientHeight,1,5000);
    camera.position.y=10
    createThree=new CreateThree(container,camera);

    //创建控制器
    controls = new PointerLockControls( camera, container );
    container.addEventListener( 'click', function () {
        controls.lock();
    });
    createThree.scene.add( controls.getObject());
    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

    //监听键盘事件
    document.addEventListener( 'keydown', onKeyDown );
    document.addEventListener( 'keyup', onKeyUp );


    const light=new THREE.AmbientLight(0xffffff);
    const light2=new THREE.DirectionalLight(0xffffff);
    light2.position.set(100,100,0)
    createThree.scene.add(light)

    const sky = new Sky();
    sky.scale.setScalar( 450000 );
    const phi = MathUtils.degToRad( 90 );
    const theta = MathUtils.degToRad( 180 );
    const sunPosition = new Vector3().setFromSphericalCoords( 1, phi, theta );
    sky.material.uniforms.sunPosition.value = sunPosition;

    const glbLoader=new GLTFLoader();
    glbLoader.load('/assets/models/scene_collision.glb',(e)=>{
        e.scene.scale.set(5,5,5)
        worldOctree.fromGraphNode(e.scene.children[0].children[0].children[0]);
        helper = new OctreeHelper( worldOctree);
        e.scene.children[0].children[0].children[0].children.forEach(item=>{
            objects.push(item)
        })

        createThree.scene.add(e.scene);
        console.log(e.scene.children[0].children[0].children[0].children)

        stickers(e.scene)
    })


    createThree.scene.add(sky)

    obj.tick=()=>{
        animate();
    }

    createThree.actionTick.push(obj)
    createThree.startRender()
})

const animate = () => {
    const time = performance.now();
    if ( controls.isLocked === true ) {
        raycaster.ray.origin.copy( controls.getObject().position );
        raycaster.ray.origin.y -= 10;
        const intersections = raycaster.intersectObjects( objects, false );
        const onObject = intersections.length > 0;
        const delta = ( time - prevTime ) / 1000;
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        direction.z = Number( moveForward ) - Number( moveBackward );
        direction.x = Number( moveRight ) - Number( moveLeft );
        direction.normalize(); // 这确保了各个方向的一致运动
        if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
        if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;
        if ( onObject === true ) {
            velocity.y = Math.max( 0, velocity.y );
            canJump = true;
        }
        controls.moveRight( - velocity.x * delta );
        controls.moveForward( - velocity.z * delta );
        controls.getObject().position.y += ( velocity.y * delta ); // 新行为

        if ( controls.getObject().position.y < 10 ) {
            velocity.y = 0;
            controls.getObject().position.y = 10;
            canJump = true;
        }
    }
    prevTime = time;
};

const onKeyDown = ( event )=>{
    switch ( event.code ) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;
        case 'Space':
            if ( canJump === true ) velocity.y += 350;
            canJump = false;
            break;
    }
};

const onKeyUp = ( event )=>{
    switch ( event.code ) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;
    }
};

//给墙画贴图
const stickers=(scene)=>{
    for (let i=1;i<11;i++){
        textureLoader.loadAsync(require(`@/assets/image/image${i}.jpg`)).then(res=>{
            console.log(res)
            let texture=res
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            let material=new THREE.MeshBasicMaterial({
                map: texture,
                side:THREE.DoubleSide
            })
            let mesh=scene.getObjectByName(`gallery${i}_board`);
            mesh.material=material
        })

    }
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
