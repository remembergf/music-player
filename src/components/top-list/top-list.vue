<template>
    <transition name="slide">
        <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
    </transition>
</template>

<script>
    import MusicList from '@/components/music-list/music-list'
    import {mapGetters} from 'vuex'
    import {getSongList} from '@/api/rank'
    import {ERR_OK} from '@/api/config'
    import {createSong} from '@/common/js/song'

    export default {
        data() {
            return {
                songs: [],
                rank: true
            }
        },
        created() {
            this._getSongList()
        },
        computed: {
            title() {
                return this.toplist.topTitle
            },
            bgImage() {
                if(this.songs.length)
                    return this.songs[0].image
                return ''
            },
            ...mapGetters([
                'toplist'
            ])
        },
        methods: {
            _getSongList() {
                if(!this.toplist.id)
                {
                    this.$router.push('/rank')
                    return
                }
                getSongList(this.toplist.id).then((res) => {
                    if(res.code === ERR_OK)
                    {
                        this.songs = this._normalizeData(res.songlist)
                    }
                })
            },
            _normalizeData(list) {
                let ret = []
                list.forEach((item) => {
                    const musicData = item.data
                    if(musicData.albumid && musicData.songid)
                    {
                        ret.push(createSong(musicData))
                    }
                })
                return ret
            }
        },
        components: {
            MusicList
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    .slide-enter-active, .slide-leave-active
        transition: all 0.3s ease
    .slide-enter, .slide-leave-to
        transform: translate3d(100%, 0, 0)
</style>