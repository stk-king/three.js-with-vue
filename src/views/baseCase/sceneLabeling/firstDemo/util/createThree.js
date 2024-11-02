import * as THREE from 'three'
import {GUI} from "three/addons/libs/lil-gui.module.min.js";
import {OrbitControls} from "three/addons/controls/OrbitControls";
export default class CreateThree{
    constructor(container,camera) {
        this.scene=new THREE.Scene();
        this.camera=camera;
        this.container=container;
        this.renderer=new THREE.WebGLRenderer({antialias:true});
        this.actionTick=[];
        this.controls=null;
        this.gui=null;
        this.controls=null;
        this.clock=new THREE.Clock();
    }

    init(){
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth,this.container.clientHeight);
        this.renderer.render(this.scene,this.camera);
        this.renderer.outputEncoding=THREE.SRGBColorSpace;

        this.axesHelper=new THREE.AxesHelper(500);
        this.scene.add(this.axesHelper);

        this.container.appendChild(this.renderer.domElement)

        window.addEventListener('resize',()=>{
            this.camera.aspect = this.container.clientWidth/this.container.clientHeight
            this.renderer.setSize(this.container.clientWidth,this.container.clientHeight);
            this.camera.updateProjectionMatrix();
        })
    }

    startRender(){
        this.init();
        this.renderer.setAnimationLoop(()=>{
            this.renderer.render(this.scene,this.camera);
            if (this.controls) this.controls.update();
            this.objectTick()
        })
    }

    objectTick(){
        let delta=this.clock.getDelta()
        for (const object of this.actionTick){
            object.tick(delta);
        }
    }

    createGui(isTrue){
        if (isTrue){
            this.gui=new GUI();
            this.gui.domElement.style.right='0px';
            this.gui.domElement.style.top = '60px';
            this.gui.domElement.style.width = '300px';
            return this.gui;
        }
    }

    createControls(controls){
        if (!controls){
            this.controls=new OrbitControls(this.camera,this.renderer.domElement);
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
        window.removeEventListener("resize", ()=>{})
    }
}
