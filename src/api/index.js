import axios from '../utils/http'
import config from '../config'
import baseUrl from './baseUrl'
export default {
    //登陆接口
    postLogin(params){
        return axios.post(config.baseUrl+baseUrl.postLogin,params);
    },
    //获取待审批通知数量
    getApproveCount(){
        return axios.get(config.baseUrl+baseUrl.getApproveCount)
    },
    //获取菜单列表
    postMenuList(params){
        return axios.post(config.baseUrl+baseUrl.postMenuList,params)
    },
    //获取用户列表
    getUserList(params){
        return axios.get(config.baseUrl+baseUrl.getUserList,{
            params
        })
    },
    //删除用户
    postDelUser(params){
        return axios.post(config.baseUrl+baseUrl.postDelUser,params);
    },
    //获取角色名称列表
    getRolesNameList(){
        return axios.get(config.baseUrl+baseUrl.getRolesNameList);
    },
    //获取部门列表
    getDeptList(){
        return axios.get(config.baseUrl+baseUrl.getDeptList);
    },
    //新建/修改用户
    postUserC_U(params){
        return axios.post(config.baseUrl+baseUrl.postUserC_U,params);
    },
    //新建/修改/删除菜单
    postMenuC_U_D(params){
        return axios.post(config.baseUrl+baseUrl.postMenuC_U_D,params);
    },
    // 获取角色列表数据
    getRolesList(params){
        return axios.get(config.baseUrl+baseUrl.getRolesList,{
            params
        });
    },
    // 角色创建/编辑/删除
    postRolesC_U_D(params){
        return axios.post(config.baseUrl+baseUrl.postRolesC_U_D,params);
    },
    // 设置角色权限
    postUpdatePermission(params){
        return axios.post(config.baseUrl+baseUrl.postUpdatePermission,params);
    }
}