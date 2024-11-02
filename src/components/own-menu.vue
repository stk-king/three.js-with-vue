<script setup>
import {ref,onMounted} from 'vue'
import { useRouter } from 'vue-router';
import Ammo from "@/utils/ammo";
const isCollapse=ref(false)
const router = useRouter();
const handleSelect = (index) => {
    router.push(index);
};
try {
    window.Ammo= Ammo
}catch (e){
    console.log("加载Ammo失败")
}


onMounted(()=>{
    console.log("routers:",router.options.routes)
    if (window.innerWidth<480){
        isCollapse.value=true
    }else{
        isCollapse.value=false
    }
})

</script>

<template>
    <el-menu class="el-menu-vertical-demo">
        <div v-for="(item,index) in router.options.routes" >
            <el-menu-item :index="i.path" v-if="!item.hasSub && item.isMenu" v-for="i in item.children" @click="handleSelect(i.path)">
                <el-icon><component :is="i.icon" /></el-icon>
                <template #title >
                    <el-tooltip
                        v-if="i.content"
                        class="box-item"
                        effect="dark"
                        :content="i.content"
                        placement="left">
                        <span class="text">{{i.name}}</span>
                    </el-tooltip>
                    <span v-else class="text">{{i.name}}</span>
                </template>
            </el-menu-item>
            <el-sub-menu :index="item.name" v-else-if="item.name!=='home' && item.isMenu">
                <template #title>
                    <el-icon><component :is="item.icon" /></el-icon>
                    <span>{{item.name}}</span>
                </template>
                <el-menu-item-group>
                    <div v-for="i in item.children">
                        <el-menu-item @click="handleSelect(i.path)" v-if="i.children.length===0">
                            <template #title>
                                <el-icon><component :is="i.icon" /></el-icon>
                                <el-tooltip
                                    v-if="i.content"
                                    class="box-item"
                                    effect="dark"
                                    :content="i.content"
                                    placement="left">
                                    <span class="text">{{i.name}}</span>
                                </el-tooltip>
                                <span v-else class="text">{{i.name}}</span>
                            </template>
                        </el-menu-item>
                        <el-sub-menu :index="i.path" v-else>
                            <template #title>
                                <el-icon><component :is="i.icon" /></el-icon>
                                <span>{{i.name}}</span>
                            </template>
                            <el-menu-item :index="ii.path" @click="handleSelect(ii.path)" v-for="ii in i.children">
                                <template #title>
                                    <el-icon><component :is="ii.icon" /></el-icon>
                                    <el-tooltip
                                        v-if="ii.content"
                                        class="box-item"
                                        effect="dark"
                                        :content="ii.content"
                                        placement="left">
                                        <span class="text">{{ii.name}}</span>
                                    </el-tooltip>
                                    <span class="text" v-else>{{ii.name}}</span>
                                </template>
                            </el-menu-item>
                        </el-sub-menu>
                    </div>
                </el-menu-item-group>
            </el-sub-menu>
        </div>
    </el-menu>
</template>

<style scoped>
.el-menu-vertical-demo{
    height: calc(100vh - 60px);
    overflow: auto;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */
}
::-webkit-scrollbar {
    display: none; /* Chrome Safari */
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}
.text{
    text-overflow: ellipsis;
    overflow: hidden;
}
:deep(.el-menu-item-group__title){
    display: none !important;
}
</style>
