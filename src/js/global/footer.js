import { selector } from '../helper/index';
import { marqueeCSS } from '../common/marquee';
import { lenis } from './lenis';

const initFooter = () => {
    marqueeCSS({
        parent: selector('.footer-brands'),
        duration: 10
    });
    $("[data-action='scrollTop']").on('click', function () {
        lenis.scrollTo(0);
        requestAnimationFrame(() => {
            window.scrollTo({ top: 0 });
        })
    })
}

export default initFooter;