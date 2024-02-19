import home from './home'
import payment_success from './payment/success';


const VIEWS = [home, payment_success];

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