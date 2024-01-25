import { initLenis } from './common/lenis';
import { initScriptPage } from './pages/index';
import initCursor from './common/magic-mouse'

const main = () => {
	initLenis();
    initCursor();
    initScriptPage();
};

window.onload = () => {
	main();
};