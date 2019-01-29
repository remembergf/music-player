<template>
    <div class="song-list">
        <ul>
            <li @click="selectItem(song, index)" v-for="(song, index) in songs" class="item">
                <!-- 排行榜单的信息描述 -->
                <div class="rank" v-show="rank">
                    <span :class="getRankCls(index)">{{getRankText(index)}}</span>
                </div>
                <div class="content">
                    <h2 class="name">{{song.name}}</h2>
                    <p class="desc">{{ getDesc(song) }}</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: {
            songs: {
                type: Array,
                default: []
            },
            rank: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            getDesc(song) {
                return `${song.singer} 。 ${song.album}`
            },
            selectItem(item, index) {
                this.$emit('select', item, index)
            },
            getRankText(index) {
                if(index > 2)
                    return index + 1
            },
            getRankCls(index) {
                return index <=2 ? `icon icon${index}` : 'text'
            }
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import './../../common/stylus/variable.styl'
    @import './../../common/stylus/mixin.styl'

    .item
        display: flex
        // 居中对齐弹性盒子的各项div
        align-items: center
        box-sizing: border-box
        height: 64px
        font-size: $font-size-medium
    .rank
        flex: 0 0 25px
        width: 25px
        margin-right: 30px
        text-align: center
    .icon
        display: inline-block
        width: 25px
        height: 24px
        background-size: 25px 24px
        &.icon0
            bg-image('first')
        &.icon1
            bg-image('second')
        &.icon2
            bg-image('third')
    .text
        color: $color-theme
        font-size: $font-size-large

    .content
        flex: 1
        line-height: 20px
        overflow: hidden
    .name
        no-wrap()
        color: $color-text
    .desc
        no-wrap()
        color: $color-text-d
        margin-top: 4px
</style>