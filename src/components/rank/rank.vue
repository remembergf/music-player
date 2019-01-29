<template>
    <div class="rank" ref="rank">
        <scroll :data="toplist" class="toplist" ref="toplist">
            <ul>
                <li class="item" v-for="item in toplist" @click="selectItem(item)">
                    <div class="icon">
                        <img width="90" height="90" v-lazy="item.picUrl">
                    </div>
                    <ul class="songlist">
                        <li class="song" v-for="(song, index) in item.songList">
                            <span>{{index + 1}}</span>
                            <span>{{song.songname}}---{{song.singername}}</span>
                        </li>
                    </ul>
                </li>
            </ul>
            <div class="loading-content" v-show="!toplist.length">
                <loading></loading>
            </div>
        </scroll>
        <router-view></router-view>
    </div>
</template>

<script>
    import {getTopList} from '@/api/rank'
    import {ERR_OK} from '@/api/config'
    import Loading from '@/base/loading/loading'
    import Scroll from '@/base/scroll/scroll'
    import {playListMixin} from '@/common/js/mixin'
    import {mapMutations} from 'vuex'

    export default {
        mixins: [playListMixin],
        data() {
            return {
                toplist: []
            }
        },
        created() {
            this._getTopList()
        },
        methods: {
            selectItem(item) {
                this.$router.push({
                    path: `/rank/${item.id}`
                })
                this.setToplist(item)
            },
            handlePlayList() {
                const bottom = this.playList.length > 0 ? '70px' : ''
                this.$refs.rank.style.bottom = bottom
                this.$refs.toplist.refresh()
            },
            _getTopList(){
                getTopList().then((res) => {
                    if(res.code === ERR_OK)
                    {
                        this.toplist = res.data.topList
                    }
                })
            },
            ...mapMutations({
                setToplist: 'SET_TOPLIST'
            })
        },
        components: {
            Loading,
            Scroll
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import './../../common/stylus/variable.styl'
    @import './../../common/stylus/mixin.styl'

    .rank
        position: fixed
        width: 100%
        top: 88px
        bottom: 0
    .toplist
        height: 100%
        overflow: hidden
    .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 90px
    .icon
        flex: 0 0 100px
        width: 90px
        height: 90px
    .songlist
        flex: 1
        display: flex
        // 项目垂直显示
        flex-direction: column
        // 项目在横轴上的对其方式
        justify-content: center
        padding: 0 20px
        height: 90px
        overflow: hidden
        background: $color-heightlight-background
        color: $color-text-d
        font-size: $font-size-medium
    .song
        line-height: 26px
        no-wrap()
    .loading-content
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>