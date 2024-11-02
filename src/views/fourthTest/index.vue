<script setup>
import {onMounted, onBeforeUnmount} from 'vue'
import * as THREE from 'three'
import CheckIntersection from "@/views/fourthTest/util/checkIntersection";
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';
import CreateThree from "@/views/fourthTest/util/CreateThree";

const gui = new GUI();
let checkIntersection,createThree,canvas,camera;


onMounted(() => {
    canvas = document.querySelector('.container')
    camera = new THREE.PerspectiveCamera(100, canvas.clientWidth / canvas.clientHeight, 1, 1300);
    camera.position.set(200, 200, 200);
    camera.lookAt(0, 10, 0);

    createThree=new CreateThree(canvas,camera)

    const geometry = new THREE.BoxGeometry(100, 100, 100);
    const material = new THREE.MeshBasicMaterial({
        color: 0xff0000,//0xff0000设置材质颜色为红色
    });


    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 10, 0);
    createThree.scene.add(mesh);
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    createThree.scene.add(ambient);





    const num = 1000; //控制长方体模型数量
    const meshGroup = new THREE.Group();
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    for (let i = 0; i < num; i++) {
        const geometry = new THREE.BoxGeometry(5, 5, 5);
        const material = new THREE.MeshBasicMaterial({
            color: getRandomColor()
        });
        const mesh = new THREE.Mesh(geometry, material);
        // 随机生成长方体xyz坐标
        const x = (Math.random() - 0.5) * 200
        const y = (Math.random() - 0.5) * 200
        const z = (Math.random() - 0.5) * 200
        mesh.position.set(x, y, z)
        meshGroup.add(mesh)
    }
    createThree.scene.add(meshGroup); // 模型对象插入场景中


    gui.domElement.style.right = '0px';
    gui.domElement.style.top = '60px';
    gui.domElement.style.width = '300px';
    const ambientFolder = gui.addFolder('方块');
    const obj = {
        color: 0xff0000,
        specular: 0x111111,
    };
    ambientFolder.addFolder('材质').addColor(obj, 'color').onChange(function (value) {
        material.color.set(value);
    });

    const dirFolder2 = ambientFolder.addFolder('位置');
    dirFolder2.add(mesh.position, 'x', -400, 400);
    dirFolder2.add(mesh.position, 'y', -400, 400);
    dirFolder2.add(mesh.position, 'z', -400, 400);
    const isRotate = {
        bool: false
    }
    const dirFolder3 = ambientFolder.add(isRotate, 'bool').name('是否旋转')
    dirFolder3.onChange(function (value) {
        isRotate.bool = value
    });

    // 后期讲解
    checkIntersection=new CheckIntersection(createThree)
    window.addEventListener('pointerdown',()=>{
        createThree.mouseMove=false
    })

    window.addEventListener('pointerup',()=>{
        if (!createThree.mouseMove){
            if (checkIntersection.object){
                checkIntersection.object.material.color.set( 0x000000 );
            }
            console.log(checkIntersection.object)
        }
    })

    let object=new Object()
    object.tick=()=>{
        if (isRotate.bool) {
            let now = new Date().getTime() / 1000
            // var v1 = new THREE.Vector3(1,0,1)
            // meshGroup.rotateOnAxis(v1,0.1);
            meshGroup.rotation.x += 0.01;
            meshGroup.rotation.y += 0.01;
            mesh.rotation.z -= 0.01
            mesh.rotation.y -= 0.01
            // console.log(v1,now-old)
        }
    }

    createThree.actionTick.push(object)

    createThree.startRender();
})

onBeforeUnmount(() => {
    gui.destroy();
    checkIntersection.destroy()
})


</script>

<template>
    <div className="container"></div>
</template>

<style scoped>

</style>
