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

        function updatePos(mode, target) {
            if (mode == "free") {
                xSetter(cursor.get(0))(lerp(cursorX, pointerCurr().x, .1))
                ySetter(cursor.get(0))(lerp(cursorY, pointerCurr().y, .1))
                xSetter(cursor.find('.cursor-dot').get(0))(lerp(dotX, 0, .15))
                ySetter(cursor.find('.cursor-dot').get(0))(lerp(dotY, 0, .15))
                xSetter(cursor.find('.cursor-border').get(0))(lerp(-(pointerCurr().x - cursorX)/20, 0, .15))
                ySetter(cursor.find('.cursor-border').get(0))(lerp(-(pointerCurr().y - cursorY)/20, 0, .15))
                xSetter(cursor.find('.cursor-glow').get(0))(lerp(-(pointerCurr().x - cursorX)/4, 0, .1))
                ySetter(cursor.find('.cursor-glow').get(0))(lerp(-(pointerCurr().y - cursorY)/4, 0, .1))
            }
            
            if (mode == 'dotstick') {

                if (target.find('[data-cursor-dotpos]').length) {
                    let targetOffsetLeft = target.find('[data-cursor-dotpos]').get(0).getBoundingClientRect().left
                    let targetOffsetTop = target.find('[data-cursor-dotpos]').get(0).getBoundingClientRect().top
        
                    xSetter(cursor.get(0))(lerp(cursorX, targetOffsetLeft + target.find('[data-cursor-dotpos]').outerWidth()/2, .1))
                    ySetter(cursor.get(0))(lerp(cursorY, targetOffsetTop + target.find('[data-cursor-dotpos]').outerHeight()/2, .1))
                    xSetter(cursor.find('.cursor-border').get(0))(lerp(borderX, 0, .15))
                    ySetter(cursor.find('.cursor-border').get(0))(lerp(borderY, 0, .15))
                    xSetter(cursor.find('.cursor-glow').get(0))(lerp(glowX, 0, .1))
                    ySetter(cursor.find('.cursor-glow').get(0))(lerp(glowY, 0, .1))
                } else {
                    let targetOffsetLeft = target.get(0).getBoundingClientRect().left
                    let targetOffsetTop = target.get(0).getBoundingClientRect().top
                    xSetter(cursor.get(0))(lerp(cursorX, targetOffsetLeft + target.outerWidth()/2, .1))
                    ySetter(cursor.get(0))(lerp(cursorY, targetOffsetTop + target.outerHeight()/2, .1))
                }
            }
        }

        if ($('[data-cursor]:hover').length) {
            cursorChange = true

            let target = $('[data-cursor]:hover')
            let targetOffsetLeft = target.get(0).getBoundingClientRect().left
            let targetOffsetTop = target.get(0).getBoundingClientRect().top

            let type = target.attr('data-cursor')
            let targetValue = {
                w: $('[data-cursor]:hover').outerWidth(),
                h: $('[data-cursor]:hover').outerHeight()
            }
            switch (type) {
                case 'stick':
                    updatePos('dotstick')
                    cursor.closest('.cursor-wrap').addClass('mixBlendMode')
                    gsap.to(cursor.find('.cursor-dot'), {width: targetValue.w, height: targetValue.h,duration: .6, ease: 'power2.out', overwrite: true})
                    gsap.to(cursor.find('.cursor-border'), {width: cusrorBorderWidth + cvUnit(15, "rem"), height: cusrorBorderWidth + cvUnit(15, "rem"), duration: .6, ease: 'power2.out', overwrite: true})

                    xSetter(cursor.get(0))(lerp(cursorX, targetOffsetLeft + target.outerWidth()/2, velChange))
                    ySetter(cursor.get(0))(lerp(cursorY, targetOffsetTop + target.outerHeight()/2, velChange))
                    break;

                case 'radar':
                    updatePos('change')
                    cursor.find('.cursor-dot').addClass('smdot')
                    xSetter(cursor.get(0))(lerp(cursorX, targetOffsetLeft + target.outerWidth()/2, velChange))
                    ySetter(cursor.get(0))(lerp(cursorY, targetOffsetTop + target.outerHeight()/2, velChange))
                    break;

                case 'hidden':
                    cursor.find('.cursor-dot').addClass('hide')
                    cursor.find('.cursor-border').addClass('hide')
                    cursor.find('.cursor-glow').addClass('hide')

                    updatePos('free')
                    break;

                case 'dotstick':
                    dotstick = true
                    updatePos('dotstick', target)
                    break;

                case 'txtstick':
                    dotstick = true
                    updatePos('free')
                    cursor.find('.cursor-dot').addClass('whitedot')
                    cursor.find('.cursor-dot').addClass('smdot')
                    cursor.find('.cursor-border').addClass('hide')
                    xSetter(cursor.find('.cursor-dot').get(0))(lerp(dotX, targetOffsetLeft - pointerCurr().x + cvUnit(-10, "rem"), .1))
                    ySetter(cursor.find('.cursor-dot').get(0))(lerp(dotY, targetOffsetTop + targetValue.h/2 - pointerCurr().y, .1))
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
                    cursor.find('.cursor-border').addClass('hide')

                    if (target.hasClass('btn-white')) {
                        cursor.find('.cursor-dot').addClass('whitedot')
                    } else if (target.hasClass('btn-black')) {
                        cursor.find('.cursor-dot').addClass('whitedot')
                    } else {
                        cursor.find('.cursor-dot').addClass('whitedot')
                    }
                    break;

                case 'menuprog':
                    dotstick = true
                    cursor.find('.cursor-dot').addClass('smdot')
                    cursor.find('.cursor-border').addClass('hide')
                    cursor.find('.cursor-glow').addClass('hide')
                    updatePos('dotstick', target)
                    break;
            }
        } else {
            if (cursorChange == true) {
                cursor.closest('.cursor-wrap').removeClass('mixBlendMode')
                gsap.to('[data-cursor="btnstick"] .txt', {x: 0, duration: .6, ease: 'power2.out'})
                cursor.find('.cursor-dot').removeClass('blackdot')
                cursor.find('.cursor-dot').removeClass('whitedot')
                cursor.find('.cursor-dot').removeClass('smdot')
                cursor.find('.cursor-border').removeClass('hide')
                cursor.find('.cursor-glow').removeClass('hide')
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