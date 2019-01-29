<template>
    <div class="player" v-show="playList.length > 0">
        <transition name="normal"
                    @enter="enter"
                    @after-enter="afterEnter"
                    @leave="leave"
                    @after-leave="afterLeave"
        >
            <div class="normal-player" v-show="fullScreen">
                <div class="background">
                    <img width="100%" height="100%" :src="currentSong.image">
                </div>
                <div class="top">
                    <div class="back" @click="back">
                        <i class="icon-back"></i>
                    </div>
                    <h1 class="title" v-html="currentSong.name"></h1>
                    <h2 class="subtitle" v-html="currentSong.singer"></h2>
                </div>
                <div class="middle" 
                     @touchstart.prevent="middleTouchStart"
                     @touchmove.prevent="middleTouchMove"
                     @touchend="middleTouchEnd"
                >
                    <div class="middle-l" ref="middleL">
                        <div class="cd-wrapper" ref="cdWrapper">
                            <div class="cd" :class="cdCls">
                                <img class="image" :src="currentSong.image">
                            </div>
                        </div>
                        <div class="playing-lyric-wrapper">
                            <div class="playing-lyric">
                                {{playingLyric}}
                            </div>
                        </div>
                    </div>
                    <!-- 歌词列表 -->
                    <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
                        <div class="lyric-wrapper">
                            <div v-if="currentLyric">
                                <p ref="lyricLine"
                                   class="text"
                                   :class="{'current': currentLineNum === index}"
                                   v-for="(line, index) in currentLyric.lines">{{ line.txt }}</p>
                            </div>
                        </div>
                    </scroll>
                </div>
                <div class="bottom">
                    <div class="dot-wrapper">
                        <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
                        <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
                    </div>
                    <div class="progress-wrapper">
                        <span class="time time-l">{{format(currentTime)}}</span>
                        <div class="progress-bar-wrapper">
                            <progress-bar @percentChange = "onProgressBarChange":percent="percent"></progress-bar>
                        </div>
                        <span class="time time-r">{{format(currentSong.duration)}}</span>
                    </div>
                    <div class="operators">
                        <div class="icon i-left" @click="changeMode">
                            <i :class="iconMode"></i>
                        </div>
                        <div class="icon i-left" :class="disableCls">
                            <i class="icon-prev" @click="prev"></i>
                        </div>
                        <div class="icon i-center" :class="disableCls">
                            <i @click="togglePlaying" :class="playIcon"></i>
                        </div>
                        <div class="icon i-right" :class="disableCls">
                            <i class="icon-next" @click="next"></i>
                        </div>
                        <div class="icon i-right">
                            <i class="icon icon-not-favorite"></i>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        


        <transition name="mini">
            <div class="mini-player" v-show="!fullScreen" @click="open">
                <div class="icon">
                    <img width="40" height="40" :src="currentSong.image" :class="cdCls">
                </div>
                <div class="text">
                    <h2 class="name" v-html="currentSong.name"></h2>
                    <p class="desc" v-html="currentSong.singer"></p>
                </div>
                <div class="control">
                    <!-- .stop是阻止点击事件向父元素的冒泡 -->
                    <i :class="miniIcon" @click.stop="togglePlaying"></i>
                </div>
                <div class="control">
                    <i class="icon-playlist"></i>
                </div>
            </div>
        </transition>
        <!-- 定义音频流 -->
        <audio :src="currentSong.url" 
               ref="audio" 
               @play="ready" 
               @error="error" 
               @timeupdate="updateTime"
               @ended = "end">
        </audio>
    </div>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'
    import animations from 'create-keyframe-animation'
    import {prefixStyle} from '@/common/js/dom'
    //引入进度条组件
    import ProgressBar from '@/base/progress-bar/progress-bar'
    import {playMode} from '@/common/js/config'
    import {shuffle} from '@/common/js/util'
    import Lyric from 'lyric-parser'
    import Scroll from '@/base/scroll/scroll'

    const transform = prefixStyle('transform')
    const transitionDuration = prefixStyle('transitionDuration')

    export default {
        data(){
            return {
                songReady: false,
                currentTime: 0,
                currentLyric: null,
                currentLineNum: 0,
                currentShow: 'cd',
                playingLyric: ''
            }
        },
        created() {
            this.touch = {}
        },
        computed: {
            cdCls() {
                return this.playing ? 'play' : 'play pause'
            },
            playIcon() {
                return this.playing ? 'icon-pause' : 'icon-play'
            },
            miniIcon() {
                return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
            },
            iconMode() {
                return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
            },
            disableCls() {
                this.songReady ? '' : 'disable'
            },
            percent(){
                return this.currentTime / this.currentSong.duration
            },

            ...mapGetters([
                'fullScreen',
                'playList',
                'currentSong',
                'playing',
                'currentIndex',
                'mode',
                'sequenceList'
            ])
        },
        methods:{
            back(){
                this.setFullScreen(false)
            },
            open(){
                this.setFullScreen(true)
            },
            //实现动画飞入的几个js钩子函数
            enter(el, done){
                const {x, y, scale} = this._getPosAndScale()
                let animation = {
                    0: {
                        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
                    },
                    60: {
                        transform: `translate3d(0, 0, 0) scale(1.1)`
                    },
                    100: {
                        transfrom: `translate3d(0, 0, 0) scale(1.0)`
                    }
                }

                //create-keyframe-animation 插件中的新建动画
                animations.registerAnimation({
                    name: 'move',
                    animation,
                    presets: {
                        duration: 400, //动画持续时间
                        easing: 'linear'
                    }
                })
                //动画的使用
                animations.runAnimation(this.$refs.cdWrapper, 'move', done)
            },
            afterEnter() {
                // 清楚动画效果
                animations.unregisterAnimation('move')
                this.$refs.cdWrapper.style.animation = ''
            },
            leave(el, done) {
                this.$refs.cdWrapper.style.transition = 'all 0.4s'
                const {x, y, scale} = this._getPosAndScale()
                this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
                // 动画完成后执行回调函数
                this.$refs.cdWrapper.addEventListener('transitionend', done)
            },
            afterLeave() {
                //清除动画
                this.$refs.cdWrapper.style.transition = ''
                this.$refs.cdWrapper.style[transform] = ''
            },
            togglePlaying() {
                if(!this.songReady)
                {
                    return
                }
                this.setPlayingState(!this.playing)
                if(this.currentLyric)
                {
                    this.currentLyric.togglePlay()
                }
            },
            prev() {
                if(!this.songReady)
                {
                    return
                }
                if(this.playList === 1)
                {
                    this.loop()
                    return
                }else{
                    let index = this.currentIndex - 1
                    if(index === -1)
                    {
                        index = this.playList.length - 1
                    }
                    this.setCurrentIndex(index)
                    if(!this.playing)
                    {
                        this.togglePlaying()
                    }
                }
                this.songReady = false
            },
            end(){
                if(this.mode === playMode.loop)
                {
                    this.loop()
                }else{
                this.next()
                }
            },
            loop() {
                this.$refs.audio.currentTime = 0
                this.$refs.audio.play()
                if(this.currentLyric){
                    // 使歌词回到开始的位置
                    this.currentLyric.seek(0)
                }
            },
            next() {
                if(!this.songReady)
                {
                    return
                }
                if(this.playList.length === 1)
                {
                    this.loop()
                    return 
                }else{
                    let index = this.currentIndex + 1
                    if(index === this.playList.length)
                    {
                        index = 0
                    }
                    this.setCurrentIndex(index)
                    if(!this.playing)
                    {
                        this.togglePlaying()
                    }
                }
                this.songReady = false
            },
            ready() {
                this.songReady = true
            },
            // error 处理一些url丢失，网络状太不好的状况，使其也能够进行跳转
            error(){
                this.songReady = true
            },
            //获取播放器的播放时间
            updateTime(event) {
                // 此时拿到的数据是一串时间戳
                this.currentTime = event.target.currentTime
            },
            //将时间戳格式化为我们正常看到的数据
            format(interval) {
                interval = interval | 0
                const minute = interval / 60 | 0
                const second = this._pad(interval % 60)

                return `${minute}:${second}`
            },
            getLyric() {
                this.currentSong.getLyric().then((lyric) => {
                    if(this.currentSong.lyric !== lyric)
                    {
                        return
                    }
                    this.currentLyric = new Lyric(lyric, this.handleLyric)
                    if(this.playing)
                    {
                        this.currentLyric.play()
                    }
                }).catch(() => {
                    this.currentLyric = null
                    this.playingLyric = ''
                    this.currentLineNum = 0
                })
            },
            //在每个时间戳获取对应的歌词
            handleLyric({lineNum, txt}) {
                this.currentLineNum = lineNum
                if(lineNum > 5)
                {
                    let ele = this.$refs.lyricLine[lineNum - 5]
                    this.$refs.lyricList.scrollToElement(ele, 1000)
                }else{
                    this.$refs.lyricList.scrollTo(0, 0, 1000)
                }
                this.playingLyric = txt
            },
            
            middleTouchStart(event) {
                const touch = event.touches[0]
                this.touch.initiated = true
                this.touch.startX = touch.pageX
                this.touch.startY = touch.pageY
            },
            middleTouchMove(event) {
                if (!this.touch.initiated) {
                    return
                }
                const touch = event.touches[0]
                const deltaX = touch.pageX - this.touch.startX
                const deltaY = touch.pageY - this.touch.startY
                if (Math.abs(deltaY) > Math.abs(deltaX)) {
                  return
                }
                // 判断其是否滑动了，或者触发了这个事件
                if (!this.touch.moved) {
                  this.touch.moved = true
                }
                const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
                const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
                this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
                this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
                this.$refs.lyricList.$el.style[transitionDuration] = 0
                this.$refs.middleL.style.opacity = 1 - this.touch.percent
                this.$refs.middleL.style[transitionDuration] = 0
            },
            middleTouchEnd() {
                if (!this.touch.moved) {
                    return
                }
                let offsetWidth
                let opacity
                if (this.currentShow === 'cd') {
                    if (this.touch.percent > 0.1) {
                        offsetWidth = -window.innerWidth
                        opacity = 0
                        this.currentShow = 'lyric'
                    } else {
                        offsetWidth = 0
                        opacity = 1
                    }
                } else {
                    if (this.touch.percent < 0.9) {
                        offsetWidth = 0
                        this.currentShow = 'cd'
                        opacity = 1
                    } else {
                        offsetWidth = -window.innerWidth
                        opacity = 0
                    }
                }
                const time = 300
                this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
                this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
                this.$refs.middleL.style.opacity = opacity
                this.$refs.middleL.style[transitionDuration] = `${time}ms`
                this.touch.initiated = false
            },
            //解决播放是秒数少一个位置的规格化
            _pad(num, n = 2) {
                let len = num.toString().length
                while(len < n){
                    num = '0' + num
                    len++
                }
                return num
            },
            changeMode() {
                const mode = (this.mode + 1) % 3
                this.setPlayMode(mode)
                let list = null
                if(mode === playMode.random)
                {
                    list = shuffle(this.sequenceList)
                }else{
                    list = this.sequenceList
                }
                this.resetCurrentIndex(list)
                this.setPlayList(list)
            },
            resetCurrentIndex(list) {
                let index = list.findIndex((item) => {
                    return item.id === this.currentSong.id
                })
            },
            onProgressBarChange(percent) {
                const currentTime = this.currentSong.duration * percent
                this.$refs.audio.currentTime = currentTime
                if(!this.playing)
                {
                    this.togglePlaying()
                }
                // 同步歌词
                if(this.currentLyric)
                {
                    this.currentLyric.seek(currentTime *1000)
                }
            },
            //获取元素的位置以及缩放的尺寸
            _getPosAndScale(){
                const targetWidth = 40
                const paddingLeft = 40
                const paddingBottom = 30
                const paddingTop = 80
                const width = window.innerWidth * 0.8
                // 以下scale, x, y都是大的cd 相对于 小的 cd 来进行变化的
                const scale = targetWidth / width
                const x = -(window.innerWidth / 2 - paddingLeft)
                const y = (window.innerHeight / 2 - paddingTop - paddingBottom)

                return {
                    x,
                    y,
                    scale
                }
            },
            ...mapMutations({
                setFullScreen: 'SET_FULL_SCREEN',
                setPlayingState: 'SET_PLAYING_STATE',
                setCurrentIndex: 'SET_CURRENT_INDEX',
                setPlayMode : 'SET_PLAY_MODE',
                setPlayList: 'SET_PLAYLIST'
            })
        },
        watch: {
            currentSong(newSong, oldSong) {
                //异步执行，等获取到地址否在进行播放,下一次DOM循环之后执行,等Vue渲染完毕后加载DOM,不过回调的this会自动绑定到它的实例上面
                if(newSong.id === oldSong.id)
                {
                    return
                }
                // 保证内存里面只有一首歌在播放
                if(this.currentLyric)
                {
                    this.currentLyric.stop()
                }
                // this.$nextTick(() =>{
                //     this.$refs.audio.play()
                //     this.getLyric()
                // })
                // 避免微信识别不了
                clearTimeout(timer)
                let timer = setTimeout(() => {
                    this.$refs.audio.play()
                    this.getLyric()
                }, 1000)
            },
            // 因为控制播放的是播放器，我们改的状态要映射到播放器上面去
            playing(newPlaying) {
                const audio = this.$refs.audio
                this.$nextTick(() => {
                    newPlaying ? audio.play() : audio.pause()
                })
            }
        },
        components: {
            ProgressBar,
            Scroll
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import './../../common/stylus/variable.styl'
    @import './../../common/stylus/mixin.styl'

    .normal-player
        position: fixed
        top: 0
        left: 0
        bottom: 0
        right: 0
        z-index: 150
        background: $color-background
        &.normal-enter-active, &.normal-leave-active
            transition: all 0.4s
            .top, .bottom
                transition: all 0.4s cubic-bezier(0.86,0.18,0.82,1.32)
        &.normal-enter, &.normal-leave-to
            opacity: 0
            .top
                transform: translate3d(0,-100px,0)
            .bottom
                transform: translate3d(0,100px,0)
                
    .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        // 给图像设置高斯模糊的效果
        filter: blur(20px)
    .top
        position: relative
        margin-bottom: 25px
    .back
        position: absolute
        top: 0
        left: 6px
        z-index: 50px
    .icon-back
        display: block
        padding: 9px
        font-size: $font-size-large-x
        color: $color-theme
        // 让图标逆时针旋转90度
        transform: rotate(-90deg)
    .title
        width: 70%
        height: 40px
        text-align: center
        margin: 0 auto
        line-height: 40px
        no-wrap()
        font-size: $font-size-large
        color: $color-text
    .subtitle
        line-height: 20px
        text-align: center
        font-size: $font-size-medium
        color: $color-text

    .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        //规定段落中的文本不进行换行
        white-space: nowrap
        font-size: 0
    .middle-l
        display: inline-block
        vertical-align: top
        position: relative
        width: 100%
        padding-top: 80%
        height: 0px
    .cd-wrapper
        position: absolute
        left: 10%
        width: 80%
        top: 0
        height: 100%
    .cd
        width: 100%
        height: 100%
        border-radius: 50%
        border: 10px solid rgba(255,255,255,0.1)
        //为元素设定的宽高决定了元素的边框盒
        box-sizing: border-box
        &.play
            animation: rotate 20s linear infinite
        &.pause
            // 规定动画正在运行还是暂停
            animation-play-state: paused 
    .image
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        border-radius: 50%

    .playing-lyric-wrapper
        width: 80%
        margin: 60px auto 0 auto
        text-align: center
    .playing-lyric
        height: 20px
        line-height: 20px
        color: $color-text-l
        font-size: $font-size-medium

    .middle-r
        display: inline-block
        vertical-align: top
        width: 100%
        height: 100%
        overflow: hidden
    .lyric-wrapper
        width: 80%
        margin: 0 auto
        text-align: center
        overflow: hidden

    .text
        line-height: 40px
        margin-top: 8px
        color: $color-text-l
        font-size: $font-size-medium
        &.current
            color: $color-text

    .bottom
        position: absolute
        bottom: 50px
        width: 100%
    .dot-wrapper
        text-align: center
    .dot
        display: inline-block
        vertical-align: middle
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
            width: 20px
            background: $color-text-ll
            border-radius: 5px
    .progress-wrapper
        display: flex
        align-items: center
        width: 80%
        margin: 0 auto
        padding: 10px 0
    .time
        color: $color-text
        font-size: $font-size-small
        flex: 0 0 30px
        line-height: 30px
        width: 30px
        &.time-l
            text-align: left
        &.time-r
            text-align: right
    .progress-bar-wrapper
        // 自适应整个屏幕
        flex: 1

    .operators
        display: flex
        align-items: center
    .icon
        flex: 1
        color: $color-theme
        i
            font-size:30px
    .i-left
        text-align: right
    .i-center
        text-align: center
        padding: 0 20px
        i
            font-size: 40px
    .i-right
        text-align: left

    .mini-player
        position: fixed
        left: 0
        bottom: 0
        display: flex
        // flex子项在flex容器的当前纵轴上处于居中位置
        align-items: center
        z-index: 180
        width: 100%
        height: 60px
        background: $color-highlight-background
        &.mini-enter-active, &.mini-leave-active
            transition: all 0.4s
        &.mini-enter, &.mini-leave-to
            opacity: 0
    .icon
        flex: 0 0 40px
        width: 40px
        padding: 0px 10px 0px 20px
        img
            border-radius: 50%
            &.play
                animation: rotate 20s linear infinite
            &.pause
                animation-play-state: paused
    .text
        // flex项目将垂直显示
        flex-direction: column
        //设置盒子在横纵上的对齐方式
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
    .name
        margin-bottom: 2px
        no-wrap()
        font-size: $font-size-medium
        color: $color-text
    .desc
        no-wrap()
        font-size: $font-size-small
        color: color-text-d
    .control
        flex: 0px 0px 30px
        width: 30px
        padding: 0 10px
    .icon-play-mini,.icon-pause-mini,.icon-playlist
        font-size: 28px
        color: $color-theme-d
        vertical-align: middle
    .icon-play-mini,.icon-pause-mini
        font-size: 30px
    @keyframes rotate
        0%
            transform: rotate(0deg)
        100%
            transform: rotate(360deg)
</style>