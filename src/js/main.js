import { initLenis } from './common/lenis';
import { initScriptPage } from './pages/index';
import initCursor from './common/magic-mouse';
import { marqueeCSS } from './common/marquee';
import  btnAnim  from './common/btn';
import  popup  from './common/popup';
import { selector } from './helper/index';

const main = () => {
	initLenis();
    initCursor();
    initScriptPage();
    btnAnim();
    popup();
    marqueeCSS({
        parent: selector('.footer-brands'),
        duration: 10
    });
};

window.onload = () => {
	main();
};