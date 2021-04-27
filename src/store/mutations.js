import stroage from '../utils/stroage'
export default {
    SET_USERINFO(state,userInfo){
        state.userInfo = userInfo;
        stroage.setItem('userInfo',userInfo);
    }
}