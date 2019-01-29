<template>
    <div class="loading">
        <img src="./loading.gif" style="width: 24px; height: 24px;">
        <p class="desc">{{ title }}</p>
    </div>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                default: '正在载入...'
            }
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import './../../common/stylus/variable.styl'
    
    .loading
        width: 100%
        text-align: center
    .desc
        line-height: 20px
        font-size: $font-size-small
        color: $color-text-l
</style>