// storage 的存取
import storage from 'good-storage'

const SEARCH_KEY = '_search_'
const SEARCH_MAX_LENGTH = 15

//将一个新数据插入到本地的方法
function insertArray(arr, val, compare, maxLen) {
    const index = arr.findIndex(compare)

    if(index === 0)
        return
    if(index > 0) {
        arr.splice(index, 1)
    }

    arr.unshift(val)

    if(maxLen && arr.length > maxLen)
        arr.pop()
}

// 从本地删除数据的方法
function deleteSearch(arr,compare) {
    const index = arr.findIndex(compare)

    if(index > -1){
        arr.splice(index, 1)
    }
}

export function saveSearch(query) {
    let searches = storage.get(SEARCH_KEY, [])
    insertArray(searches, query, (item) => {
        return item === query
    }, SEARCH_MAX_LENGTH)

    storage.set(SEARCH_KEY, searches)

    return searches
}

export function loadSearch() {
    return storage.get(SEARCH_KEY, [])
}

export function deleteSearchHistory(query) {
    let searches = storage.get(SEARCH_KEY, [])

    deleteSearch(searches, (item) => {
        return item === query
    })

    storage.set(SEARCH_KEY, searches)

    return searches
}

export function clearSearchHistory() {
    storage.remove(SEARCH_KEY)

    return []
}