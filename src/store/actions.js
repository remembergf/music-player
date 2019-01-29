//对mutation的一些封装及异步操作

import * as types from './mutation-types'
import {playMode} from '@/common/js/config'
import {shuffle} from '@/common/js/util'
import {saveSearch, deleteSearchHistory, clearSearchHistory} from '@/common/js/catch'

// 获取歌曲索引
function findIndex(list, song){
    return list.findIndex((item) => {
        return item.id === song.id
    })
}

export const selectPlay = function ({commit, state}, {list, index}){
    commit(types.SET_SEQUENCE_LIST, list)
    if(state.mode === playMode.random)
    {
        let randomList = shuffle(list)
        commit(types.SET_PLAYLIST, randomList)
        index = findIndex(randomList, list[index])
    }else{
        commit(types.SET_PLAYLIST, list)
    }
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_CURRENT_INDEX, index)
    commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function ({commit}, {list}) {
    commit(types.SET_PLAY_MODE, playMode.random)
    commit(types.SET_SEQUENCE_LIST, list)
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
    commit(types.SET_CURRENT_INDEX, 0) 
}

// 向原有的列表中插入一个歌曲，并作出一些判断
export function insertSong({commit, state}, song)
{
    let playList = state.playList.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex

    let currentSong = playList[currentIndex]
    // 查找当前歌曲的索引
    let fpIndex = findIndex(playList, song)
    currentIndex++ 

    playList.splice(currentIndex, 0, song)

    if(fpIndex > -1)
    {
        if(currentIndex > fpIndex)
        {
            playList.splice(fpIndex, 1)
            currentIndex--
        }else{
            playList.splice(fpIndex + 1, 1)
        }
    }


    // 对顺序列表中数据的一些处理
    let currentSIndex = findIndex(sequenceList, currentSong) + 1
    let fsIndex = findIndex(sequenceList, song)

    sequenceList.splice(currentSIndex, 0, song)

    if(fsIndex > -1)
    {
        if(currentSIndex > fsIndex)
        {
            sequenceList.splice(fsIndex, 1)
        }else{
            sequenceList.splice(fsIndex + 1, 1)
        }
    }

    commit(types.SET_PLAYLIST, playList)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}


export const saveSearchHistory = function({commit}, query)
{
    commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

// 删除本地存储的一条数据
export const deleteSearch = function({commit}, query) {
    commit(types.SET_SEARCH_HISTORY, deleteSearchHistory(query))
}

// 将本地的数据清空

export const clearSearch = function({commit}) {
    commit(types.SET_SEARCH_HISTORY, clearSearchHistory())
}