import { isTouchDevice } from "../helper/viewport";

const lerp = (a, b, t = 0.08) => {
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

const selector = (parent) => {
    return (child) => $(parent).find(child);
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
const findClosestEdge = (ev, el) => {
    if (!el) return;

    const wrapperRect = el.getBoundingClientRect();
    const x = ev.clientX - wrapperRect.left;
    const y = ev.clientY - wrapperRect.top;

    return closestEdge(x,y, el.clientWidth, el.clientHeight);
}
const closestEdge = (x,y,w,h) => {
    const topEdgeDist = distMetric(x,y,w/2,0);
    const bottomEdgeDist = distMetric(x,y,w/2,h);
    const min = Math.min(topEdgeDist, bottomEdgeDist);
    return min === topEdgeDist ? 'top' : 'bottom';
}
const distMetric = (x,y,x2,y2) => {
    var xDiff = x - x2;
    var yDiff = y - y2;
    return (xDiff * xDiff) + (yDiff * yDiff);
}

export {
    lerp,
    parseRem,
    xSetter,
    ySetter,
    rotZSetter,
    xGetter,
    yGetter,
    selector,
    rotZGetter,
    typeOpts,
    pointerCurr,
    findClosestEdge,
    closestEdge,
    distMetric,
    debounce
}
