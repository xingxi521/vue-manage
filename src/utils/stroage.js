/**
 * 本地存储二次封装
 */
import config from '../config'
export default {
    setItem(key,val){
        let obj = this.getStroage();
        obj[key] = val;
        window.localStorage.setItem(config.stroageSpace,JSON.stringify(obj));
    },
    //获取本地已存储的数据
    getStroage(){
        return JSON.parse(window.localStorage.getItem(config.stroageSpace)) || {};
    },
    getItem(key){
        return this.getStroage()[key];
    },
    clearItem(key){
        let obj = this.getStroage();
        delete obj[key];
        window.localStorage.setItem(config.stroageSpace,JSON.stringify(obj));
    },
    clearAll(){
        window.localStorage.clear();
    }
}