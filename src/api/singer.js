import jsonp from '@/common/js/jsonp'
import {commonParams, options} from './config'

export function getSingerList(){
    const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

    const data = Object.assign({}, commonParams, {
        channel: 'singer',
        page: 'list',
        key: 'all_all_all',
        pagesize: 100,
        pagenum: 1,
        hostUin: 0,
        needNewCode: 0,
        platform: 'yqq',
        g_tk: 339083389,
    })

    return jsonp(url, data, options)
}

// 获取接口的数据
// 传入singerId 是因为获取歌手详情页的时候是用每个歌手特定的ID来实现的
export function getSingerDetail(singerId){
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

    const data = Object.assign({}, commonParams, {
        hostUin: 0,
        platform: 'yqq',
        needNewCode: 0,
        order: 'listen',
        begin: 0,
        num: 100,
        songstatus: 1,
        g_tk: 339083389,
        singermid: singerId
    })

    return jsonp(url, data, options)
}
