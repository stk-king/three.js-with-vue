<script setup>
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Octree } from 'three/addons/math/Octree.js';
import { OctreeHelper } from 'three/addons/helpers/OctreeHelper.js';
import { Capsule } from 'three/addons/math/Capsule.js';
import {onMounted,onUnmounted} from "vue";
import CreateThree from "@/views/project/firstProject/util/CreateThree";
import CreateRobot from "@/views/project/firstProject/util/robot/CreateRobot";

let createThree,container,camera,helper,gui;
let sphereIdx = 0;
let worldOctree;
let playerOnFloor = false;  //是否在地面上
const keyStates = {};
const playerCollider = new Capsule( new THREE.Vector3( 0, 0.35, 0 ), new THREE.Vector3( 0, 1, 0 ), 0.35 ); //创建了一个胶囊体（Capsule）碰撞器，玩家碰撞器
const playerVelocity = new THREE.Vector3();  //玩家速度
const playerDirection = new THREE.Vector3();  //玩家方向
const GRAVITY = 60;  //重力
const NUM_SPHERES = 100;  //球数量
const SPHERE_RADIUS = 0.2;  //球半径
const STEPS_PER_FRAME = 5;  // 每帧步数
const spheres = [];
const vector1 = new THREE.Vector3();
const vector2 = new THREE.Vector3();
const vector3 = new THREE.Vector3();
let mouseTime = 0;
const loader = new GLTFLoader();


function initLight(){
    const fillLight1 = new THREE.HemisphereLight( 0x8dc1de, 0x00668d, 1.5 );
    fillLight1.position.set( 2, 1, 1 );

    const directionalLight = new THREE.DirectionalLight( 0xffffff, 2.5 );
    directionalLight.position.set( - 5, 25, - 1 );
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 0.01;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.right = 30;
    directionalLight.shadow.camera.left = - 30;
    directionalLight.shadow.camera.top	= 30;
    directionalLight.shadow.camera.bottom = - 30;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.radius = 4;
    directionalLight.shadow.bias = - 0.00006;

    createThree.scene.add( fillLight1,directionalLight);
}

function initModel(){
    const sphereGeometry = new THREE.IcosahedronGeometry( SPHERE_RADIUS, 5 );
    const sphereMaterial = new THREE.MeshLambertMaterial( { color: 0xdede8d } );

    for ( let i = 0; i < NUM_SPHERES; i ++ ) {
        const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
        sphere.castShadow = true;
        sphere.receiveShadow = true;
        createThree.scene.add( sphere );
        spheres.push( {
            mesh: sphere,
            collider: new THREE.Sphere( new THREE.Vector3( 0, - 100, 0 ), SPHERE_RADIUS ),
            velocity: new THREE.Vector3()
        });
    }
}

function init(){
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

    document.addEventListener( 'mouseup', () => {
        if ( document.pointerLockElement !== null ) throwBall(); //如果鼠标指针已经被锁定就发射球
    });

    document.body.addEventListener( 'mousemove', ( event ) => {
        //如果鼠标被锁定，移动鼠标就要改变相机方向，500相当于灵敏度
        if ( document.pointerLockElement === document.body ) {
            camera.rotation.y -= event.movementX / 500;
            camera.rotation.x -= event.movementY / 500;
        }
    });
}

