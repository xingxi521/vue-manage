import { createRouter,createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Welcome from '../views/Welcome/Welcome.vue'
const routes = [
    {
        path:'/',
        name:'Home',
        component:Home,
        redirect: '/welcome',
        children:[
            {
                path:'welcome',
                name:'Welcome',
                component:Welcome,
            }
        ]
    },
    {
        path:'/login',
        name:'Login',
        component:()=>import('../views/Login/Login.vue')
    }
];
const router = createRouter({
    history:createWebHashHistory(),
    routes
});
export default router;