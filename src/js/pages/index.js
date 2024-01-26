import home from './home'

const VIEWS = [home];

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