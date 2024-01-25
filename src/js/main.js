import { initLenis } from './common/lenis';
import { initScriptPage } from './pages/index';

const main = () => {
	initLenis();
    // initMagicMouse();
    initScriptPage();
};

window.onload = () => {
	main();
};