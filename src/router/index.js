import { createRouter,createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Welcome from '../views/Welcome/Welcome.vue'
const routes = [
    {
        path:'/',
        name:'Home',
        component:Home,
        redirect: '/welcome',
        meta:{
            name:'欢迎使用Vue3通用后台'
        },
        children:[
            {
                path:'welcome',
                name:'Welcome',
                component:Welcome,
                meta:{
                    name:'欢迎页'
                }
            }
        ]
    },
    {
        path:'/login',
        name:'Login',
        component:()=>import('../views/Login/Login.vue'),
        meta:{
            name:'登录页面'
        }
    }
];
const router = createRouter({
    history:createWebHashHistory(),
    routes
});
export default router;