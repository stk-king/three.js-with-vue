import * as THREE from 'three'
import {GUI} from "three/addons/libs/lil-gui.module.min.js";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
export default class initThree{
    constructor(container,camera) {
        this.container=container;
        this.camera=camera;
        this.renderer=new THREE.WebGLRenderer({antialias:true});
        this.scene=new THREE.Scene();
        this.gui=null;
        this.actionTick=[];
        this.controls=null;
    }

    init(){
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth,this.container.clientHeight);
        this.renderer.render(this.scene,this.camera);

        this.axesHelper=new THREE.AxesHelper(500);
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
            this.renderer.render(this.scene,this.camera);
            if (this.controls) this.controls.update();
            this.objectTick()
        })
    }

    objectTick(){
        let delta=new THREE.Clock().getDelta();
        for (let object of this.actionTick){
            object.tick(delta)
        }
    }
    createGui(isTrue){
        if (isTrue){
            this.gui=new GUI();
            this.gui.domElement.style.right = '0px';
            this.gui.domElement.style.top = '60px';
            this.gui.domElement.style.width = '300px';
            return this.gui
        }
    }

    createControls(controls){
        if (!controls){
            this.controls=new OrbitControls(this.camera,this.renderer.domElement);
            this.controls.update();
        }else {
            this.controls=controls
        }
    }

    destroy(){
        this.renderer.setAnimationLoop(null);
        this.renderer.dispose();
        if (this.gui) this.gui.destroy()
        if (this.controls) this.controls.dispose()
    }
}
