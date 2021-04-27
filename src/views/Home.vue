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
                <MenuTree :menuList="menuList"/>
            </el-menu>
        </div>
        <div class="content-right" :class="isCollapse?'fold-content':''">
            <div class="top-bar">
                <div class="bar-left">
                    <i :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'" @click="toggleMenue"></i>
                    <span>面包屑</span>
                </div>
                <div class="top-userinfo">
                    <el-badge :is-dot="noticeCount> 0 ? true : false" class="item"><i class="el-icon-bell bellicon"></i></el-badge>
                    <el-dropdown @command="dropMenuHandler">
                        <span class="userinfo-name">{{userInfo.userName}}</span>
                        <template #dropdown>
                            <el-dropdown-menu >
                                <el-dropdown-item command="emain">邮箱：{{userInfo.userEmail}}</el-dropdown-item>
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
import MenuTree from './MenuTree/MenuTree.vue'
export default {
    name:'Home',
    components:{
        MenuTree
    },
    data(){
        return{
            isCollapse:false,//菜单是否折叠
            userInfo:this.$store.state.userInfo,//用户信息
            noticeCount:0,//待处理信息数量
            menuList:[],//菜单列表数据
        }
    },
    mounted() {
       this.getApproveCountRequest();
       this.getMenuListRequest();
    },
    methods:{
        //收缩菜单
        toggleMenue(){
            this.isCollapse = !this.isCollapse;
        },
        //下拉菜单点击事件
        dropMenuHandler(command){
            if(command === 'emain'){
                return
            }else if(command === 'logout'){//退出登陆
                this.$store.commit('SET_USERINFO','');
                this.$router.replace('/login');
            }
        },
        //获取待处理审批数量
        async getApproveCountRequest(){
            const count = await this.$api.getApproveCount();
            this.noticeCount = count;
        },
        //获取菜单列表数据
        async getMenuListRequest(){
            const res = await this.$api.postMenuList({
                menuName:'123',
                menuState:1
            });
            this.menuList = res;
            console.log('菜单列表数据',res);
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
                        margin-top: 6px;
                    }
                    .bellicon{
                        font-size: 20px;
                        margin-right: 15px;
                        
                    }
                    .userinfo-name{
                        font-size: 18px;
                        cursor: pointer;
                        color: #409eff;
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