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
    if ($('.cursor-wrap').hasClass('on-hidden') && !isTouchDevice() && $(window).width() > 991) {
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

class FloatingAnimation {
	constructor(target, x, y, angle, duration) {
		this.target = $(target);
		this.x = x || 50;
		this.y = y || 50;
		this.angle = angle || 15;
		this.duration = duration || 10;

		this.randomX = this.random(this.x * 0.1, this.x);
		this.randomY = this.random(this.y * 0.1, this.y);
		this.randomAngle = this.random(this.angle * 0.1, this.angle);
		this.randomMoveTime = this.random(this.duration * 0.5, this.duration);
		this.randomRotateTime = this.random(this.duration, this.duration * 2);

		gsap.set(this.target, {
			x: this.randomX(Math.random() < 0.5 ? 1 : -1),
			y: this.randomY(Math.random() < 0.5 ? 1 : -1),
			rotation: this.randomAngle(Math.random() < 0.5 ? 1 : -1),
			transformOrigin: "center center",
		}, 0);

		this.moveX(this.target, Math.random() < 0.5 ? 1 : -1);
		this.moveY(this.target, Math.random() < 0.5 ? 1 : -1);
		this.rotate(this.target, Math.random() < 0.5 ? 1 : -1);
	}

	random(min, max) {
		const delta = max - min;
		return (direction = 1) => (max - delta * Math.random()) * direction;
	}

	moveX(selector, direction) {
		gsap.to(selector, {
			duration: this.randomMoveTime(),
			x: this.randomX(direction),
			ease: 'Sine.inOut',
			onComplete: this.moveX.bind(this),
			onCompleteParams: [selector, direction * -1],
		});
	}

	moveY(selector, direction) {
		gsap.to(selector, {
			duration:this.randomMoveTime(),
			y: this.randomY(direction),
			ease: 'Sine.inOut',
			onComplete: this.moveY.bind(this),
			onCompleteParams: [selector, direction * -1],
		});
	}

	rotate(selector, direction) {
		gsap.to(selector, {
			duration: this.randomRotateTime(),
			rotation: this.randomAngle(direction),
			ease: 'Sine.inOut',
			onComplete: this.rotate.bind(this),
			onCompleteParams: [selector, direction * -1],
		});
	}
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
    FloatingAnimation,
    debounce
}
