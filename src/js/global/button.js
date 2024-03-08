import { lenis } from "./lenis";
import { cvUnit, isTouchDevice, viewportBreak } from "../helper/viewport";

const initButton = () => {
    $('.btn').each((_, el) => {
        let bgOverlay = $('<div></div>').addClass('btnoverlay');
        $(el).append(bgOverlay)
    })

    $('a.btn').each((_, item) => {
        let href = $(item).attr('href');
        if (href.startsWith("./")) {
            href = href.slice(2);
        }
        $(item).attr('href', `${origin}/${href}`)
    })
}

export default initButton;