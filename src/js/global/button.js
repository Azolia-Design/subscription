import { lenis } from "./lenis";

const initButton = () => {
    $('.btn').each((_, el) => {
        let bgOverlay = $('<div></div>').addClass('btnoverlay');
        $(el).append(bgOverlay)
    })
    $('a').on('click', function (e) {
        if ($(this).attr('href').includes('#')) {
            e.preventDefault();
            let target = $(this).attr('href').slice(1);
            console.log(target)
            lenis.scrollTo(`[data-section-id="${target}"]`, {
                offset: -100,
            })
            history.replaceState({}, '', `${window.location.pathname}#${target}`);
            return false;
        }
    })
}

export default initButton;