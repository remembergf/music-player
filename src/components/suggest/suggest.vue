<template>
    <scroll class="suggest" 
            :data="result"
            :pullup="pullup"
            @scrollToEnd="searchMore"
            :beforeScroll="beforeScroll"
            @beforeScroll="listScroll"
            ref="suggest">
        <ul class="suggest-list">
            <li class="suggest-item" v-for="item in result" @click="selectItem(item)">
                <div class="icon">
                    <i :class="getIconCls(item)"></i>
                </div>
                <div class="name">
                    <p class="text" v-html="getDisplayName(item)"></p>
                </div>
            </li>
            <loading v-show="hasMore" title = ""></loading>
        </ul>
        <div class="no-result-wrapper" v-show="!hasMore && !result.length">
                <no-result title="暂时没有找到搜索结果！"></no-result>
        </div>
    </scroll>

</template>

<script>
    import {getSearch} from '@/api/search'
    import {ERR_OK} from '@/api/config'
    import {createSong} from '@/common/js/song'
    import Scroll from '@/base/scroll/scroll'
    import Loading from '@/base/loading/loading'
    import Singer from '@/common/js/singer'
    import NoResult from '@/base/no-result/no-result'
    import {mapMutations} from 'vuex'
    import {mapActions} from 'vuex'

    const TYPE_SINGER = 'singer'
    const perpage = 20

    export default {
        props: {
            query: {
                type: String,
                default: ''
            },
            showSinger: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                page: 1,
                pullup: true,
                result: [],
                beforeScroll: true,
                hasMore: true
            }
        },
        methods: {
            listScroll() {
                this.$emit('listScroll')
            },
            selectItem(item) {
                if(item.type === TYPE_SINGER)
                {
                    const singer = new Singer({
                        id: item.singermid,
                        name: item.singername
                    })
                    this.$router.push({
                        path: `/search/${singer.id}`
                    })
                    this.setSinger(singer)
                }else{
                    this.insertSong(item)
                }

                this.$emit('select', item)
            },
            refresh() {
                this.$refs.suggest.refresh()
            },
            searchMore() {
                if(!this.hasMore)
                    return
                this.page++
                getSearch(this.query, this.page, this.showSinger, perpage).then((res) => {
                    if(res.code === ERR_OK)
                    {
                        this.result = this.result.concat(this._normalizeResult(res.data))
                        this._checkMore(res.data)
                    }
                })
            },
            _checkMore(data) {
                const song = data.song
                if(!song.list.length || (song.curnum + song.curpage * perpage) >= song.totalnum)
                {
                    this.hasMore = false
                }
            },
            _search() {
                this.hasMore = true
                // 每次再次输入query时，它的page也在改变，我们将其重定位到顶部
                this.page = 1
                this.$refs.suggest.scrollTo(0,0)
                getSearch(this.query, this.page, this.showSinger, perpage).then((res) => {
                    if(res.code === ERR_OK)
                    {
                        this.result = this._normalizeResult(res.data)
                        this._checkMore(res.data)
                    }
                })
            },
            getIconCls(item) {
                if(item.type === TYPE_SINGER)
                {
                    return 'icon-mine'
                }else{
                    return 'icon-music'
                }
            },
            getDisplayName(item) {
                if(item.type === TYPE_SINGER)
                {
                    return item.singername
                }else{
                    return `${item.name}---${item.singer}`
                }
            },
            _normalizeResult(data) {
                let ret = []
                if(data.zhida && data.zhida.singerid)
                {
                    ret.push({...data.zhida, ...{type: TYPE_SINGER}})
                }
                if(data.song)
                {
                    ret = ret.concat(this._normalizeSongs(data.song.list))
                }
                return ret
            },
            _normalizeSongs(list) {
                let ret = []
                list.forEach((musicData) => {
                    if(musicData.songid && musicData.albumid) {
                        ret.push(createSong(musicData))
                    }
                })

                return ret
            },
            ...mapMutations({
                setSinger: 'SET_SINGER'
            }),
            ...mapActions([
                'insertSong'
            ])
        },
        components: {
            Scroll,
            Loading,
            NoResult
        },
        watch: {
            query() {
                this._search()
            }
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import './../../common/stylus/variable.styl'
    @import './../../common/stylus/mixin.styl'

    .suggest
        height: 100%
        overflow: hidden
    .suggest-list
        padding: 0 30px
    .suggest-list
        align-items: center
        padding-bottom: 20px
    .suggest-item
        display: flex
        margin-top: 11px
    .icon
        flex: 0 0 32px

    [class^="icon-"]
        // [class^="icon-"]表示以icon-开头的class选择器
        // [class*="icon-"]与之相反，表示包含"icon-"的class选择器
        font-size: $font-size-medium
        color: $color-text-d
        width: 32px
        height: 32px
    .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
    .text
        no-wrap()
    .no-result-wrapper
        position: absolute
        top: 50%
        width: 100%
        transform: translateY(-50%)
</style>