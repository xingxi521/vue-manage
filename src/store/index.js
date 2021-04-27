import { createStore } from 'vuex'
import stroage from '../utils/stroage'
import mutations from './mutations'
const state = {
    userInfo:stroage.getItem('userInfo') || {}
}
export default createStore({
    state,
    mutations
})