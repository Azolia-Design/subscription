import { selector } from '../helper/index';
import { marqueeCSS } from '../common/marquee';

const initFooter = () => {
    marqueeCSS({
        parent: selector('.footer-brands'),
        duration: 10
    });
}

export default initFooter;