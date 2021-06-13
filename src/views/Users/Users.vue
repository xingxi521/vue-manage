<template>
    <div class="users-main">
        <!-- 头部查询功能区域 -->
        <div class="users-top">
            <el-form :inline="true" :model="selectData" ref="selectForm">
                <el-form-item label="用户ID" prop="userId">
                    <el-input v-model="selectData.userId" type="Number" placeholder="请输入用户ID"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="selectData.userName" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="用户状态" prop="state">
                    <el-select v-model="selectData.state" placeholder="请选择">
                        <el-option label="所有" :value="0"></el-option>
                        <el-option label="在职" :value="1"></el-option>
                        <el-option label="离职" :value="2"></el-option>
                        <el-option label="试用期" :value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSearchHandler">查询</el-button>
                    <el-button @click="onResetHandler('selectForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 表格区域 -->
        <div class="users-bottom">
            <div class="users-bottom-top">
                <el-button type="primary" @click="addUserHandler" v-permisson="'user-create'">新增用户</el-button>
                <el-button type="danger" @click="handleDelete(null,'dels')" v-permisson="'user-deletes'">批量删除</el-button>
            </div>
            <div class="users-bottom-table">
                <el-table
                ref="userTable"
                :data="userData"
                @select="selectHandler"
                >
                    <el-table-column
                        type="selection"
                        width="55"
                    >
                    </el-table-column>
                    <!-- 表字段遍历 -->
                    <el-table-column
                        v-for="item in columList"
                        :key="item.userId"
                        :prop="item.prop"
                        :label="item.label"
                        show-overflow-tooltip
                        :formatter="item.formatter"
                    >
                    </el-table-column>
                    <!-- 操作 -->
                    <el-table-column label="操作" width="180" align="center">
                        <template #default="scope">
                            <el-button size="mini" @click="handleEdit(scope.row)" v-permisson="'user-edit'">编辑</el-button>
                            <el-button size="mini" type="danger" @click="handleDelete(scope.row,'del')" v-permisson="'user-delete'">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                background
                layout="prev, pager, next"
                :page-size="pageData.pageSize"
                :total="pageData.total"
                class="pagination"
                @current-change="handleCurrentChange"
                >
                </el-pagination>
            </div>
            <!-- 新增用户弹窗 -->
            <el-dialog
            title="新增用户"
            v-model="userDialogVisible"
            width="30%"
            >
                <el-form :model="userForm" :rules="rules" ref="userRuleForm" label-width="100px">
                    <el-form-item label="用户名" prop="userName">
                        <el-input v-model="userForm.userName" placeholder="请输入用户名称" :disabled="action=='edit'"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="userEmail">
                        <el-input v-model="userForm.userEmail" placeholder="请输入用户邮箱" :disabled="action=='edit'">
                            <template #append>@qq.com</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobile">
                        <el-input v-model="userForm.mobile" placeholder="请输入手机号码"></el-input>
                    </el-form-item>
                    <el-form-item label="岗位" prop="job">
                        <el-input v-model="userForm.job" placeholder="请输入岗位"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="state">
                        <el-select v-model="userForm.state" placeholder="请选择">
                            <el-option label="在职" :value="1"></el-option>
                            <el-option label="离职" :value="2"></el-option>
                            <el-option label="试用期" :value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="系统角色" prop="roleList">
                        <el-select v-model="userForm.roleList" placeholder="请选择" multiple>
                            <el-option
                                v-for="item in rolesNameList"
                                :key="item._id"
                                :label="item.roleName"
                                :value="item._id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属部门" prop="deptId">
                        <el-cascader
                            :options="deptList"
                            :props="{ checkStrictly: true,value:'_id', label:'deptName',children:'children'}"
                            clearable
                            v-model="userForm.deptId"
                            placeholder="请选择"
                        >
                        </el-cascader>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                    <el-button @click="dialogCancelHandler">取 消</el-button>
                    <el-button type="primary" @click="dialogSubmitHandler">确 定</el-button>
                    </span>
                </template>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import { onMounted,reactive,ref,getCurrentInstance,toRefs } from 'vue'
