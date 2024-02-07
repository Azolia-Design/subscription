import { lenis } from "./lenis";

const initButton = () => {
    $('.btn').each((_, el) => {
        let bgOverlay = $('<div></div>').addClass('btnoverlay');
        $(el).append(bgOverlay)
    })
    $('a').on('click', function (e) {
        if ($(this).attr('href').includes('#')) {
            let target = $(this).attr('href').slice(1);
            if (target) {
                e.preventDefault();
                lenis.scrollTo(`[data-section-id="${target}"]`, {
                    offset: -100,
                })
                requestAnimationFrame(() => {
                    let targetTop = $(`[data-section-id="${target}"]`).get(0).offsetTop + $(window).height() - 100;
                    window.scrollTo({ top: targetTop });
                })
                history.replaceState({}, '', `${window.location.pathname}#${target}`);
                return false;
            }
        }
    })
}

export default initButton;