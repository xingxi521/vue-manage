<template>
    <div class="menu-main">
        <!-- 头部查询功能区域 -->
        <div class="menu-top">
            <el-form :inline="true" :model="selectData" ref="selectForm">
                <el-form-item label="菜单名称" prop="menuName">
                    <el-input v-model="selectData.menuName" placeholder="请输入菜单名称"></el-input>
                </el-form-item>
                <el-form-item label="菜单状态" prop="menuState">
                    <el-select v-model="selectData.menuState" placeholder="请选择">
                        <el-option label="正常" :value="1"></el-option>
                        <el-option label="停用" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onQueryHandler">查询</el-button>
                    <el-button @click="onResetHandler('selectForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 表格区域 -->
        <div class="menu-bottom">
            <div class="menu-bottom-top">
                <el-button type="primary" @click="addMenuHandler(1)" v-permisson="'menu-create'">新增菜单</el-button>
            </div>
            <el-table
            :data="menuListData"
            style="width: 100%;margin-bottom: 20px;"
            row-key="_id"
            :tree-props="{children: 'children'}">
                <el-table-column :prop="item.props" :label="item.label" v-for="item in tablePros" :key="item.props" :formatter="item.formatter" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" width="250">
                    <template #default="scope">
                        <el-button size="mini" @click="addMenuHandler(2, scope.row)" type="primary" v-permisson="'menu-create'">添加</el-button>
                        <el-button size="mini" @click="handleEdit(scope.row)" v-permisson="'menu-edit'">编辑</el-button>
                        <el-button size="mini" type="danger" @click="handleDelete(scope.row)" v-permisson="'menu-delete'">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
        title="添加菜单"
        v-model="dialogVisible"
        width="35%"
        :close-on-click-modal="false"
        @close="closeHandler"
        >
            <el-form :model="menuForm" :rules="rules" ref="menuRuleForm" label-width="100px">
                <el-form-item label="父级菜单" prop="parentId">
                    <el-cascader :options="menuListData" 
                    :props="{ checkStrictly: true,value:'_id',label:'menuName' }" 
                    clearable 
                    v-model="menuForm.parentId"
                    placeholder="请选择"
                    >
                    </el-cascader>
                    <span style="color:#999;margin-left:10px">如果不选创建一级菜单</span>
                </el-form-item>
                <el-form-item label="菜单类型" prop="menuType">
                    <el-radio v-model="menuForm.menuType" :label="1">菜单</el-radio>
                    <el-radio v-model="menuForm.menuType" :label="2">按钮</el-radio>
                </el-form-item>
                <el-form-item :label="menuForm.menuType === 1?'菜单名称':'按钮名称'" prop="menuName">
                    <el-input v-model="menuForm.menuName" :placeholder="menuForm.menuType == 1?'请输入菜单名称':'输入按钮名称'"></el-input>
                </el-form-item>
                <el-form-item label="权限标识" prop="menuCode" v-if="menuForm.menuType == 2">
                    <el-input v-model="menuForm.menuCode" placeholder="请输入唯一标识"></el-input>
                </el-form-item>
                <el-form-item label="菜单路由" prop="path" v-if="menuForm.menuType == 1">
                    <el-input v-model="menuForm.path" placeholder="请输入菜单路由"></el-input>
                </el-form-item>
                <el-form-item label="菜单图标" prop="icon" v-if="menuForm.menuType == 1">
                    <el-input v-model="menuForm.icon" placeholder="请输入图标(element-ui的图标库)"></el-input>
                </el-form-item>
                <el-form-item label="组件路径" prop="component" v-if="menuForm.menuType == 1">
                    <el-input v-model="menuForm.component" placeholder="请输入组件路径"></el-input>
                </el-form-item>
                <el-form-item label="菜单状态" prop="menuState" v-if="menuForm.menuType == 1">
                    <el-radio-group v-model="menuForm.menuState">
                        <el-radio :label="1">正常</el-radio>
                        <el-radio :label="2">停用</el-radio>
                    </el-radio-group>
                    
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                <el-button @click="onCancelHandler">取 消</el-button>
                <el-button type="primary" @click="onSubmitHandler">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script>
