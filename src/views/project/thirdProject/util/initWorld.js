import * as THREE from 'three'
import CreateThree from "@/views/project/thirdProject/util/CreateThree";
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import { Sky } from 'three/addons/objects/Sky.js';
import {MathUtils, Vector3} from "three";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import CheckIntersection from "@/utils/checkIntersection";

import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';

let createThree,camera,container,objLoader;
export default class initWorld{
    constructor() {
        this.mounted()
    }
    mounted(){
        container=document.querySelector('.world')
        camera=new THREE.PerspectiveCamera(75,container.clientWidth/container.clientHeight,1,100);
        camera.position.set(10,10,10)
        createThree=new CreateThree(container,camera);

        createThree.createControls(null)
        createThree.renderer.logarithmicDepthBuffer=true;

        let checkIntersection=new CheckIntersection(createThree.scene,camera,container)
        window.addEventListener('pointerdown',()=>{
            if (checkIntersection.object){
                // checkIntersection.object.material.color.set( 0x000000 );
                console.log(checkIntersection.object.material)

                if (checkIntersection.object.material.length>0){
                    checkIntersection.object.material.forEach((m)=>{
                        m.color.set(0xff0000)
                    })
                }
                // createThree.scene.children[4].remove(checkIntersection.object)
                // createThree.scene.remove(createThree.scene.getObjectByName('Mesh28349 Model'))

            }
            console.log(checkIntersection.object)
        })



        // create2()
        this.initLight()
        this.initModel()

        createThree.startRender()
    }

    initLight(){
        const light=new THREE.AmbientLight(0xffffff,1)
        const light2=new THREE.DirectionalLight(0xffffff,3)
        light2.position.set(-100,100,-100)
        const light3=light2.clone()
        light3.position.set(10,10,10)
        createThree.scene.add(light,light2)
    }

    initModel(){
        const sky=new Sky()
        sky.scale.setScalar( 450000 );

        const phi = MathUtils.degToRad( 90 );
        const theta = MathUtils.degToRad( 180 );
        const sunPosition = new Vector3().setFromSphericalCoords( 1, phi, theta );

        sky.material.uniforms.sunPosition.value = sunPosition;

        createThree.scene.add( sky );

        // const loader = new THREE.TextureLoader();
        // const texture2 = loader.load(
        //     require('@/views/project/thirdProject/util/water.jpg'),
        //     () => {
        //         texture2.mapping = THREE.EquirectangularReflectionMapping;
        //         texture2.colorSpace = THREE.SRGBColorSpace;
        //     });
        // const material=new THREE.MeshBasicMaterial({
        //     map:texture2
        // })
        // const geometry=new THREE.PlaneGeometry(400,600)
        // const mesh=new THREE.Mesh(geometry,material)
        // mesh.rotation.x=-Math.PI/2
        // createThree.scene.add(mesh)


        objLoader = new OBJLoader();
        const mtlLoader = new MTLLoader();
        mtlLoader.load('/assets/OBJ1/CasteliaCity.mtl', (mtl) => {
            mtl.preload();
            for (const material of Object.values(mtl.materials)) {
                material.side = THREE.DoubleSide;
            }
            objLoader.setMaterials(mtl);
            objLoader.load('/assets/OBJ1/CasteliaCity.obj', (root) => {
                console.log(root)
                root.castShadow=true

                // root.scene.traverse((child) => {
                //     if(child.isMesh) {
                //         child.material.emissive =  child.material.color;
                //         child.material.emissiveMap = child.material.map ;
                //     }
                // })
                root.scale.set(0.0001,0.0001,0.0001)
                root.remove(root.getObjectByName('Mesh28349 Model'))

                createThree.scene.add(root);
                console.log(createThree.scene)

                // this.initCompose(root.getObjectByName("Mesh22068 Component_68_1 Component_94_1 Model"))
            });
        })

        // const dracoLoader = new DRACOLoader(); //
        // const gltfLoader = new GLTFLoader();
        // dracoLoader.setDecoderPath( '/assets/jsm/draco/' );
        // dracoLoader.preload(); //初始化_initDecoder 解码器
        // gltfLoader.setDRACOLoader(dracoLoader); //gltfloader使用dracoLoader
        // const url = '/assets/OBJ1/result.gltf';
        // gltfLoader.load(url, (gltf) => {
        //     const root = gltf.scene;
        //     console.log(gltf)
        //     root.scale.set(0.0001,0.0001,0.0001)
        //     createThree.scene.add(root);
        // });
    }

    initCompose(e){
        const composer = new EffectComposer(createThree.renderer);
        // OutlinePass第一个参数v2的尺寸和canvas画布保持一致
        const v2 = new THREE.Vector2(container.clientWidth, container.clientHeight);
        // const v2 = new THREE.Vector2(800, 600);
        const outlinePass = new OutlinePass(v2, createThree.scene, camera);
        outlinePass.selectedObjects = [e];
        // 设置OutlinePass通道
        composer.addPass(outlinePass);

        let obj=new Object()
        obj.tick=()=>{
            composer.render();
        }

        createThree.actionTick.push(obj)
    }
    unmounted(){
        createThree.destroy()
    }
}
