import initHeader from "./header";
import initFooter from "./footer";
import initPopup from "./popup";
import initCursor from "./magic-mouse";
import { initLenis } from "./lenis";
import initButton from './button';
import refreshOnBreakpoint from './refresh';
import { viewport } from "../helper/viewport";

const initGlobal = () => {
    initLenis();
    initCursor();
    refreshOnBreakpoint();
    initPopup();
    initButton()
    initHeader();
    initFooter();
}

export default initGlobal;
