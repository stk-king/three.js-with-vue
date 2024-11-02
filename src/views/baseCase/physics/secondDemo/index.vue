<script setup>
import {onMounted, onUnmounted} from "vue";
import CreateThree from "@/utils/CreateThree";
import * as THREE from 'three'
import Ammo from '@/utils/ammo'

let physics, position ,createThree,camera,container;
let boxes,floor;

//physic
const gravityConstant = - 9.8;
let physicsWorld;
const rigidBodies = [];
let transformAux1;
let softBodyHelpers;
const meshMap = new WeakMap();

// 定义圆球和物理引擎相关的全局变量
let balls = []; // 保存圆球模型的数组

// 点击事件处理函数
function createSphere(position, velocity) {
    const ballGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
    ballMesh.position.copy(position);
    createThree.scene.add(ballMesh);

    const ballShape = new Ammo.btSphereShape(0.4);
    const ballTransform = new Ammo.btTransform();
    ballTransform.setIdentity();
    ballTransform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));
    const ballMotionState = new Ammo.btDefaultMotionState(ballTransform);
    const ballLocalInertia = new Ammo.btVector3(0,0, 0);
    ballShape.calculateLocalInertia(1, ballLocalInertia);
    const ballRbInfo = new Ammo.btRigidBodyConstructionInfo(1, ballMotionState, ballShape, ballLocalInertia);
    ballRbInfo.set_m_restitution(0.9);
    const ballBody = new Ammo.btRigidBody(ballRbInfo);
    physicsWorld.addRigidBody(ballBody);

    ballBody.setLinearVelocity(new Ammo.btVector3(velocity.x, velocity.y, velocity.z));
    ballBody.threeObject = ballMesh;
    rigidBodies.push(ballBody);
}

function onDocumentMouseDown(event) {
    event.preventDefault();
    const mouse = new THREE.Vector2();
    const rect = container.getBoundingClientRect();
    const containerWidth = rect.width;
    const containerHeight = rect.height;
    mouse.x = ( event.x - rect.left) / containerWidth * 2 - 1;
    mouse.y = - ( event.y - rect.top) / containerHeight * 2 + 1;


    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const direction = new THREE.Vector3();
    raycaster.ray.direction.normalize();
    direction.copy(raycaster.ray.direction);
    direction.multiplyScalar(13); // 调整这个值来改变初速度的大小
    createSphere(camera.position, direction);
}

onMounted( ()=>{
    try{
        Ammo().then(( AmmoLib )=>{
            // physics =AmmoPhysics();
            Ammo = AmmoLib;
            initPhysics()

            const position=new THREE.Vector3();
            container=document.querySelector('.container');
            camera = new THREE.PerspectiveCamera( 75, container.clientWidth / container.clientHeight, 0.1, 2000 );
            camera.position.set( 30, 30, 30 );
            camera.lookAt( 0, 0.5, 0 );

            createThree=new CreateThree(container,camera);
            createThree.createControls(null)

            initLight();
            initModel();
            initFloor();
            createFlyingCube()

            let obj=new Object();
            obj.tick=(e)=>{
                updatePhysics(e)
                let index = Math.floor( Math.random() * boxes.count );
                position.set( 0, Math.random()*6 + 1, 0 );
                setMeshPosition(boxes,position,index)
            }

            createThree.actionTick.push(obj)

            // 监听鼠标点击事件
            container.addEventListener('mousedown', onDocumentMouseDown, false);

            createThree.startRender()
        })
    }catch (e){
        location.reload()
    }
})
function createFlyingCube() {
    // 创建立方体几何体
    let cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
    let cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    let cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cubeMesh.position.set(6, 1, 0);
    createThree.scene.add(cubeMesh);

    // 创建立方体的物理形状
    let cubeShape = new Ammo.btBoxShape(new Ammo.btVector3(1.5, 1.5, 1.5));
    let cubeTransform = new Ammo.btTransform();
    cubeTransform.setIdentity();
    cubeTransform.setOrigin(new Ammo.btVector3(3, 1, 0));
    let cubeMotionState = new Ammo.btDefaultMotionState(cubeTransform);
    let cubeLocalInertia = new Ammo.btVector3(0, 0, 0);
    cubeShape.calculateLocalInertia(1, cubeLocalInertia);
    let cubeRbInfo = new Ammo.btRigidBodyConstructionInfo(1, cubeMotionState, cubeShape, cubeLocalInertia);
    cubeRbInfo.set_m_restitution(0.9);
    let cubeBody = new Ammo.btRigidBody(cubeRbInfo);
    physicsWorld.addRigidBody(cubeBody);

    // 给立方体一个初速度，使其呈抛物线运动
    let initialVelocity = new Ammo.btVector3(0,20, 0); // 修改速度值以实现更好的抛物线效果
    cubeBody.setLinearVelocity(initialVelocity);
    cubeBody.threeObject = cubeMesh;
    cubeBody.threeObject.isFly = true;

    // 将刚体保存起来，以便后续更新状态
    rigidBodies.push(cubeBody);
}

