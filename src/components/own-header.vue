<script setup>
import {useRouter} from "vue-router";

const router=useRouter()
const handleSelect = (e) => {
    if (e=="5"){
        router.push('/own')
    }
}
const list=[
    {
        name:'文档资料',
        path:'',
        children:[
            {
                name:'three.js 官方文档',
                path:'https://threejs.org/docs/index.html#manual/zh/'
            },
            {
                name:'three.js gui文档',
                path:'https://lil-gui.georgealways.com/'
            },
            {
                name:'three.js 中文网',
                path:'http://www.webgl3d.cn/pages/4a14ce/'
            },
            {
                name:'three.js 实战手册',
                path:'https://discoverthreejs.com/zh/'
            },
            {
                name:'element-plus 文档',
                path:'https://element-plus.org/zh-CN/component/overview.html'
            },
            {
                name:'着色器教程',
                path:'https://thebookofshaders.com/01/?lan=ch'
            },
            {
                name:'WebGL 理论基础',
                path: 'https://webglfundamentals.org/webgl/lessons/zh_cn/'
            }
        ]
    },
    {
        name:'3d 资源',
        path: '',
        children: [
            {
                path:'https://quaternius.com/index.html',
                name: 'quaternius(3d模型*)'
            },
            {
              path:'https://sketchfab.com/3d-models',
              name: 'Sketchfab（3d模型）'
            },
            {
                name:'3d 模型(Free 3D)',
                path:'https://free3d.com/3d-models/'
            },
            {
                name:'3d 模型(老陈打码)',
                path:'https://www.cpengx.cn/'
            },
            {
                name:'官方示例模型',
                path:'https://github.com/mrdoob/three.js/tree/master/examples/models'
            },
            {
                name:'纹理贴图',
                path:'https://www.textures.com/library'
            },
            {
                name:'360°全景贴图',
                path:'https://www.flickr.com/photos/tags/360%C2%B0panorama/'
            },
            {
                name:'OPEN3DMODEL',
                path:'https://open3dmodel.com/zh-CN'
            },
            {
                name:'太阳系纹理贴图',
                path:'https://www.solarsystemscope.com/textures/'
            },
            {
                name:'模型网',
                path:'https://www.cgmodel.com/'
            }
        ]
    },
    {
        name:'实战资源',
        path:'',
        children: [
            {
                name:'three.js作品展示平台',
                path:'https://github.com/bosombaby/web3d-product?tab=readme-ov-file',
            },
            {
                name:'icegl可借鉴的项目',
                path:'https://gitee.com/ice-gl/icegl-three-vue-tres'
            },
            {
                name:'Three.js达人课相关案例',
                path:'https://github.com/johnson2heng/GitChat-Three.js?tab=readme-ov-file'
            },
            {
                path:'https://github.com/gkjohnson/three-mesh-bvh',
                name:'Github项目1'
            }
        ]
    },
    {
        name:'国外教学网站',
        path:'',
        children: [
            {
                name:'tutorialsPoint',
                path:'https://www.tutorialspoint.com/threejs/index.htm'
            },
            {
                name:'udemy免费视频',
                path:'https://www.udemy.com/topic/threejs/?price=price-free&sort=popularity'
            },
            {
                name:'Alison Three.js游戏开发',
                path:'https://alison.com/course/3d-application-and-game-development-with-three-js'
            }
        ]
    },
    {
      name:'实用工具',
      path: '',
      children: [
          {
              name:'制作立方体贴图',
              path:'https://matheowis.github.io/HDRI-to-CubeMap/'
          },
          {
              name:'3d 模型格式转换',
              path:'https://www.3dwhere.com/conv'
          },
          {
              name:'3d 模型在线查看器',
              path:'https://3dviewer.net/#'
          },
          {
              name:'地图数据',
              path:'https://datav.aliyun.com/portal/school/atlas/area_selector'
          },
          {
              name:'文字样式转json',
              path:'https://gero3.github.io/facetype.js/'
          }
      ]
    },
    {
        name:'个人中心',
        path:'/own'
    },
]
</script>

<template>
    <el-menu
        class="el-menu-demo"
        mode="horizontal"
        :ellipsis="false"
        @select="handleSelect"
    >
        <el-menu-item index="0">
            <img
                style="width: 50px;border-radius: 50%"
                :src="require('@/assets/favicon.png')"
                alt="Element logo"
            />
            <span style="margin-left: 10px;font-size: 20px;font-weight: bold">你好</span>
        </el-menu-item>
        <div class="flex-grow" />
        <div v-for="(item,num) in list">
            <el-menu-item :index="num.toString()" v-if="item.path">{{item.name}}</el-menu-item>
            <el-sub-menu :index="num.toString()" v-else>
                <template #title>{{item.name}}</template>
                <el-menu-item v-for="i in item.children">
                    <a slot="title" :href="i.path" target="_blank" style="width:100%;text-align: center">{{i.name}}</a>
                </el-menu-item>
            </el-sub-menu>
        </div>

    </el-menu>
</template>

<style scoped>
a{
    color: #409dfd;
    text-decoration: none
}
.flex-grow {
    flex-grow: 1;
}
</style>
