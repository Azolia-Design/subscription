import { lenis } from "./lenis";
import { isTouchDevice, viewportBreak } from "../helper/viewport";

const initButton = () => {
    $('.btn').each((_, el) => {
        let bgOverlay = $('<div></div>').addClass('btnoverlay');
        $(el).append(bgOverlay)
    })

    $('a').on('click', function (e) {
        if ($(this).attr('href').includes('#')) {
            let target = $(this).attr('href').slice(1);
            let offset = viewportBreak({ desktop: -100, mobile: -20 });

            if (target) {
                e.preventDefault();
                if (!isTouchDevice()) {
                    lenis.scrollTo(`[data-section-id="${target}"]`, {
                        offset: offset
                    })
                }
                else {
                    let targetTop = $(`[data-section-id="${target}"]`).get(0).offsetTop + $(window).height() + offset;
                    $('html').animate({
                        scrollTop: targetTop
                    }, 800);
                }
                history.replaceState({}, '', `${window.location.pathname}#${target}`);
                return false;
            }
            // console.log("scroll ne");
            // console.log(target);
        }
    })
}

export default initButton;