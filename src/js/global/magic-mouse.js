import { lerp, xSetter, ySetter, xGetter, yGetter, pointerCurr } from "../helper/index";
import { cvUnit, isTouchDevice } from '../helper/viewport'

const initCursor = () => {
    const cusrorDotWidth = parseFloat($('.cursor-dot').css('width'))
    const cusrorBorderWidth = parseFloat($('.cursor-border').css('width'))
    const cusroGlowWidth = parseFloat($('.cursor-glow').css('width'))

    let cursorChange = false
    const velChange = .11

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

                    updatePos('free')
                    gsap.to(cursor.find('.cursor-dot'), {width: target.find('[data-cursor-dotpos]').width() + 6, height: target.find('[data-cursor-dotpos]').height() + 6, duration: .6, ease: 'power2.out', overwrite: true})
                    let dotOffsetLeft = target.find('[data-cursor-dotpos]').get(0).getBoundingClientRect().left
                    let dotOffsetTop = target.find('[data-cursor-dotpos]').get(0).getBoundingClientRect().top
                    xSetter(cursor.find('.cursor-dot').get(0))(lerp(dotX, dotOffsetLeft + (target.find('[data-cursor-dotpos]').width()/2 + 1.5) - pointerCurr().x, .1))
                    ySetter(cursor.find('.cursor-dot').get(0))(lerp(dotY, dotOffsetTop + (target.find('[data-cursor-dotpos]').height()/2 + 1.5) - pointerCurr().y, .1))
                    xSetter(cursor.find('.cursor-border').get(0))(lerp(dotX, dotOffsetLeft + (target.find('[data-cursor-dotpos]').width()/2 + 1.5) - pointerCurr().x, .1))
                    ySetter(cursor.find('.cursor-border').get(0))(lerp(dotY, dotOffsetTop + (target.find('[data-cursor-dotpos]').height()/2 + 1.5) - pointerCurr().y, .1))
                    xSetter(cursor.find('.cursor-glow').get(0))(lerp(dotX, dotOffsetLeft + (target.find('[data-cursor-dotpos]').width()/2 + 1.5) - pointerCurr().x, .1))
                    ySetter(cursor.find('.cursor-glow').get(0))(lerp(dotY, dotOffsetTop + (target.find('[data-cursor-dotpos]').height()/2 + 1.5) - pointerCurr().y, .1))
                    break;

                case 'txtstick':
                    dotstick = true

                    updatePos('free')
                    gsap.set(cursor.find('.cursor-dot'), {width: cvUnit(5, "rem"), height: cvUnit(5, "rem"), scale: 1, duration: .6, ease: 'power2.out', overwrite: true})
                    gsap.to(cursor.find('.cursor-border'), {scale: 1.5, autoAlpha: 0, duration: .4, ease: 'power2.out', overwrite: true})
                    gsap.set(cursor.find('.cursor-dot'), {backgroundColor: '#fff', duration: .6, ease: 'power2.out', overwrite: true})

                    xSetter(cursor.get(0))(lerp(cursorX, targetOffsetLeft + cvUnit(-10, "rem"), .1))
                    ySetter(cursor.get(0))(lerp(cursorY, targetOffsetTop + targetValue.h/2, .1))
                    xSetter(cursor.find('.cursor-glow').get(0))(lerp(glowX, cursorX - targetOffsetLeft, .1))
                    ySetter(cursor.find('.cursor-glow').get(0))(lerp(glowY, cursorY - targetOffsetTop, .1))
                    break;

                case 'btnstick':
                    dotstick = true

                    updatePos('free')
                    let sizeDot = target.attr('data-size')
                    let distanceDot = target.attr('data-distance')
                    gsap.to(target.find('.txt'), {x: cvUnit(sizeDot, 'rem')/2, duration: .6, ease: 'power2.out', overwrite: true})

                    let txtOffsetLeft = target.get(0).getBoundingClientRect().left
                    let txtOffsetTop = target.get(0).getBoundingClientRect().top
                    xSetter(cursor.find('.cursor-dot').get(0))(lerp(dotX, txtOffsetLeft + target.outerWidth()/2 - target.find('.txt').width()/2 - cvUnit(distanceDot, 'rem') - pointerCurr().x, .1))
                    ySetter(cursor.find('.cursor-dot').get(0))(lerp(dotY, txtOffsetTop + target.outerHeight()/2 - pointerCurr().y, .1))
                    gsap.set(cursor.find('.cursor-dot'), {width: cvUnit(sizeDot, "rem"), height: cvUnit(sizeDot, "rem"), scale: 1, duration: .6, ease: 'power2.out', overwrite: true})
                    gsap.to(cursor.find('.cursor-border'), {scale: 1.5, autoAlpha: 0, duration: .4, ease: 'power2.out', overwrite: true})

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
                    gsap.to(cursor.find('.cursor-dot'), {scale: targetValue.h / cusrorDotWidth, duration: .6, ease: 'power2.out', overwrite: true})
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
            cursor.closest('.cursor-wrap').removeClass('mixBlendMode')
            gsap.to('[data-cursor="btnstick"] .txt', {x: 0, duration: .6, ease: 'power2.out'})
            if (cursorChange == true) {
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
    requestAnimationFrame(initMouseMove)
}

export default initCursor;