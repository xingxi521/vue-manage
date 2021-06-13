import { createRouter,createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import api from '../api'
import publicFn from '../utils/publicFn'
import storage from '../utils/stroage'
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
    },
    {
        path:'/404',
        name:'404',
        component:()=>import('../views/404.vue')
    }
];

const router = createRouter({
    history:createWebHashHistory(),
    routes
})

// 加载动态路由

async function loadAsyncRoutes() {
    try {
        // 有登录再进行路由表动态加载
        if (storage.getItem('userInfo') && storage.getItem('userInfo').token) {
            const { menuList } = await api.getPermissonMenuList()
            const routes = publicFn.gennerateRoutes(menuList)
            routes.forEach(item => {
                router.addRoute('Home',item)
            })
        }
    } catch (error) {
        console.log(error.stack);
    }
}

// 进入路由守卫前，路由表必须加载完，否则如果在守卫里再加 即使添加成功了，也不生效了
await loadAsyncRoutes()

// 判断是否具备当前路由页面权限
function checkPermisson(path) {
    const hasPermisson = router.getRoutes().filter(item => item.path === path).length
    if (hasPermisson) {
        return true
    } else {
        return false
    }
}

router.beforeEach(async (to, from, next) => {
    if (checkPermisson(to.path)) {
        next()
    } else {
        next('/404')
    }
})

export default router;