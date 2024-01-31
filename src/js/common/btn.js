const btnAnim = () => {
    let bgOverlay = document.createElement('div')
    $(bgOverlay).addClass('btnoverlay')
    $('.btn').each((idx, el) => {
        let cloner = $(bgOverlay).clone()
        $(el).append(cloner)
    })
}

export default btnAnim;