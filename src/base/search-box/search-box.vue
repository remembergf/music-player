<template>
    <div class="search-box">
        <i class="icon-search"></i>
        <input ref="query" :placeholder="placeholder" class="box" v-model="query">
        <i v-show="query" class="icon-dismiss" @click="clear"></i>
    </div>
</template>

<script>
    import {debounce} from '@/common/js/util'

    export default {
        props: {
            placeholder: {
                type: String,
                default: '搜索歌曲、歌手'
            }
        },
        data() {
            return {
                query: ''
            }
        },
        created() {
            this.$watch('query', debounce((newQuery) => {
                this.$emit('query', newQuery)
            }, 200))
        },
        methods: {
            // 使焦点从输入框中移出
            blur() {
                this.$refs.query.blur()
            },
            clear() {
                this.query = ''
            },
            // 将此接口暴露给父组件
            setQuery(query) {
                this.query = query
            }
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    @import './../../common/stylus/variable.styl'

    .search-box
        display: flex
        // 水平居中对齐弹性盒的各项div
        align-items: center
        box-sizing: border-box
        width: 100%
        padding: 0 6px
        height: 40px
        border-radius: 6px
        background: $color-highlight-background
    .icon-search
        flex: 0 0 24px
        font-size: 24px
        color: $color-background
    .box
        flex: 1
        margin: 0px 5px
        line-height: 18px
        background: $color-highlight-background
        color: $color-text
        font-size: $font-size-medium
    .icon-dismiss
        font-size: 16px
        color: $color-background
</style>