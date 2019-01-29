//引入带有mixin的组件时，mixin 的钩子会先一步的执行，相当于扩充了父元素的属性

import {mapGetters} from 'vuex'

export const playListMixin = {
    computed: {
        ...mapGetters([
            'playList'
        ])
    },
    // 在DOM加载完毕后触发
    mounted() {
        this.handlePlayList(this.playList)
    },

    // 在keep-alive 切换组件之后进行调用
    activated() {
        this.handlePlayList(this.playList)
    },

    // 检测playList 的变化
    watch: {
        playList(newValue) {
            this.handlePlayList(newValue)
        }
    },

    methods: {
        handlePlayList(){
            throw new Error('please build the handlePlayList function')
        }
    }
}