import * as THREE from 'three'

export const resources = [
    {
        name: 'bgm',
        type: 'audio',
        path: '/assets/XiaoMiSu7/audio/bgm.mp3'
    },
    {
        name: 'sm_car',
        type: 'gltfModel',
        path: '/assets/XiaoMiSu7/mesh/sm_car.gltf'
    },
    {
        name: 'sm_startroom',
        type: 'gltfModel',
        path: '/assets/XiaoMiSu7/mesh/sm_startroom.raw.gltf'
    },
    {
        name: 'sm_speedup',
        type: 'gltfModel',
        path: '/assets/XiaoMiSu7/mesh/sm_speedup.gltf'
    },
    {
        name: 'skin1',
        type: 'texture',
        path: '/assets/XiaoMiSu7/texture/skin1.jpg'
    },
    {
        name: 'skin2',
        type: 'texture',
        path: '/assets/XiaoMiSu7/texture/skin2.jpg'
    },
    {
        name: 'skin3',
        type: 'texture',
        path: '/assets/XiaoMiSu7/texture/skin3.jpg'
    },
    {
        name: 'skin4',
        type: 'texture',
        path: '/assets/XiaoMiSu7/texture/skin4.webp'
    },
    {
        name: 'ut_car_body_ao',
        type: 'texture',
        path: '/assets/XiaoMiSu7/texture/t_car_body_AO.raw.jpg'
    },
    {
        name: 'ut_startroom_ao',
        type: 'texture',
        path: '/assets/XiaoMiSu7/texture/t_startroom_ao.raw.jpg'
    },
    {
        name: 'ut_startroom_light',
        type: 'texture',
        path: '/assets/XiaoMiSu7/texture/t_startroom_light.raw.jpg'
    },
    {
        name: 'ut_floor_normal',
        type: 'texture',
        path: '/assets/XiaoMiSu7/texture/t_floor_normal.webp'
    },
    {
        name: 'ut_floor_roughness',
        type: 'texture',
        path: '/assets/XiaoMiSu7/texture/t_floor_roughness.webp'
    },
    {
        name: 'ut_env_night',
        type: 'hdrTexture',
        path: '/assets/XiaoMiSu7/texture/t_env_night.hdr'
    },
    {
        name: 'ut_env_light',
        type: 'hdrTexture',
        path: '/assets/XiaoMiSu7/texture/t_env_light.hdr'
    }
]

export const loadResourceByName=async (name)=>{
    const item=resources.find(resource=>resource.name===name);
    if (item){
        const textureLoader=new THREE.TextureLoader();
        return textureLoader.loadAsync(item.path)
    }else{
        return alert('请检查资源是否存在')
    }
}
