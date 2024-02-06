let viewport = {
    width: $(window).width(),
    height: $(window).height(),
    pixelRatio: window.devicePixelRatio,
}
const DEVICE = {
    mobile: window.matchMedia('only screen and (max-width: 767px)'),
    tablet: window.matchMedia('only screen and (max-width: 991px)'),
    desktop: window.matchMedia('only screen and (max-width: 9999999px)')
}

const viewportBreak = (options) => {
    const { desktop, tablet, mobile } = options;
    let result;
    switch (true) {
        case DEVICE.mobile.matches:
            result = mobile;
            break;
        case DEVICE.tablet.matches:
            result = tablet;
            break;
        case DEVICE.desktop.matches:
            result = desktop;
            break;
        default:
            break;
    }
    return (result instanceof Function) ? result() : result;
}

const cvUnit = (val, unit) => {
    let result;
    switch (true) {
        case unit === 'vw':
            result = $(window).width() * (val / 100);
            break;
        case unit === 'vh':
            result = $(window).height() * (val / 100);
            break;
        case unit === 'rem':
            result = val / 10 * parseFloat($('html').css('font-size'));
            break;
        default: break;
    }
    return result;
}

const percentage = (percent, total) => ((percent / 100) * total).toFixed(2);

const isTouchDevice = () => {
    return (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0));
}

export { viewport, viewportBreak, isTouchDevice, cvUnit, percentage };