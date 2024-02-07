import { selector } from '../helper/index';
import { marqueeCSS } from '../common/marquee';
import { lenis } from './lenis';
import { isTouchDevice } from '../helper/viewport';

const initFooter = () => {
    marqueeCSS({
        parent: selector('.footer-brands'),
        duration: 10
    });
    $("[data-action='scrollTop']").on('click', function () {
        if (!isTouchDevice()) {
            lenis.scrollTo(0);
        }
        else {
            $('html').animate({ scrollTop: 0 }, 800);
        }
    })
}

export default initFooter;