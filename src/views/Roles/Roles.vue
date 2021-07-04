<template>
    <div class="roles-main">
        <!-- 头部查询功能区域 -->
        <div class="roles-top">
            <el-form :inline="true" :model="formData" ref="formData">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="formData.roleName" placeholder="请输入角色名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSearchHandler">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 表格区域 -->
        <div class="roles-bottom">
            <div class="roles-bottom-top">
                <!-- <el-button type="primary" @click="createHandler" v-permisson="'role-create'">创建角色</el-button> -->
                <el-button type="primary" @click="createHandler">创建角色</el-button>
            </div>
            <div class="roles-bottom-table">
                <el-table
                ref="rolesTable"
                :data="rolesData"
                >
                    <!-- 表字段遍历 -->
                    <el-table-column
                        v-for="item in columList"
                        :key="item._id"
                        :prop="item.prop"
                        :label="item.label"
                        show-overflow-tooltip
                        :formatter="item.formatter"
                    >
                    </el-table-column>
                    <!-- 操作 -->
                    <el-table-column label="操作" width="260" align="center">
                        <template #default="scope">
                            <!-- <el-button size="mini" @click="handleEdit(scope.row)" v-permisson="'role-edit'">编辑</el-button>
                            <el-button size="mini" type="primary" @click="handlerSetPermission(scope.row)" v-permisson="'role-setpermission'">设置权限</el-button>
                            <el-button size="mini" type="danger" @click="handleDelete(scope.row,'delete')" v-permisson="'role-delete'">删除</el-button> -->
                            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                            <el-button size="mini" type="primary" @click="handlerSetPermission(scope.row)">设置权限</el-button>
                            <el-button size="mini" type="danger" @click="handleDelete(scope.row,'delete')">删除</el-button>
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
            <!-- 新增弹窗 -->
            <el-dialog
            title="新增角色"
            v-model="addShow"
            width="35%"
            >
                <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px">
                    <el-form-item label="角色名称" prop="roleName">
                        <el-input v-model="addForm.roleName" placeholder="请输入用户名称"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" prop="remark">
                        <el-input type="textarea" :row='2' v-model="addForm.remark" placeholder="请输入备注"></el-input>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                    <el-button @click="dialogCancelHandler">取 消</el-button>
                    <el-button type="primary" @click="dialogSubmitHandler">确 定</el-button>
                    </span>
                </template>
            </el-dialog>
            <!-- 设置权限弹窗 -->
            <el-dialog
            title="设置权限"
            v-model="permissionShow"
            width="35%"
            >
                <el-form :model="permissionForm" ref="permissionForm" label-width="100px">
                    <el-form-item label="角色名称">
                        {{permissionForm.currentRoleName}}
                    </el-form-item>
                    <el-form-item label="选择权限">
                        <el-tree
                        :data="menuList"
                        show-checkbox
                        node-key="_id"
                        ref="menuTree"
                        default-expand-all
                        :props="{ label: 'menuName' }">
                        </el-tree>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                    <el-button @click="permissionShow = false">取 消</el-button>
                    <el-button type="primary" @click="perssionSubmitHandler">确 定</el-button>
                    </span>
                </template>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import publicFn from '../../utils/publicFn'
