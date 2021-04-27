<template>
    <div class="welcome-main">
        <div class="welcome-left">
            <div class="main-title">欢迎使用</div>
            <div class="sub-title">星系通用后台管理系统V1.0</div>
            <div class="desc">- Vue3.0+ElementPlus+Node+Mongo打造通用后台管理系统</div>
        </div>
        <div class="welcome-right"></div>
    </div>
</template>
<script>
export default {
    name:'Welcome'
}
</script>
<style lang="less" scoped>
    .welcome-main{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        .welcome-left{
            margin-bottom: 50px;
            .main-title{
                font-size: 30px;
                font-weight: bold;
            }
            .sub-title{
                font-size: 40px;
                line-height: 62px;
                color: #409eff;
            }
            .desc{
                text-align: right;
                font-size: 14px;
                color: #999;
            }
        }
        .welcome-right{
            background:url('./../../assets/images/welcome.png');
            width: 371px;
            height: 438px;
            margin-left: 200px;
        }
    }
</style>