function setMeshPosition( mesh, position, index ) {
    if ( mesh.isInstancedMesh ) {
        const bodies = meshMap.get(mesh);
        const body = bodies[index];
        body.setAngularVelocity( new Ammo.btVector3( 0, 0, 0 ) );
        body.setLinearVelocity( new Ammo.btVector3( 0, 0, 0 ) );
        transformAux1.setIdentity();
        transformAux1.setOrigin( new Ammo.btVector3( position.x, position.y, position.z ) );
        body.setWorldTransform( transformAux1 );
    } else if ( mesh.isMesh ) {
        const body = meshMap.get( mesh );
        body.setAngularVelocity( new Ammo.btVector3( 0, 0, 0 ) );
        body.setLinearVelocity( new Ammo.btVector3( 0, 0, 0 ) );
        transformAux1.setIdentity();
        transformAux1.setOrigin( new Ammo.btVector3( position.x, position.y, position.z ) );
        body.setWorldTransform( transformAux1 );
    }
}
//创建灯光
function initLight(){
    const hemiLight = new THREE.HemisphereLight();
    const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
    dirLight.position.set( 5, 5, 5 );
    dirLight.castShadow = true;
    dirLight.shadow.camera.zoom = 2;

    createThree.scene.add(hemiLight,dirLight);
}

//初始化物理世界
function initPhysics() {
    const collisionConfiguration = new Ammo.btSoftBodyRigidBodyCollisionConfiguration();
    const dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
    const broadphase = new Ammo.btDbvtBroadphase();
    const solver = new Ammo.btSequentialImpulseConstraintSolver();
    const softBodySolver = new Ammo.btDefaultSoftBodySolver();
    physicsWorld = new Ammo.btSoftRigidDynamicsWorld( dispatcher, broadphase, solver, collisionConfiguration, softBodySolver );
    physicsWorld.setGravity( new Ammo.btVector3( 0, gravityConstant, 0 ) );
    physicsWorld.getWorldInfo().set_m_gravity( new Ammo.btVector3( 0, gravityConstant, 0 ) );

    transformAux1 = new Ammo.btTransform();
    softBodyHelpers = new Ammo.btSoftBodyHelpers();
}
function updatePhysics( deltaTime ) {
    const matrix = new THREE.Matrix4();
    physicsWorld.stepSimulation(1/60);
    // 更新 Three.js 场景中的盒子位置和旋转
    for (let i = 0; i < rigidBodies.length; i++) {
        const objThree = rigidBodies[i].threeObject;
        if (objThree) {
            const trans = rigidBodies[i].getWorldTransform();
            const origin = trans.getOrigin();
            const rotation = trans.getRotation();
            if (objThree.setMatrixAt){
                objThree.setMatrixAt(i, matrix.compose(
                    new THREE.Vector3(origin.x(), origin.y(), origin.z()),
                    new THREE.Quaternion(rotation.x(), rotation.y(), rotation.z(), rotation.w()),
                    new THREE.Vector3(1, 1, 1)
                ));
                objThree.instanceMatrix.needsUpdate = true;
            }else if (objThree.isFly) {
                setTimeout(()=>{
                    objThree.position.set(origin.x(), origin.y(), origin.z());
                    objThree.quaternion.set(rotation.x(), rotation.y(), rotation.z(), rotation.w());
                },1000)
            }else{
                objThree.position.set(origin.x(), origin.y(), origin.z());
            }
        }
    }
}

