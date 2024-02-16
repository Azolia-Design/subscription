import { selector, lerp, xGetter, xSetter, yGetter, ySetter, pointerCurr, FloatingAnimation } from '../helper/index';
import { marqueeCSS } from '../common/marquee';
import { lenis } from './lenis';
import { cvUnit, isTouchDevice, viewportBreak} from '../helper/viewport';

const initFooter = () => {
    marqueeCSS({
        parent: selector('.footer-brands'),
        duration: 10
    });

    const curtainFooter = () => {
        let curtainHeight = $('.footer-curtain').height()

        gsap.from('.footer-curtain--inner', {
            scrollTrigger: {
                trigger: '.footer-curtain',
                start: 'top bottom',
                endTrigger: '.footer',
                end: `bottom bottom+=${cvUnit(viewportBreak({desktop: 0, tablet: -36, mobile: -82}), "rem") - (curtainHeight)}`,
                scrub: .2,
                // markers: true
            },
            scaleY: 0,
            stagger: {
                amount: -.35
            },
            delay: .2,
            ease: 'power1.inOut'
        })
    }
    curtainFooter();

    const parallaxBear = () => {
        let target = $('.footer-curtain-logo')
        let tarCurrX = xGetter(target.get(0))
        let tarCurrY = yGetter(target.get(0))
        let moveX = (pointerCurr().x/$(window).width() - 0.5) * ($(window).width() - target.width() - cvUnit(60, 'rem'))
        let moveY = (pointerCurr().y/$(window).height() - 0.5) * 2 * (target.height()/8)
        xSetter(target.get(0))(lerp(tarCurrX, moveX, .01))
        ySetter(target.get(0))(lerp(tarCurrY, moveY, .01))
        requestAnimationFrame(parallaxBear);
    }

    if ($(window).width() > 991) {
        parallaxBear();
    } else {
        // new FloatingAnimation('.footer-curtain-logo img', 20, 10, 4, 15)
    }

    $("[data-action='scrollTop']").on('click', function (e) {
        e.preventDefault()
        if (!isTouchDevice()) {
            lenis.scrollTo(0);
        }
        else {
            $('html').animate({ scrollTop: 0}, 800);
        }
    })
}

export default initFooter;