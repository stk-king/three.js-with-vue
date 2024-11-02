import * as THREE from 'three'
import {GUI} from "three/addons/libs/lil-gui.module.min";
import {OrbitControls} from "three/addons/controls/OrbitControls";

export default class InitThree{
    constructor(container,camera) {
        this.container=container;
        this.camera=camera;
        this.scene=new THREE.Scene();
        this.renderer=new THREE.WebGLRenderer({antialias:true});
        this.actionTick=[];
        this.gui=null;
        this.controls=null;
    }

    init(){
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth,this.container.clientHeight);
        this.renderer.render(this.scene,this.camera);

        this.axesHelper=new THREE.AxesHelper(500);
        this.scene.add(this.axesHelper);


        this.container.appendChild(this.renderer.domElement);

        window.addEventListener('resize', this.update)


    }

    update(){
        this.renderer.setSize(this.container.clientWidth,this.container.clientHeight);
        this.camera.aspect=this.container.clientWidth/this.container.clientHeight;
        this.camera.updateProjectionMatrix();
    }

    startRender(){
        this.init()
        this.renderer.setAnimationLoop(()=>{
            this.renderer.render(this.scene,this.camera);
            this.renderer.setScissorTest( true );
            this.objectTick()
        })
    }

    objectTick(){
        const delta=new THREE.Clock().getDelta()
        for (let obj of this.actionTick){
            obj.tick()
        }
    }

    createControls(control){
        if (!control){
            this.controls=new OrbitControls(this.camera,this.renderer.domElement);
            this.controls.update()
            this.controls.enablePan = false
            this.controls.enableDamping = true // 启用阻尼
            this.controls.minPolarAngle = 0.5 // 最小绕y轴角度
            this.controls.maxPolarAngle = 1.35 // 最大绕y轴角度
            this.controls.zoomSpeed = 1 // 缩放速度
        }else {
            this.controls=control
        }
    }
    createGui(isTrue){
        if (isTrue){
            this.gui=new GUI();
            this.gui.domElement.style.right = '0px';
            this.gui.domElement.style.top = '60px';
            this.gui.domElement.style.width = '300px';
            return this.gui;
        }
    }

    destroy(){
        window.removeEventListener('resize',this.update);
        this.axesHelper.dispose()
        if (this.gui) this.gui.destroy();
        if (this.controls) this.controls.dispose();
        this.renderer.setAnimationLoop(null);
        this.renderer.dispose();

    }
}