import publicFn from '../../utils/publicFn'
export default {
    name:'Users',
    setup() {
        const { proxy } = getCurrentInstance(); 
        const selectData = reactive({
            state:1
        });//查询功能表单对象
        // 动态表格数据对象
        var userData = ref([]);
        //动态表格字段格式
        const columList = reactive([
            {
                prop:'userId',
                label:'用户ID'
            },
            {
                prop:'userName',
                label:'用户名'
            },
            {
                prop:'userEmail',
                label:'用户邮箱'
            },
            {
                prop:'role',
                label:'用户角色',
                formatter(row,col,value){
                    return{
                        0:'管理员',
                        1:'普通用户'
                    }[value]
                }
            },
            {
                prop:'state',
                label:'用户状态',
                formatter(row,col,value){
                    return{
                        1:'在职',
                        2:'离职',
                        3:'试用期'
                    }[value]
                }
            },
            {
                prop:'createTime',
                label:'注册时间',
                formatter(row,col,value){
                    return publicFn.formateDate(new Date(value));
                }
            },
            {
                prop:'lastLoginTime',
                label:'最后登录时间',
                formatter(row,col,value){
                    return publicFn.formateDate(new Date(value));
                }
            }
        ]);
        // 分页数据对象
        var pageData = reactive({
            pageNum: 1,
            pageSize: 10,
            total: 0
        });
        //当前选中的用户数组
        const selectUserArr = ref([]);
        //新增用户弹窗显示开关
        const userDialogVisible = ref(false);
        //新增用户表单对象
        const userForm = reactive({
            state:3
        });
        //表单验证规则
        const rules = reactive({
            userName:[
                {
                    required: true, message: '请输入用户名', trigger: 'blur'
                }
            ],
            userEmail:[
                { required: true, message: '请输入邮箱', trigger: 'blur' }
            ],
            deptId:[
                { required: true, message: '请选择', trigger: 'blur' }
            ]
        });
        //角色名称列表
        const rolesNameList = ref([]);
        //部门列表
        const deptList = ref([]);
        //操作类型
        const action = ref('add');
        onMounted(()=>{
            getUserListRequest();
            getRolesRequest();
            getDeptListRequest();
        });
        //获取用户列表数据
        const getUserListRequest = async () =>{
            const params = {...selectData,...pageData};
            try {
                const res = await proxy.$api.getUserList(params);
                userData.value = res.list;
                pageData.total = res.page.total;
            } catch (error) {
                console.log(error);
            }
        }
        //查询事件
        const onSearchHandler = ()=>{
            getUserListRequest();
        }
        //重置事件
        const onResetHandler = (name)=>{
            proxy.$refs[name].resetFields();
        }
        //表格选中事件
        const selectHandler = (selection, row)=>{
            var arr = [];
            selection.map(item=>{
                arr.push(item.userId);
            });
            selectUserArr.value = arr;
        }
        //删除用户事件
        const handleDelete = async (row,action) =>{
            if(action === 'del'){
                var res = await proxy.$api.postDelUser({
                    userIds:[row.userId]
                });
            }else{
                if(selectUserArr.value.length > 0){
                    var res = await proxy.$api.postDelUser({
                        userIds:[...selectUserArr.value]
                    });
                }else{
                    proxy.$message.error('您还没选中需要删除的用户');
                    return
                }
            }
            if(res.nModified >= 1){
                proxy.$message.success('删除成功');
                getUserListRequest();
            }else{
                proxy.$message.error('删除失败');
            }
        }
        //获取角色名称列表
        const getRolesRequest = async ()=>{
            const res = await proxy.$api.getRolesNameList();
            rolesNameList.value = res;
        }
        //获取部门列表
        const getDeptListRequest = async ()=>{
            const res = await proxy.$api.getDeptList();
            deptList.value = res;
        }
        // 分页触发事件
        const handleCurrentChange = (current) => {
            pageData.pageNum = current;
            getRolesList();
        }
        //新增用户弹窗取消按钮事件
        const dialogCancelHandler = ()=>{
            userDialogVisible.value = false;
            onResetHandler('userRuleForm');
        }
        //新增用户弹窗确定按钮事件
        const dialogSubmitHandler = ()=>{
            proxy.$refs['userRuleForm'].validate(async (valid) => {
                if (valid) {
                    let params = {...userForm};
                    if(params.userEmail){
                        params.userEmail += '@qq.com' 
                    }
                    params.action = action.value;
                    await proxy.$api.postUserC_U(params);
                    if(params.action === 'add'){
                        proxy.$message.success('添加用户信息成功');
                    }else{
                        proxy.$message.success('修改用户信息成功');
                    }
                    userDialogVisible.value = false;
                    getUserListRequest();
                } else {
                    proxy.$message.error('您填写的信息不符合规则，请重新输入');
                    return false;
                }
            });
        }
        //编辑事件
        const handleEdit = (row)=>{
            userDialogVisible.value = true;
            action.value = 'edit';
            proxy.$nextTick(()=>{
                Object.assign(userForm,row);
            });
        }
        //添加用户按钮事件
        const addUserHandler = ()=>{
            userDialogVisible.value = true;
            action.value = 'add';
        }
        return {
            selectData,
            userData,
            columList,
            pageData,
            userDialogVisible,
            userForm,
            rules,
            rolesNameList,
            deptList,
            action,
            getUserListRequest,
            onSearchHandler,
            onResetHandler,
            selectHandler,
            handleDelete,
            getRolesRequest,
            getDeptListRequest,
            dialogCancelHandler,
            dialogSubmitHandler,
            handleEdit,
            addUserHandler,
            handleCurrentChange
        }
    }
}
</script>
<style lang="less" scoped>
    .users-main{
        // background-color: #fff;
        height: 100%;
        .users-top{
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            :deep(.el-form-item){
                margin-bottom: 0;
            }
        }
        .users-bottom{
            background-color: #fff;
            border-radius: 5px 5px 0 0;
            margin-top: 10px;
            .el-select{
                width: 100%;
            }
            :deep(.el-cascader){
                width: 100%;
            }
            .users-bottom-top{
                padding: 20px;
                border-bottom: 1px solid #ececec
            }
            .users-bottom-table{
                .pagination{
                    padding: 10px;
                    text-align: right;
                }
            }
        }
    }
</style>