import publicFn from '../../utils/publicFn'
export default {
    name:'Menu',
    data(){
        return{
            //查询数据对象
            selectData:{
                menuState:1
            },
            //动态表格字段
            tablePros:[
                {
                    props:'menuName',
                    label:'菜单名称'
                },
                {
                    props:'icon',
                    label:'图标'
                },
                {
                    props:'menuType',
                    label:'菜单类型',
                    formatter(row,col,value){
                        return{
                            1:'菜单',
                            2:'按钮'
                        }[value]
                    }
                },
                {
                    props:'menuCode',
                    label:'权限标识'
                },
                {
                    props:'path',
                    label:'路由地址'
                },
                {
                    props:'component',
                    label:'组件路径'
                },
                {
                    props:'menuState',
                    label:'菜单状态',
                    formatter(row,col,value){
                        return{
                            1:'正常',
                            2:'暂停'
                        }[value]
                    }
                },
                {
                    props:'createTime',
                    label:'创建时间',
                    formatter(row,col,value){
                        return publicFn.formateDate(new Date(value));
                    }
                }
            ],
            menuListData:[],//菜单列表数据
            dialogVisible:false,//添加菜单弹窗控制
            //添加菜单表单数据
            menuForm:{
                menuType:1,
                menuState:1,
                parentId:[null]
            },
            //表单验证规则
            rules:{
                menuName:[
                    { required: true, message: '请输入菜单名称', trigger: 'blur' }
                ]
            },
            action:'create'
        }
    },
    mounted() {
        this.getMenuListRequest();
    },
    methods:{
        //重置表单事件
        onResetHandler(formName){
            // this.$refs[formName].resetFields();
            this.menuForm = {
                menuType:1,
                menuState:1,
                parentId:[null]
            };
        },
        //获取菜单列表
        async getMenuListRequest(){
            try {
                const res = await this.$api.postMenuList({...this.selectData});
                this.menuListData = res;
            } catch (error) {
                this.$message.error(error.stack);
            }
        },
        //添加-修改-删除请求
        async postMenuC_U_DRequest(){
            try {
                await this.$api.postMenuC_U_D({...this.menuForm,action:this.action});
                if(this.action === 'create'){
                    this.$message.success('创建菜单成功！');
                    this.onResetHandler('menuRuleForm');
                }else if(this.action === 'edit'){
                    this.$message.success('编辑菜单成功！');
                    this.onResetHandler('menuRuleForm');
                }else if(this.action === 'delete'){
                    this.$message.success('删除菜单成功！');
                }
                this.getMenuListRequest();
                this.dialogVisible = false;
            } catch (error) {
                this.$message.error(error.stack);
                return Promise.reject(error.stack);
            }
        },
        //查询按钮事件
        onQueryHandler(){
            this.getMenuListRequest();
        },
        //添加菜单按钮事件
        addMenuHandler(type,row){
            this.dialogVisible = true;
            if(type === 1){
                this.action = 'create';
            }else{//每行的添加按钮
                this.$nextTick(()=>{
                    this.menuForm.parentId = [...row.parentId,row._id].filter(item => item);
                    this.menuForm.menuType = 1;
                });
                
            }
        },
        //弹窗确定按钮事件
        onSubmitHandler(){
            this.$refs['menuRuleForm'].validate((valid) => {
                if (valid) {
                    this.postMenuC_U_DRequest();
                } else {
                    this.$message.error('请填写完整再进行提交');
                    return false;
                }
            });
        },
        //弹窗取消按钮事件
        onCancelHandler(){
            this.onResetHandler('menuRuleForm');
            this.action = "create";
            this.dialogVisible = false;
        },
        //弹窗X按钮事件
        closeHandler(){
            this.onCancelHandler();
            this.action = "create";
        },
        //编辑按钮事件
        handleEdit(row){
            this.action = "edit";
            this.dialogVisible = true;
            this.$nextTick(()=>{
                Object.assign(this.menuForm,row);//利用浅拷贝方式快速赋值，缺点就是会把一些无关的属性也一起提交了
            });
        },
        //删除菜单按钮事件
        async handleDelete(row){
            this.action = "delete";
            await this.$api.postMenuC_U_D({_id: row._id, action:this.action});
            this.$message.success('删除成功')
            this.getMenuListRequest()
        }
    }
}
</script>
<style lang="less" scoped>
    .menu-main{
        height: 100%;
        .menu-top{
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            :deep(.el-form-item){
                margin-bottom: 0;
            }
        }
        .menu-bottom{
            background-color: #fff;
            border-radius: 5px 5px 0 0;
            margin-top: 10px;
            .el-select{
                width: 100%;
            }
            :deep(.el-cascader){
                width: 100%;
            }
            .menu-bottom-top{
                padding: 20px;
                border-bottom: 1px solid #ececec
            }
            .menu-bottom-table{
                .pagination{
                    padding: 10px;
                    text-align: right;
                }
            }
        }
    }
</style>