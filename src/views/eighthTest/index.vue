<script setup>
import * as THREE from 'three'
import {onBeforeUnmount, onMounted} from "vue";
import CreateThree8 from "@/views/eighthTest/util/CreateThree";
import CheckIntersection from "@/utils/checkIntersection";
import CSS2DDialog from "@/views/fifthTest/component/CSS2DDialog.vue";

let container,createThree;

onMounted(()=>{
    container=document.querySelector('.container');
    let camera=new THREE.PerspectiveCamera(45,container.clientWidth/container.clientHeight,1,500);
    camera.position.set(100,100,0)
    createThree=new CreateThree8(container,camera)

    //创建灯光
    const light1=new THREE.AmbientLight(0xffffff,0.8);
    const light2 = new THREE.DirectionalLight( 0xccccff, 8 );
    light2.position.set( 0, 100, 0 );
    createThree.scene.add(light1,light2)

    createThree.loaderModel('/assets/eight/carbon_pack.glb').then(res=>{
        let children=res.scene.children[0].children[0].children[0]

        children.rotateX(-Math.PI / 2);
        createThree.scene.add(children)

        createTag('tag','Object_69',8,false)
        createTag('tag2','Object_183',2,false)
        createTag('tag3','Object_169',10,false)
        createTag('tag4','Object_162',10,false)
        createTag('tag5','Object_227',16,false)

        let checkIntersection=new CheckIntersection(createThree.scene,createThree.camera,container)
        let isVisible=false
        window.addEventListener('pointerdown',()=>{
            if (checkIntersection.object){
                console.log(checkIntersection.object)
                // isVisible=!isVisible
                // if (checkIntersection.object.children.length>0){
                //     checkIntersection.object.children[0].visible =isVisible
                // }

                animateCamera(checkIntersection.object,createThree,2000)
            }
        })
    })


    createThree.startRender();
})

/**
 * 创建标注
 * @param elementName dom className
 * @param objectName  object3D name
 * @param position  Vector3()
 * @param isCss3  是否使用css3dRenderer渲染
 */
function createTag(elementName,objectName,position,isCss3){
    let div=document.getElementById(elementName);
    let tag3D;
    if (isCss3){
        tag3D=createThree.createCss3(div);
        tag3D.scale.set(0.1,0.1,0.1)
    }else{
        tag3D=createThree.createCss2(div);
    }
    // tag3D.visible =false
    let object3D=createThree.scene.getObjectByName(objectName)
    if (object3D) {
        if (position) {
            tag3D.position.set(object3D.position.x, object3D.position.y+position, object3D.position.z);
        } else if (object3D.position) {
            tag3D.position.copy(object3D.position); // 使用对象的位置
        } else {
            console.error('Position not provided and object3D does not have a position.');
            return;
        }

        if (object3D.add) {
            object3D.add(tag3D);
        } else {
            console.error('object3D does not have an add method.');
        }
    } else {
        console.error('object3D is undefined.');
    }
}

function animateCamera(target,createThree,duration) {
    let camera = createThree.camera;
    let controls = createThree.controls;
    const startPosition = camera.position.clone();

    console.log(startPosition)

    // 计算目标位置的世界坐标
    let targetPosition = new THREE.Vector3();
    target.getWorldPosition(targetPosition);

    console.log(targetPosition)


    // 计算目标模型的高度
    let box = new THREE.Box3().setFromObject(target);
    let height = box.max.y - box.min.y;

    let cameraPosition=new THREE.Vector3(targetPosition.x,height+20,targetPosition.z);
    if (targetPosition.x<0){
        cameraPosition.x-=30
    }else{
        cameraPosition.x+=30
    }
    if (targetPosition.z<0){
        cameraPosition.z-=30
    }else{
        cameraPosition.z+=30
    }

    let startTime = null;

    // 禁用控制器以防止干扰相机的手动操作
    if (controls) {
        controls.enabled = false;
    }

    function animate(time) {
        if (!startTime) startTime = time;
        const elapsed = time - startTime;
        const t = Math.min(elapsed / duration, 1);

        // 插值计算相机位置
        camera.position.lerpVectors(startPosition, cameraPosition , t);

        // 让相机始终看向目标位置
        camera.lookAt(0,height,0);

        // 更新投影矩阵
        camera.updateProjectionMatrix();

        if (t < 1) {
            requestAnimationFrame(animate);
        } else {
            // 动画结束后重新启用控制器
            if (controls) {
                controls.enabled = true;
            }
        }
    }

    requestAnimationFrame(animate);
}


onBeforeUnmount(()=>{
    createThree.destroy()
})
</script>

<template>
    <div>
        <div class="container"></div>
        <c-s-s2-d-dialog></c-s-s2-d-dialog>
        <c-s-s2-d-dialog :data="{id:'tag2',title:'公共厕所',isInhabitant:'',publishDate:''}"></c-s-s2-d-dialog>
        <c-s-s2-d-dialog :data="{id:'tag3',title:'办公楼A',isInhabitant:'',publishDate:''}"></c-s-s2-d-dialog>
        <c-s-s2-d-dialog :data="{id:'tag4',title:'办公楼B',isInhabitant:'',publishDate:''}"></c-s-s2-d-dialog>
        <c-s-s2-d-dialog :data="{id:'tag5',title:'中心大厦',isInhabitant:'',publishDate:''}"></c-s-s2-d-dialog>
    </div>
</template>

<style scoped>

</style>
