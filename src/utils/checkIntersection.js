/**
 * 三维物体与鼠标之间的触碰
 * @param scene 场景或group
 */

import * as THREE from 'three'
export default class CheckIntersection{
    constructor(scene,camera,container) {
        this.scene=scene;
        this.camera=camera;
        this.container=container;
        this.raycaster=new THREE.Raycaster();
        this.mouse=new THREE.Vector2();
        this.object=null;
        this.init()
    }

    init(){
        //注册pointermove事件用于在用户移动指针（鼠标、触摸笔或类似设备）时触发。
        window.addEventListener( 'pointermove', this.onPointerMove.bind(this) );
        window.addEventListener('pointerdown',this.addHandle.bind(this))
        window.addEventListener('pointerup',this.removeHandle.bind(this))
    }

    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
    onPointerMove(event){
        const rect = this.container.getBoundingClientRect();
        const containerWidth = rect.width;
        const containerHeight = rect.height;
        this.mouse.x = ( event.x - rect.left) / containerWidth * 2 - 1;
        this.mouse.y = - ( event.y - rect.top) / containerHeight * 2 + 1;
    }

    addHandle(){
        this.object=null
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true); //若为true，则同时也会检测所有物体的后代。
        if (intersects.length > 0) {
            this.object=intersects[0].object
        }
    }

    removeHandle(){

    }

    destroy(){
        window.removeEventListener('pointermove',this.onPointerMove);
        window.removeEventListener('pointerdown',this.addHandle);
        window.removeEventListener('pointerup',this.removeHandle);
    }
}
