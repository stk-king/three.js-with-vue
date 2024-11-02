<script setup>
import * as THREE from 'three';
import {onMounted} from 'vue'
import {FlyControls} from 'three/addons/controls/FlyControls.js'
import CreateThree from "@/views/baseCase/controls/fourthDemo/util/CreateThree";
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';

let createThree,container,camera,meshSun,meshPlanet,meshClouds,meshMoon,meshVenus,meshSaturn,controls,orbit;
const MARGIN = 0;
const radius = 6371;
const tilt = 0.41;
const moonScale=2;
const distance=50000;
let d, dPlanet, dMoon,composer;
const dMoonVec = new THREE.Vector3();
const rotationSpeed = 0.5;



const clock = new THREE.Clock();

onMounted(()=>{
    container=document.querySelector('.container');
    camera = new THREE.PerspectiveCamera( 25, container.clientWidth/container.clientHeight, 50, 1e7 );
    camera.position.z=radius*120
    camera.position.y=radius*20

    createThree=new CreateThree(container,camera);
    createThree.scene.fog=new THREE.FogExp2( 0x000000, 0.00000025 );

    controls = new FlyControls( camera, createThree.renderer.domElement );
    controls.movementSpeed = 1000;
    controls.domElement = createThree.renderer.domElement;
    controls.rollSpeed = Math.PI / 24;
    controls.autoForward = false;
    controls.dragToLook = false;

    createThree.createControls(controls);

    composer = new EffectComposer( createThree.renderer );

    initLight();
    initModel();
    // create2()
    let obj=new Object();
    obj.tick=()=>{
        render()
    }
    createThree.actionTick.push(obj)

    createThree.startRender();
})

function initLight() {
    let dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
    dirLight.position.set( - 1, 0, 1 ).normalize();

    createThree.scene.add(dirLight);
}
let angle = 0;
let speed = 0.01;
function render() {
    const delta = clock.getDelta();
    meshSun.rotation.y += rotationSpeed * delta;
    meshPlanet.rotation.y += rotationSpeed * delta;
    meshClouds.rotation.y += 1.25 * rotationSpeed * delta;
    meshVenus.rotation.y += 1.25 * rotationSpeed * delta;
    meshMoon.rotation.y += 1.25 * rotationSpeed * delta;
    meshSaturn.rotation.y += 2.25 * rotationSpeed * delta;

    dPlanet = camera.position.length();
    dMoonVec.subVectors( camera.position, meshSun.position );
    dMoon = dMoonVec.length();
    if ( dMoon < dPlanet ) {
        d = ( dMoon - radius * moonScale * 1.01 );
    } else {
        d = ( dPlanet - radius * 1.01 );
    }
    controls.movementSpeed = 0.33 *d;
    createThree.controls.update( delta );
    // composer.render( delta );

}

function rotateAroundPoint(object, center, angleToYAxis) {
    // 将对象位置转换到围绕的中心点
    object.position.sub(center);

    // 计算绕Y轴旋转的角度
    let axis = new THREE.Vector3(0, 1, 0); // Y轴
    let angle = angleToYAxis * Math.PI / 180; // 将角度转换为弧度

    // 应用旋转
    object.position.applyAxisAngle(axis, angle);

    // 还原位置
    object.position.add(center);
}

