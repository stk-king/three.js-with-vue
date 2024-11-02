<script setup>
import {onBeforeUnmount, onMounted} from "vue";
import * as THREE from "three";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import {DecalGeometry} from "three/addons/geometries/DecalGeometry.js";
import {GUI} from "three/addons/libs/lil-gui.module.min.js";
import CreateThree3 from "@/views/fifthTest/util/CreateThree";

let  scene, camera,container,createThree;
let mesh;
let raycaster;
let line;

const intersection = {
    intersects: false,
    point: new THREE.Vector3(),
    normal: new THREE.Vector3()
};
const mouse = new THREE.Vector2();
const intersects = [];

const textureLoader = new THREE.TextureLoader();
const decalDiffuse = textureLoader.load( '/assets/LeePerrySmith/decal-diffuse.png' );
decalDiffuse.colorSpace = THREE.SRGBColorSpace;
const decalNormal = textureLoader.load( '/assets/LeePerrySmith/decal-normal.jpg' );

const decalMaterial = new THREE.MeshPhongMaterial( {
    specular: 0x444444,
    map: decalDiffuse,
    normalMap: decalNormal,
    normalScale: new THREE.Vector2( 1, 1 ),
    shininess: 30,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: - 4,
    wireframe: false
} );

const decals = [];
let mouseHelper;
const position = new THREE.Vector3();
const orientation = new THREE.Euler();
const size = new THREE.Vector3( 10, 10, 10 );

const params = {
    minScale: 10,
    maxScale: 20,
    rotate: true,
    clear: function () {
        removeDecals();
    }
};

const gui = new GUI();


onMounted(()=>{
    container=document.querySelector('.container')
    camera = new THREE.PerspectiveCamera( 45, container.clientWidth / container.clientHeight, 1, 1000 );
    camera.position.z = 120;
    createThree=new CreateThree3(container,camera);

    createThree.scene.add( new THREE.AmbientLight( 0x666666 ) );

    const dirLight1 = new THREE.DirectionalLight( 0xffddcc, 3 );
    dirLight1.position.set( 1, 0.75, 0.5 );
    createThree.scene.add( dirLight1 );

    const dirLight2 = new THREE.DirectionalLight( 0xccccff, 3 );
    dirLight2.position.set( - 1, 0.75, - 0.5 );
    createThree.scene.add( dirLight2 );


    const geometry=new THREE.BufferGeometry();
    geometry.setFromPoints([ new THREE.Vector3(), new THREE.Vector3() ] );
    line = new THREE.Line( geometry, new THREE.LineBasicMaterial() );
    createThree.scene.add( line );

    loadLeePerrySmith()  //加载模型
    raycaster = new THREE.Raycaster(); //（光线投射） 光线投射用于进行鼠标拾取（在三维空间中计算出鼠标移过了什么物体）。
    mouseHelper = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 10 ), new THREE.MeshNormalMaterial());
    mouseHelper.visible = true;
    createThree.scene.add(mouseHelper );

    window.addEventListener( 'pointerdown',  ()=> {
        createThree.moved = false;
    } );
    window.addEventListener( 'pointerup', (event)=>{
        if ( !createThree.moved) {
            checkIntersection( event.clientX, event.clientY );
            if ( intersection.intersects ) shoot();
        }
    } );
    window.addEventListener( 'pointermove', onPointerMove );

    function onPointerMove( event ) {
        if ( event.isPrimary ) {
            checkIntersection( event.clientX, event.clientY );
        }
    }
    //检查鼠标焦点
    function checkIntersection( x, y ) {
        if ( mesh === undefined ) return;
        const rect = container.getBoundingClientRect();
        const containerWidth = rect.width;
        const containerHeight = rect.height;
        mouse.x = ( x - rect.left) / containerWidth * 2 - 1;
        mouse.y = - ( y - rect.top) / containerHeight * 2 + 1;
        raycaster.setFromCamera( mouse, camera );
        //mesh为 检查与射线相交的物体。false对应值：若为true，则同时也会检查所有的后代。否则将只会检查对象本身。默认值为true。最后一个数值表示要赋值的数组：intersects
        /** 被赋值的intersects对应值的解释
         * distance —— 射线投射原点和相交部分之间的距离。
         * point —— 相交部分的点（世界坐标）
         * face —— 相交的面
         * faceIndex —— 相交的面的索引
         * object —— 相交的物体
         * uv —— 相交部分的点的UV坐标。
         * uv2 —— Second set of U,V coordinates at point of intersection
         * instanceId – The index number of the instance where the ray intersects the InstancedMesh
         */
        raycaster.intersectObject( mesh, false, intersects );
        if ( intersects.length > 0 ) {

            const p = intersects[0].point;  //一个Vector3对象
            mouseHelper.position.copy( p );
            intersection.point.copy( p );  //记录

            const n = intersects[ 0 ].face.normal.clone();  //一个Vector3对象
            //mesh.matrixWorld:物体的世界变换。若这个Object3D没有父级，则它将和local transform .matrix（局部变换矩阵）相同。
            n.transformDirection( mesh.matrixWorld );  //通过传入的矩阵（m的左上角3 x 3子矩阵）变换向量的方向， 并将结果进行normalizes（归一化）
            n.multiplyScalar( 10 );  //将该向量与所传入的标量10进行相乘。
            n.add( intersects[0].point );

            intersection.normal.copy( intersects[0].face.normal );
            mouseHelper.lookAt( n );  //使对象朝向目标

            const positions = line.geometry.attributes.position;  //获取对应几何体的位置坐标,是一个Float32BufferAttribute对象
            positions.setXYZ( 0, p.x, p.y, p.z );  //设置给定索引的矢量的第一、二、三维数据（设置 X、Y 和 Z 值）。
            positions.setXYZ( 1, n.x, n.y, n.z );
            positions.needsUpdate = true;  //该标志位指明当前 attribute 已经被修改过，且需要再次送入 GPU 处理。当开发者改变了该队列的值，则标志位需要设置为 true。

            intersection.intersects = true;  //标记是否用shoot()点击记录

            intersects.length = 0;  //清空

        } else {
            intersection.intersects = false;
        }
    }
    gui.domElement.style.right = '0px';
    gui.domElement.style.top = '60px';
    gui.domElement.style.width = '300px';
    gui.add( params, 'minScale', 1, 30 );
    gui.add( params, 'maxScale', 1, 30 );
    gui.add( params, 'rotate' );
    gui.add( params, 'clear' );
    gui.open();

    createThree.startRender()
})

