const rewire = require("rewire")
const song = rewire("./song")
const filterSinger = song.__get__("filterSinger")
// @ponicode
describe("song.createSong", () => {
    test("0", () => {
        let callFunction = () => {
            song.createSong({ songid: "Saltwater Crocodile", songmid: "1.0.0", singer: false, songname: "Producer", albumname: "user-name", interval: 0.5 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            song.createSong({ songid: "Nile Crocodile", songmid: "4.0.0-beta1\t", singer: false, songname: "Producer", albumname: "user-name", interval: 7 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            song.createSong({ songid: "Saltwater Crocodile", songmid: "4.0.0-beta1\t", singer: true, songname: "Developer", albumname: "user-name", interval: 3 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            song.createSong({ songid: "Australian Freshwater Crocodile", songmid: "v4.0.0-rc.4", singer: true, songname: "Manager", albumname: "username", interval: 0 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            song.createSong({ songid: "Spectacled Caiman", songmid: "4.0.0-beta1\t", singer: true, songname: "Manager", albumname: 123, interval: 3600 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            song.createSong(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("filterSinger", () => {
    test("0", () => {
        let callFunction = () => {
            filterSinger([false, true, false])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            filterSinger([false, true, true])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            filterSinger([true, true, true])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            filterSinger([true, true, false])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            filterSinger([false, false, false])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            filterSinger(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
