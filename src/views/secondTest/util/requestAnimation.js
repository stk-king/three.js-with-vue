import { Clock } from 'three';

const clock = new Clock();
export class RequestAnimation{
    constructor(camera,scene,renderer) {
        this.camera=camera
        this.scene=scene
        this.renderer=renderer
        this.updatables=[]
    }

    start(){
        // 每个可用帧都会调用的函数。 如果传入‘null’,所有正在进行的动画都会停止。
        this.renderer.setAnimationLoop(()=>{
            this.tick()
            this.renderer.render(this.scene,this.camera)
        })
    }
    stop(){
        this.renderer.setAnimationLoop(null);
    }
    tick() {
        const delta=clock.getDelta()
        for(const object of this.updatables) {
            object.tick(delta);
        }
    }
}
