<script setup>
import { onMounted, onUnmounted } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import * as THREE from 'three'

let map = null,wallData=[],paths;
let shape='116.011036,29.671376;116.012131,29.670922;116.01215,29.670901;116.012159,29.670883;116.012183,29.67065;116.01218,29.670629;116.012174,29.670621;116.012154,29.670609;116.011782,29.670466;116.011766,29.670455;116.011754,29.670443;116.011747,29.670428;116.011726,29.670262;116.011732,29.670241;116.011743,29.670228;116.011751,29.670218;116.011928,29.669944;116.012139,29.66954;116.01228,29.669207;116.012528,29.668617;116.012718,29.66813;116.012725,29.668097;116.012719,29.668085;116.012706,29.668068;116.01201,29.667613;116.01177,29.667606;116.011758,29.667603;116.011751,29.667597;116.011743,29.667584;116.01168,29.667203;116.01159,29.667138;116.011469,29.667271;116.011091,29.667016;116.011076,29.666996;116.011073,29.666985;116.011072,29.666969;116.011076,29.666946;116.013567,29.664535;116.013618,29.664507;116.013665,29.664494;116.013702,29.664494;116.013735,29.664495;116.013775,29.664502;116.013842,29.664522;116.014522,29.665097;116.015648,29.666013;116.015856,29.666167;116.015898,29.666215;116.015912,29.666249;116.015926,29.666296;116.01593,29.666332;116.015922,29.66638;116.015804,29.666838;116.015604,29.66755;116.015553,29.667964;116.015566,29.668269;116.015746,29.668669;116.015813,29.668947;116.015821,29.669215;116.015821,29.669412;116.015835,29.669453;116.015853,29.669496;116.015884,29.669534;116.015924,29.669567;116.017007,29.670099;116.017513,29.670373;116.017544,29.670391;116.017557,29.670408;116.017565,29.67044;116.017621,29.672081;116.017537,29.672304;116.017677,29.673226;116.017683,29.673239;116.017694,29.673253;116.017713,29.67326;116.017734,29.673266;116.018111,29.673274;116.018127,29.673277;116.018138,29.673282;116.018146,29.673295;116.018149,29.673314;116.01817,29.674455;116.018072,29.674526;116.018069,29.674701;116.017814,29.674713;116.017822,29.674978;116.017842,29.675534;116.017889,29.675562;116.017907,29.675794;116.017901,29.675807;116.017888,29.675826;116.017866,29.675842;116.016906,29.676202;116.016882,29.676208;116.016865,29.676211;116.016834,29.676208;116.016798,29.676194;116.016768,29.676171;116.016234,29.675588;116.016159,29.675492;116.016155,29.675435;116.016036,29.675258;116.015931,29.675149;116.015422,29.674788;116.014951,29.674443;116.014842,29.674356;116.014132,29.674025;116.013774,29.67369;116.013717,29.673511;116.013615,29.673376;116.013389,29.673212;116.013322,29.673147;116.013285,29.673086;116.013267,29.673059;116.013238,29.673028;116.013202,29.673007;116.013128,29.672989;116.013076,29.672978;116.012992,29.672959;116.012887,29.672924;116.0128,29.672889;116.01247,29.672625;116.011567,29.672069;116.010941,29.671656;116.01091,29.67162;116.010897,29.671584;116.010887,29.671543;116.010887,29.671505;116.010899,29.671473;116.010913,29.671443;116.010952,29.671414;116.011036,29.671376'
// 墙体高度
const height = 100
// 墙体颜色
const color = '#ff0000'
// 动效纹理
let texture = null
// 动效纹理偏移
let texture_offset = 0
// THREE相关变量
let camera, scene, renderer


