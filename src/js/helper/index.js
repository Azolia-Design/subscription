const lerp = (a,b,t = 0.08) => {
    return a + (b - a) * t;
}

const parseRem = (input) => {
    return input / 10 * parseFloat($('html').css('font-size'));
}

const xSetter = (el) => gsap.quickSetter(el, 'x', `px`);
const ySetter = (el) => gsap.quickSetter(el, 'y', `px`);

const xGetter = (el) => gsap.getProperty(el, 'x');
const yGetter = (el) => gsap.getProperty(el, 'y');

const selector = (parent) => {
    return (child) => $(parent).find(child);
}

export {
    lerp,
    parseRem,
    xSetter,
    ySetter,
    xGetter,
    yGetter,
    selector
}
