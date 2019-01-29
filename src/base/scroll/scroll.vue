<template>
    <div ref="wrapper">
        <slot></slot>
    </div>
</template>

<script>
    import BScroll from 'better-scroll'

    export default{
        props: {
            // 屏幕滑动超过一段时间，派发scroll
            probeType: {
                type: Number,
                default: 1
            },
            click: {
                type: Boolean,
                default: true
            },
            data: {
                type: Array,
                default: null
            },
            listenScroll: {
                type: Boolean,
                //默认不监听滚动的位置
                default: false
            },
            pullup: {
                type: Boolean,
                default: false
            },
            beforeScroll: {
                type: Boolean,
                default: false
            }
        },
        mounted(){
            setTimeout(() => {
                this._initScroll()
            },20)
        },
        methods: {
            _initScroll(){
                if(!this.$refs.wrapper){
                    return
                }
                this.scroll = new BScroll(this.$refs.wrapper, {
                    probeType: this.probeType,
                    click: this.click
                })

                // 如果监听了Scroll的位置
                if(this.listenScroll)
                {
                    // this指向Vue实例
                    let me = this
                    this.scroll.on('scroll', (pos) =>{
                        // 子组件使用$emit来触发父组件的自定义事件
                        me.$emit('scroll', pos)
                    })
                }

                if(this.pullup)
                {
                    this.scroll.on('scrollEnd', () => {
                        //相对于坐标来讲的话，(0,0)永远是左上角
                        if(this.scroll.y <= (this.scroll.maxScrollY + 50))
                        {
                            this.$emit('scrollToEnd')
                        }
                    })
                }

                if(this.beforeScroll)
                {
                    this.scroll.on('beforeScrollStart', () => {
                        this.$emit('beforeScroll')
                    })
                }
            },
            // 启用better-scroll，默认开启
            enable(){
                this.scroll && this.scroll.enable()
            },
            //禁止better-scroll,DOM事件的回调函数不在执行
            disable(){
                this.scroll && this.scroll.disable()
            },
            //重新计算better-scroll，当DOM结构发生变化的时候确保滚动正常进行
            refresh(){
                this.scroll && this.scroll.refresh()
            },
            //滚动到指定的位置,this.scroll是相应的实例
            scrollTo(){
                this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
            },
            //滚动到某个元素的位置
            scrollToElement(){
                this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
            }
        },
        //监听data的变化，值是对应的回调函数
        watch: {
            data(){
                setTimeout(() => {
                    this.refresh()
                })
            }
        }
    }
</script>