//扔球
function throwBall() {
    const sphere = spheres[ sphereIdx ]; //sphereIdx被记录发射了多少个球，也就是第几个球将要发射出去
    camera.getWorldDirection( playerDirection );  //根据玩家坐标获取世界坐标
    //首先将球体碰撞器的中心位置设置为胶囊体碰撞器的终点位置（playerCollider.end）。
    //然后沿玩家方向（playerDirection）移动这个中心位置，移动距离为胶囊体碰撞器半径的1.5倍。
    sphere.collider.center.copy( playerCollider.end ).addScaledVector( playerDirection, playerCollider.radius * 1.5 );
    // 计算投掷的力度,也就是impulse的大小决定了球的初速度
    // 计算一个冲量（impulse），这个值会随着我们按住按钮的时间增加而增加
    // 使用指数衰减公式，使得按住按钮时间越长，冲量增加越快，但有一个上限
    const impulse = 15 + 30 * (1 - Math.exp((mouseTime - performance.now()) * 0.001));
    // 设置球体的初始速度为玩家方向的冲量
    sphere.velocity.copy(playerDirection).multiplyScalar(impulse);
    // 额外添加玩家当前速度的两倍，以使得球体继承玩家的速度
    sphere.velocity.addScaledVector(playerVelocity, 2);
    // 更新球的索引，指向下一个球体
    // 如果当前索引已到达数组末尾，则重置为0
    sphereIdx = (sphereIdx + 1) % spheres.length;
}

//玩家碰撞
function playerCollisions() {
    // capsuleIntersect 方法用于检测胶囊体碰撞器与 Octree 中的物体是否相交。这个方法返回一个相交结果，通常包括一些信息，例如相交点、相交深度等。
    const result = worldOctree.capsuleIntersect( playerCollider );
    // 初始化 playerOnFloor 为 false，表示玩家不在地面上
    playerOnFloor = false;
    if ( result ) {
        playerOnFloor = result.normal.y > 0;
        if ( ! playerOnFloor ) {
            // 计算速度在碰撞法线方向上的分量，并将其从玩家速度中减去
            // 这用于模拟碰撞反弹效果
            playerVelocity.addScaledVector( result.normal, - result.normal.dot( playerVelocity ) );
        }
        if ( result.depth >= 1e-10 ) {
            // 将胶囊体沿碰撞法线方向移动，使其脱离碰撞
            playerCollider.translate( result.normal.multiplyScalar( result.depth ));
        }
    }
}

//更新玩家
function updatePlayer( deltaTime ) {
    let damping = Math.exp( - 4 * deltaTime ) - 1;
    if ( ! playerOnFloor ) {
        playerVelocity.y -= GRAVITY * deltaTime;
        // 空气阻力小
        damping *= 0.1;
    }

    playerVelocity.addScaledVector( playerVelocity, damping );
    const deltaPosition = playerVelocity.clone().multiplyScalar( deltaTime );
    playerCollider.translate( deltaPosition );
    playerCollisions();
    camera.position.copy( playerCollider.end );
}

// 玩家球体碰撞
function playerSphereCollision( sphere ) {
    const center = vector1.addVectors( playerCollider.start, playerCollider.end ).multiplyScalar( 0.5 );
    const sphere_center = sphere.collider.center;
    const r = playerCollider.radius + sphere.collider.radius;
    const r2 = r * r;
    // 近似值：玩家 = 3 个球体
    for ( const point of [ playerCollider.start, playerCollider.end, center ] ) {
        const d2 = point.distanceToSquared( sphere_center );
        if ( d2 < r2 ) {
            const normal = vector1.subVectors( point, sphere_center ).normalize();
            const v1 = vector2.copy( normal ).multiplyScalar( normal.dot( playerVelocity ) );
            const v2 = vector3.copy( normal ).multiplyScalar( normal.dot( sphere.velocity ) );
            playerVelocity.add( v2 ).sub( v1 );
            sphere.velocity.add( v1 ).sub( v2 );
            const d = ( r - Math.sqrt( d2 ) ) / 2;
            sphere_center.addScaledVector( normal, - d );
        }
    }
}

