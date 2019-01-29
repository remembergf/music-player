//入口文件
import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import state from './state'
import mutations from './mutations'
// 注册插件,它会保存当前状态的修改以及上一个、下一个状态的快照
import createLogger from 'vuex/dist/logger'

//注册Vuex插件
Vue.use(Vuex)

// 调试工具，检测state的修改是否由mutations修改

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    getters,
    actions,
    state,
    mutations,
    //是否开启严格模式，开发环境中会唯一检测state 由 mutations 更改
    struct: debug,
    plugins: debug ? [createLogger()] : []
})