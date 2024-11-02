import {Capsule} from "three/addons/math/Capsule";
import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {AnimationMixer} from "three";


const cameraPath = [];
export default class CreateRobot{
    constructor(createThree,worldOctree) {
        this.createThree=createThree;
        this.worldOctree=worldOctree;
        this.loader=new GLTFLoader();
        this.playerCollider = new Capsule( new THREE.Vector3( 0, 0.35, 0 ), new THREE.Vector3( 0, 1, 0 ), 0.35 ); //创建了一个胶囊体（Capsule）碰撞器，玩家碰撞器
        this.playerVelocity = new THREE.Vector3();  //玩家速度
        this.playerDirection = new THREE.Vector3(1,0,0);  //玩家方向
        this.GRAVITY = 60;  //重力
        this.playerOnFloor = false; //是否在地面上
        this.NUM_SPHERES = 100;  //球数量
        this.SPHERE_RADIUS = 0.2;  //球半径
        this.STEPS_PER_FRAME = 5;  // 每帧步数
        this.playerModel=null; //模型
        this.mixer=null; //动画
        this.animations=[]
        this.init()
    }

    init(){
        this.loadModel()
        let obj=new Object({
            tick:(e)=>{
                this.autoMove(e)
                this.updatePlayer(e)
            }
        })
        this.createThree.actionTick.push(obj)
    }

    async loadModel(){
        await this.loader.load( '/assets/Tribal.gltf', ( gltf ) => {
            this.animations=gltf.animations
            this.playerModel=gltf.scene
            this.playerModel.scale.set(0.5,0.5,0.5);
            this.playerModel.position.set(-4,-1.75,-3)
            this.createThree.scene.add(this.playerModel);
            // this.worldOctree.fromGraphNode(this.playerModel); // 把gltf.scene添加到碰撞检测树里去
            gltf.scene.traverse(child => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    if (child.material.map) {
                        child.material.map.anisotropy = 4;
                    }
                }
            });
            // 初始动画
            this.modelAnimation(9)
        })
    }

    modelAnimation(index){
        this.mixer=new AnimationMixer(this.playerModel)
        const clip=this.animations[index]
        const action=this.mixer.clipAction(clip);
        action.play()
        this.playerModel.tick=(e)=>{
            this.mixer.update(e)
        }

        this.createThree.actionTick.push(this.playerModel)
    }

    // 人物自动移动，并且通过const result = this.worldOctree.capsuleIntersect( this.playerCollider );检测出物体碰撞就反方向继续移动，人物的正面也随之改变
    autoMove(deltaTime) {
        if (this.playerModel) {
            const moveSpeed = 0.04; // 调整移动速度
            const moveStep = deltaTime * moveSpeed;

            // 获取物体到相机的方向向量
            // const directionToCamera = new THREE.Vector3();
            // this.playerModel.position.y=-1.75
            // directionToCamera.subVectors(this.createThree.camera.position, this.playerModel.position);
            // directionToCamera.normalize(); // 将方向向量归一化，确保移动速度一致
            //
            // // 将方向向量乘以移动速度得到移动距离
            // const moveDistance = directionToCamera.multiplyScalar(moveSpeed);
            //
            // // 将移动距离添加到物体当前位置
            // this.playerModel.position.add(moveDistance);


            this.playerCollider.start.copy(this.playerModel.position).add(new THREE.Vector3(0, 0.35, 0));
            this.playerCollider.end.copy(this.playerModel.position).add(new THREE.Vector3(0, 1, 0));


            const result = this.worldOctree.capsuleIntersect(this.playerCollider);

            const lookAtPosition = this.playerModel.position.clone().add(this.playerDirection);
            this.playerModel.lookAt(this.createThree.camera.position);
        }
    }

    playerCollisions() {
        // capsuleIntersect 方法用于检测胶囊体碰撞器与 Octree 中的物体是否相交。这个方法返回一个相交结果，通常包括一些信息，例如相交点、相交深度等。
        const result = this.worldOctree.capsuleIntersect( this.playerCollider );
        // 初始化 playerOnFloor 为 false，表示玩家不在地面上
        this.playerOnFloor = false;
        if ( result ) {
            this.playerOnFloor = result.normal.y > 0;
            if ( ! this.playerOnFloor ) {
                // 计算速度在碰撞法线方向上的分量，并将其从玩家速度中减去
                // 这用于模拟碰撞反弹效果
                this.playerVelocity.addScaledVector( result.normal, - result.normal.dot( this.playerVelocity ) );
            }
            if ( result.depth >= 1e-10 ) {
                // 将胶囊体沿碰撞法线方向移动，使其脱离碰撞
                this.playerCollider.translate( result.normal.multiplyScalar( result.depth ) );
            }
        }
    }
    updatePlayer( deltaTime ) {
        let damping = Math.exp( - 4 * deltaTime ) - 1;
        if ( ! this.playerOnFloor ) {
            this.playerVelocity.y -= this.GRAVITY * deltaTime;
            // 空气阻力小
            damping *= 0.1;
        }

        this.playerVelocity.addScaledVector( this.playerVelocity, damping );
        const deltaPosition = this.playerVelocity.clone().multiplyScalar( deltaTime );
        this.playerCollider.translate( deltaPosition );
        this.playerCollisions();
    }


}


