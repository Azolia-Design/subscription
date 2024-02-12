import { lerp, xSetter, ySetter, xGetter, yGetter, pointerCurr } from "../helper/index";
import { cvUnit, isTouchDevice } from '../helper/viewport'

const initCursor = () => {
    const cusrorDotWidth = parseFloat($('.cursor-dot').css('width'))
    const cusrorBorderWidth = parseFloat($('.cursor-border').css('width'))
    const cusroGlowWidth = parseFloat($('.cursor-glow').css('width'))

    let cursorChange = false
    const velChange = .12

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

        function updatePos(mode) {
            xSetter(cursor.get(0))(lerp(cursorX, pointerCurr().x, .1))
            ySetter(cursor.get(0))(lerp(cursorY, pointerCurr().y, .1))
            xSetter(cursor.find('.cursor-border').get(0))(lerp(borderX, -(pointerCurr().x - cursorX)/20, .15))
            ySetter(cursor.find('.cursor-border').get(0))(lerp(borderY, -(pointerCurr().y - cursorY)/20, .15))
            xSetter(cursor.find('.cursor-glow').get(0))(lerp(glowX, -(pointerCurr().x - cursorX)/4, .1))
            ySetter(cursor.find('.cursor-glow').get(0))(lerp(glowY, -(pointerCurr().y - cursorY)/4, .1))
        }

        if ($('[data-cursor]:hover').length) {
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
                    cursor.closest('.cursor-wrap').addClass('mixBlendMode')
                    gsap.to(cursor.find('.cursor-dot'), {width: targetValue.w, height: targetValue.h, duration: .6, ease: 'power2.out', overwrite: true})
                    gsap.to(cursor.find('.cursor-border'), {width: targetValue.w + cvUnit(30, "rem"), height: targetValue.h + cvUnit(30, "rem"), duration: .6, ease: 'power2.out', overwrite: true})

                    xSetter(cursor.get(0))(lerp(cursorX, targetOffsetLeft + target.outerWidth()/2, velChange))
                    ySetter(cursor.get(0))(lerp(cursorY, targetOffsetTop + target.outerHeight()/2, velChange))
                    xSetter(cursor.find('.cursor-border').get(0))(lerp(borderX, 0, velChange))
                    ySetter(cursor.find('.cursor-border').get(0))(lerp(borderY, 0, velChange))
                    break;

                case 'radar':
                    gsap.to(cursor.find('.cursor-dot'), {scale: 0, duration: .6, ease: 'power2.out', overwrite: true})

                    xSetter(cursor.get(0))(lerp(cursorX, targetOffsetLeft + target.outerWidth()/2, velChange))
                    ySetter(cursor.get(0))(lerp(cursorY, targetOffsetTop + target.outerHeight()/2, velChange))
                    break;

                case 'hidden':
                    updatePos()

                    gsap.to(cursor.find('.cursor-dot'), {scale: 0, duration: .6, ease: 'power2.out', overwrite: true})
                    gsap.to(cursor.find('.cursor-border'), {scale: 1.5, autoAlpha: 0, duration: .4, ease: 'power2.out', overwrite: true})
                    gsap.to(cursor.find('.cursor-glow'), {scale: 1.5, autoAlpha: 0, duration: .4, ease: 'power2.out', overwrite: true})
                    break;

                case 'dotstick':
                    gsap.to(cursor.find('.cursor-dot'), {width: target.find('[data-cursor-dotpos]').width() + 6, height: target.find('[data-cursor-dotpos]').height() + 6, duration: .6, ease: 'power2.out', overwrite: true})
                    // gsap.to(cursor.find('.cursor-border'), {scale: 1.5, autoAlpha: 0, duration: .4, ease: 'power2.out', overwrite: true})
                    // gsap.to(cursor.find('.cursor-glow'), {scale: 1.5, autoAlpha: 0, duration: .4, ease: 'power2.out', overwrite: true})

                    xSetter(cursor.get(0))(lerp(cursorX, dotOffsetLeft + target.find('[data-cursor-dotpos]').outerWidth()/2, velChange))
                    ySetter(cursor.get(0))(lerp(cursorY, dotOffsetTop + target.find('[data-cursor-dotpos]').outerHeight()/2, velChange))
                    xSetter(cursor.find('.cursor-dot').get(0))(lerp(dotX, 0, velChange))
                    ySetter(cursor.find('.cursor-dot').get(0))(lerp(dotY, 0, velChange))
                    xSetter(cursor.find('.cursor-border').get(0))(lerp(borderX, 0, velChange))
                    ySetter(cursor.find('.cursor-border').get(0))(lerp(borderY, 0, velChange))
                    xSetter(cursor.find('.cursor-glow').get(0))(lerp(glowX, pointerCurr().x - (dotOffsetLeft + target.find('[data-cursor-dotpos]').outerWidth()/2), .15))
                    ySetter(cursor.find('.cursor-glow').get(0))(lerp(glowY, pointerCurr().y - (dotOffsetTop + target.find('[data-cursor-dotpos]').outerHeight()/2), .15))

                    break;

                case 'txtstick':
                    gsap.set(cursor.find('.cursor-dot'), {width: cvUnit(5, "rem"), height: cvUnit(5, "rem"), scale: 1, duration: .6, ease: 'power2.out', overwrite: true})
                    gsap.to(cursor.find('.cursor-border'), {scale: 1.5, autoAlpha: 0, duration: .4, ease: 'power2.out', overwrite: true})
                    gsap.set(cursor.find('.cursor-dot'), {backgroundColor: '#fff', duration: .6, ease: 'power2.out', overwrite: true})

                    xSetter(cursor.get(0))(lerp(cursorX, targetOffsetLeft + cvUnit(-10, "rem"), velChange))
                    ySetter(cursor.get(0))(lerp(cursorY, targetOffsetTop + targetValue.h/2, velChange))
                    xSetter(cursor.find('.cursor-glow').get(0))(lerp(glowX, pointerCurr().x - targetOffsetLeft , velChange))
                    ySetter(cursor.find('.cursor-glow').get(0))(lerp(glowY, pointerCurr().y - targetOffsetTop, velChange))
                    break;
                
                case 'halostick':
                    gsap.to(target, {x: cvUnit(30,'rem'), duration: .6, ease: 'power2.out', overwrite: true})
                    gsap.to(cursor.find('.cursor-dot'), {width: cvUnit(5, "rem"), height: cvUnit(5, "rem"), scale: 1, duration: .6, ease: 'power2.out', overwrite: true})
                    gsap.to(cursor.find('.cursor-border'), {scale: 1.5, autoAlpha: 0, duration: .4, ease: 'power2.out', overwrite: true})
                    // gsap.to(cursor.find('.cursor-glow'), {scale: 1.5, autoAlpha: 0, duration: .4, ease: 'power2.out', overwrite: true})

                    xSetter(cursor.get(0))(lerp(cursorX, targetOffsetLeft + cvUnit(-15, "rem"), velChange))
                    ySetter(cursor.get(0))(lerp(cursorY, targetOffsetTop + targetValue.h/2, velChange))
                    xSetter(cursor.find('.cursor-glow').get(0))(lerp(glowX, pointerCurr().x - targetOffsetLeft , velChange))
                    ySetter(cursor.find('.cursor-glow').get(0))(lerp(glowY, pointerCurr().y - targetOffsetTop, velChange))

                    break;

                case 'btnstick':
                    gsap.to(target.find('.txt'), {x: cvUnit(15, 'rem')/2, duration: .6, ease: 'power2.out', overwrite: true})

                    gsap.set(cursor.find('.cursor-dot'), {width: cvUnit(10, "rem"), height: cvUnit(10, "rem"), scale: 1, duration: .6, ease: 'power2.out', overwrite: true})
                    gsap.to(cursor.find('.cursor-border'), {scale: 1.5, autoAlpha: 0, duration: .4, ease: 'power2.out', overwrite: true})

                    if (target.hasClass('btn-white')) {
                        gsap.set(cursor.find('.cursor-dot'), {backgroundColor: '#fff', duration: .6, ease: 'power2.out', overwrite: true})
                    } else if (target.hasClass('btn-black')) {
                        gsap.set(cursor.find('.cursor-dot'), {backgroundColor: '#fff', duration: .6, ease: 'power2.out', overwrite: true})
                    } else {
                        gsap.set(cursor.find('.cursor-dot'), {backgroundColor: '#fff', duration: .6, ease: 'power2.out', overwrite: true})
                    }

                    xSetter(cursor.get(0))(lerp(cursorX, txtOffsetLeft + cvUnit(-15, "rem") + parseInt(target.find('.txt').css('paddingLeft')), velChange))
                    ySetter(cursor.get(0))(lerp(cursorY, txtOffsetTop + target.height()/2, velChange))
                    xSetter(cursor.find('.cursor-glow').get(0))(lerp(glowX, pointerCurr().x - cursorX , velChange))
                    ySetter(cursor.find('.cursor-glow').get(0))(lerp(glowY, pointerCurr().y - cursorY, velChange))

                    break;

                case 'menuprog':
                    updatePos()

                    gsap.to(cursor.find('.cursor-dot'), {scale: target.find('.header-menu-prog-item').height() / cusrorDotWidth, duration: .6, ease: 'power2.out', overwrite: true})
                    gsap.to(cursor.find('.cursor-border'), {scale: 1.5, autoAlpha: 0, duration: .4, ease: 'power2.out', overwrite: true})
                    gsap.to(cursor.find('.cursor-glow'), {scale: 1.5, autoAlpha: 0, duration: .4, ease: 'power2.out', overwrite: true})

                    xSetter(cursor.get(0))(lerp(cursorX, targetOffsetLeft + targetValue.w/2, velChange))
                    ySetter(cursor.get(0))(lerp(cursorY, targetOffsetTop + targetValue.h/2, velChange))
                    break;
            }
            cursorChange = true
        } else {
            if (cursorChange == true) {
                cursor.closest('.cursor-wrap').removeClass('mixBlendMode')
                gsap.to('[data-cursor="btnstick"] .txt', {x: 0, duration: .6, ease: 'power2.out'})
                gsap.to('[data-cursor="halostick"]', {x: 0, duration: .6, ease: 'power2.out'})

                gsap.to(cursor.find('.cursor-dot'), {width: cusrorDotWidth, height: cusrorDotWidth, backgroundColor: '#f5450d',scale: 1, autoAlpha: 1, backgroundColor: '#f5450d', duration: .6, ease: 'power2.out'})
                gsap.to(cursor.find('.cursor-border'), {width: cusrorBorderWidth, height: cusrorBorderWidth, scale: 1, autoAlpha: 1, duration: .6, ease: 'power2.out'})
                gsap.to(cursor.find('.cursor-glow'), {width: cusroGlowWidth, height: cusroGlowWidth, scale: 1, autoAlpha: 1, duration: .6, ease: 'power2.out'})
                cursorChange = false
            }
            updatePos()
        }
        requestAnimationFrame(initMouseMove)
    }
    if ($(window).width() > 991) {
        requestAnimationFrame(initMouseMove)
    }
}

export default initCursor;