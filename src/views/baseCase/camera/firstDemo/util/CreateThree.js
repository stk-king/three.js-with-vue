import * as THREE from 'three'
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {GLTFLoader} from "three/addons";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module'
import {AnimationMixer} from "three";
import {GUI} from "three/addons/libs/lil-gui.module.min.js";

let clock=new THREE.Clock();
export default class CreateThree{
    constructor(container,camera) {
        this.scene=new THREE.Scene();
        this.container=container;
        this.camera=camera;
        this.renderer=new THREE.WebGLRenderer({antialias:true});
        this.actionTick=[];
        this.gui=null;
        this.controls=null;
    }

    init(){
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth,this.container.clientHeight);
        this.renderer.render(this.scene,this.camera)

        this.axesHelper=new THREE.AxesHelper(500);
        this.scene.add(this.axesHelper);

        this.container.appendChild(this.renderer.domElement)

        window.addEventListener('resize',()=>{
            this.renderer.setSize(this.container.clientWidth,this.container.clientHeight);
            this.camera.aspect = this.container.clientWidth/this.container.clientHeight
            this.camera.updateProjectionMatrix();
        })
    }

    startRender(){
        this.init()
        this.renderer.setAnimationLoop(()=>{
            this.renderer.render(this.scene,this.camera)
            if (this.controls) this.controls.update();   //设置了轨道控制器一定要更新
            this.objectTick()
        })
    }

    objectTick(){
        let delate=clock.getDelta()
        for (const object of this.actionTick){
            object.tick(delate)
        }
    }

    createGui(e){
        if (e){
            this.gui=new GUI();
            this.gui.domElement.style.right = '0px';
            this.gui.domElement.style.top = '60px';
            this.gui.domElement.style.width = '300px';
            return this.gui;
        }
    }

    createControls(controls){
        if (!controls){
            this.controls=new OrbitControls(this.camera,this.renderer.domElement);
            this.controls.update()
            this.controls.enablePan = false
            this.controls.enableDamping = true // 启用阻尼
            this.controls.minPolarAngle = 0.5 // 最小绕y轴角度
            this.controls.maxPolarAngle = 1.35 // 最大绕y轴角度
            this.controls.zoomSpeed = 1 // 缩放速度
        }else {
            this.controls=controls
        }
    }
    destroy(){
        this.axesHelper.dispose()
        this.renderer.setAnimationLoop(null)
        this.renderer.dispose()
        if (this.controls) this.controls.dispose();
        if (this.gui) this.gui.destroy();
    }
}
