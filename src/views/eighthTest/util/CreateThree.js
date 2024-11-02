import * as THREE from 'three'
import {CSS2DObject, CSS2DRenderer, GLTFLoader} from "three/addons";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {MeshoptDecoder} from "three/addons/libs/meshopt_decoder.module";
import {AnimationMixer} from "three";
import {CSS3DRenderer , CSS3DObject} from "three/addons/renderers/CSS3DRenderer.js";
export default class CreateThree8{
    constructor(container,camera) {
        this.scene=new THREE.Scene()
        this.renderer=new THREE.WebGLRenderer({antialias:true});
        this.css2Renderer=new CSS2DRenderer();
        this.css3Renderer=new CSS3DRenderer();
        this.camera=camera;
        this.container=container;
        this.actionTick=[];
        this.clock=new THREE.Clock();
        this.gltfLoader=new GLTFLoader();
        this.dracoLoader=new DRACOLoader();  //一个用于加载经过Draco压缩的图形库。
    }

    init(){
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth,this.container.clientHeight);
        this.renderer.render(this.scene,this.camera);
        this.renderer.domElement.style.zIndex = -1;
        this.controls=new OrbitControls(this.camera,this.renderer.domElement);
        this.axesHelper=new THREE.AxesHelper(500);
        this.scene.add(this.axesHelper);
        this.container.appendChild(this.renderer.domElement);
        window.addEventListener('resize',()=>{
            this.renderer.setSize(this.container.clientWidth,this.container.clientHeight);
            this.camera.aspect=this.container.clientWidth/this.container.clientHeight;
            this.camera.updateProjectionMatrix();
        })
    }

    startRender(){
        this.init()
        this.renderer.setAnimationLoop(()=>{
            this.renderer.render(this.scene,this.camera);
            this.css2Renderer.render(this.scene,this.camera);
            this.css3Renderer.render(this.scene,this.camera);
            // this.controls.update();
            this.objectTick()
        })
    }

    objectTick(){
        let delate=this.clock.getDelta();
        for (const object of this.actionTick){
            object.tick(delate)
        }
    }


    loaderModel(url){
        this.gltfLoader.setMeshoptDecoder(MeshoptDecoder)
        return this.gltfLoader.loadAsync(url)
    }

    loaderAnimation(scene){
        return new AnimationMixer(scene)
    }

    createCss2(div){
        this.css2Renderer.setSize(this.container.clientWidth,this.container.clientHeight);
        this.css2Renderer.domElement.style.position = 'absolute';
        this.css2Renderer.domElement.style.top = '0px';
        this.css2Renderer.domElement.style.pointerEvents = 'none';
        this.container.appendChild(this.css2Renderer.domElement);
        return new CSS2DObject(div)
    }

    createCss3(div){
        this.css3Renderer.setSize(this.container.clientWidth,this.container.clientHeight);
        this.css3Renderer.domElement.style.position = 'absolute';
        this.css3Renderer.domElement.style.top = '0px';
        this.css3Renderer.domElement.style.pointerEvents = 'none';
        this.container.appendChild(this.css3Renderer.domElement);
        return new CSS3DObject(div)
    }

    destroy(){
        this.axesHelper.dispose()
        this.renderer.setAnimationLoop(null)
        this.renderer.dispose()
        this.controls.dispose()
    }
}
