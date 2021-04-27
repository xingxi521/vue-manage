import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import stroage from './utils/stroage';
import api from './api';
import store from './store'
const app = createApp(App);
app.config.globalProperties.$stroage = stroage;
app.config.globalProperties.$api = api;
app.use(router).use(store).use(ElementPlus).mount('#app')
