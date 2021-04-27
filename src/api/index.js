import axios from '../utils/http'
import config from '../config'
import baseUrl from './baseUrl'
export default {
    postLogin(params){
        return axios.post(config.baseUrl+baseUrl.postLogin,params);
    }
}