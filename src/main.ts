import { createApp } from 'vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import store from './stores/index'
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// 创建实例
app.use(ElementPlus, { size: 'small', zIndex: 3000 })
//调用方法
app.use(router)

//store挂载
app.use(store)
app.mount('#app')
