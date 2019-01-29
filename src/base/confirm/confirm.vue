<!-- 弹窗组件 -->

<template>
    <transition name="confirm-fade">
        <div class="confirm" v-show="showFlag">
            <div class="confirm-wrapper">
                <div class="confirm-content">
                    <p class="text">{{title}}</p>
                    <div class="operate">
                        <div class="operate-btn-left" @click="cancel">{{cancelBtn}}</div>
                        <div class="operate-btn-right" @click="confirm">{{ confirmBtn }}</div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        data() {
            return {
                showFlag: false
            }
        },
        props: {
            title: {
                type: String,
                default: ''
            },
            confirmBtn: {
                type: String,
                default: '清空'
            },
            cancelBtn: {
                type: String,
                default: '取消'
            }
        },
        methods: {
            show() {
                this.showFlag = true
            },
            cancel() {
                this.showFlag = false
            },
            confirm() {
                this.showFlag = false
                this.$emit('confirm')
            }
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import './../../common/stylus/variable.styl'

    .confirm
        position: fixed
        left: 0
        right: 0
        bottom: 0
        top: 0
        z-index: 998
        background-color: $color-background-d
        &.confirm-fade-enter-active
            animation: fade 0.3s
    .confirm-wrapper
        position: absolute
        top: 50%
        left: 50%
        transform: translate(-50%, -50%)
        z-index: 999
    .confirm-content
        width: 270px
        border-radius: 13px
        animation: zoom 0.3s
        background: $color-highlight-background
    .text
        padding: 19px 15px
        line-height: 22px
        text-align: center
        font-size: $font-size-large
        color: $color-text-l
    .operate
        display: flex
        align-items: center
        text-align: center
        font-size: $font-size-large
    .operate-btn-left, .operate-btn-right
        line-height: 22px
        flex: 1
        padding: 10px 0px
        border-top: 1px solid $color-background-d
        color: $color-text-d
    .operate-btn-left
        border-right: 1px solid $color-text-d

    @keyframes fade
        0%{
            opacity: 0%
        }
        100%{
            opacity: 100%
        }
    @keyframes zoom
        0%
            transform: scale(0)
        50%
            transform: scale(1.1)
        100%
            transform: scale(1)
</style>