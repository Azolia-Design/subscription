import { initScriptPage } from './pages/index';
import initGlobal from './global/index';

const main = () => {
    initGlobal();
    initScriptPage();
};

window.onload = () => {
	main();
};