<template>
    <scroll 
        class="listview" 
        :data="data" 
        ref="listview" 
        :listenScroll="listenScroll"
        :probeType = "probeType"
        @scroll="scroll">
        <ul>
            <li class="list-group" v-for="group in data" ref="listGroup">
                <h2 class="list-title"> {{ group.title }} </h2>
                <ul>
                    <li @click="selectItem(item)" v-for="item in group.items" class="list-item">
                        <img v-lazy="item.avatar" class="avatar">
                        <span class="name"> {{ item.name }} </span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
            <ul>
                <li v-for="(item, index) in shortcutList"  
                    class="item" 
                    :data-index="index"
                    :class="{'current': currentIndex === index}">
                        {{ item }}
                </li>
            </ul>
        </div>
        <!-- 固定标题 -->
        <div class="list-fixed" v-show="fixedTitle" ref="fixed">
            <h1 class="fixed-title">{{fixedTitle}}</h1>
        </div>

        <div v-show="!data.length" class="loading-container">
            <loading></loading>
        </div>
    </scroll>
</template>

<script>
    import Scroll from '@/base/scroll/scroll'
    import {getData} from '@/common/js/dom'
    import Loading from '@/base/loading/loading'

    const ANCHOR_HEIGHT = 18
    const TITLE_HEIGHT = 30
    export default {
        props: {
            data:{
                type: Array,
                default: []
            }
        },
        data(){
            return {
                scrollY: -1,
                currentIndex: 0,
                diff: -1
            }
        },
        created(){
            this.touch = {}
            this.listenScroll = true
            this.listHeight = [],
            this.probeType = 3
        },
        computed: {
            shortcutList(){
                return this.data.map((group) => {
                    // substring(start, stop) 表示截取的字符串从start至stop-1
                    return group.title.substring(0, 1)
                })
            },
            fixedTitle(){
                // 边界条件的判断
                if(this.scrollY > 0)
                {
                    return ''
                }
                return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
            }
        },
        methods: {
            selectItem(item){
                //$emit触发父组件的自定义事件
                this.$emit('select', item)
            },
            onShortcutTouchStart(e){
                let anchorIndex = getData(e.target, 'index')
                // touches 是当前位于屏幕下的手指列表信息,touches[0]表示第一个手指的位置
                let firstTouch = e.touches[0]
                // 获取y轴的坐标
                this.touch.y1 = firstTouch.pageY
                // 看锚点在第几个listGroup
                this.touch.anchorIndex = anchorIndex
                this._scrollTo(anchorIndex)
            },
            onShortcutTouchMove(e){
                let firstTouch = e.touches[0]
                this.touch.y2 = firstTouch.pageY
                let offY = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
                // 由于anchorIndex的结果是数字和字符串相加后，也是字符串，所以需要转义
                let anchorIndex = parseInt(this.touch.anchorIndex + offY)
                this._scrollTo(anchorIndex)
            },
            refresh() {
                this.$refs.listview.refresh()
            },

            // 监听滚动事件
            scroll(pos){
                 this.scrollY = pos.y
            },
            _scrollTo(index){
                // console.log(index)
                // 对边框顶部和底部 index == null 元素的处理
                if(!index && index !== 0)
                {
                    return
                }
                // 对顶部和底部index的值进行处理
                if(index < 0)
                {
                    index = 0
                }else if(index > this.listHeight.length - 2){
                    index = this.listHeight.length - 2
                }
                //获取点击时候的位置
                this.scrollY = -this.listHeight[index]
                // scrollToElement的第二个参数为滑动滚动动画的时间
                this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
            },
            // 计算每个group的高度
            _calculateHeight(){
                const listHeight = []
                const list = this.$refs.listGroup
                let height = 0
                this.listHeight.push(height)
                // 循环遍历每个group的高度
                for(let i = 0; i < list.length; i++)
                {
                    let item = list[i]
                    // 获取DOM元素的高度
                    height += item.clientHeight
                    this.listHeight.push(height)
                }
            }
        },
        // 监听变量的变化
        watch: {
            data() {
                // 在DOM渲染好后才开始计算高度
                setTimeout(() => {
                    this._calculateHeight()
                }, 20)
            },
            // 通过比较scrollY 和 listHeight对比，得出currentIndex的值
            scrollY(newY){
                const listHeight = this.listHeight
                //当list滚动到顶部的时候,newY > 0
                if(newY > 0)
                {
                    this.currentIndex = 0
                    return
                }
                //在中间部分滚动,以顶部为坐标
                for(let i = 0; i < listHeight.length - 1; i++)
                {
                    let height1 = listHeight[i]
                    let height2 = listHeight[i + 1]
                    // 往上滚动的时候，newY为负
                    if(-newY >= height1 && -newY < height2)
                    {
                        this.currentIndex = i
                        this.diff = height2 + newY
                        return
                    }
                }
                //当滚动到list的底部，并且 -newY 大于最后一个元素的上限
                this.currentIndex = listHeight.length - 2
            },
            //diff 是中间剩余的位置
            diff(newVal){
                let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
                if(this.fixedTop === fixedTop)
                {
                    return
                }
                this.fixedTop = fixedTop
                //Dom操作使其Title往上面顶
                this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
            }
        },
        components: {
            Scroll,
            Loading
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import './../../common/stylus/variable.styl'
    
    .listview
        position: relative
        width: 100%
        height: 100%
        overflow: hidden
        background: $color-background
    .list-group
        padding-bottom: 30px
    .list-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .list-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
    .avatar
        width: 50px
        height: 50px
        border-radius: 50%
    .name
        margin-left: 20px
        color: $color-text-l
        font-size: $font-size-medium
    .list-shortcut
        position: absolute
        z-index: 30
        right: 0
        top: 50%
        transform: translateY(-50%)
        width: 20px
        padding: 20px 0
        border-radius: 10px
        text-align: center
        background: $color-background-d
        font-family: Helvetica
    .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
            color: $color-theme
    .list-fixed
        position: absolute
        top: 0
        left: 0
        width: 100%
    .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>