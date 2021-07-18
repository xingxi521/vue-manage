import stroage from '../utils/stroage'
export default {
    // 设置用户信息
    SET_USERINFO(state, userInfo){
        state.userInfo = userInfo;
        stroage.setItem('userInfo',userInfo);
    },
    // 设置用户菜单权限列表
    SET_MENULIST(state, menuList) {
        state.menuList = menuList
        stroage.setItem('menuList',menuList);
    },
    // 设置用户按钮权限列表
    SET_BTNLIST(state, btnList) {
        state.btnList = btnList
        stroage.setItem('btnList', btnList)
    },
    // 设置通知数量
    SET_NOTICE_COUNT(state, noticeCount) {
        state.noticeCount = noticeCount
        stroage.setItem('noticeCount', noticeCount)
    }
}