onMounted(() => {
    window._AMapSecurityConfig = {
        securityJsCode: "066321a8bc0888c6956235dbb7e9df11",
    };

    AMapLoader.load({
        key: "2b084e5cefbcde97c2c5a9a97cbfc020", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ["AMap.Scale"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
    }).then((AMap) => {
        map = new AMap.Map("container", {
            pitch: 50, //地图俯仰角度，有效范围 0 度- 83 度
            viewMode: '3D', //地图模式
            terrain:true,
            rotateEnable: true, //是否开启地图旋转交互 鼠标右键 + 鼠标画圈移动 或 键盘Ctrl + 鼠标左键画圈移动
            pitchEnable: true, //是否开启地图倾斜交互 鼠标右键 + 鼠标上下移动或键盘Ctrl + 鼠标左键上下移动
            zoom: 17, //初始化地图层级
            rotation: -15, //初始地图顺时针旋转的角度
            zooms: [2, 20], //地图显示的缩放级别范围
            center: [116.014829, 29.668984], //初始地图中心经纬度
        });
        createLine(map)
        map.on('click', (event) => {
            const {lng, lat} = event.lnglat
            console.log(lng+","+lat)
        })
        initLayer()
    }).catch((e) => {
        console.log(e);
    });
});


// 初始化图层
function initLayer () {
    const layer = new AMap.GLCustomLayer({
        zIndex: -1,
        visible: true,
        init: (gl) => {
            initThree()
            createWall()
            animate()
        },
        render: () => {

            const { near, far, fov, up, lookAt, position } = map.customCoords.getCameraParams()

            camera.near = near// 近平面
            camera.far = far // 远平面
            camera.fov = fov // 视野范围
            camera.position.set(...position)
            camera.up.set(...up)
            camera.lookAt(...lookAt)

            // 更新相机坐标系
            camera.updateProjectionMatrix()

            renderer.render(scene, camera)

            // 这里必须执行！重新设置 three 的 gl 上下文状态
            renderer.resetState()
        }
    })

    map.add(layer)
}

function createLine(m){
    let lngLatArray=[],data=[];
    let coordinatesArray = shape.split(';');
    for (let i = 0; i < coordinatesArray.length; i++) {
        let coord = coordinatesArray[i];
        // 确保字符串非空（最后一个分号会导致一个空字符串）
        if (coord) {
            // 分割经度和纬度
            let [lng, lat] = coord.split(',').map(Number);
            // 创建AMap.LngLat实例并放入数组
            lngLatArray.push(new AMap.LngLat(lng, lat));
            //存储墙体数据
            data.push([lng,lat])
        }
    }
    wallData.push(data)
    // 地理坐标转为three坐标系，不管用不用arr，都需要转换一个非空数组
    // 否则customCoords没实例化api会报错
    paths = map.customCoords.lngLatsToCoords(wallData)
    let polygon = new AMap.Polygon({
        path: lngLatArray, //路径
        fillColor: "#fff", //多边形填充颜色
        strokeWeight: 5, //线条宽度，默认为 2
        strokeColor: "#000", //线条颜色
    });
    m.add(polygon)
}

function initThree () {
    camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 100, 1 << 30)
    renderer = new THREE.WebGLRenderer({
        antialias: true // 抗锯齿，默认false 耗性能
    })
    // 自动清空画布这里必须设置为 false，否则地图底图将无法显示
    renderer.autoClear = false
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.setSize(container.clientWidth,container.clientHeight);
    renderer.domElement.style.zIndex = 1;
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0px';
    renderer.domElement.style.pointerEvents = 'none';
    container.appendChild(renderer.domElement)
    scene = new THREE.Scene()
    // 增加环境光
    const aLight = new THREE.AmbientLight(0xffffff, 0.3)
    scene.add(aLight)
}
function createCube () {
    const geometry = new THREE.BoxGeometry(200, 200, 200)
    const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false
    })
    const cube = new THREE.Mesh(geometry, material)
    cube.position.set(0, 0, 0)
    scene.add(cube)
}
function createWall () {

    let faceList = []
    let faceVertexUvs = []

    // 合并多个闭合范围
    for (let i = 0; i < paths.length; i++) {
        const { face, uvs } = generateVecData(paths[i])
        faceList = [...faceList, ...face]
        faceVertexUvs = [...faceVertexUvs, ...uvs]
    }

    // 背景层
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(faceList), 3))
    geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(faceVertexUvs), 2))

    const material1 = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false,
        alphaMap: new THREE.TextureLoader().load('/assets/XiaoMiSu7/texture/skin2.jpg'), // 不透明图片
        // wireframe: true
    })
    const mesh1 = new THREE.Mesh(geometry, material1)
    scene.add(mesh1)

    // 动画层
    const geometry2 = geometry.clone()
    texture = generateTexture(128, color)
    texture.wrapS = THREE.RepeatWrapping // 水平重复平铺
    texture.wrapT = THREE.RepeatWrapping // 垂直重复平铺

    const material2 = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false,
        map: texture
    })

    const mesh2 = new THREE.Mesh(geometry2, material2)
    scene.add(mesh2)

}

