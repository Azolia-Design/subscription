const mainScript = () => {
    console.log(`Init Page`)
    const lenis = new Lenis({
        lerp: false,
        duration: 1.6
    })
    function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    const lerp = (a,b,t = 0.08) => {
        return a + (b - a) * t;
    }
    let pointer = {x: $(window).width()/2, y: $(window).height()/2};

    const isTouchDevice = () => {
        return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
    }
    $(window).on('pointermove', function(e) {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        if ($('.cursor-wrap').hasClass('on-hidden') && !isTouchDevice()) {
            handleCursor.show()
        }
    })
    const pointerCurr = () => {
        return pointer
    }
    const parseRem = (input) => {
        return input / 10 * parseFloat($('html').css('font-size'))
    }
    const xSetter = (el) => gsap.quickSetter(el, 'x', `px`);
    const ySetter = (el) => gsap.quickSetter(el, 'y', `px`);

    const xGetter = (el) => gsap.getProperty(el, 'x')
    const yGetter = (el) => gsap.getProperty(el, 'y')

    let typeOpts = {
        lines: { type: 'lines', linesClass: 'g-lines'},
        words: { type: 'words,lines', linesClass: 'g-lines'},
        chars: { type: 'chars,words,lines', linesClass: 'g-lines'}
    };
    let gOpts = {
        ease: 'power2.easeOut',
    };

    const handleCursor = {
        init: () => {
            const cusrorDotWidth = parseFloat($('.cursor-dot').css('width'))
            const cusrorBorderWidth = parseFloat($('.cursor-border').css('width'))
            const cusroGlowWidth = parseFloat($('.cursor-glow').css('width'))

            let cursorChange = false
            const velChange = .1

            function initMouseMove() {
                let cursor = $('.cursor')
                let cursorX = xGetter(cursor.get(0))
                let cursorY = yGetter(cursor.get(0))

                function updatePos(mode) {
                    if (mode == "free") {
                        xSetter(cursor.get(0))(lerp(cursorX, pointerCurr().x, .1))
                        ySetter(cursor.get(0))(lerp(cursorY, pointerCurr().y, .1))
                    }
                    xSetter(cursor.find('.cursor-border').get(0))(lerp(-(pointerCurr().x - cursorX)/20, 0, .15))
                    ySetter(cursor.find('.cursor-border').get(0))(lerp(-(pointerCurr().y - cursorY)/20, 0, .15))
                    xSetter(cursor.find('.cursor-glow').get(0))(lerp(-(pointerCurr().x - cursorX)/4, 0, .1))
                    ySetter(cursor.find('.cursor-glow').get(0))(lerp(-(pointerCurr().y - cursorY)/4, 0, .1))
                }

                if ($('[data-cursor]:hover').length) {
                    cursorChange = true

                    let target = $('[data-cursor]:hover')
                    let targetOffsetLeft = target.get(0).getBoundingClientRect().left
                    let targetOffsetTop = target.get(0).getBoundingClientRect().top
                    
                    let type = target.attr('data-cursor')
                    let targetValue = $('[data-cursor]:hover').outerWidth()

                    switch (type) {
                        case 'stick':
                            gsap.to(cursor.find('.cursor-dot'), {width: targetValue, height: targetValue, duration: .6, ease: gOpts.ease})
                            xSetter(cursor.get(0))(lerp(cursorX, targetOffsetLeft + target.outerWidth()/2, velChange))
                            ySetter(cursor.get(0))(lerp(cursorY, targetOffsetTop + target.outerHeight()/2, velChange))
                            break;
                        case 'magnetic':
                            gsap.to(cursor.find('.cursor-glow'), {width: targetValue, height: targetValue, duration: .6, ease: gOpts.ease})
                            xSetter(cursor.get(0))(lerp(cursorX, targetOffsetLeft + target.outerWidth()/2, velChange))
                            ySetter(cursor.get(0))(lerp(cursorY, targetOffsetTop + target.outerHeight()/2, velChange))
                            break;
                    }
                    updatePos('change')
                } else {
                    if (cursorChange == true) {
                        gsap.to(cursor.find('.cursor-dot'), {width: cusrorDotWidth, height: cusrorDotWidth, duration: .6, ease: gOpts.ease})
                        gsap.to(cursor.find('.cursor-border'), {width: cusrorBorderWidth, height: cusrorBorderWidth, duration: .6, ease: gOpts.ease})
                        gsap.to(cursor.find('.cursor-glow'), {width: cusroGlowWidth, height: cusroGlowWidth, duration: .6, ease: gOpts.ease})
                        cursorChange = false
                    }
                    updatePos('free')
                }
                requestAnimationFrame(initMouseMove)
            }
            requestAnimationFrame(initMouseMove)
        },
        show: () => {
            $('.cursor-wrap').removeClass('on-hidden')
        }
    }

    handleCursor.init()
}

window.onload = mainScript
