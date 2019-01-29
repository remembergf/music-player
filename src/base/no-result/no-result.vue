<template>
    <div class="no-result">
        <div class="no-result-icon"></div>
        <p class="no-result-text">{{title}}</p>
    </div>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                default: ''
            }
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import './../../common/stylus/variable.styl'
    @import './../../common/stylus/mixin.styl'

    .no-result
        text-align: center
    .no-result-icon
        width: 86px
        height: 90px
        bg-image('no-result')
        margin: 0 auto
        background-size: 86px 90px
    .no-result-text
        margin-top: 30px
        color: $coor-text-d
        font-size: $font-size-medium
</style>