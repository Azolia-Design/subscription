const lerp = (a,b,t = 0.08) => {
    return a + (b - a) * t;
}

const parseRem = (input) => {
    return input / 10 * parseFloat($('html').css('font-size'));
}

const xSetter = (el) => gsap.quickSetter(el, 'x', `px`);
const ySetter = (el) => gsap.quickSetter(el, 'y', `px`);
const rotZSetter = (el) => gsap.quickSetter(el, 'rotateZ', `deg`);

const xGetter = (el) => gsap.getProperty(el, 'x');
const yGetter = (el) => gsap.getProperty(el, 'y');
const rotZGetter = (el) => gsap.getProperty(el, 'rotateZ')

const isTouchDevice = () => {
    return (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0));
}

let typeOpts = {
    lines: { type: 'lines', linesClass: 'g-lines'},
    words: { type: 'words,lines', linesClass: 'g-lines'},
    chars: { type: 'chars,words,lines', linesClass: 'g-lines'}
};

let pointer = { x: $(window).width() / 2, y: $(window).height() / 2 };
$(window).on('pointermove', function (e) {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    if ($('.cursor-wrap').hasClass('on-hidden') && !isTouchDevice()) {
        $('.cursor-wrap').removeClass('on-hidden')
    }
})

const pointerCurr = () => {
    return pointer
}

function debounce(func, delay = 100){
    let timer;
    return function(event) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(func, delay, event);
    };
}

export {
    lerp,
    parseRem,
    xSetter,
    ySetter,
    rotZSetter,
    xGetter,
    yGetter,
    rotZGetter,
    typeOpts,
    pointerCurr,
    isTouchDevice,
    debounce
}
