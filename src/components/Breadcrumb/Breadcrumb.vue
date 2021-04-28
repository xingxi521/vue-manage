<template>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="(item,index) in breadData" :key="item.path">
            <router-link :to="item.path" v-if="index == 0">{{item.meta.name}}</router-link>
            <span v-else>{{item.meta.name}}</span>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>
<script>
export default {
    name:'Breadcrumb',
    computed:{
        //获取路由里的matched
        breadData(){
            return this.$route.matched
        }
    }
}
</script>