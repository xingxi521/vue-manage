<template>
    <div class="login-main">
        <div class="login-modal">
            <h1 class="login-title">后台管理系统</h1>
            <el-form :model="formData" :rules="rules" ref="ruleForm" status-icon>
                <el-form-item prop="userName">
                    <el-input v-model="formData.userName" prefix-icon="el-icon-user" placeholder="请输入账号"></el-input>
                </el-form-item>
                <el-form-item prop="passWord">
                    <el-input v-model="formData.passWord"  placeholder="请输入密码" prefix-icon="el-icon-view" type="password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" class="login-btn" @click="loginHandler">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import publicFn from '../../utils/publicFn'
export default {
    name:'Login',
    data(){
        return{
            formData:{
                userName:'',
                passWord:''
            },
            rules:{
                userName:[{required: true, message: '请输入账号', trigger: 'blur'}],
                passWord:[{required: true, message: '请输入密码', trigger: 'blur'}],
            }
        }
    },
    methods:{
        loginHandler(){
            this.$refs['ruleForm'].validate(async (valid) => {
                if (valid) {
                    const res = await this.$api.postLogin({
                        userName: this.formData.userName,
                        userPwd: this.formData.passWord
                    })
                    this.$store.commit('SET_USERINFO',res);
                    await this.loadAsyncRoutes()
                    this.$router.replace('/');
                } else {
                    return false;
                }
            });
        },
        async loadAsyncRoutes() {
            try {
                const { menuList } = await this.$api.getPermissonMenuList()
                const routes = publicFn.gennerateRoutes(menuList)
                routes.forEach(item => {
                    this.$router.addRoute('Home',item)
                })
            } catch (error) {
                console.log(error.stack);
            }
        }
    }
}
</script>
<style lang="less" scoped>
    .login-main{
        background-color: #f8fcff;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        .login-modal{
            width: 500px;
            padding: 50px;
            background-color: #fff;
            box-shadow: 0 0 14px 7px #c7c9cb4d;
            .login-title{
                text-align: center;
                font-size: 26px;
                font-weight: 400;
                margin-bottom: 30px;
            }
            .login-btn{
                width: 100%;
            }
        }
    }
</style>