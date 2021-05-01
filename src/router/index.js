import { createRouter,createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
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
                component:() => import('../views/Welcome/Welcome.vue'),
                meta:{
                    name:'欢迎页'
                }
            },
            {
                path:'users',
                name:'Users',
                component:() => import('../views/Users/Users.vue'),
                meta:{
                    name:'用户管理'
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