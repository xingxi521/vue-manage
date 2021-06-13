export default {
    postLogin:'/users/login', // 登陆接口
    getApproveCount:'/leave/count', // 待审批通知数量
    postMenuList:'/menu/list', // 获取菜单列表
    getUserList:'/users/list', // 获取用户列表
    postDelUser:'/users/delete', // 删除用户
    getRolesNameList:'/roles/operate', // 获取角色名称列表
    getDeptList:'/dept/list', // 获取部门列表
    postUserC_U:'/users/operate', // 新建/修改用户
    postMenuC_U_D:'/menu/operate', // 新建/修改/删除菜单
    getRolesList:'/roles/list', // 获取角色列表数据
    postRolesC_U_D:'/roles/operate', // 角色创建/编辑/删除
    postUpdatePermission:'/roles/update/permission', // 设置角色权限
    getAllUserList:'/users/all/list', // 获取所有用户列表
    postDeptC_U_D:'/dept/operate', // 新建/修改/删除部门
    getPermissonMenuList: '/menu/getPermissonMenuList', // 根据用户获取对应的菜单权限列表
}