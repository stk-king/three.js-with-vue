import * as THREE from 'three'
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {GLTFLoader} from "three/addons";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module'
import {AnimationMixer} from "three";

let clock=new THREE.Clock();
export default class CreateThree4{
    constructor(container,camera) {
        this.scene=new THREE.Scene();
        this.container=container;
        this.camera=camera;
        this.renderer=new THREE.WebGLRenderer({antialias:true});
        this.actionTick=[];
        this.gltfLoader=new GLTFLoader();
        this.dracoLoader = new DRACOLoader(); //一个用于加载经过Draco压缩的图形库。
    }

    init(){
        this.scene.background=new THREE.Color( 0xf0f0f0 );
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth,this.container.clientHeight);
        this.renderer.render(this.scene,this.camera)

        this.controls=new OrbitControls(this.camera,this.renderer.domElement);
        // this.controls.update()
        // this.controls.enablePan = false
        // this.controls.enableDamping = true // 启用阻尼
        // this.controls.minPolarAngle = 0.5 // 最小绕y轴角度
        // this.controls.maxPolarAngle = 1.35 // 最大绕y轴角度
        // this.controls.zoomSpeed = 1 // 缩放速度
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
            this.controls.update();  //设置了轨道控制器一定要更新
            this.objectTick()
        })
    }

    objectTick(){
        let delate=clock.getDelta()
        for (const object of this.actionTick){
            object.tick(delate)
        }
    }


    loaderModel(url){
        this.gltfLoader.setMeshoptDecoder(MeshoptDecoder)
        return this.gltfLoader.loadAsync(url)
    }

    loaderAnimation(scene){
        this.mixer=new AnimationMixer(scene)
        // const action=this.mixer.clipAction(animation)
        // action.play()
        return this.mixer
    }

    destroy(){
        this.axesHelper.dispose()
        this.renderer.setAnimationLoop(null)
        this.renderer.dispose()
        this.controls.dispose()
    }
}
