import jsonp from '@/common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

export function getHotkey() {
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

    const data = Object.assign({}, commonParams, {
        platform: 'h5',
        needNewCode: 1
    })

    return jsonp(url, data, options)
}

export function getSearch(query, page, zhida, perpage) {
    const url = '/api/getSearch'

    const data = Object.assign({}, commonParams, {
        platform: 'h5',
        needNewCode: 1,
        w: query,
        uin: 0,
        zhidaqu: 1,
        catZhida: zhida ? 1 : 0,
        t: 0,
        flag: 1,
        ie: 'utf-8',
        sem: 1,
        aggr: 0,
        perpage,
        n: perpage,
        p: page,
        format: 'json',
        remoteplace: 'txt.mqq.all'
    })

    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}