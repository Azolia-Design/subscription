import { lerp, xSetter, ySetter, xGetter, yGetter, pointerCurr } from "../helper/index";
import { cvUnit, isTouchDevice } from '../helper/viewport'

const initCursor = () => {
    const cusrorDotWidth = parseFloat($('.cursor-dot').css('width'))
    const cusrorBorderWidth = parseFloat($('.cursor-border').css('width'))
    const cusroGlowWidth = parseFloat($('.cursor-glow').css('width'))

    let cursorChange = false
    const velChange = .15

    function initMouseMove() {
        let cursor = $('.cursor')
        let cursorX = xGetter(cursor.get(0))
        let cursorY = yGetter(cursor.get(0))
        let dotX = xGetter(cursor.find('.cursor-dot').get(0))
        let dotY = yGetter(cursor.find('.cursor-dot').get(0))
        let borderX = xGetter(cursor.find('.cursor-border').get(0))
        let borderY = yGetter(cursor.find('.cursor-border').get(0))
        let glowX = xGetter(cursor.find('.cursor-glow').get(0))
        let glowY = yGetter(cursor.find('.cursor-glow').get(0))

        let dotstick = false

        function updatePos(mode) {
            if (mode == "free") {
                xSetter(cursor.get(0))(lerp(cursorX, pointerCurr().x, .1))
                ySetter(cursor.get(0))(lerp(cursorY, pointerCurr().y, .1))
                if (dotstick == false) {
                    xSetter(cursor.find('.cursor-dot').get(0))(lerp(dotX, 0, .1))
                    ySetter(cursor.find('.cursor-dot').get(0))(lerp(dotY, 0, .1))
                }
                // xSetter(cursor.find('.cursor-border').get(0))(lerp(borderX, 0, .15))
                // ySetter(cursor.find('.cursor-border').get(0))(lerp(borderY, 0, .15))
                // xSetter(cursor.find('.cursor-glow').get(0))(lerp(glowX, 0, .1))
                // ySetter(cursor.find('.cursor-glow').get(0))(lerp(glowY, 0, .1))
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

            if (target.find('.txt').length) {
                txtOffsetLeft = target.find('.txt').get(0).getBoundingClientRect().left
                txtOffsetTop = target.find('.txt').get(0).getBoundingClientRect().top
            }

            if (target.find('[data-cursor-dotpos]').length) {
                dotOffsetLeft = target.find('[data-cursor-dotpos]').get(0).getBoundingClientRect().left
                dotOffsetTop = target.find('[data-cursor-dotpos]').get(0).getBoundingClientRect().top
            }
            let targetValue = {
                w: $('[data-cursor]:hover').outerWidth(),
                h: $('[data-cursor]:hover').outerHeight()
            }

            let type = target.attr('data-cursor')

            switch (type) {
                case 'stick':
                    updatePos('change')
                    cursor.closest('.cursor-wrap').addClass('mixBlendMode')
                    gsap.to(cursor.find('.cursor-dot'), {scale: targetValue.w / cusrorDotWidth, duration: .6, ease: 'power2.out', overwrite: true})
                    gsap.to(cursor.find('.cursor-border'), {width: cusrorBorderWidth + cvUnit(15, "rem"), height: cusrorBorderWidth + cvUnit(15, "rem"), duration: .6, ease: 'power2.out', overwrite: true})

                    xSetter(cursor.get(0))(lerp(cursorX, targetOffsetLeft + target.outerWidth()/2, velChange))
                    ySetter(cursor.get(0))(lerp(cursorY, targetOffsetTop + target.outerHeight()/2, velChange))
                    break;

                case 'magnetic':
                    updatePos('change')
                    gsap.to(cursor.find('.cursor-glow'), {scale: targetValue.w / cusrorDotWidth, duration: .6, ease: 'power2.out', overwrite: true})
                    xSetter(cursor.get(0))(lerp(cursorX, targetOffsetLeft + target.outerWidth()/2, velChange))
                    ySetter(cursor.get(0))(lerp(cursorY, targetOffsetTop + target.outerHeight()/2, velChange))
                    break;

                case 'radar':
                    updatePos('change')
                    gsap.to(cursor.find('.cursor-dot'), {scale: 0, duration: .6, ease: 'power2.out', overwrite: true})
                    xSetter(cursor.get(0))(lerp(cursorX, targetOffsetLeft + target.outerWidth()/2, velChange))
                    ySetter(cursor.get(0))(lerp(cursorY, targetOffsetTop + target.outerHeight()/2, velChange))
                    break;

                case 'hidden':
                    gsap.to(cursor.find('.cursor-dot'), {scale: 0, duration: .6, ease: 'power2.out', overwrite: true})
                    gsap.to(cursor.find('.cursor-border'), {scale: 1.5, autoAlpha: 0, duration: .4, ease: 'power2.out', overwrite: true})
                    gsap.to(cursor.find('.cursor-glow'), {scale: 1.5, autoAlpha: 0, duration: .4, ease: 'power2.out', overwrite: true})
                    updatePos('free')
                    break;

                case 'dotstick':
                    dotstick = true
                    let dotSize

                    updatePos('free')
                    gsap.to(cursor.find('.cursor-dot'), {width: target.find('[data-cursor-dotpos]').width() + 6, height: target.find('[data-cursor-dotpos]').height() + 6, duration: .6, ease: 'power2.out', overwrite: true})
                    gsap.to(cursor.find('.cursor-border'), {scale: 1.5, autoAlpha: 0, duration: .4, ease: 'power2.out', overwrite: true})
                    gsap.to(cursor.find('.cursor-glow'), {scale: 1.5, autoAlpha: 0, duration: .4, ease: 'power2.out', overwrite: true})
                    
                    xSetter(cursor.find('.cursor-dot').get(0))(lerp(dotX, dotOffsetLeft + (target.find('[data-cursor-dotpos]').width()/2 + 1.5) - pointerCurr().x, .1))
                    ySetter(cursor.find('.cursor-dot').get(0))(lerp(dotY, dotOffsetTop + (target.find('[data-cursor-dotpos]').height()/2 + 1.5) - pointerCurr().y, .1))
                    break;

                case 'txtstick':
                    dotstick = true

                    updatePos('free')
                    gsap.set(cursor.find('.cursor-dot'), {width: cvUnit(5, "rem"), height: cvUnit(5, "rem"), scale: 1, duration: .6, ease: 'power2.out', overwrite: true})
                    gsap.to(cursor.find('.cursor-border'), {scale: 1.5, autoAlpha: 0, duration: .4, ease: 'power2.out', overwrite: true})
                    gsap.set(cursor.find('.cursor-dot'), {backgroundColor: '#fff', duration: .6, ease: 'power2.out', overwrite: true})

                    xSetter(cursor.get(0))(lerp(cursorX, targetOffsetLeft + cvUnit(-10, "rem"), .1))
                    ySetter(cursor.get(0))(lerp(cursorY, targetOffsetTop + targetValue.h/2, .1))
                    xSetter(cursor.find('.cursor-glow').get(0))(lerp(glowX, pointerCurr().x - targetOffsetLeft , .2))
                    ySetter(cursor.find('.cursor-glow').get(0))(lerp(glowY, pointerCurr().y - targetOffsetTop, .2))
                    break;
                
                case 'halostick':
                    dotstick = true

                    updatePos('free')
                    gsap.to(target, {x: cvUnit(30,'rem'), duration: .6, ease: 'power2.out', overwrite: true})
                    gsap.to(cursor.find('.cursor-dot'), {width: cvUnit(5, "rem"), height: cvUnit(5, "rem"), scale: 1, duration: .6, ease: 'power2.out', overwrite: true})
                    gsap.to(cursor.find('.cursor-border'), {scale: 1.5, autoAlpha: 0, duration: .4, ease: 'power2.out', overwrite: true})
                    gsap.to(cursor.find('.cursor-glow'), {scale: 1.5, autoAlpha: 0, duration: .4, ease: 'power2.out', overwrite: true})


                    xSetter(cursor.get(0))(lerp(cursorX, targetOffsetLeft + cvUnit(-15, "rem"), .1))
                    ySetter(cursor.get(0))(lerp(cursorY, targetOffsetTop + targetValue.h/2, .1))
                    xSetter(cursor.find('.cursor-glow').get(0))(lerp(glowX, pointerCurr().x - targetOffsetLeft , .2))
                    ySetter(cursor.find('.cursor-glow').get(0))(lerp(glowY, pointerCurr().y - targetOffsetTop, .2))

                    break;

                case 'btnstick':
                    dotstick = true

                    updatePos('free')
                    gsap.to(target.find('.txt'), {x: cvUnit(15, 'rem')/2, duration: .6, ease: 'power2.out', overwrite: true})

                    
                    gsap.set(cursor.find('.cursor-dot'), {width: cvUnit(10, "rem"), height: cvUnit(10, "rem"), scale: 1, duration: .6, ease: 'power2.out', overwrite: true})
                    gsap.to(cursor.find('.cursor-border'), {scale: 1.5, autoAlpha: 0, duration: .4, ease: 'power2.out', overwrite: true})

                    xSetter(cursor.get(0))(lerp(cursorX, txtOffsetLeft + cvUnit(-15, "rem") + parseInt(target.find('.txt').css('paddingLeft')), .1))
                    ySetter(cursor.get(0))(lerp(cursorY, txtOffsetTop + target.height()/2, .1))
                    xSetter(cursor.find('.cursor-glow').get(0))(lerp(glowX, pointerCurr().x - targetOffsetLeft , .2))
                    ySetter(cursor.find('.cursor-glow').get(0))(lerp(glowY, pointerCurr().y - targetOffsetTop, .2))

                    if (target.hasClass('btn-white')) {
                        gsap.set(cursor.find('.cursor-dot'), {backgroundColor: '#fff', duration: .6, ease: 'power2.out', overwrite: true})
                    } else if (target.hasClass('btn-black')) {
                        gsap.set(cursor.find('.cursor-dot'), {backgroundColor: '#fff', duration: .6, ease: 'power2.out', overwrite: true})
                    } else {
                        gsap.set(cursor.find('.cursor-dot'), {backgroundColor: '#fff', duration: .6, ease: 'power2.out', overwrite: true})
                    }
                    break;

                case 'menuprog':
                    dotstick = true
                    updatePos('free')

                    console.log(targetValue.h / cusrorDotWidth);
                    gsap.to(cursor.find('.cursor-dot'), {scale: target.find('.header-menu-prog-item').height() / cusrorDotWidth, duration: .6, ease: 'power2.out', overwrite: true})
                    gsap.to(cursor.find('.cursor-border'), {scale: 1.5, autoAlpha: 0, duration: .4, ease: 'power2.out', overwrite: true})
                    xSetter(cursor.find('.cursor-dot').get(0))(lerp(dotX, targetOffsetLeft - pointerCurr().x + targetValue.w/2, .1))
                    ySetter(cursor.find('.cursor-dot').get(0))(lerp(dotY, targetOffsetTop - pointerCurr().y + targetValue.h/2, .1))
                    xSetter(cursor.find('.cursor-border').get(0))(lerp(dotX, targetOffsetLeft - pointerCurr().x + targetValue.w/2, .1))
                    ySetter(cursor.find('.cursor-border').get(0))(lerp(dotY, targetOffsetTop - pointerCurr().y + targetValue.h/2, .1))
                    xSetter(cursor.find('.cursor-glow').get(0))(lerp(dotX, targetOffsetLeft - pointerCurr().x + targetValue.w/2, .1))
                    ySetter(cursor.find('.cursor-glow').get(0))(lerp(dotY, targetOffsetTop - pointerCurr().y + targetValue.h/2, .1))
                    break;
            }
        } else {
            if (cursorChange == true) {
                cursor.closest('.cursor-wrap').removeClass('mixBlendMode')
                gsap.to('[data-cursor="btnstick"] .txt', {x: 0, duration: .6, ease: 'power2.out'})
                gsap.to('[data-cursor="halostick"]', {x: 0, duration: .6, ease: 'power2.out'})

                gsap.to(cursor.find('.cursor-dot'), {width: cusrorDotWidth, height: cusrorDotWidth, scale: 1, autoAlpha: 1, backgroundColor: '#f5450d', duration: .6, ease: 'power2.out'})
                gsap.to(cursor.find('.cursor-border'), {width: cusrorBorderWidth, height: cusrorBorderWidth, scale: 1, autoAlpha: 1, duration: .6, ease: 'power2.out'})
                gsap.to(cursor.find('.cursor-glow'), {width: cusroGlowWidth, height: cusroGlowWidth, scale: 1, autoAlpha: 1, duration: .6, ease: 'power2.out'})
                cursorChange = false
                dotstick = false
            }
            updatePos('free')
        }
        requestAnimationFrame(initMouseMove)
    }
    if ($(window).width() > 991) {
        requestAnimationFrame(initMouseMove)
    }
}

export default initCursor;