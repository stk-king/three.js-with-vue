import * as THREE from 'three'
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {GLTFLoader} from "three/addons";
import {AnimationMixer} from "three";
let clock=new THREE.Clock()
export default class CreateThree3{
    constructor(container,camera) {
        this.scene=new THREE.Scene()
        this.camera=camera
        this.container=container
        this.renderer=new THREE.WebGLRenderer({antialias:true});
        this.actionTick=[]
        this.moved=false
    }

    init(){
        this.scene.background = new THREE.Color( 0xf0f0f0 );

        this.renderer.setSize(this.container.clientWidth,this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.render(this.scene,this.camera)

        this.controls=new OrbitControls(this.camera,this.renderer.domElement);
        this.controls.minDistance = 50;
        this.controls.maxDistance = 200;
        this.controls.addEventListener('change',()=>{
            this.moved=true
        })

        this.axesHelper=new THREE.AxesHelper(1000)
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

    loaderModel(url){
        const loader=new GLTFLoader()
        return loader.loadAsync(url)
    }

    loaderAnimation(scene,animation){
        this.mixer=new AnimationMixer()
        const action=this.mixer.clipAction(animation)
        action.play()
        return this.mixer
    }

    destroy(){
        this.axesHelper.dispose()
        this.renderer.setAnimationLoop(null)
        this.renderer.dispose()
        this.controls.dispose()
    }
}
