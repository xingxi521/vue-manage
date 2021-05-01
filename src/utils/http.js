import axios from 'axios'
import router from '../router'
import { ElMessage } from 'element-plus'
import stroage from '../utils/stroage'
//创建axios实例
const instace = axios.create({
    timeout:5000
});

// instace.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

//设置拦截器
instace.interceptors.request.use(config=>{
    const localStroage = stroage.getItem('userInfo');
    if(localStroage){
        config.headers.Authorization = localStroage.token;
    }
    return config;
},error=>{
    return Promise.reject(error);
});
//设置请求成功后的拦截器
const errorHandler = (status,msg)=>{
    switch(status){
        case 400:
            ElMessage.error("请求语法有问题，服务器无法识别");
            break;
        case 401:
            ElMessage.error("客户端未授权该请求。缺乏有效的身份认证凭证");
            break;
        case 403:
            ElMessage.error("服务器拒绝响应。权限不足");
            break;
        case 404:
            ElMessage.error("URL无效或者URL有效但是没有资源");
            break;
        case 500:
            ElMessage.error(msg.message);
            break;
        default:
            ElMessage.error(msg);
            break;
    }
}
instace.interceptors.response.use(res=>{
    if(res.status === 200){
        if(res.data.code === 200){
            return res.data.data;
        }else if(res.data.code === 40001){//认证失败或TOKEN过期
            ElMessage.error('认证失败或TOKEN过期');
            setTimeout(()=>{
                router.push('/login');
            },1500)
            return Promise.reject("认证失败或TOKEN过");
        }else{
            ElMessage.error(res.data.msg);
            return Promise.reject(res.data.msg);
        }
    }else{
        return Promise.reject(res);
    }
},error=>{
    const {response} = error;
    if(response){
        errorHandler(response.status,response.data);
        return Promise.reject(error);
    }else{
        ElMessage.error('网络连接中断！');
    }
});

export default instace