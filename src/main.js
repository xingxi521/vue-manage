import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import stroage from './utils/stroage';
import api from './api';
import store from './store'
import "element-plus/packages/theme-chalk/src/base.scss"
const app = createApp(App);
// 按钮权限判断
app.directive('permisson', {
    beforeMount(el, binding) {
        const btnList = stroage.getItem('btnList')
        if (!btnList.includes(binding.value)) {
            // 解决进入页面按钮会闪一下再消失问题
            el.style.display = 'none'
            setTimeout(function(){
                el.parentNode.removeChild(el)
            },0)
        }
    }
})
app.config.globalProperties.$stroage = stroage;
app.config.globalProperties.$api = api;
app.use(router).use(store).use(ElementPlus).mount('#app')