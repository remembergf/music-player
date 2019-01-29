<template>
    <div class="singer" ref="singer">
        <list-view @select="selectSinger" :data="singers" ref="list"></list-view>
        <router-view></router-view>
    </div>
</template>

<script>
    import {getSingerList} from '@/api/singer'
    import {ERR_OK} from '@/api/config' 
    import Singer from '@/common/js/singer'
    import ListView from '@/base/listview/listview'
    import {mapMutations} from 'vuex'
    import {playListMixin} from '@/common/js/mixin'
    
    const HOT_NAME = '热门'
    const HOT_SINGER_LENGTH = 10
    export default{
        mixins: [playListMixin],
        data() {
            return {
                singers: []
            }
        },
        created() {
            this._getSingerList()
        },
        methods: {
            handlePlayList() {
                const bottom = this.playList.length > 0 ? '60px' : ''
                this.$refs.singer.style.bottom = bottom
                this.$refs.list.refresh()
            },
            selectSinger(singer){
                // 编程式导航
                this.$router.push({
                    path: `/singer/${singer.id}`
                })
                this.setSinger(singer)
            },
            _getSingerList(){
                getSingerList().then((res) => {
                    if(res.code === ERR_OK)
                    {
                        this.singers = this._normalizeSinger(res.data.list)
                    }
                })
            },
            //使从接口里面拿出来的数据规范化
            _normalizeSinger(list){
                let map = {
                    hot: {
                        title: HOT_NAME,
                        items: []
                    }
                }
                list.forEach((item, index) => {
                    if(index < HOT_SINGER_LENGTH)
                    {
                        map.hot.items.push(new Singer({
                            id: item.Fsinger_mid,
                            name: item.Fsinger_name
                        }))
                    }
                    const key = item.Findex
                    if(!map[key])
                    {
                        map[key] = {
                            title: key,
                            items: []
                        }
                    }

                    map[key].items.push(new Singer({
                        id: item.Fsinger_mid,
                        name: item.Fsinger_name
                    }))
                })
                //为了得到有序列表，对map进行处理
                let hot = []
                let ret = []
                for(let key in map)
                {
                    let val = map[key]
                    if(val.title.match(/[a-zA-Z]/)){
                        ret.push(val)
                    }else if(val.title === HOT_NAME){
                        hot.push(val)
                    }
                }
                // 对ret进行排序操作
                ret.sort((a,b) => {
                    return a.title.charCodeAt(0) - b.title.charCodeAt(0)
                }) 

                return hot.concat(ret)
            },
            //修改mutations的数据
            ...mapMutations({
                setSinger: 'SET_SINGER'
            })
        },
        components:{
            ListView
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    .singer
        position: fixed
        top: 88px
        bottom: 0px
        width: 100%
</style>