import { lerp, xSetter, ySetter, xGetter, yGetter, pointerCurr } from "../helper/index";
import { cvUnit, isTouchDevice } from '../helper/viewport'

const initCursor = () => {
    let cursorChange = false
    let insideBgSc = false
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

                    cursor.find('.cursor-dot').addClass('stickstepdot')
                    cursor.find('.cursor-border').addClass('stickstepdot')

                    xSetter(cursor.get(0))(lerp(cursorX, targetOffsetLeft + target.outerWidth()/2, velChange))
                    ySetter(cursor.get(0))(lerp(cursorY, targetOffsetTop + target.outerHeight()/2, velChange))
                    xSetter(cursor.find('.cursor-border').get(0))(lerp(borderX, 0, velChange))
                    ySetter(cursor.find('.cursor-border').get(0))(lerp(borderY, 0, velChange))
                    break;

                case 'radar':
                    cursor.find('.cursor-dot').addClass('hide')

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
                    cursor.find('.cursor-dot').addClass('stickfaq')

                    xSetter(cursor.get(0))(lerp(cursorX, dotOffsetLeft + target.find('[data-cursor-dotpos]').outerWidth()/2, velChange))
                    ySetter(cursor.get(0))(lerp(cursorY, dotOffsetTop + target.find('[data-cursor-dotpos]').outerHeight()/2, velChange))
                    xSetter(cursor.find('.cursor-border').get(0))(lerp(borderX, 0, velChange))
                    ySetter(cursor.find('.cursor-border').get(0))(lerp(borderY, 0, velChange))
                    xSetter(cursor.find('.cursor-glow').get(0))(lerp(glowX, pointerCurr().x - (dotOffsetLeft + target.find('[data-cursor-dotpos]').outerWidth()/2), .15))
                    ySetter(cursor.find('.cursor-glow').get(0))(lerp(glowY, pointerCurr().y - (dotOffsetTop + target.find('[data-cursor-dotpos]').outerHeight()/2), .15))

                    break;

                case 'txtstick':
                    cursor.find('.cursor-dot').addClass('smdot')
                    cursor.find('.cursor-border').addClass('hide')

                    if (target.hasClass('footer-link')) {
                        cursor.find('.cursor-dot').addClass('whitedot')
                    }

                    xSetter(cursor.get(0))(lerp(cursorX, targetOffsetLeft + cvUnit(-10, "rem"), velChange))
                    ySetter(cursor.get(0))(lerp(cursorY, targetOffsetTop + targetValue.h/2, velChange))
                    xSetter(cursor.find('.cursor-glow').get(0))(lerp(glowX, pointerCurr().x - targetOffsetLeft , velChange))
                    ySetter(cursor.find('.cursor-glow').get(0))(lerp(glowY, pointerCurr().y - targetOffsetTop, velChange))
                    break;

                case 'halostick':
                    cursor.find('.cursor-dot').addClass('smdot')
                    cursor.find('.cursor-border').addClass('hide')

                    gsap.to(target, {x: cvUnit(30,'rem'), duration: .6, ease: 'power2.out', overwrite: true})

                    xSetter(cursor.get(0))(lerp(cursorX, targetOffsetLeft + cvUnit(-15, "rem"), velChange))
                    ySetter(cursor.get(0))(lerp(cursorY, targetOffsetTop + targetValue.h/2, velChange))
                    xSetter(cursor.find('.cursor-glow').get(0))(lerp(glowX, pointerCurr().x - targetOffsetLeft , velChange))
                    ySetter(cursor.find('.cursor-glow').get(0))(lerp(glowY, pointerCurr().y - targetOffsetTop, velChange))

                    break;

                case 'btnstick':
                    cursor.find('.cursor-dot').removeClass('hide')
                    cursor.find('.cursor-glow').removeClass('hide')

                    cursor.find('.cursor-dot').addClass('smdot')
                    cursor.find('.cursor-border').addClass('hide')

                    gsap.to(target.find('.txt'), {x: cvUnit(15, 'rem')/2, duration: .6, ease: 'power2.out', overwrite: true})

                    if (target.hasClass('btn-white')) {
                        cursor.find('.cursor-dot').addClass('whitedot')
                    } else if (target.hasClass('btn-black')) {
                        cursor.find('.cursor-dot').addClass('whitedot')
                    } else {
                        cursor.find('.cursor-dot').addClass('whitedot')
                    }

                    xSetter(cursor.get(0))(lerp(cursorX, txtOffsetLeft + cvUnit(-15, "rem") + parseInt(target.find('.txt').css('paddingLeft')), velChange))
                    ySetter(cursor.get(0))(lerp(cursorY, txtOffsetTop + target.height()/2, velChange))
                    xSetter(cursor.find('.cursor-glow').get(0))(lerp(glowX, pointerCurr().x - cursorX , velChange))
                    ySetter(cursor.find('.cursor-glow').get(0))(lerp(glowY, pointerCurr().y - cursorY, velChange))

                    break;

                case 'menuprog':
                    cursor.find('.cursor-dot').addClass('smdot')
                    cursor.find('.cursor-border').addClass('hide')
                    cursor.find('.cursor-glow').addClass('hide')

                    xSetter(cursor.get(0))(lerp(cursorX, targetOffsetLeft + targetValue.w/2, velChange))
                    ySetter(cursor.get(0))(lerp(cursorY, targetOffsetTop + targetValue.h/2, velChange))
                    break;

                case 'hamburger':
                    cursor.find('.cursor-border').removeClass('hide')

                    cursor.find('.cursor-dot').addClass('hide')
                    cursor.find('.cursor-glow').addClass('hide')

                    xSetter(cursor.get(0))(lerp(cursorX, targetOffsetLeft + targetValue.w/2, velChange))
                    ySetter(cursor.get(0))(lerp(cursorY, targetOffsetTop + targetValue.h/2, velChange))
                    xSetter(cursor.find('.cursor-border').get(0))(lerp(borderX, 0, velChange))
                    ySetter(cursor.find('.cursor-border').get(0))(lerp(borderY, 0, velChange))
                    break;
            }
            cursorChange = true
        } else {
            if (cursorChange == true) {
                cursor.closest('.cursor-wrap').removeClass('mixBlendMode')
                gsap.to('[data-cursor="btnstick"] .txt', {x: 0, duration: .6, ease: 'power2.out'})
                gsap.to('[data-cursor="halostick"]', {x: 0, duration: .6, ease: 'power2.out'})

                cursor.find('.cursor-dot').removeClass('stickstepdot')
                cursor.find('.cursor-dot').removeClass('hide')
                cursor.find('.cursor-dot').removeClass('smdot')
                cursor.find('.cursor-dot').removeClass('whitedot')
                cursor.find('.cursor-dot').removeClass('blackdot')
                cursor.find('.cursor-dot').removeClass('stickfaq')

                cursor.find('.cursor-border').removeClass('stickstepdot')
                cursor.find('.cursor-border').removeClass('hide')

                cursor.find('.cursor-glow').removeClass('hide')

                cursorChange = false
            }
            updatePos()
        }
        if ($('.home-portfolio:hover').length || $('.home-pricing-plan-item.popular:hover').length || $('.home-curtain:hover').length) {
            if (insideBgSc == false || cursorChange == false) {
                cursor.find('.cursor-dot').addClass('whitedot')
                insideBgSc = true
            }
        } else {
            if (insideBgSc == true) {
                cursor.find('.cursor-dot').removeClass('whitedot')
                insideBgSc = false
            }
        }
        requestAnimationFrame(initMouseMove)
    }
    if ($(window).width() > 991) {
        initMouseMove()
    }
}

export default initCursor;