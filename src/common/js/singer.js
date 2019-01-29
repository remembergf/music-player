//构造一个class类，我们在使用的时候只需要new它的实例即可

export default class Singer {
    constructor({id, name}) {
        this.id = id
        this.name = name
        this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
    }
}