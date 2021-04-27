<template>
    <template v-for="item in menuList" :key="item._id">
        <el-submenu :index="item.path" v-if="item.children && item.children.length > 0 && item.children[0].menuType == 1">
            <template #title>
                <i :class="item.icon"></i>
                <span>{{item.menuName}}</span>
            </template>
            <!-- 递归组件，再次循环判断子菜单 -->
            <MenuTree :menuList="item.children"/>
        </el-submenu>
        <el-menu-item v-else :index="item.path">{{item.menuName}}</el-menu-item>
    </template>
</template>
<script>
export default {
    name:'MenuTree',
    props:{
        menuList:{
            type:Array,
            default:function(){
                return[];
            }
        }
    }
}
</script>