//球体碰撞
function spheresCollisions() {
    for ( let i = 0, length = spheres.length; i < length; i ++ ) {
        const s1 = spheres[ i ];
        for ( let j = i + 1; j < length; j ++ ) {
            const s2 = spheres[ j ];
            const d2 = s1.collider.center.distanceToSquared( s2.collider.center );
            const r = s1.collider.radius + s2.collider.radius;
            const r2 = r * r;

            if ( d2 < r2 ) {
                const normal = vector1.subVectors( s1.collider.center, s2.collider.center ).normalize();
                const v1 = vector2.copy( normal ).multiplyScalar( normal.dot( s1.velocity ) );
                const v2 = vector3.copy( normal ).multiplyScalar( normal.dot( s2.velocity ) );

                s1.velocity.add( v2 ).sub( v1 );
                s2.velocity.add( v1 ).sub( v2 );

                const d = ( r - Math.sqrt( d2 ) ) / 2;

                s1.collider.center.addScaledVector( normal, d );
                s2.collider.center.addScaledVector( normal, - d );
            }
        }
    }
}

//更新球
function updateSpheres( deltaTime ) {
    spheres.forEach( sphere => {
        sphere.collider.center.addScaledVector( sphere.velocity, deltaTime );
        const result = worldOctree.sphereIntersect( sphere.collider );
        if ( result ) {
            sphere.velocity.addScaledVector( result.normal, - result.normal.dot( sphere.velocity ) * 1.5 );
            sphere.collider.center.add( result.normal.multiplyScalar( result.depth ) );
        } else {
            sphere.velocity.y -= GRAVITY * deltaTime;
        }

        const damping = Math.exp( - 1.5 * deltaTime ) - 1;
        sphere.velocity.addScaledVector( sphere.velocity, damping );

        playerSphereCollision( sphere );
    } );

    spheresCollisions();
    for ( const sphere of spheres ) {
        sphere.mesh.position.copy( sphere.collider.center );
    }
}

// 获取向前向量
function getForwardVector() {
    camera.getWorldDirection( playerDirection );
    playerDirection.y = 0;
    playerDirection.normalize();
    return playerDirection;
}

function getSideVector() {
    camera.getWorldDirection( playerDirection ); //获取相机的朝向（方向向量）
    playerDirection.y = 0;
    playerDirection.normalize();
    playerDirection.cross( camera.up );
    return playerDirection;
}

function controls( deltaTime ) {
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
            playerVelocity.y = 15;
        }
    }
}
function teleportPlayerIfOob() {
    if ( camera.position.y <= - 25 ) {
        playerCollider.start.set( 0, 0.35, 0 );
        playerCollider.end.set( 0, 1, 0 );
        playerCollider.radius = 0.35;
        camera.position.copy( playerCollider.end );
        camera.rotation.set( 0, 0, 0 );
    }
}

onMounted(()=>{
    container=document.querySelector('.container')
    camera = new THREE.PerspectiveCamera( 70, container.clientWidth/container.clientHeight, 0.1, 1000 );
    camera.rotation.order = 'YXZ';

    createThree=new CreateThree(container,camera);

    init()
    initModel()
    initLight()
    let obj=new Object();
    obj.tick=(deltaTime)=>{
        controls( deltaTime );
        updatePlayer( deltaTime );
        updateSpheres( deltaTime );
        teleportPlayerIfOob();
    }
    createThree.actionTick.push(obj)

    loader.load( '/assets/models/project/collision-world.glb', ( gltf ) => {
        createThree.scene.add(gltf.scene);
        worldOctree.fromGraphNode(gltf.scene); // 把gltf.scene添加到碰撞检测树里去
        gltf.scene.traverse(child => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material.map) {
                    child.material.map.anisotropy = 4;
                }
            }
        });
        helper = new OctreeHelper( worldOctree);
        helper.visible = false;
        createThree.scene.add( helper );
    })



    gui=createThree.createGui(true)
    gui.add( { debug: false }, 'debug' ).onChange( function ( value ) {
        helper.visible = value;
    });

    new CreateRobot(createThree,worldOctree);
    createThree.startRender()
})
onUnmounted(()=>{
    gui.destroy()
    createThree.destroy()
})
</script>

<template>
  <div class="container"></div>
</template>

<style scoped>

</style>
