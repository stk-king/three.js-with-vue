import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as icons from '@element-plus/icons-vue'

require('@/mock/index');


const app=createApp(App)
app.use(ElementPlus)

Object.keys(icons).forEach(key => {
    app.component(key, icons[key])
})

app.use(router)
app.mount('#app')
