import initHeader from "./header";
import initFooter from "./footer";
import initPopup from "./popup";
import initCursor from "./magic-mouse";
import { initLenis } from "./lenis";
import initButton from './button';

const initGlobal = () => {
    initLenis();
    initCursor();
    initPopup();
    initButton()
    initHeader();
    initFooter();
}

export default initGlobal;
