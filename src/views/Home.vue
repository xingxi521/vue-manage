<template>
    <div class="home-main">
        <div class="nav-left" :class="isCollapse?'fold-menu':''">
            <div class="nav-left-logo">
                <img src="./../assets/logo.png" alt="">
                <span>Manger</span>
            </div>
            <el-menu
                default-active="2"
                class="el-menu-vertical-demo"
                background-color="#001529"
                text-color="#fff"
                active-text-color="#409eff"
                :collapse="isCollapse"
            >
                <el-submenu index="1">
                    <template #title>
                        <i class="el-icon-setting"></i>
                        <span>系统管理</span>
                    </template>
                    <el-menu-item index="1-1">选项1</el-menu-item>
                    <el-menu-item index="1-2">选项2</el-menu-item>
                </el-submenu>
                <el-submenu index="2">
                    <template #title>
                        <i class="el-icon-setting"></i>
                        <span>审批管理</span>
                    </template>
                    <el-menu-item index="2-1">选项1</el-menu-item>
                    <el-menu-item index="2-2">选项2</el-menu-item>
                </el-submenu>
            </el-menu>
        </div>
        <div class="content-right" :class="isCollapse?'fold-content':''">
            <div class="top-bar">
                <div class="bar-left">
                    <i :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'" @click="toggleMenue"></i>
                    <span>面包屑</span>
                </div>
                <div class="top-userinfo">
                    <el-badge is-dot class="item"><i class="el-icon-bell bellicon"></i></el-badge>
                    <el-dropdown>
                        <span class="userinfo-name">星系</span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="emain">邮箱:123@qq.com</el-dropdown-item>
                                <el-dropdown-item command="logout">退出</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>
            <div class="router-wrapper">
                <div class="router-page">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'Home',
    data(){
        return{
            isCollapse:false
        }
    },
    methods:{
        //收缩菜单
        toggleMenue(){
            this.isCollapse = !this.isCollapse;
        }
    }
}
</script>
<style lang="less">
    .home-main{
        position: relative;
        .nav-left{
            position: fixed;
            width: 200px;
            height: 100vh;
            background-color: #001529;
            overflow-y: auto;
            transition: all .5s;
            .nav-left-logo{
                display: flex;
                align-items: center;
                font-size: 18px;
                height: 50px;
                span{
                    font-size: 25px;
                    color: #fff;
                }
                img{
                    margin: 0 16px;
                    width: 32px;
                    height: 32px;
                }
            }
            .el-menu-item:hover {
                background-color: #0c2b42 !important;
            }
            .el-menu-vertical-demo{
                border:none
            }
            &.fold-menu{
                width: 65px;
            }
        }
        .content-right{
            margin-left: 200px;
            transition: all .5s;
            &.fold-content{
                margin-left: 65px;
            }
            .top-bar{
                height: 50px;
                line-height: 50px;
                background-color: #fff;
                display: flex;
                justify-content: space-between;
                padding-left: 20px;
                padding-right: 50px;
                border-bottom: 1px solid #ddd;
                .bar-left{
                    i{
                        margin-right: 10px;
                        font-size: 18px;
                        cursor: pointer;
                    }
                }
                .top-userinfo{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .item{
                        line-height: 30px;
                    }
                    .bellicon{
                        font-size: 20px;
                        margin-right: 15px;
                        
                    }
                    .userinfo-name{
                        font-size: 18px;
                        cursor: pointer;
                    }
                    .el-badge__content.is-fixed.is-dot{
                        right: 19px;
                    }
                }
            }
            .router-wrapper{
                background-color: #eef0f3;
                padding: 20px;
                height: calc(~"100vh - 50px");
                .router-page{
                    background-color: #fff;
                    height: 100%;
                }
            }
        }
    }
</style> 