/**
 * 创建一个闭合范围的模型数据
 * @param res {Object} 包含面的顶点数据face，UV面的顶点数据uvs
 */
function generateVecData (arr) {
    const vec3List = [] // 顶点数组
    let faceList = [] // 三角面数组
    let faceVertexUvs = [] // 面的UV层队列，用于纹理和几何信息映射
    const t0 = [0, 0]
    const t1 = [1, 0]
    const t2 = [1, 1]
    const t3 = [0, 1]

    for (let i = 0; i < arr.length; i++) {
        const [x1, y1] = arr[i]
        vec3List.push([x1, y1, 0])
        vec3List.push([x1, y1, height])
    }

    for (let i = 0; i < vec3List.length - 2; i++) {
        if (i % 2 === 0) {
            // 下三角
            faceList = [...faceList, ...vec3List[i], ...vec3List[i + 2], ...vec3List[i + 1]]
            // UV
            faceVertexUvs = [...faceVertexUvs, ...t0, ...t1, ...t3]
        } else {
            // 上三角
            faceList = [...faceList, ...vec3List[i], ...vec3List[i + 1], ...vec3List[i + 2]]
            // UV
            faceVertexUvs = [...faceVertexUvs, ...t3, ...t1, ...t2]
        }
    }

    return {
        face: faceList,
        uvs: faceVertexUvs
    }
}

/**
 * 创建材质图
 * @param size 尺寸为2的n次方
 * @param color 颜色
 * @returns {*}
 */
function generateTexture(size = 64, color ="#ff0000"){

    let canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    let ctx = canvas.getContext('2d')
    let linearGradient = ctx.createLinearGradient(0,0,0,size)
    linearGradient.addColorStop(0.2, hexToRgba(color, 0.0))
    linearGradient.addColorStop(0.8, hexToRgba(color, 0.5))
    linearGradient.addColorStop(1.0, hexToRgba(color, 1.0))
    ctx.fillStyle = linearGradient
    ctx.fillRect(0,0, size, size)

    let texture = new THREE.Texture(canvas)
    texture.needsUpdate = true //必须
    return texture
}

/**
 * 将十六进制的颜色值转成rgba
 * @param {String} hex
 * @param {number} opacity
 * @returns {string}
 */
function hexToRgba (hex, opacity = 1) {
    return 'rgba(' + parseInt('0x' + hex.slice(1, 3)) + ',' + parseInt('0x' + hex.slice(3, 5)) + ',' +
        parseInt('0x' + hex.slice(5, 7)) + ',' + opacity + ')'
}

// 动画
function animate () {

    // 纹理偏移
    texture_offset -= 0.03 // 向上移动
    texture.offset.set(0, texture_offset)

    if (map) {
        map.render()
    }
    requestAnimationFrame(() => {
        animate()
    })
}












onUnmounted(() => {
    map?.destroy();
});

</script>

<template>
    <div class="container" id="container"></div>
</template>

<style scoped>

</style>