onBeforeUnmount(()=>{
    gui.destroy()
    createThree.destroy()
})

function loadLeePerrySmith() {
    const map = textureLoader.load( '/assets/LeePerrySmith/Map-COL.jpg' );
    map.colorSpace = THREE.SRGBColorSpace;
    const specularMap = textureLoader.load( '/assets/LeePerrySmith/Map-SPEC.jpg' );
    const normalMap = textureLoader.load( '/assets/LeePerrySmith/Infinite-Level_02_Tangent_SmoothUV.jpg' );

    createThree.loaderModel('/assets/LeePerrySmith/LeePerrySmith.glb').then(gltf=>{
        mesh = gltf.scene.children[ 0 ];
        mesh.material = new THREE.MeshPhongMaterial( {
            specular: 0x111111,
            map: map,
            specularMap: specularMap,
            normalMap: normalMap,
            shininess: 25
        } );

        createThree.scene.add( mesh );
        mesh.scale.set( 10, 10, 10 );
    })
}

function shoot() {
    position.copy( intersection.point );
    orientation.copy( mouseHelper.rotation );

    if ( params.rotate ) orientation.z = Math.random() * 2 * Math.PI;

    const scale = params.minScale + Math.random() * ( params.maxScale - params.minScale );
    size.set( scale, scale, scale );

    const material = decalMaterial.clone();
    material.color.setHex( Math.random() * 0xffffff );

    const m = new THREE.Mesh( new DecalGeometry( mesh, position, orientation, size ), material );
    m.renderOrder = decals.length;

    decals.push( m );
    createThree.scene.add( m );
}

function removeDecals() {
    decals.forEach(d=>{
        createThree.scene.remove(d );
    });
    decals.length = 0;
}
</script>

<template>
    <div class="container"></div>
</template>

<style scoped>

</style>
