const popup = (name) => {
    let popupWrap = $(`[data-popup-${name}='wrap']`);
    const popupAction = {
        open: () => {
            popupWrap.addClass('active');
            requestAnimationFrame(() => $('.header-bar').addClass('force'));
            lenis.stop();
        },
        close: () => {
            if (!popupWrap.hasClass('active')) return;
            setTimeout(() => {
                popupWrap.removeClass('active');
                $('.header-bar').removeClass('force');
            }, 100)
            lenis.start();
        }
    }
    $(`[data-popup-${name}]`).on('click', function (e) {
        if ($(this).attr(`data-popup-${name}`) === 'open') {
            e.preventDefault();
            popupAction.open();
        }
        else if ($(this).attr(`data-popup-${name}`) === 'close') {
            e.preventDefault();
            popupAction.close();
        }
        else return;
    })
    $(window).on('click', (e) => {
        if (!$(`[data-popup-${name}='wrap'] .popup-inner>div:hover`).length)
            if (!$(`[data-popup-${name}='open']:hover`).length)
                popupAction.close();
    })
}
const initPopup = () => {
    popup('benefit');
}

export default initPopup;