const initButton = () => {
    $('.btn').each((_, el) => {
        let bgOverlay = $('<div></div>').addClass('btnoverlay');
        $(el).append(bgOverlay)
    })
}

export default initButton;