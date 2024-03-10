import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from './router'
import 'normalize.css'
import '@/assets/styles/common.less'
import ui from './components/library/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './mock'

const app = createApp(App)

const pinia = createPinia()

// 注册ElementPlusIconsVue组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus)
app.use(pinia)
// 应用pinia持久化工具
pinia.use(piniaPluginPersistedstate)
app.use(router)
// 应用ui(XtxSkeleton)插件
app.use(ui)

app.mount('#app')

// createApp(App)
// .use(pinia)
// .use(router)
// .use(ui)
// .use(ElementPlus)
// .mount('#app')