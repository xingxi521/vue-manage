<template>
    <div class="dept-main">
        <!-- 头部查询功能区域 -->
        <div class="dept-top">
            <el-form :inline="true" :model="queryForm" ref="queryForm">
                <el-form-item label="部门名称" prop="deptName">
                    <el-input v-model="queryForm.deptName" placeholder="请输入菜单名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onQueryHandler">查询</el-button>
                    <el-button @click="onResetHandler('queryForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 表格区域 -->
        <div class="dept-bottom">
            <div class="dept-bottom-top">
                <el-button type="primary" @click="addHandler(1)" v-permisson="'dept-create'">新增部门</el-button>
            </div>
            <el-table
            :data="deptListData"
            style="width: 100%;margin-bottom: 20px;"
            row-key="_id"
            :tree-props="{children: 'children'}">
                <el-table-column :prop="item.props" :label="item.label" v-for="item in tablePros" :key="item.props" :formatter="item.formatter" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" width="250">
                    <template #default="scope">
                        <el-button size="mini" @click="addHandler(2, scope.row)" type="primary" v-permisson="'dept-create'">添加</el-button>
                        <el-button size="mini" @click="handleEdit(scope.row)" v-permisson="'dept-edit'">编辑</el-button>
                        <el-button size="mini" type="danger" @click="handleDelete(scope.row)" v-permisson="'dept-delete'">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 新增修改弹出 -->
        <el-dialog
        :title="action==='create'?'添加部门':'修改部门'"
        v-model="addShow"
        width="35%"
        :close-on-click-modal="false"
        @close="closeHandler"
        >
            <el-form :model="addRuleForm" :rules="rules" ref="addRuleForm" label-width="100px">
                <el-form-item label="上级部门" prop="parentId">
                    <el-cascader :options="deptListData" 
                    :props="{ checkStrictly: true,value:'_id',label:'deptName' }" 
                    clearable 
                    v-model="addRuleForm.parentId"
                    placeholder="请选择"
                    >
                    </el-cascader>
                </el-form-item>
                <el-form-item label="部门名称" prop="deptName">
                    <el-input v-model="addRuleForm.deptName" placeholder="请输入部门名称"></el-input>
                </el-form-item>
                <el-form-item label="负责人" prop="userName">
                    <el-select v-model="addRuleForm.userName" placeholder="请选择负责人" @change="selectHandler">
                        <el-option
                        v-for="item in userList"
                        :key="item.userId"
                        :label="item.userName"
                        :value="`${item.userId}/${item.userName}/${item.userEmail}`">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="负责人邮箱" prop="userEmail">
                    <el-input v-model="addRuleForm.userEmail" disabled></el-input>
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
    name:'Dept',
    data(){
        return{
            //查询数据对象
            queryForm:{
                deptName:''
            },
            // 分页数据
            pageData: {
                total: 0,
                pageSize: 10,
                pageNum:1
            },
            //动态表格字段
            tablePros:[
                {
                    props:'deptName',
                    label:'部门名称'
                },
                {
                    props:'userName',
                    label:'负责人'
                },
                {
                    props:'updateTime',
                    label:'更新时间',
                    formatter(row,col,value){
                        return publicFn.formateDate(new Date(value));
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
            deptListData:[],//部门列表数据
            addShow:false,//添加菜单弹窗控制
            //添加部门表单数据
            addRuleForm:{
                parentId:[null]
            },
            //表单验证规则
            rules:{
                deptName:[
                    { required: true, message: '请输入部门名称', trigger: 'blur' }
                ],
                userName: [
                    { required: true, message: '请选择部门负责人', trigger: 'blur' }
                ]
            },
            action:'create',
            userList:[], // 用户列表数据
        }
    },
    mounted() {
        this.getDeptListRequest();
        this.getAllUserListRequest()
    },
    methods:{
        //重置表单事件
        onResetHandler(formName){
            this.$refs[formName].resetFields();
        },
        //获取菜单列表
        async getDeptListRequest(){
            try {
                const res = await this.$api.getDeptList({...this.queryForm, ...this.pageData});
                this.deptListData = res;
            } catch (error) {
                this.$message.error(error.stack);
            }
        },
        // 获取所有用户列表
        async getAllUserListRequest() {
            try {
                const res = await this.$api.getAllUserList()
                this.userList = res
            } catch (error) {
                this.$message.error(error.stack);
            }
        },
        //添加-修改-删除请求
        async postDeptC_U_DRequest(){
            try {
                await this.$api.postDeptC_U_D({...this.addRuleForm,action:this.action});
                if(this.action === 'create'){
                    this.$message.success('创建部门成功！');
                    this.onResetHandler('addRuleForm');
                }else if(this.action === 'edit'){
                    this.$message.success('编辑部门成功！');
                    this.onResetHandler('addRuleForm');
                }
                this.getDeptListRequest();
                this.addShow = false;
            } catch (error) {
                this.$message.error(error.stack);
                return Promise.reject(error.stack);
            }
        },
        //查询按钮事件
        onQueryHandler(){
            this.getDeptListRequest();
        },
        //添加菜单按钮事件
        addHandler(type,row){
            this.addShow = true;
            if(type === 1){
                this.action = 'create';
            }else{//每行的添加按钮
                this.$nextTick(()=>{
                    this.addRuleForm.parentId = [...row.parentId,row._id].filter(item => item);
                });
            }
        },
        //弹窗确定按钮事件
        onSubmitHandler(){
            this.$refs['addRuleForm'].validate((valid) => {
                if (valid) {
                    this.postDeptC_U_DRequest();
                } else {
                    this.$message.error('请填写完整再进行提交');
                    return false;
                }
            });
        },
        //弹窗取消按钮事件
        onCancelHandler(){
            this.onResetHandler('addRuleForm');
            this.action = "create";
            this.addShow = false;
        },
        //弹窗X按钮事件
        closeHandler(){
            this.onCancelHandler();
            this.action = "create";
        },
        // 负责人下拉选中触发事件
        selectHandler(val) {
            const [userId, userName, userEmail,] = val.split('/')
            Object.assign(this.addRuleForm, { userId, userEmail, userName })
        },
        //编辑按钮事件
        handleEdit(row){
            this.action = "edit";
            this.addShow = true;
            this.$nextTick(()=>{
                Object.assign(this.addRuleForm,row);//利用浅拷贝方式快速赋值，缺点就是会把一些无关的属性也一起提交了
            });
        },
        //删除菜单按钮事件
        async handleDelete(row){
            this.action = "delete";
            await this.$api.postDeptC_U_D({_id: row._id, action:this.action});
            this.$message.success('删除成功')
            this.getDeptListRequest()
        }
    }
}
</script>
<style lang="less" scoped>
    .dept-main{
        height: 100%;
        .dept-top{
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            :deep(.el-form-item){
                margin-bottom: 0;
            }
        }
        .dept-bottom{
            background-color: #fff;
            border-radius: 5px 5px 0 0;
            margin-top: 10px;
            .el-select{
                width: 100%;
            }
            :deep(.el-cascader){
                width: 100%;
            }
            .dept-bottom-top{
                padding: 20px;
                border-bottom: 1px solid #ececec
            }
            .dept-bottom-table{
                .pagination{
                    padding: 10px;
                    text-align: right;
                }
            }
        }
    }
</style>