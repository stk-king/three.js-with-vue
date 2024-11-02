<script setup>
import {onBeforeUnmount, onMounted} from 'vue'
import * as THREE from 'three'
import {GLTFLoader} from "three/addons";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {AnimationMixer,DirectionalLight} from "three";
import {RequestAnimation} from "@/views/secondTest/util/requestAnimation";
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const gui = new GUI();
const scene=new THREE.Scene()
const renderer = new THREE.WebGLRenderer({
    antialias:true,
});

onMounted(()=>{
    const canvas=document.querySelector('.container')
    const camera = new THREE.PerspectiveCamera(100, canvas.clientWidth / canvas.clientHeight, 1, 1300);
    camera.position.set(0, 10, 30);
    camera.lookAt(0, 0, 0);


    const dir1 = new THREE.Vector3(1, 0, 0).normalize();
    const origin = new THREE.Vector3(0, 0, 0);
    const arrowHelper1 = new THREE.ArrowHelper(dir1, origin, 20, 0xf50404);

    const dir2 = new THREE.Vector3(0, 1, 0).normalize();
    const arrowHelper2 = new THREE.ArrowHelper(dir2, origin, 20, 0x02ff73);

    const dir3 = new THREE.Vector3(0, 0, 1).normalize();
    const arrowHelper3 = new THREE.ArrowHelper(dir3, origin, 20, 0x0aa2f5);
    scene.add( arrowHelper1,arrowHelper2,arrowHelper3);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', function () {
        renderer.render(scene, camera);
    });

    const directionalLight = new DirectionalLight('#0aa2f5', 10);
    const light = new THREE.AmbientLight('white', 10);
    directionalLight.position.set(10, 10, 10);
    scene.add(light);
    const requestAnimation=new RequestAnimation(camera,scene,renderer)

    let mixer,robot,animations,index=0;

    // 创建GLTF加载器对象
    const loader=new GLTFLoader();
    const parrotData = loader.loadAsync('/assets/Tribal.gltf');//异步加载模型
    parrotData.then(res=>{
        robot=res.scene  //获取模型
        robot.position.set(0,0,0)
        robot.scale.set(5,5,5)
        animations=res.animations
        mixer = new AnimationMixer(res.scene);  //动画混合器是用于场景中特定对象的动画的播放器
        const clip = animations[9];
        const action = mixer.clipAction(clip);
        action.play();
        robot.tick=(delate)=>{
            mixer.update(delate)
        }
        requestAnimation.updatables=[]
        requestAnimation.updatables.push(robot)
        scene.add(robot)
    })
    function setAnimation(index){
        mixer.stopAllAction();
        const clip = animations[index]; //选取动画
        const action = mixer.clipAction(clip); //剪切动画
        action.play();  //让混合器激活动作
        robot.tick=(delate)=>{
            mixer.update(delate)
        }
        requestAnimation.updatables=[]
        requestAnimation.updatables.push(robot)
        console.log(requestAnimation.updatables)
    }
    for (let i=0;i<=11;i++){
        gui.add({ play: () => {
            setAnimation(i)
        }}, 'play').name(`动作${i}`);
    }


    renderer.setSize(canvas.clientWidth,canvas.clientHeight)
    renderer.physicallyCorrectLights = true; //物理照明
    renderer.render(scene, camera);
    canvas.appendChild(renderer.domElement)

    requestAnimation.start()

    gui.domElement.style.right = '0px';
    gui.domElement.style.top = '60px';
    gui.domElement.style.width = '300px';

})

onBeforeUnmount(()=>{
    gui.destroy();
    renderer.dispose()
})
</script>

<template>
    <div class="container"></div>
</template>

<style scoped>

</style>
