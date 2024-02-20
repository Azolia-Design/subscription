import home from './home/index'
import payment_success from './payment/success';
import term from './term/index'


const VIEWS = [home, payment_success, term];

const initScriptPage = () => {
    const dataNamespace = $('[data-barba-namespace]').attr('data-barba-namespace');
    VIEWS.forEach(page => {
        if (dataNamespace == page.namespace) {
            page.afterEnter();
        }
    });
}

export {
    VIEWS,
    initScriptPage
};