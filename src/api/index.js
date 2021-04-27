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
    }
}