export default {
    name:'Users',
    data() {
        return {
            // 查询表单数据
            formData: {
                roleName: ''
            },
            // 分页数据
            pageData: {
                total: 0,
                pageSize: 10,
                pageNum:1
            },
            // 表格数据
            rolesData: [],
            // 表格列项
            columList: [
                {
                    prop:'roleName',
                    label:'角色名称'
                },
                {
                    prop:'remark',
                    label:'备注'
                },
                {
                    prop:'permissionList',
                    label:'权限列表',
                    formatter:(row,col,value) => {
                        const resultArr = []
                        value.halfCheckedKeys.forEach(item => {
                            if (this.menuNameMapping[item]) {
                                resultArr.push(this.menuNameMapping[item])
                            }
                        })
                        return resultArr.join(',')
                    }
                },
                {
                    prop:'createTime',
                    label:'创建时间',
                    formatter(row,col,value){
                        return publicFn.formateDate(new Date(value));
                    }
                }
            ],
            addShow: false, // 创建角色弹出显示开关
            // 添加角色表单数据
            addForm: {

            },
            // 验证规则
            rules: {
                roleName: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' }
                ]
            },
            // 行为
            action: '',
            permissionShow: false, // 权限设置弹窗显示开关
            // 设置权限表单
            permissionForm: {
                currentRoleName: '',
                currentRoleId: ''
            },
            // 菜单列表数据
            menuList: [],
            // 菜单名称名映射表
            menuNameMapping: {}
        }
    },
    mounted() {
        this.getRolesList()
        this.getMenuList()
    },
    methods: {
        // 获取角色列表数据
        async getRolesList() {
            const params = {
                ...this.formData,
                ...this.pageData
            }
            const res = await this.$api.getRolesList(params)
            this.rolesData = res.list
            this.pageData.total = res.page.total
        },
        // 获取菜单列表数据
        async getMenuList() {
            const res = await this.$api.postMenuList()
            this.menuList = res
            this.menuNameMapping = this.permissionMapping(res)
        },
        // 查询按钮事件
        onSearchHandler() {
            this.getRolesList()
        },
        // 分页触发事件
        handleCurrentChange(current) {
            this.pageData.pageNum = current;
            this.getRolesList();
        },
        // 创建角色按钮事件
        createHandler() {
            this.addShow = true
            this.action = 'create'
        },
        // 重置表单
        resetForm() {
            this.addForm = {}
        },
        // 弹出取消按钮事件
        dialogCancelHandler() {
            this.resetForm()
            this.addShow = false
        },
        // 弹出确定按钮事件
        dialogSubmitHandler() {
            this.$refs.addForm.validate(async (vaild) => {
                if (vaild) {
                    let params = {
                        ...this.addForm,
                        action: this.action
                    }
                    const res = await this.$api.postRolesC_U_D(params)
                    if (this.action === 'create') {
                        this.$message.success('新增角色成功')
                    } else if (this.action === 'edit') {
                        this.$message.success('编辑角色成功')
                    }
                    this.addShow = false
                    this.resetForm()
                    this.getRolesList()
                } else {
                    this.$message.error('请填写完成信息再进行提交')
                    return false
                }
            })
        },
        // 表格每行编辑按钮事件
        handleEdit(row) {
            this.action = 'edit'
            Object.assign(this.addForm, row)
            this.addShow = true
        },
        // 表格每行删除按钮事件
        async handleDelete(row, action) {
            await this.$api.postRolesC_U_D({_id: row._id, action})
            this.$message.success('删除角色成功')
            this.getRolesList()
        },
        // 表格每行设置权限按钮事件
        handlerSetPermission(row) {
            this.permissionShow = true
            this.permissionForm.currentRoleName = row.roleName
            this.permissionForm.currentRoleId = row._id
            this.$nextTick(()=>{
                this.$refs.menuTree.setCheckedKeys(row.permissionList.checkedKeys);
            })
        },
        // 设置权限弹窗确定按钮事件
        async perssionSubmitHandler() {
            const checkedNode = this.$refs.menuTree.getCheckedNodes() // 获取选中节点的node集合
            const halfCheckedKeys = this.$refs.menuTree.getHalfCheckedKeys() // 获取真正半选中状态的节点key
            const checkedKeys = [] // 选中的子菜单-也就是最后一个层级的节点，
            // 半选中状态节点-这里的半选中状态其实是虚拟的，人为把他当做半选中，因为elementUI的树控件只要最后一个层级节点都被选中了
            // 那么父节点自动就全选状态了
            const parentCheckedKeys = [] 
            checkedNode.forEach(item => {
                if (!item.children) {
                    checkedKeys.push(item._id)
                } else {
                    parentCheckedKeys.push(item._id)
                }
            })
            const params = {
                _id: this.permissionForm.currentRoleId,
                permissionList: {
                    checkedKeys,
                    // 这里concat是因为上面把有子节点的节点当做为半选状态了，用于后面假如有新子节点添加可以直接认为他就是半选状态
                    // 所以要把那些被当做是半选状态实际上已经是全选状态的节点跟获取出来的半选状态节点合到一起
                    halfCheckedKeys: parentCheckedKeys.concat(halfCheckedKeys)
                }
            }
            await this.$api.postUpdatePermission(params)
            this.permissionShow = false
            this.$message.success('设置权限成功')
            this.getRolesList()
        },
        // 权限列表id映射对应菜单名称处理
        permissionMapping(list) {
            var result = {}
            for(var i=0;i<list.length;i++) {
                if (list[i].children && list[i].btnList) { // 如果btnList存在 那就证明他是最后一个层级的父节点了
                    result[list[i]._id] = list[i].menuName
                } else if (list[i].children && !list[i].btnList) {
                    result = {...result, ...this.permissionMapping(list[i].children)}
                }
            }
            return result
        }
    }
}
</script>
<style lang="less" scoped>
    .roles-main{
        // background-color: #fff;
        height: 100%;
        .roles-top{
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            :deep(.el-form-item){
                margin-bottom: 0;
            }
        }
        .roles-bottom{
            background-color: #fff;
            border-radius: 5px 5px 0 0;
            margin-top: 10px;
            .el-select{
                width: 100%;
            }
            :deep(.el-cascader){
                width: 100%;
            }
            .roles-bottom-top{
                padding: 20px;
                border-bottom: 1px solid #ececec
            }
            .roles-bottom-table{
                .pagination{
                    padding: 10px;
                    text-align: right;
                }
            }
        }
    }
</style>