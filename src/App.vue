<template>
    <div id="app">
        <m-header></m-header>
        <tab></tab>
        <!-- 缓存组件，避免性能的消耗 -->
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
        <!-- 将Player组件放在APP.vue中，避免了由于组件切换导致音乐的中断 -->
        <player></player>
    </div>
</template>

<script>
    import MHeader from '@/components/m-header/m-header'
    import Tab from '@/components/tab/tab'
    import Player from '@/components/player/player'

    export default {
        components:
        {
            MHeader,
            Tab,
            Player
        }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
