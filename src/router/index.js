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
                path:'/system/users',
                name:'Users',
                component:() => import('../views/Users/Users.vue'),
                meta:{
                    name:'用户管理'
                }
            },
            {
                path:'/system/menu',
                name:'Menu',
                component:() => import('../views/Menu/Menu.vue'),
                meta:{
                    name:'菜单管理'
                }
            },
            {
                path:'/system/roles',
                name:'Roles',
                component:() => import('../views/Roles/Roles.vue'),
                meta:{
                    name:'角色管理'
                }
            },
            {
                path:'/system/dept',
                name:'Dept',
                component:() => import('../views/Dept/Dept.vue'),
                meta:{
                    name:'部门管理'
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