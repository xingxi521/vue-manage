import { createStore } from 'vuex'
import stroage from '../utils/stroage'
import mutations from './mutations'
const state = {
    userInfo: stroage.getItem('userInfo') || {},
    menuList: stroage.getItem('menuList') || [],
    btnList: stroage.getItem('btnList') || [],
    noticeCount: 0
}
export default createStore({
    state,
    mutations
})