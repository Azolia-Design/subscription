import { lenis } from "./lenis";

const popup = (name) => {
    let popupWrap = $(`[data-popup-${name}='wrap']`);
    const popupAction = {
        open: (el) => {
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
        },
        update: (target) => {
            $('.popup--sidebar-content').empty()
            let parent = $(target).closest('.home-benefit-item')
            let title = parent.find('.home-benefit-other-title').text()
            $('.popup--sidebar-header-heading').text(title)

            let cloner
            parent.find('.home-benefit-other-sub-txt').each((idx, el) => {
                cloner = $(el).clone()
                cloner.removeAttr('class')
                cloner.removeAttr('style')
                $('.popup--sidebar-content').append(cloner.clone())
            })

        }
    }
    $(`[data-popup-${name}]`).on('click', function (e) {
        if ($(this).attr(`data-popup-${name}`) === 'open') {
            e.preventDefault();
            popupAction.open(this);
            popupAction.update(this)
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
    popup('contact');
}

export default initPopup;