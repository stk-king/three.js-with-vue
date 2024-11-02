import { createRouter, createWebHashHistory } from 'vue-router'
import index from '@/views/index.vue'

const routes = [
  {
    path: '/',
    name: 'index',
    component: index,
    icon:'Menu',
    hasSub:false,
    isMenu:true,  //是否显示在侧边栏
    children:[
      {
        path:'/',
        name:'首页',
        icon:'Promotion',
        children:[],
        content:'',
        component:()=>import('@/views/introduce.vue')
      },
      {
        path:'/editor',
        name:'在线编辑器',
        icon:'EditPen',
        children:[],
        content:'',
        component:()=>import('@/views/editor/index.vue')
      },
    ]
  },
  {
    path: '/baseCase',
    component: index,
    icon:'Platform',
    name: '基础案例',
    hasSub:true,
    isMenu:true,
    children: [
      {
        path:'/other',
        name:'代码测试',
        icon:'WalletFilled',
        content:'代码测试',
        children:[],
        component:()=>import('@/views/baseCase/anotherTest/index.vue')
      },
      {
        path:'/geometry',
        name:'几何体和曲线',
        content:'几种常见的几何体(geometry)和曲线（curve）示例代码',
        icon:'Stamp',
        children:[
          {
            path:'/geometry/firstDemo',
            name:'几何体合集',
            icon:'Link',
            content:'常用的几种几何体',
            children:[],
            component:()=>import('@/views/baseCase/geometry/firstDemo/index.vue')
          },
          {
            path:'/geometry/secondDemo',
            name:'曲线示例',
            icon:'Link',
            content:'',
            children:[],
            component:()=>import('@/views/baseCase/geometry/secondDemo/index.vue')
          },
        ],
      },
      {
        path:'/material/firstDemo',
        name:'材质（material）',
        icon:'MessageBox',
        content:'几种常见的材质示例代码',
        children:[],
        component:()=>import('@/views/baseCase/material/firstDemo/index.vue')
      },
      {
        path:'/light',
        name:'灯光',
        icon:'Notification',
        content:'几种常见的灯光示例代码',
        children:[
          {
            path:'/light/firstDemo',
            name:'平行光',
            icon:'Link',
            content:'也叫方向光（DirectionalLight），常常用来表现太阳光照的效果。',
            children:[],
            component:()=>import('@/views/baseCase/light/firstDemo/index.vue')
          },
          {
            path:'/light/secondDemo',
            name:'点光源',
            icon:'Link',
            content:'点光源（PointLight）表示的是从一个点朝各个方向发射出光线的一种光照效果。',
            children:[],
            component:()=>import('@/views/baseCase/light/secondDemo/index.vue')
          },
          {
            path:'/light/thirdDemo',
            name:'聚光灯',
            icon:'Link',
            content:'聚光灯（SpotLight）可以看成是一个点光源被一个圆锥体限制住了光照的范围。',
            children:[],
            component:()=>import('@/views/baseCase/light/thirdDemo/index.vue')
          },
          {
            path:'/light/fourthDemo',
            name:'矩形区域光',
            icon:'Link',
            content:'矩形区域光（RectAreaLight）表示一个矩形区域的发射出来的光照，例如长条的日光灯或者天花板上磨砂玻璃透进来的自然光。',
            children:[],
            component:()=>import('@/views/baseCase/light/fourthDemo/index.vue')
          },
        ]
      },
      {
        path: '/camera',
        name: '相机',
        icon: 'Clock',
        content: '五种相机示例代码',
        children: [
          {
            path:'/camera/firstDemo',
            name:'摄像机阵列（ArrayCamera）',
            icon:'Link',
            content:'ArrayCamera',
            children:[],
            component:()=>import('@/views/baseCase/camera/firstDemo/index.vue')
          },
          {
            path:'/camera/secondDemo',
            name:'立方相机（CubeCamera）',
            icon:'Link',
            content:'CubeCamera',
            children:[],
            component:()=>import('@/views/baseCase/camera/secondDemo/index.vue')
          },
          {
            path:'/camera/thirdDemo',
            name:'正交相机（OrthographicCamera）',
            icon:'Link',
            content:'OrthographicCamera',
            children:[],
            component:()=>import('@/views/baseCase/camera/thirdDemo/index.vue')
          },
          {
            path:'/camera/fourthDemo',
            name:'透视相机（PerspectiveCamera）',
            icon:'Link',
            content:'PerspectiveCamera',
            children:[],
            component:()=>import('@/views/baseCase/camera/fourthDemo/index.vue')
          },
          {
            path:'/camera/fifthDemo',
            name:'立体相机（StereoCamera）',
            icon:'Link',
            content:'StereoCamera',
            children:[],
            component:()=>import('@/views/baseCase/camera/fifthDemo/index.vue')
          },
        ]
      },
      {
        path: '/controls',
        name: '控制器',
        icon: 'View',
        content: '几种常见的控制器示例代码',
        children: [
          {
            path:'/controls/firstDemo',
            name:'OrbitControls',
            icon:'Link',
            content:'轨道控制器（OrbitControls）,轨迹球控制器(TrackballControls) 与 OrbitControls 相类似。然而，它不能恒定保持摄像机的up向量。 这意味着，如果摄像机绕过“北极”和“南极”，则不会翻转以保持“右侧朝上”。',
            children:[],
            component:()=>import('@/views/baseCase/controls/firstDemo/index.vue')
          },
          {
            path:'/controls/secondDemo',
            name:'DragControls',
            icon:'Link',
            content:'拖放控制器（DragControls），该类被用于提供一个拖放交互。',
            children:[],
            component:()=>import('@/views/baseCase/controls/secondDemo/index.vue')
          },
          {
            path:'/controls/thirdDemo',
            name:'MapControls',
            icon:'Link',
            content:'地图控制器(MapControls),可以像地图一样拖动',
            children:[],
            component:()=>import('@/views/baseCase/controls/thirdDemo/index.vue')
          },
          {
            path:'/controls/fourthDemo',
            name:'FlyControls',
            icon:'Link',
            content:'飞行控制器（FlyControls），该控制器的另一个实现FirstPersonControls,功能类似.',
            children:[],
            component:()=>import('@/views/baseCase/controls/fourthDemo/index.vue')
          },
          {
            path:'/controls/fifthDemo',
            name:'PointerLockControls',
            icon:'Link',
            content: '指针锁定控制器（PointerLockControls）',
            children: [],
            component:()=>import('@/views/baseCase/controls/fifthDemo/index.vue')
          }
        ]
      },
      {
        path: '/loader',
        name: '加载器',
        icon: 'Switch',
        content: '几种常见的加载器示例代码',
        component:()=>import('@/views/baseCase/loader/firstDemo/index.vue'),
        children: []
      },
      {
        path: '/animation',
        name: '骨骼和动画',
        icon: 'Rank',
        content: '骨骼和动画相关基础教学',
        children: [
          {
            path:'/animation/firstDemo',
            name:'顶点变形法',
            icon:'Link',
            content:'通过改变几何体的顶点位置来实现变形效果。',
            children:[],
            component:()=>import('@/views/baseCase/animation/firstDemo/index.vue')
          },
          {
            path:'/animation/secondDemo',
            name:'形态变换目标',
            icon:'Link',
            content:'Morph Targets允许你定义多个目标形态，然后在它们之间进行插值。Three.js中的MorphTargets属性可以用于创建这些目标。',
            children:[],
            component:()=>import('@/views/baseCase/animation/secondDemo/index.vue')
          },
          {
            path:'/animation/thirdDemo',
            name:'着色器动画',
            icon:'Link',
            content:'使用自定义着色器可以实现复杂的变形效果，例如通过片段着色器或顶点着色器来控制变形。',
            children:[],
            component:()=>import('@/views/baseCase/animation/thirdDemo/index.vue')
          },
          {
            path:'/animation/fourthDemo',
            name:'使用动画库',
            icon:'Link',
            content:'使用动画库(如GSAP,tween)，可以方便地控制几何体的属性，实现变形效果。',
            children:[],
            component:()=>import('@/views/baseCase/animation/thirdDemo/index.vue')
          },
          {
            path:'/animation/fifthDemo',
            name:'骨骼动画',
            icon:'Link',
            content:'骨骼动画通常用于角色动画，通过移动和旋转骨骼来驱动几何体的变形。',
            children:[],
            component:()=>import('@/views/baseCase/animation/thirdDemo/index.vue')
          },
        ]
      },
      {
        path: '/physics',
        name: '物理效果',
        icon: 'PieChart',
        content: '关于物理效果的演示',
        children: [
          {
            path:'/physics/firstDemo',
            name:'AmmoPhysics',
            icon:'Link',
            content:'three.js 内置的物理引擎,还是基于Ammo.js',
            children:[],
            component:()=>import('@/views/baseCase/physics/firstDemo/index.vue')
          },
          {
            path:'/physics/secondDemo',
            name:'原生Ammo.js',
            icon:'Link',
            content:'',
            children:[],
            component:()=>import('@/views/baseCase/physics/secondDemo/index.vue')
          },
          {
            path:'/physics/thirdDemo',
            name:'Octree和Capsule',
            icon:'Link',
            content:'使用Octree(八叉树，一种树形数据结构,Capsule(胶囊碰撞体)来构成的物理效果)',
            children:[],
            component:()=>import('@/views/baseCase/physics/thirdDemo/index.vue')
          }
        ]
      },
      {
        path:'/effectComposer',
        name:'后期处理',
        icon:'ScaleToOriginal',
        content: '该类管理了产生最终视觉效果的后期处理过程链。 后期处理过程根据它们添加/插入的顺序来执行，最后一个过程会被自动渲染到屏幕上。',
        children: [
          {
            path:'/effectComposer/firstDemo',
            name:'发光描边',
            icon:'Link',
            content:'发光描边（OutlinePass)',
            children:[],
            component:()=>import('@/views/baseCase/effectComposer/firstDemo/index.vue'),
          },
          {
            path:'/effectComposer/secondDemo',
            name:'发光通道',
            icon:'Link',
            content:'发光通道（UnrealBloomPass)',
            children:[],
            component:()=>import('@/views/baseCase/effectComposer/secondDemo/index.vue'),
          },
          {
            path:'/effectComposer/thirdDemo',
            name:'环境光遮蔽',
            icon:'Link',
            content:'屏幕空间环境光遮蔽效果(SSAOPass)。',
            children:[],
            component:()=>import('@/views/baseCase/effectComposer/secondDemo/index.vue'),
          },
          {
            path:'/effectComposer/fourthDemo',
            name:'故障效果',
            icon:'Link',
            content:'故障效果(GlitchPass)。',
            children:[],
            component:()=>import('@/views/baseCase/effectComposer/secondDemo/index.vue'),
          },
          {
            path:'/effectComposer/fifthDemo',
            name:'胶片颗粒和扫描线',
            icon:'Link',
            content:'胶片颗粒和扫描线效果(FilmPass)。',
            children:[],
            component:()=>import('@/views/baseCase/effectComposer/secondDemo/index.vue'),
          }
        ],
      },
      {
        path:'/sceneLabeling',
        name:'场景标注',
        icon:'WarnTriangleFilled',
        content: '使用相关的拓展库实现三维场景的标注。',
        children: [
          {
            path:'/sceneLabeling/firstDemo',
            name:'CSS2DRenderer',
            icon:'Link',
            content:'如果你希望将三维物体和基于HTML的标签相结合，则这一渲染器将十分有用。在这里，各个DOM元素也被包含到一个CSS2DObject实例中，并被添加到场景图中。',
            children:[],
            component:()=>import('@/views/baseCase/sceneLabeling/firstDemo/index.vue'),
          },
        ]
      }
    ]
  },
  {
    path: '/',
    name: 'demo',
    component: index,
    icon:'Menu',
    hasSub:false,
    isMenu:true,
    children:[
      {
        path:'/1',
        name:'快速入门',
        icon:'Menu',
        children:[],
        content:'',
        component:()=>import('@/views/firstTest/index.vue')
      },
      {
        path:'/2',
        name:'解析动画',
        icon:'HelpFilled',
        children:[],
        content:'',
        component:()=>import('@/views/secondTest/index.vue')
      },
      {
        path:'/3',
        name:'封装代码',
        icon:'document',
        children:[],
        content:'',
        component:()=>import('@/views/thirdTest/index.vue')
      },
      {
        path:'/4',
        name:'射线拾取',
        icon:'setting',
        children:[],
        content:'',
        component:()=>import('@/views/fourthTest/index.vue')
      },
      {
        path: '/5',
        name: '人头涂鸦',
        icon:'Histogram',
        children:[],
        content:'根据官方示例改编',
        component: () => import('@/views/fifthTest/index.vue')
      },
      {
        path:'/6',
        name:'Css3渲染',
        icon:'Film',
        children:[],
        content:'',
        component:()=>import('@/views/sixthTest/index.vue')
      },
      {
        path:'/7',
        name:'小米Su7',
        icon:'Ticket',
        children:[],
        content:'',
        component:()=>import('@/views/seventhTest/index.vue')
      },
      {
        path:'/8',
        name:'标注实践',
        icon:'Flag',
        children:[],
        content:'',
        component:()=>import('@/views/eighthTest/index.vue')
      },
      {
        path:'/9',
        name:'结合高德',
        icon:'VideoCameraFilled',
        children:[],
        content:'',
        component:()=>import('@/views/ninthTest/index.vue')
      },
      {
        path:'/10',
        name:'骨骼示例',
        icon:'HelpFilled',
        children:[],
        content:'',
        component:()=>import('@/views/tenthTest/index.vue')
      },
      {
        path:'/11',
        name:'场景贴图',
        icon:'Compass',
        children:[],
        content:'',
        component:()=>import('@/views/eleventhTest/index.vue')
      },
      {
        path:'/12',
        name:'飞线Shader',
        icon:'Promotion',
        children:[],
        content:'',
        component:()=>import('@/views/twelveTest/index.vue')
      },
      {
        path:'/13',
        name:'待开发',
        icon:'EditPen',
        children:[],
        content:'',
        component:()=>import('@/views/thirteenthTest/index.vue')
      },
    ]
  },
  {
    path: '/project',
    component: index,
    icon:'Discount',
    name: '综合案例',
    hasSub:true,
    isMenu:true,
    children: [
      {
        path:'/firstProject',
        name:'射击游戏',
        icon:'Open',
        content:'',
        children:[],
        component:()=>import('@/views/project/firstProject/index.vue')
      },
      {
        path:'/secondProject',
        name:'3D展厅',
        content:'',
        icon:'HelpFilled',
        children:[],
        component:()=>import('@/views/project/secondProject/index.vue')
      },
      {
        path:'/thirdProject',
        name:'智慧城市',
        content:'',
        icon:'Operation',
        children:[],
        component:()=>import('@/views/project/thirdProject/index.vue')
      }
    ]
  },
  {
    path: '/own',
    name: '个人中心',
    hasSub:false,
    isMenu:false,
    component: ()=>import('@/views/ownCenter.vue'),
    icon:'Menu',
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
