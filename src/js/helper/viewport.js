let viewport = {
    width: $(window).width(),
    height: $(window).height(),
    pixelRatio: window.devicePixelRatio,
}
const device = { desktop: 991, tablet: 767, mobile: 479  }

const useRem = (vw, maxWidth) => {
    vw = viewport.width < maxWidth ? (vw * viewport.width) / 1000 : vw / 10;

    return (value) => Number((value * vw).toFixed(2));
};

const viewportBreak = (options) => {
    const { desktop, tablet, mobile } = options;
    let result;
    switch (true) {
        case viewport.width <= device.tablet:
            result = mobile;
            break;
        case viewport.width <= device.desktop:
            result = tablet;
            break;
        default:
            result = desktop;
            break;
    }
    return (result instanceof Function) ? result() : result;
}

const cvUnit = (val, unit) => {
    let result;
    switch (true) {
        case unit === 'vw':
            result = window.innerWidth * (val / 100);
            break;
        case unit === 'vh':
            result = window.innerHeight * (val / 100);
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

export { viewport, useRem, viewportBreak, isTouchDevice, cvUnit, percentage };