<template>
    <div class="search">
        <div class="search-box-wrapper">
            <search-box ref="searchBox" @query="onChangQuery"></search-box>
        </div>
        <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
            <scroll class="shortcut" :data="shortcut" ref="scroll">
                <div>
                    <div class="hot-key">
                        <h1 class="title1">热门搜索</h1>
                        <ul>
                            <li @click="addQuery(item.k)" class="item" v-for="item in hotkey">
                                <span>{{item.k}}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="searchHistory" v-show="searchHistory.length">
                        <h1 class="title">
                            <span class="text">搜索历史</span>
                            <span class="clear" @click="showConfirm">
                                <i class="icon-clear"></i>
                            </span>
                        </h1>

                        <search-list @select="addQuery" @delete="deleteSearch" :searches="searchHistory"></search-list>
                    </div>
                </div>
            </scroll>
        </div>
        <div class="suggest-result" v-show="query">
            <suggest ref="suggest" @listScroll="blurInput" :query="query" @select="saveSearch"></suggest>
        </div>
        <confirm ref="confirm" title="确认清空吗？" @confirm="clearSearch"></confirm>
        <router-view></router-view>
    </div>
</template>
<script>
    import SearchBox from '@/base/search-box/search-box'
    import {getHotkey} from '@/api/search'
    import {ERR_OK} from '@/api/config'
    import Scroll from '@/base/scroll/scroll'
    import Suggest from '@/components/suggest/suggest'
    import {mapActions, mapGetters} from 'vuex'
    import SearchList from '@/base/search-list/search-list'
    import Confirm from '@/base/confirm/confirm'
    import {playListMixin} from '@/common/js/mixin'

    export default{
        mixin: [playListMixin],
        data() {
            return {
                hotkey: [],
                query: ''
            }
        },
        created() {
            this._getHotkey()
        },
        computed: {
            ...mapGetters([
                'searchHistory'
            ]),
            shortcut() {
                return this.hotkey.concat(this.searchHistory)
            }
        },
        methods: {
            handlePlayList() {
                const bottom = this.playList.length > 0 ? '60px' : ''

                this.$refs.scroll.style.bottom = bottom
                this.$refs.scroll.refresh()

                this.$refs.suggest.style.bottom = bottom
                this.$refs.suggest.refresh()
            },
            showConfirm() {
                this.$refs.confirm.show()
            },
            saveSearch() {
                this.saveSearchHistory(this.query)
            },
            blurInput() {
                this.$refs.searchBox.blur()
            },
            _getHotkey() {
                getHotkey().then((res) => {
                    if(res.code === ERR_OK)
                        this.hotkey = res.data.hotkey.slice(0, 10)
                })
            },
            addQuery(query) {
                this.$refs.searchBox.setQuery(query)
            },
            onChangQuery(query) {
                this.query = query
            },
            ...mapActions([
                'saveSearchHistory',
                'deleteSearch',
                'clearSearch'
            ])
        },
        components: {
            SearchBox,
            Suggest,
            SearchList,
            Confirm,
            Scroll
        },
        watch: {
            query(newQuery) {
                if(!newQuery) {
                    setTimeout(() => {
                        this.$refs.scroll.refresh()
                    })
                }
            }
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import './../../common/stylus/variable.styl'
    @import './../../common/stylus/mixin.styl'

    .search-box-wrapper
        margin: 20px
    .shortcut-wrapper
        position: fixed
        top: 178px
        bottom: 0
        width: 100%
    .shortcut
        height: 100%
        overflow: hidden
    .hot-key
        margin: 0 20px 20px 20px
    .title1
        margin-bottom: 20px
        color: $color-text-l
        font-size: $font-size-medium
    .item
        display: inline-block
        padding: 5px 10px
        margin: 0 10px 10px 0
        border-radius: 6px
        font-size: $font-size-medium
        color: $color-text-d
        background: $color-highlight-background
    .saveSearchHistory
        position: relative
    .title
        display: flex
        padding: 0px 20px
        align-items: center
        height: 40px
        font-size: $font-size-medium
        color: $color-text-l
    .text
        flex: 1
    .clear
        extend-click()
    .icon-clear
        font-size: $font-size-medium
        color: $color-text-d
    .suggest-result
        position: fixed
        width: 100%
        top: 178px
        bottom: 0
</style>