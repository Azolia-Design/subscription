import { initScriptPage } from './pages/index';
import initGlobal from './global/index';

const main = () => {
    initScriptPage();
    initGlobal();
};

window.onload = () => {
	main(); 
};