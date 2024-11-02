/**
 * 封装three.js代码，减小工程量
 */
import * as THREE from 'three'
import {GLTFLoader} from "three/addons";
import {AnimationMixer} from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

let clock=new THREE.Clock()
export default class CreateThree{
    constructor(container,camera) {
        this.scene=new THREE.Scene();
        this.container=container;
        this.renderer=new THREE.WebGLRenderer({
            antialias:true,
            preserveDrawingBuffer: true,  //是否保留缓直到手动清除或被覆盖。 默认false.
            alpha: true
        });
        this.camera=camera;
        this.actionTick=[]
    }

    //初始化
    init(){
        this.renderer.setSize(this.container.clientWidth,this.container.clientHeight);
        this.renderer.autoClearColor = false;
        this.renderer.render(this.scene,this.camera)
        //轨道控制器，可以使得相机围绕目标进行轨道运动。
        // this.controls=new OrbitControls(this.camera,this.renderer.domElement)
        // this.controls.addEventListener('change',()=>{
        //     this.renderer.render(this.scene,this.camera)
        // })

        //3维坐标
        this.axesHelper = new THREE.AxesHelper( 10);
        this.scene.add( this.axesHelper );

        this.container.appendChild(this.renderer.domElement)

        window.addEventListener('resize',()=>{
            this.renderer.setSize(this.container.clientWidth,this.container.clientHeight);
            this.camera.aspect = this.container.clientWidth/this.container.clientHeight
            this.camera.updateProjectionMatrix();
        });
    }

    //开始循环渲染
    startRender(){
        this.init()
        this.renderer.setAnimationLoop(()=>{
            this.objectTick()
            this.renderer.render(this.scene,this.camera)
        })
    }

    stopRender(){
        this.renderer.setAnimationLoop(null)
    }

    objectTick(){
        const delta=clock.getDelta()
        for (const object of this.actionTick){
            object.tick(delta)
        }
    }

    //销毁
    destroy(){
        this.renderer.dispose()
        if (this.controls) this.controls.dispose()
    }

}
