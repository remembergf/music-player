import {playMode} from '@/common/js/config'
import {loadSearch} from '@/common/js/catch'

//管理所有的状态
const state = {
    singer: {},
    playing: false,
    fullScreen: false,
    playList: [],
    sequenceList: [],
    mode: playMode.sequence,
    currentIndex: -1,
    disc: {},
    toplist: {},
    searchHistory: loadSearch()
}

export default state