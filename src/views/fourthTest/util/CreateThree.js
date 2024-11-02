import * as THREE from 'three'
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
let clock=new THREE.Clock()
export default class CreateThree2{
    constructor(container,camera) {
        this.scene=new THREE.Scene()
        this.camera=camera
        this.container=container
        this.renderer=new THREE.WebGLRenderer({antialias:true});
        this.actionTick=[];
        this.mouseMove=false;  //添加中间变量，防止触发控制器的同时触发点击事件
    }

    init(){
        this.renderer.setSize(this.container.clientWidth,this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.render(this.scene,this.camera)

        this.controls=new OrbitControls(this.camera,this.renderer.domElement);
        this.controls.addEventListener('change',()=>{
            this.mouseMove=true
            this.renderer.render(this.scene,this.camera)
        })

        this.axesHelper=new THREE.AxesHelper(500)
        this.scene.add(this.axesHelper)

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
            this.objectTick()
        })
    }

    objectTick(){
        let delta=clock.getDelta()
        for (const object of this.actionTick){
            object.tick(delta)
        }
    }

    destroy(){
        this.renderer.setAnimationLoop(null)
        this.renderer.dispose()
        if (this.axesHelper) this.axesHelper.dispose()
        this.controls.dispose()
    }
}
