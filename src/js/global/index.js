import initHeader from "./header";
import initFooter from "./footer";
import initPopup from "./popup";
import initCursor from "./magic-mouse";
import initGlowBorder from "./glow-border";
import { initLenis } from "./lenis";
import initButton from './button';
import refreshOnBreakpoint from './refresh';

const initGlobal = () => {
    initLenis();
    if ($(window).width() > 991) {
        initCursor();
    }
    refreshOnBreakpoint();
    initPopup();
    initButton()
    initHeader();
    initFooter();
    initGlowBorder();
}

export default initGlobal;
