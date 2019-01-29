export function addClass(el, className){
    // console.log(hasClass(el, className))
    if(hasClass(el, className)){
        return 
    }
    // console.log(hasClass(el, className))
    let newClass = el.className.split(' ')
    newClass.push(className)
    el.className = newClass.join(' ')
}

export function hasClass(el, className){
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
    return reg.test(el.className)
}

export function getData(el, name, val)
{
    const prefix = 'data-'
    name = prefix + name
    if(val)
    {
        // value存在，就设置属性
        return el.setAttribute(name, val)
    }else{
        // 不存在，就获取它的属性
        return el.getAttribute(name)
    }
}


// autoPrefix js中对自动增加前缀的一种封装
let elementStyle = document.createElement('div').style

let vendor = (() => {
    let transformNames ={
        webkit: 'webkitTransform',
        Moz: 'MozTransform',
        O: 'OTransform',
        ms: 'msTransform',
        standard: 'transform'
    }
    for(let key in transformNames)
    {
        if(elementStyle[transformNames[key]] !== undefined){
            return key
        }
    }

    return false
})()

export function prefixStyle(style){
    if(vendor === false){
        return false
    }

    if(vendor === 'standard'){
        return style
    }

    return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}