function initModel() {
    const textureLoader=new THREE.TextureLoader();

    //创建太阳
    const materialSun=new THREE.MeshBasicMaterial({
        map:textureLoader.load('/assets/texture/controls/2k_sun.jpg')
    })
    materialSun.map.colorSpace = THREE.SRGBColorSpace;
    const geometry = new THREE.SphereGeometry( radius*2, 100, 50 );
    meshSun = new THREE.Mesh( geometry, materialSun );
    meshSun.rotation.y = 0;
    meshSun.rotation.z = tilt;
    meshSun.position.set(0,0,0)
    createThree.scene.add(meshSun)


    // 创建地球
    const materialNormalMap = new THREE.MeshBasicMaterial( {
        specular: 0x7c7c7c,
        shininess: 15,
        map: textureLoader.load( '/assets/texture/controls/earth_atmos_2048.jpg' ),
        specularMap: textureLoader.load( '/assets/texture/controls/earth_specular_2048.jpg' ),
        normalMap: textureLoader.load( '/assets/texture/controls/earth_normal_2048.jpg' ),
        // y 比例被取消以补偿法线地图的惯用手。
        normalScale: new THREE.Vector2( 0.85, - 0.85 )
    } );
    materialNormalMap.map.colorSpace = THREE.SRGBColorSpace;
    meshPlanet = new THREE.Mesh( geometry, materialNormalMap );
    meshPlanet.rotation.y = 0;
    meshPlanet.rotation.z = tilt;
    meshPlanet.position.x=-distance*1
    meshPlanet.position.y=distance*0.5
    meshPlanet.position.z=distance*0.5
    meshPlanet.scale.set(0.5,0.5,0.5)
    createThree.scene.add(meshPlanet)

    //创建云
    const materialClouds = new THREE.MeshLambertMaterial( {
        map: textureLoader.load( '/assets/texture/controls/earth_clouds_1024.png' ),
        transparent: true
    });
    materialClouds.map.colorSpace = THREE.SRGBColorSpace;
    meshClouds = new THREE.Mesh( geometry, materialClouds );
    meshClouds.scale.set( 1.005, 1.005, 1.005 );
    meshClouds.rotation.z = tilt;
    createThree.scene.add(meshClouds)

    //创建月亮
    const materialMoon = new THREE.MeshBasicMaterial( {
        map: textureLoader.load( '/assets/texture/controls/2k_mercury.jpg' )
    } );
    materialMoon.map.colorSpace = THREE.SRGBColorSpace;
    meshMoon = new THREE.Mesh( geometry, materialMoon );
    meshMoon.position.x=distance;
    meshMoon.position.z=-distance*2;
    meshMoon.position.y=distance*0.5;
    meshMoon.scale.set( 0.33, 0.33, 0.33 );
    createThree.scene.add(meshMoon)


    //创建土星
    const materialVenus=new THREE.MeshBasicMaterial({
        map:textureLoader.load('/assets/texture/controls/2k_jupiter.jpg'),
    })
    const geometryVenus = new THREE.SphereGeometry( radius*0.3, 100, 50 );
    meshVenus = new THREE.Mesh( geometry, materialVenus );
    meshVenus.rotation.y = 0;
    meshVenus.rotation.z = tilt;
    meshVenus.position.x=distance
    meshVenus.position.y=distance
    meshVenus.position.z=distance*2
    createThree.scene.add(meshVenus)

    //创建金星
    const materialSaturn=new THREE.MeshBasicMaterial({
        specular: 0x7c7c7c,
        shininess: 15,
        map:textureLoader.load('/assets/texture/controls/2k_venus_surface.jpg'),
        normalMap:textureLoader.load('/assets/texture/controls/2k_venus_atmosphere.jpg')
    })
    materialSaturn.map.colorSpace = THREE.SRGBColorSpace;
    const geometrySaturn = new THREE.SphereGeometry( radius*0.5, 100, 50 );
    meshSaturn = new THREE.Mesh( geometrySaturn, materialSaturn );
    meshSaturn.rotation.y = 0;
    meshSaturn.rotation.z = tilt;
    meshSaturn.position.z=-distance*2
    meshSaturn.position.y=-distance*2
    meshSaturn.position.x=distance
    createThree.scene.add(meshSaturn)

    //创建星星
    const r = radius, starsGeometry = [ new THREE.BufferGeometry(), new THREE.BufferGeometry() ];
    const vertices1 = [];
    const vertices2 = [];
    const vertex = new THREE.Vector3();
    for ( let i = 0; i < 250; i ++ ) {
        vertex.x = Math.random() * 2 - 1;
        vertex.y = Math.random() * 2 - 1;
        vertex.z = Math.random() * 2 - 1;
        vertex.multiplyScalar( r );
        vertices1.push( vertex.x, vertex.y, vertex.z );
    }

    for ( let i = 0; i < 1500; i ++ ) {
        vertex.x = Math.random() * 2 - 1;
        vertex.y = Math.random() * 2 - 1;
        vertex.z = Math.random() * 2 - 1;
        vertex.multiplyScalar( r );
        vertices2.push( vertex.x, vertex.y, vertex.z );
    }

    starsGeometry[ 0 ].setAttribute( 'position', new THREE.Float32BufferAttribute( vertices1, 3 ) );
    starsGeometry[ 1 ].setAttribute( 'position', new THREE.Float32BufferAttribute( vertices2, 3 ) );
    const starsMaterials = [
        new THREE.PointsMaterial( { color: 0x9c9c9c, size: 2, sizeAttenuation: false } ),
        new THREE.PointsMaterial( { color: 0x9c9c9c, size: 1, sizeAttenuation: false } ),
        new THREE.PointsMaterial( { color: 0x7c7c7c, size: 2, sizeAttenuation: false } ),
        new THREE.PointsMaterial( { color: 0x838383, size: 1, sizeAttenuation: false } ),
        new THREE.PointsMaterial( { color: 0x5a5a5a, size: 2, sizeAttenuation: false } ),
        new THREE.PointsMaterial( { color: 0x5a5a5a, size: 1, sizeAttenuation: false } )
    ];

    for ( let i = 10; i < 30; i ++ ) {
        const stars = new THREE.Points( starsGeometry[ i % 2 ], starsMaterials[ i % 6 ] );
        stars.rotation.x = Math.random() * 6;
        stars.rotation.y = Math.random() * 6;
        stars.rotation.z = Math.random() * 6;
        stars.scale.setScalar( i * 10 );
        stars.matrixAutoUpdate = false;
        stars.updateMatrix();
        createThree.scene.add( stars );
    }

    // 创建轨道
    let orbitGeometry = new THREE.TorusGeometry(radius*3, 0.01);
    let orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    orbit = new THREE.Line(orbitGeometry, orbitMaterial);
    orbit.position.set(0,0,0)
    orbit.rotation.x=Math.PI/2

    for (let i=0;i<10;i++){
        let orbit2=orbit.clone()
        orbit2.scale.set(2*i,2*i,2*i)
        createThree.scene.add(orbit2);
    }

    createThree.scene.add(orbit);
    // createThree.scene.add(meshPlanet,meshClouds,meshMoon);
}
function create2(){
    const loader = new THREE.TextureLoader();
    const texture2 = loader.load(
        '/assets/texture/controls/2k_stars_milky_way.jpg',
        () => {
            texture2.mapping = THREE.EquirectangularReflectionMapping;
            texture2.colorSpace = THREE.SRGBColorSpace;
            createThree.scene.background = texture2;
        });
}


</script>
<template>
    <div class="container"></div>
</template>

<style scoped>

</style>
