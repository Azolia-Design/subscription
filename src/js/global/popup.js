import { lenis } from "./lenis";

const popup = (name) => {
    let popupWrap = $(`[data-popup-${name}='wrap']`);
    const popupAction = {
        open: () => {
            popupWrap.addClass('active');
            requestAnimationFrame(() => $('.header-bar').addClass('force'));
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
            lenis.start();
            popupAction.close();
        }
        else return;
    })
    $(window).on('click', (e) => {
        if (!$(`[data-popup-${name}='wrap'] .popup-content>div:hover`).length)
            if (!$(`[data-popup-${name}='open']:hover`).length)
                popupAction.close();
    })
}
const initPopup = () => {
    popup('benefit');
}

export default initPopup;