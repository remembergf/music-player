<template>
    <div class="recommend" ref="recommend">
        <scroll ref="scroll" class="recommend-content" :data="discList">
            <div>
                <div v-if="recommends.length" class="slider-wrapper">
                    <slider>
                        <div v-for="item in recommends">
                            <a v-bind:href="item.linkUrl">
                                <!-- 避免图片加载不出来导致滑动不到底部 -->
                                <!-- fastclick 需要忽略某些元素,我们为其添加needsclick类-->
                                <img class="needsclick" @load="loadImage" v-bind:src="item.picUrl">
                            </a>
                        </div>
                    </slider>
                </div>
                <div class="recommend-list">
                    <h1 class="list-title">热门歌单推荐</h1>
                    <ul>
                        <li @click="selectItem(item)" v-for="item in discList" class="item">
                            <div class="icon">
                                <img v-lazy="item.imgurl" style="width: 60px; height: 60px;">
                            </div>
                            <div class="text" >
                                <h2 class="name" v-html="item.creator.name"></h2>
                                <p class="desc" v-html="item.dissname"></p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="loading-content" v-show="!discList.length">
                <loading></loading>
            </div>
        </scroll>
        <router-view></router-view>
    </div>
</template>
<script>
    import Loading from '@/base/loading/loading'
    import Scroll from '@/base/scroll/scroll'
    import Slider from './../../base/slider/slider'
    import {getRecommend, getDiscList} from './../../api/recommend'
    import {ERR_OK} from './../../api/config'
    import {playListMixin} from '@/common/js/mixin'
    import {mapMutations} from 'vuex'

    export default{
        mixins: [playListMixin],
        data(){
            return {
                recommends: [],
                discList: []
            }
        },
        // 将首次触发写在create钩子里面，之后的获取从缓存中读取数据，
        created(){
            this._getRecommend()
            this._getDiscList()
        },
        methods:{
            handlePlayList() {
                const bottom = this.playList.length > 0 ? '60px' : ''
                this.$refs.recommend.style.bottom = bottom
                this.$refs.scroll.refresh()
            },
            _getRecommend(){
                getRecommend().then((res)=>{
                    if(res.code === ERR_OK)
                        this.recommends = res.data.slider
                })
            },
            _getDiscList(){
                getDiscList().then((res) => {
                    if(res.code === ERR_OK)
                        this.discList = res.data.list
                })
            },
            selectItem(item) {
                this.$router.push({
                    path: `/recommend/${item.dissid}`
                })
                this.setDisc(item)
            },
            loadImage(){
                if(!this.checkloaded)
                {
                    this.$refs.scroll.refresh()
                    this.checkloaded = true
                }
            },
            ...mapMutations({
                setDisc: 'SET_DISC'
            })
        },
        components:{
            Slider,
            Scroll,
            Loading
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import './../../common/stylus/variable.styl'

    .recommend
        position: fixed
        width: 100%
        top: 88px
        bottom: 0
    .recommend-content
        height: 100%
        overflow: hidden
    .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
    .list-title
        height: 65px
        line-height: 65px
        text-align: center
        font-size: $font-size-medium
        color: $color-theme
    .item
        display: flex
        //定义用户应该如何代理元素的总高度和宽度
        box-sizing: border-box
        // flex布局中项目的水平对齐方式
        align-items: center
        padding: 0px 20px 20px 20px;
    .icon
        flex: 0 0 60px
        width: 60px
        padding-right: 20px
    .text
        display: flex
        // flex子元素垂直显示
        flex-direction: column
        // 在水平方向上的对齐方式
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        font-size: $font-size-large
    .name
        margin-bottom: 15px
        color: $color-text
    .desc
        color: $color-text-d
    .loading-content
        width: 100%
        //水平垂直居中
        transfrom: translate(50%,50%)
        
</style>