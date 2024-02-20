import { selector, lerp, xGetter, xSetter, yGetter, ySetter, rotZGetter, rotZSetter, pointerCurr, FloatingAnimation } from '../helper/index';
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
        let tarCurrRotz = rotZGetter(target.get(0))
        if (target.hasClass('active')) {
            let moveX = (pointerCurr().x/$(window).width() - 0.5) * ($(window).width() - target.width() - cvUnit(60, 'rem'))
            let moveY = (pointerCurr().y/$(window).height() - 0.5) * 2 * (target.height()/8)
            xSetter(target.get(0))(lerp(tarCurrX, moveX, .02))
            ySetter(target.get(0))(lerp(tarCurrY, moveY, .02))
            rotZSetter(target.get(0))(lerp(tarCurrRotz, Math.min(Math.max(((moveX - tarCurrX) / 80), -7), 7), .08))
        } else {
            xSetter(target.get(0))(lerp(tarCurrX, 0, .02))
            ySetter(target.get(0))(lerp(tarCurrY, 0, .02))
            rotZSetter(target.get(0))(lerp(tarCurrRotz, 0, .08))
        }
        requestAnimationFrame(parallaxBear);
    }

    ScrollTrigger.create({
        trigger: '.footer',
        start: 'top bottom',
        end: 'bottom top',
        toggleClass: {targets: '.footer-curtain-logo', className: "active"},
        onEnter: () => {
            if ($(window).width() > 991) {
                parallaxBear();
            }
        }
    })
    

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