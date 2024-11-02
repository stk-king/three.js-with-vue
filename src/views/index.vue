<script setup>
import Stats from 'three/addons/libs/stats.module.js';
import OwnMenu from "@/components/own-menu.vue";
import OwnHeader from "@/components/own-header.vue";
import {onMounted, ref} from 'vue'
import OwnCenter from "@/views/ownCenter.vue";
import Introduce from "@/views/introduce.vue";

const wd=ref('200px')
const href=ref(null)
onMounted(()=>{
    href.value=window.location.pathname
    const stats = new Stats();
    document.querySelector('.common-layout').appendChild(stats.domElement);
    stats.domElement.style.top = '';
    stats.domElement.style.right = '0px';
    stats.domElement.style.left = '';
    stats.domElement.style.bottom = '0px';
    stats.setMode(1);

    let is=true
    const render=()=>{
        while (is){
            try {
                stats.update();
                is=false
            }catch (e){
                is=true
            }
            console.log("==")
        }

        requestAnimationFrame(render)
    }
    render()

    if (window.innerWidth<480){
        wd.value='60px'
    }else{
        wd.value='200px'
    }
})
</script>

<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <own-header></own-header>
            </el-header>
            <el-container>
                <el-aside :width="wd">
                    <own-menu></own-menu>
                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<style scoped>
.el-header,.el-main{
    padding: 0;
}
</style>
