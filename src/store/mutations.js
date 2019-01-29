import * as types from './mutation-types'

const mutations = {
    // mutations 接受两个参数，一个是state,另一个是传递过来的值
    // 使用ES6风格的计算属性命名功能来使用一个常量作为函数名
    [types.SET_SINGER](state, singer){
        state.singer = singer
    },
    [types.SET_PLAYING_STATE](state, flag){
        state.playing = flag
    },
    [types.SET_PLAYLIST](state, list){
        state.playList = list
    },
    [types.SET_FULL_SCREEN](state, flag){
        state.fullScreen = flag
    },
    [types.SET_SEQUENCE_LIST](state, list){
        state.sequenceList = list
    },
    [types.SET_PLAY_MODE](state, mode){
        state.mode = mode
    },
    [types.SET_CURRENT_INDEX](state, index){
        state.currentIndex = index
    },
    [types.SET_DISC](state, disc) {
        state.disc = disc
    },
    [types.SET_TOPLIST](state, toplist) {
        state.toplist = toplist
    },
    [types.SET_SEARCH_HISTORY](state, history) {
        state.searchHistory = history
    }
}

export default mutations