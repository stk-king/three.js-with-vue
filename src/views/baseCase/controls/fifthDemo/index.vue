<script setup>
import * as THREE from 'three'
import {onMounted, onUnmounted} from "vue";
import CreateThree from "@/views/baseCase/controls/firstDemo/util/CreateThree";
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

let createThree, camera, container,controls;

const objects = [];
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



onMounted( () => {
    container = document.querySelector('.container')
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 1, 1000);
    camera.position.y = 10;

    createThree=new CreateThree(container,camera);
    createThree.scene.fog=new THREE.Fog(0xffffff,0,750);

    //创建灯光
    const light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 2.5 );
    light.position.set( 0.5, 1, 0.75 );
    createThree.scene.add( light );

    //创建控制器
    controls = new PointerLockControls( camera, container );
    container.addEventListener( 'click', function () {
        controls.lock();
    });
    createThree.scene.add( controls.getObject());

    //监听键盘事件
    document.addEventListener( 'keydown', onKeyDown );
    document.addEventListener( 'keyup', onKeyUp );

    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

    //创建地板
    initFloor();
    //创建物体
    initModel();

    let obj=new Object()
    obj.tick=()=>{
        animate()
    }
    createThree.actionTick.push(obj)
    createThree.startRender();
})
//创建正方体
const initModel=()=>{
    const boxGeometry = new THREE.BoxGeometry( 20, 20, 20 ).toNonIndexed();
    position = boxGeometry.attributes.position;
    const colorsBox = [];
    for ( let i = 0, l = position.count; i < l; i ++ ) {
        color.setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75, THREE.SRGBColorSpace );
        colorsBox.push( color.r, color.g, color.b );
    }
    boxGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colorsBox, 3 ) );
    for ( let i = 0; i < 500; i ++ ) {
        const boxMaterial = new THREE.MeshPhongMaterial( { specular: 0xffffff, flatShading: true, vertexColors: true } );
        boxMaterial.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75, THREE.SRGBColorSpace );
        const box = new THREE.Mesh( boxGeometry, boxMaterial );
        box.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
        box.position.y = Math.floor( Math.random() * 20 ) * 20 + 10;
        box.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;
        createThree.scene.add( box );
        objects.push( box );
    }
}
//创建地板
const initFloor=()=>{
    let floorGeometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
    floorGeometry.rotateX( - Math.PI / 2 );
    position = floorGeometry.attributes.position;
    for ( let i = 0, l = position.count; i < l; i ++ ) {
        vertex.fromBufferAttribute( position, i );
        vertex.x += Math.random() * 20 - 10;
        vertex.y += Math.random() * 2;
        vertex.z += Math.random() * 20 - 10;
        position.setXYZ( i, vertex.x, vertex.y, vertex.z );
    }
    floorGeometry = floorGeometry.toNonIndexed(); //确保每个面都有唯一的顶点
    position = floorGeometry.attributes.position;
    const colorsFloor = [];
    for ( let i = 0, l = position.count; i < l; i ++ ) {
        color.setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75, THREE.SRGBColorSpace );
        colorsFloor.push( color.r, color.g, color.b );
    }
    floorGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colorsFloor, 3 ) );
    const floorMaterial = new THREE.MeshBasicMaterial( { vertexColors: true } );
    const floor = new THREE.Mesh( floorGeometry, floorMaterial );
    createThree.scene.add( floor );
}

const animate=()=> {
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
}
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
onUnmounted(() => {
    createThree.destroy()
})
</script>

<template>
    <div class="container"></div>
</template>

<style scoped>

</style>
