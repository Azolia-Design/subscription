let viewport = {
    width: $(window).width(),
    height: $(window).height(),
    pixelRatio: window.devicePixelRatio,
}
const device = { tablet: 991, mobile: 767  }

const viewportBreak = (callbacks) => {
    const { desktop, tablet, mobile } = callbacks;

    let result;
    switch (true) {
        case viewport.width >= device.tablet:
            result = callbacks.desktop && callbacks.desktop();
            break;
        case viewport.width >= device.mobile:
            result = callbacks.tablet && callbacks.tablet();
            break;
        default:
            result = callbacks.mobile && callbacks.mobile();
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