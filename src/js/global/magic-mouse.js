import { lerp, xSetter, ySetter, rotZSetter, scaleXSetter, scaleYSetter, xGetter, yGetter, rotZGetter, scaleXGetter, scaleYGetter, pointerCurr } from "../helper/index";
import { cvUnit, isTouchDevice } from '../helper/viewport'

const initCursor = () => {
    let cursorChange = false
    let insideBgSc = false
    const velChange = .12
    let cursor = $('.cursor')
    let targetPos
    let forcing = false

    function initMouseMove() {
        let cursorX = xGetter(cursor.get(0))
        let cursorY = yGetter(cursor.get(0))
        let zRot = rotZGetter(cursor.get(0))
        let scaleX = scaleXGetter(cursor.get(0))
        let scaleY = scaleYGetter(cursor.get(0))

        let dotX = xGetter(cursor.find('.cursor-dot').get(0))
        let dotY = yGetter(cursor.find('.cursor-dot').get(0))
        let borderX = xGetter(cursor.find('.cursor-border').get(0))
        let borderY = yGetter(cursor.find('.cursor-border').get(0))
        let glowX = xGetter(cursor.find('.cursor-glow').get(0))
        let glowY = yGetter(cursor.find('.cursor-glow').get(0))


        targetPos = {
            x: pointerCurr().x,
            y: pointerCurr().y
        }

        function updatePos(mode) {
            if (mode == "force") {
                // gsap.set(cursor, {x: targetPos.x, y: targetPos.y})
            } else {
                xSetter(cursor.get(0))(lerp(cursorX, targetPos.x, .1))
                ySetter(cursor.get(0))(lerp(cursorY, targetPos.y, .1))
            }

            xSetter(cursor.find('.cursor-border').get(0))(lerp(borderX, -(targetPos.x - cursorX) / 20, .15))
            ySetter(cursor.find('.cursor-border').get(0))(lerp(borderY, -(targetPos.y - cursorY) / 20, .15))
            xSetter(cursor.find('.cursor-glow').get(0))(lerp(glowX, -(targetPos.x - cursorX) / 4, .1))
            ySetter(cursor.find('.cursor-glow').get(0))(lerp(glowY, -(targetPos.y - cursorY) / 4, .1))
        }

        let showreelIc = $('.home-showreel-play-ic')
        let showreelIcX = xGetter(showreelIc.get(0))
        let showreelIcY = yGetter(showreelIc.get(0))
        let targetX, targetY

        if ($('.home-showreel--wrap:hover').length) {
            if ($('[data-video="to-pause"]').length && $('.home-showreel-thumb:hover').length) {
                targetX = (pointerCurr().x / $(window).width() - .5) * 2 * ($(window).width()) / 2
                targetY = ((pointerCurr().y - $('.home-showreel-thumb').get(0).getBoundingClientRect().top) / ($('.home-showreel-thumb').height()) - 0.5) * ($('.home-showreel-thumb').height())

                cursor.find('.cursor-dot').addClass('hide')
                cursor.find('.cursor-border').addClass('hide')
                cursor.find('.cursor-glow').addClass('hide')
                if (!showreelIc.hasClass('pause')) {
                    showreelIc.addClass('pause')
                    gsap.to(showreelIc, { scale: .4, autoAlpha: 1, overwrite: true })
                }
            } else {
                targetX = 0
                targetY = 0
                cursor.find('.cursor-dot').removeClass('hide')
                cursor.find('.cursor-border').removeClass('hide')
                cursor.find('.cursor-glow').removeClass('hide')
                if (showreelIc.hasClass('pause')) {
                    showreelIc.removeClass('pause')
                    gsap.to(showreelIc, { scale: 1, autoAlpha: 1, overwrite: true })
                }
            }
        } else {
            targetX = 0
            targetY = 0
        }

        if ($('[data-video="to-pause"]').length && !$('.home-showreel-thumb:hover').length) {
            if (showreelIc.hasClass('pause')) {
                gsap.to(showreelIc, { scale: 1, autoAlpha: 0, overwrite: true })
            }
        }
        xSetter(showreelIc.get(0))(lerp(showreelIcX, targetX, .1))
        ySetter(showreelIc.get(0))(lerp(showreelIcY, targetY, .1))

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

                    targetPos = {
                        x: targetOffsetLeft + target.outerWidth() / 2,
                        y: targetOffsetTop + target.outerHeight() / 2
                    }

                    xSetter(cursor.get(0))(lerp(cursorX, targetOffsetLeft + target.outerWidth() / 2, velChange))
                    ySetter(cursor.get(0))(lerp(cursorY, targetOffsetTop + target.outerHeight() / 2, velChange))
                    xSetter(cursor.find('.cursor-border').get(0))(lerp(borderX, 0, velChange))
                    ySetter(cursor.find('.cursor-border').get(0))(lerp(borderY, 0, velChange))
                    break;

                case 'radar':
                    cursor.find('.cursor-dot').addClass('hide')

                    targetPos = {
                        x: targetOffsetLeft + target.outerWidth() / 2,
                        y: targetOffsetTop + target.outerHeight() / 2
                    }

                    updatePos()
                    xSetter(cursor.find('.cursor-border').get(0))(lerp(borderX, 0, .15))
                    ySetter(cursor.find('.cursor-border').get(0))(lerp(borderY, 0, .15))
                    break;

                case 'hidden':
                    updatePos()

                    gsap.to(cursor.find('.cursor-dot'), { scale: 0, duration: .6, ease: 'power2.out', overwrite: true })
                    gsap.to(cursor.find('.cursor-border'), { scale: 1.5, autoAlpha: 0, duration: .4, ease: 'power2.out', overwrite: true })
                    gsap.to(cursor.find('.cursor-glow'), { scale: 1.5, autoAlpha: 0, duration: .4, ease: 'power2.out', overwrite: true })
                    break;

                case 'dotstick':
                    cursor.find('.cursor-dot').addClass('stickfaq')
                    targetPos = {
                        x: dotOffsetLeft + target.find('[data-cursor-dotpos]').outerWidth() / 2,
                        y: dotOffsetTop + target.find('[data-cursor-dotpos]').outerHeight() / 2
                    }
                    updatePos()

                    if (target.hasClass('hovered')) {
                        if (Math.abs(cursorY - targetPos.y) <= 1 || forcing == true) {
                            updatePos('force')
                            forcing = true
                        }
                    } else {
                        forcing = false
                        $(`[data-cursor="dotstick"]`).removeClass('hovered')
                        target.addClass('hovered')
                    }
                    break;

                case 'txtstick':
                    cursor.find('.cursor-dot').addClass('smdot')
                    cursor.find('.cursor-border').addClass('hide')
                    cursor.find('.cursor-glow').addClass('hide')

                    if (target.hasClass('footer-link')) {
                        cursor.find('.cursor-dot').addClass('whitedot')
                    }

                    targetPos = {
                        x: targetOffsetLeft + cvUnit(-10, "rem"),
                        y: targetOffsetTop + targetValue.h / 2
                    }
                    updatePos()
                    break;

                case 'halostick':
                    cursor.find('.cursor-dot').addClass('smdot')
                    cursor.find('.cursor-border').addClass('hide')
                    cursor.find('.cursor-glow').addClass('hide')

                    gsap.to(target, { x: cvUnit(15, 'rem'), duration: .6, ease: 'power2.out', overwrite: true })

                    targetPos = {
                        x: targetOffsetLeft + cvUnit(-10, "rem"),
                        y: targetOffsetTop + targetValue.h / 2
                    }
                    updatePos()

                    break;

                case 'btnstick':
                    cursor.find('.cursor-dot').removeClass('hide')
                    cursor.find('.cursor-glow').removeClass('hide')

                    cursor.find('.cursor-dot').addClass('smdot')
                    cursor.find('.cursor-border').addClass('hide')

                    gsap.to(target.find('.txt'), { x: cvUnit(15, 'rem') / 2, duration: .6, ease: 'power2.out', overwrite: true })

                    if (target.hasClass('btn-white')) {
                        cursor.find('.cursor-dot').addClass('whitedot')
                    } else if (target.hasClass('btn-black')) {
                        cursor.find('.cursor-dot').addClass('whitedot')
                    } else {
                        cursor.find('.cursor-dot').addClass('whitedot')
                    }

                    targetPos = {
                        x: txtOffsetLeft + cvUnit(-15, "rem") + parseInt(target.find('.txt').css('paddingLeft')),
                        y: txtOffsetTop + target.height() / 2
                    }
                    updatePos()
                    break;

                case 'menuprog':
                    cursor.find('.cursor-dot').removeClass('hide')
                    cursor.find('.cursor-dot').removeClass('whitedot')

                    cursor.find('.cursor-dot').addClass('smdot')
                    cursor.find('.cursor-border').addClass('hide')
                    cursor.find('.cursor-glow').addClass('hide')

                    targetPos = {
                        x: targetOffsetLeft + targetValue.w / 2,
                        y: targetOffsetTop + targetValue.h / 2
                    }
                    updatePos()
                    break;

                case 'hamburger':
                    cursor.find('.cursor-dot').removeClass('whitedot')
                    cursor.find('.cursor-border').removeClass('hide')

                    cursor.find('.cursor-dot').addClass('hide')
                    cursor.find('.cursor-border').addClass('mddot')
                    cursor.find('.cursor-glow').addClass('hide')

                    targetPos = {
                        x: targetOffsetLeft + targetValue.w / 2,
                        y: targetOffsetTop + targetValue.h / 2
                    }
                    updatePos()
                    xSetter(cursor.find('.cursor-border').get(0))(lerp(borderX, 0, velChange))
                    ySetter(cursor.find('.cursor-border').get(0))(lerp(borderY, 0, velChange))
                    break;
            }
            cursorChange = true
        } else {
            forcing = false
            if (cursorChange == true) {
                cursor.closest('.cursor-wrap').removeClass('mixBlendMode')
                gsap.to('[data-cursor="btnstick"] .txt', { x: 0, duration: .6, ease: 'power2.out' })
                gsap.to('[data-cursor="halostick"]', { x: 0, duration: .6, ease: 'power2.out' })

                cursor.find('.cursor-dot').removeClass('stickstepdot')
                cursor.find('.cursor-dot').removeClass('hide')
                cursor.find('.cursor-dot').removeClass('smdot')
                cursor.find('.cursor-dot').removeClass('whitedot')
                cursor.find('.cursor-dot').removeClass('blackdot')
                cursor.find('.cursor-dot').removeClass('stickfaq')

                cursor.find('.cursor-border').removeClass('stickstepdot')
                cursor.find('.cursor-border').removeClass('mddot')
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