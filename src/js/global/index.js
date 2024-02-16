import initHeader from "./header";
import initFooter from "./footer";
import initPopup from "./popup";
import initCursor from "./magic-mouse";
import { initLenis } from "./lenis";
import initButton from './button';
import refreshOnBreakpoint from './refresh';

const initGlobal = () => {
    initLenis();
    if ($(window).width() > 991) {
        initCursor();
    }
    // refreshOnBreakpoint();
    // initPopup();
    // initButton()
    initHeader();
    // initFooter();
}

export default initGlobal;
