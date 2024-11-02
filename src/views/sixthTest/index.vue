<script setup>
import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import {onMounted} from "vue";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {Vector3} from "three";

let camera, scene, renderer;
let controls,container;

function Element( id, x, y, z, ry ,rx,rz) {

    const div = document.createElement( 'div' );
    div.style.width = '480px';
    div.style.height = '480px';
    div.style.backgroundColor = '#ff0000';

    const iframe = document.createElement( 'iframe' );
    iframe.style.width = '480px';
    iframe.style.height = '480px';
    iframe.style.border = '0px';
    // iframe.src = [ 'https://www.youtube.com/embed/', id, '?rel=0' ].join( '' );
    iframe.src = "//player.bilibili.com/player.html?isOutside=true&aid=666390514&bvid=BV1ka4y1C7sH&cid=1412370594&p=1&as_wide=1&danmaku=0&high_quality=1"
    iframe.scrolling="no"
    iframe.border="0"
    iframe.frameborder="no"
    iframe.framespacing="0"
    iframe.allowfullscreen="true"
    div.appendChild( iframe );

    const object = new CSS3DObject( div );
    object.position.set( x, y, z );
    object.rotation.y = ry;
    object.rotation.x = rx;
    object.rotation.z = rz;
    return object;

}

onMounted(()=>{
    container = document.querySelector( '.container' );
    init();
    animate();
})

function init() {
    camera = new THREE.PerspectiveCamera( 50, container.clientWidth / container.clientHeight, 1, 5000 );
    camera.position.set( 600, 800, 800 );

    scene = new THREE.Scene();

    renderer = new CSS3DRenderer();
    renderer.setSize( container.clientWidth ,container.clientHeight );
    container.appendChild( renderer.domElement );

    const group = new THREE.Group();
    group.add( new Element( 'SJOz3qjfQXU', 0, 0, 240, 0 ,0,0) );
    group.add( new Element( 'Y2-xZ-1HE-Q', 240, 0, 0, Math.PI / 2 ,0,0) );
    group.add( new Element( 'IrydklNpcFI', 0, 0, - 240, Math.PI,0,0 ) );
    group.add( new Element( '9ubytEsCaS0', - 240, 0, 0, - Math.PI / 2,0,0 ) );
    group.add( new Element( '9ubytEsCaS0', 0, -240, 0, 0,Math.PI / 2,0 ) );
    group.add( new Element( '9ubytEsCaS0', 0, 240, 0, 0,Math.PI / 2,0 ) );
    scene.add( group );

    controls = new OrbitControls( camera, renderer.domElement );
    controls.rotateSpeed = 2;

    window.addEventListener( 'resize', onWindowResize );

    controls.addEventListener( 'change', function () {
        renderer.render( scene, camera );
    } );
}

function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix();
    renderer.setSize( container.clientWidth ,container.clientHeight );
}

function animate() {
    requestAnimationFrame( animate );
    controls.update();
    renderer.render( scene, camera );
}
</script>

<template>
    <div>
        <div class="container"></div>
        <div id="blocker"></div>
    </div>
</template>

<style scoped>

</style>
