import {defineStore} from "pinia";

export const useSystemStore=defineStore('system',{
    state:()=>({
        href:''
    }),
    actions:{
        setHref(href){
            this.href=href;
        }
    },
})
