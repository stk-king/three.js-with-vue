<script setup>
import {onBeforeUnmount, onMounted} from "vue";
import CreateThree from "@/utils/CreateThree";
import * as THREE from 'three'

let createThree,gui,step=0,controls,rotate=true,container,camera;
let box, circle, cone, cylinder, sphere, plane, torus, line, curveLine,points,sprite;

onMounted(()=>{
    container=document.querySelector('.container');
    camera = new THREE.PerspectiveCamera(75, container.clientHeight/container.clientHeight, 1, 1000); //实例化相机
    camera.position.set(100, 100, 100);
    createThree=new CreateThree(container,camera)
    createThree.createControls(null)

    let light = new THREE.DirectionalLight(0xffffff); //添加了一个白色的平行光
    light.position.set(20, 50, 50); //设置光的方向
    createThree.scene.add(light); //添加到场景
    //添加一个全局环境光
    createThree.scene.add(new THREE.AmbientLight(0x222222));

    initMesh()

    //创建调试框
    controls = {
        rotate:true
    };

    gui = createThree.createGui(true);
    gui.add(controls, "rotate").name("旋转").onChange( (e)=>{
        rotate = e;
    });

    //创建一个对象用于执行动画
    let obj=new Object({tick:()=>{
            animate()
        }})

    createThree.actionTick.push(obj)
    createThree.startRender()
})
//创建模型
function initMesh() {

    //添加直线
    let pointsArr = [
        new THREE.Vector3( -10, 0, -5 ),
        new THREE.Vector3( -5, 15, 5 ),
        new THREE.Vector3( 20, 15, -5 ),
        new THREE.Vector3( 10, 0, 5 )
    ];

    //创建材质
    let m1=new THREE.LineBasicMaterial({color:0x000000});  //基础线条材质（LineBasicMaterial）
    let m2=new THREE.LineDashedMaterial( { color : 0xff0000 } ); //创建一条红色的虚线材质(LineDashedMaterial)
    let m3=new THREE.MeshLambertMaterial( { color : 0xff0000 } ); //Lambert网格材质(MeshLambertMaterial),一种非光泽表面的材质，没有镜面高光。
    let m4= new THREE.MeshNormalMaterial() //法线网格材质(MeshNormalMaterial),一种把法向量映射到RGB颜色的材质。
    let m5=new THREE.MeshPhongMaterial({color:0x00ffff})  //Phong网格材质(MeshPhongMaterial),一种用于具有镜面高光的光泽表面的材质。
    let m6=new THREE.MeshBasicMaterial({color:0x00ffff})  //基础网格材质(MeshBasicMaterial),一个以简单着色（平面或线框）方式来绘制几何体的材质。这种材质不受光照的影响。
    let m7=new THREE.MeshPhysicalMaterial({color:0x00ffff})  //物理网格材质(MeshPhysicalMaterial),MeshStandardMaterial的扩展，提供了更高级的基于物理的渲染属性：
    let m8=new THREE.MeshStandardMaterial({color:0x00ffff}) //标准网格材质(MeshStandardMaterial),一种基于物理的标准材质，使用Metallic-Roughness工作流程。
    let m9=new THREE.MeshToonMaterial({color:0x00ffff})  //一种实现卡通着色的材质。
    let m10=new THREE.PointsMaterial({color:0xff0000})  //点材质(PointsMaterial),Points使用的默认材质。
    let m11=new THREE.SpriteMaterial( {color: 0xff0000 } );  //点精灵材质(SpriteMaterial),一种使用Sprite的材质。


    let lineGeometry = new THREE.BoxGeometry(); //实例化几何体
    lineGeometry.setFromPoints(pointsArr); //使用当前点的属性配置几何体
    line = new THREE.Line(lineGeometry, m1);
    line.position.set(-65, -30, 0);

    //添加曲线线
    //指定一些用于生成曲线线的三维顶点
    let curve = new THREE.CatmullRomCurve3(pointsArr);
    let points = curve.getPoints( 50 ); //使用getPoints获取当前曲线分成50段后的所有顶点
    let curveGeometry = new THREE.BufferGeometry().setFromPoints( points ); //使用顶点生成几何体
    // 使用THREE.Line创建线
    curveLine = new THREE.Line( curveGeometry, m2 );
    curveLine.computeLineDistances(); //需要重新计算位置才能显示出虚线
    curveLine.position.set(-65, -30, 0);

    //创建立方体
    box = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), m3);
    box.position.set(-50, 20, 0);

    //创建圆
    circle = new THREE.Mesh(new THREE.CircleGeometry(5, 32),m4);
    circle.position.set(-20, 20, 0);

    //创建圆锥
    cone = new THREE.Mesh(new THREE.ConeGeometry(5, 20, 32), m5);
    cone.position.set(20, 20, 0);

    //创建圆柱
    cylinder = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 20, 32), m6);
    cylinder.position.set(50, 20, 0);

    //创建球
    sphere = new THREE.Mesh(new THREE.SphereGeometry(5, 32, 32), m7);
    sphere.position.set(-20, -20, 0);

    //创建平面
    plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), m8);
    plane.position.set(20, -20, 0);

    //创建圆环
    torus = new THREE.Mesh(new THREE.TorusGeometry(10, 3, 16, 100), m9);
    torus.position.set(50, -20, 0);

    //创建由点材质组成的正方体
    const vertices = [];
    for ( let i = 0; i < 1000; i ++ ) {
        const x = THREE.MathUtils.randFloatSpread( 20 );
        const y = THREE.MathUtils.randFloatSpread( 20 );
        const z = THREE.MathUtils.randFloatSpread( 20 );
        vertices.push( x, y, z );
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ));
    points = new THREE.Points( geometry, m10 );
    points.position.set(80, -20, 0);


    const map = new THREE.TextureLoader().load( '/assets/XiaoMiSu7/texture/skin1.jpg' );
    m11.map=map
    sprite = new THREE.Sprite( m11 );
    sprite.scale.set(20, 20, 20)
    sprite.position.set(80, 20, 0);

    createThree.scene.add(box, circle, cone, cylinder, sphere, plane, torus, line, curveLine,points,sprite)
}

//创建旋转动画
function animate() {
    //判断是否可以旋转
    if(rotate){
        step += 0.02;

        //设置每一个模型的转向
        line.rotation.set(step, step, step);
        curveLine.rotation.set(step, step, step);
        box.rotation.set(step, step, step);
        circle.rotation.set(step, step, step);
        cone.rotation.set(step, step, step);
        cylinder.rotation.set(step, step, step);
        sphere.rotation.set(step, step, step);
        plane.rotation.set(step, step, step);
        torus.rotation.set(step, step, step);
    }
}

//创建灯光

onBeforeUnmount(()=>{
    createThree.destroy()
    gui.destroy()
})
</script>

<template>
    <div class="container"></div>
</template>

<style scoped>

</style>
