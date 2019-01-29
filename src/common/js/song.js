import {getLyric} from '@/api/song'
import {ERR_OK} from '@/api/config'
import {Base64} from 'js-base64'

//将歌曲数据封装成自己想要的数据，创建class类
export default class Song {
    constructor({id, mid, singer, name, album, duration, image, url}) {
        this.id = id
        // 歌曲的mid
        this.mid = mid
        this.singer = singer
        this.name = name
        this.album = album
        this.duration = duration
        this.image = image
        this.url = url
    }

    // 获取歌词的封装
    getLyric() {
        // 如果歌词数据存在的话，我们只需要调用，而不必再从缓存里面去获取
        if(this.lyric)
        {
            return Promise.resolve(this.lyric)
        }

        return new Promise((resolve, reject) => {
            getLyric(this.mid).then((res) => {
                if(res.retcode === ERR_OK)
                {
                    this.lyric = Base64.decode(res.lyric)
                    resolve(this.lyric)
                }else{
                    reject('no lyric')
                }
            })
        })
    }
}

//实例化一个新的工厂方式
export function createSong(musicData) {
    return new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        singer: filterSinger(musicData.singer),
        name: musicData.songname,
        album: musicData.albumname,
        duration: musicData.interval,
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        // 获取到qq音乐可播放的源,这个播放源可能会随时更改的,从qq音乐API播放地址上面找到的通用
        url: `https://api.bzqll.com/music/tencent/url?id=${musicData.songmid}&key=579621905&br=320`
    })
}


//将歌手信息过滤出来，拿到它的单例
function filterSinger(singer) {
    let ret = []
    if(!singer){
        return ''
    }
    singer.forEach((s) => {
        ret.push(s.name)
    })

    return ret.join('/')
}

