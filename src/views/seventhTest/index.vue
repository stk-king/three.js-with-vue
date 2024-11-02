<script setup>
import {onBeforeUnmount, onMounted} from "vue";
import * as THREE from 'three'
import CreateThree4 from "@/views/seventhTest/util/CreateThree";
import {loadResourceByName} from "@/views/seventhTest/util/resource";

let camera,container,createThree,mixer,animations,modelParts=[];
let carControl={
    isMove:false,
    skinName:null,
    color:[0xffddcc,0xff0000,0xD3E6FF],
    perspective:false
}


onMounted(()=>{
    container=document.querySelector('.container');
    camera=new THREE.PerspectiveCamera(45,container.clientWidth/container.clientHeight,1,1000)
    camera.position.set(0,10,10)

    createThree=new CreateThree4(container,camera)
    // createThree.controls.target=v


    //添加灯光
    const light1=new THREE.AmbientLight(0xffffff)
    const light2=new THREE.DirectionalLight(0xffddcc,10)
    const light3=new THREE.DirectionalLight(0xffffff,4)
    light2.position.set(-100,-100,-100)
    light3.position.set(100,100,100)
    createThree.scene.add(light1,light2,light3)


    // 添加网格地面
    const gridHelper = new THREE.GridHelper(20, 20) // 创建一个网格帮助器，参数为网格的宽度和高度
    gridHelper.material.transparent = true // 开启网格帮助器的透明度
    gridHelper.material.opacity = 0.5 // 设置网格帮助器的透明度
    createThree.scene.add(gridHelper)

    createThree.loaderModel('/assets/XiaoMiSu7/mesh/sm_car.gltf').then(gltf=>{
        let robot=gltf.scene;
        robot.traverse(obj=>{
            modelParts.push(obj)
        })

        let wheelModel = modelParts[35]
        if (wheelModel && wheelModel.children) {
            wheelModel.tick=(e)=>{
                if (carControl.isMove) {
                    wheelModel.children.forEach(function (item) {
                        item.rotateZ(-1 * 0.03);
                        gridHelper.position.x += -1 * 0.03
                        if (gridHelper.position.x < -1) {
                            gridHelper.position.x = 0
                        }
                    });
                }
            }
        }
        //7.车牌，8前车玻璃，12车后视镜，13车后视镜皮肤，16车操作台，18车座位
        // let body=modelParts[22]
        // console.log(body)
        // // changSkin('du_ye_body',body)
        // body.position.set(0,0,3)
        mixer=createThree.loaderAnimation(gltf.scene)
        robot.tick=(e)=>{
            mixer.update(e)
        }
        createThree.actionTick.push(robot,wheelModel)
        createThree.scene.add(robot)
    })


    createThree.startRender()
})

//切换皮肤
function changSkin(color,skinName){
    let mesh=modelParts[3].children[0] //车整体外壳
    let mesh2=modelParts[2]  //后车灯盖
    let mesh3=modelParts[12].children[0]  //后视镜皮肤
    if (color){
        let material=new THREE.MeshPhysicalMaterial({
            color: color, //默认颜色
            metalness: 0.9,//车外壳金属度
            roughness: 0.5,//车外壳粗糙度
            envMapIntensity: 2.5, //环境贴图对Mesh表面影响程度
        })
        mesh.material = material
        mesh2.material = material
        mesh3.material = material
    }else{
        loadResourceByName(skinName).then(res=>{
            let texture=res
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            let material=new THREE.MeshStandardMaterial({
                map: texture,
            })
            mesh.material = material
            mesh2.material = material
            mesh3.material = material
        })
    }

}

//切换视角
function changePerspective(){
    carControl.perspective=!carControl.perspective
    let v;
    // let body=modelParts[22]
    if (carControl.perspective){
        camera.position.set(-0.7,1.1,0)
        camera.updateProjectionMatrix ()
        v= new THREE.Vector3(0,1.1,0)
        camera.lookAt(v)
    }else {
        camera.position.set(0,10,10)
        camera.updateProjectionMatrix ()
        v= new THREE.Vector3(0,0,0)
        camera.lookAt(v)
    }
    createThree.controls.target=v  //设置了轨道控制器一定要重新设置控制器的焦点
}

function itemToHexColor(item) {
    // 将颜色值转换为十六进制颜色字符串
    return `#${item.toString(16).padStart(6, '0')}`;
}


onBeforeUnmount(()=>{
    createThree.destroy()
})
</script>

<template>
    <div>
        <div class="container"></div>
        <div id="control">
            <div class="btn" @click="carControl.isMove=!carControl.isMove">启动汽车</div>
            <div class="line"></div>
            <div class="btn">切换皮肤</div>
            <div class="skin-box">
                <div class="img-box" v-for="item in 3" @click="changSkin(null,`skin${item}`)">
                    <img :src="`/assets/XiaoMiSu7/texture/skin${item}.jpg`">
                </div>
                <div class="img-box" v-for="item in carControl.color" @click="changSkin(item,null)">
                    <div class="color-box" :style="{ background: itemToHexColor(item) }"></div>
                </div>
            </div>
            <div class="line"></div>
            <div class="btn" @click="changePerspective">切换视角</div>
<!--            <div class="line"></div>-->
<!--            <div class="btn">切换视角</div>-->
        </div>
    </div>
</template>

<style scoped>
#control{
    position: fixed;
    top: 60px;
    right:0;
    background: rgba(0,0,0,0.5);
    width: 250px;
    color: white;
    padding: 5px;
    font-weight: bold;
    .btn{
        text-align: center;
        padding: 5px;
        cursor: pointer;
        background: #000000;
    }
    .line{
        height: 2px;
        background: white;
    }
    .skin-box{
        display: grid;
        grid-template-columns: repeat(3,1fr);
        gap: 5px;
        padding: 5px 0;
        .img-box{
            display: flex;
            justify-content: center;
            img{
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: 2px solid #fff;
            }
            .color-box{
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: 2px solid #fff;
            }
        }

    }
}
</style>