//创建地板
function initFloor(){
    const floor = new THREE.Mesh(
        new THREE.BoxGeometry( 40, 40 ,0.2),
        new THREE.MeshStandardMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            opacity: 0.4,
            transparent: false
        })
    );
    floor.rotation.x=-Math.PI/2
    floor.receiveShadow = true;
    floor.userData.physics = { mass: 0 };
    createThree.scene.add(floor)

    // 创建地面的物理形状
    let groundShape = new Ammo.btBoxShape(new Ammo.btVector3(20, 0.1, 20));
    let groundTransform = new Ammo.btTransform();
    groundTransform.setIdentity();
    groundTransform.setOrigin(new Ammo.btVector3(0, 0, 0));
    let groundMotionState = new Ammo.btDefaultMotionState(groundTransform);
    let groundRbInfo = new Ammo.btRigidBodyConstructionInfo(0, groundMotionState, groundShape, new Ammo.btVector3(0, 0, 0));
    let groundBody = new Ammo.btRigidBody(groundRbInfo);
    physicsWorld.addRigidBody(groundBody);
}

function initModel(){
    const material = new THREE.MeshLambertMaterial();
    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();
    const geometryBox = new THREE.BoxGeometry( 0.075, 0.075, 0.075 );
    boxes = new THREE.InstancedMesh( geometryBox, material, 200 );
    boxes.instanceMatrix.setUsage( THREE.DynamicDrawUsage );
    boxes.castShadow = true;
    boxes.receiveShadow = true;
    for ( let i = 0; i < boxes.count; i ++ ) {
        matrix.setPosition( Math.random() - 0.5, Math.random() * 20, Math.random() - 0.5 );
        boxes.setMatrixAt( i, matrix );
        boxes.setColorAt( i, color.setHex( 0xffffff * Math.random() ) );
    }
    createThree.scene.add(boxes);

    // 创建盒子的物理形状
    const boxShape = new Ammo.btBoxShape(new Ammo.btVector3(0.075 * 0.5, 0.075 * 0.5, 0.075 * 0.5));
    // 循环遍历每个盒子实例
    for (let i = 0; i < boxes.count; i++) {
        // 获取盒子的位置矩阵
        boxes.getMatrixAt(i, matrix);
        // 创建刚体的位置和旋转信息
        const position = new THREE.Vector3();
        matrix.decompose(position, new THREE.Quaternion(), new THREE.Vector3());
        // 设置刚体的初始变换
        const transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));
        // 计算盒子的局部惯性
        const localInertia = new Ammo.btVector3(0, 0, 0);
        boxShape.calculateLocalInertia(10, localInertia); // 10 是盒子的质量
        // 创建刚体的信息
        const motionState = new Ammo.btDefaultMotionState(transform);
        const rbInfo = new Ammo.btRigidBodyConstructionInfo(10, motionState, boxShape, localInertia);
        rbInfo.set_m_restitution(0.9);
        const boxBody = new Ammo.btRigidBody(rbInfo);
        // 将刚体添加到物理世界
        physicsWorld.addRigidBody(boxBody);
        // 关联刚体和 Three.js 的盒子实例
        boxBody.threeObject = boxes;
        // 将刚体保存起来，以便后续更新状态
        rigidBodies.push(boxBody);
    }
    meshMap.set(boxes, rigidBodies);
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
