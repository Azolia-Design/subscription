import { xGetter, xSetter, lerp } from "../helper/index";
import { lenis } from "../global/lenis";
import { isTouchDevice, viewportBreak } from "../helper/viewport";

const setupDot = () => {
    let allSections = $('[data-section]');
    let tempLabel = $('.header-menu-label-item').eq(0).clone();
    let tempProg = $('.header-menu-prog-item-wrap').eq(0).clone();

    $('.header-menu-label').find('.header-menu-label-item').remove();
    $('.header-menu-prog').find('.header-menu-prog-item-wrap').remove();
    allSections.each((idx, el) => {
        let htmlLabel = tempLabel.clone();
        htmlLabel.attr('data-header-id', `${$(el).attr('data-section-id')}`);
        htmlLabel.find('span').text(`${$(el).attr('data-section-id')}`);
        $('.header-menu-label').append(htmlLabel)

        let htmlProg = tempProg.clone();
        htmlProg.attr('href', `#${$(el).attr('data-section-id')}`)
        htmlProg.attr('data-header-id',`${$(el).attr('data-section-id')}`)
        $('.header-menu-prog').append(htmlProg)
    })
}

const updateProgressByScroll = () => {
    let allSections = $('[data-section]');
    const DOM = {
        labelItem: $('.header-menu-label-item'),
        labelById: (id) => $(`.header-menu-label-item[data-header-id="${id}"]`),
        progWrap: $(`.header-menu-prog-item-wrap`),
        progItem: $(`.header-menu-prog-item`),
        progById: (id) => $(`.header-menu-prog-item-wrap[data-header-id="${id}"]`)
    }
    setTimeout(() => {
        let offset = '40%'
        allSections.each((idx, el) => {
            ScrollTrigger.create({
                trigger: el,
                start: `top top+=${offset}`,
                end: `bottom bottom-=${offset}`,
                scrub: true,
                onUpdate: (self) => {
                    let currSection = allSections.eq(idx);
                    let id = currSection.attr('data-section-id')

                    DOM.labelById(id).addClass('active');
                    DOM.labelItem.not(DOM.labelById(id)).removeClass('active');

                    DOM.progById(id).addClass('active');
                    DOM.progWrap.not(DOM.progById(id)).removeClass('active');

                    DOM.progById(id).find(DOM.progItem).addClass('active');
                    DOM.progWrap.not(DOM.progById(id)).find(DOM.progItem).removeClass('active');

                    let percent = Math.ceil((self.progress * 100) - 100);
                    gsap.to(DOM.progById(id).find('.header-menu-prog-item-inner'), {xPercent: percent, duration: .3, overwrite: true})
                }
            })
        })
        ScrollTrigger.create({
            trigger: '.home-main',
            start: `top top+=${offset}`,
            end: `bottom bottom-=${offset}`,
            onLeave: () => {
                $(`.header-menu-label-item`).removeClass('active');
                $(`.header-menu-prog-item`).removeClass('active');
            },
            onLeaveBack: () => {
                $(`.header-menu-label-item`).removeClass('active');
                $(`.header-menu-prog-item`).removeClass('active');
            }
        })
    }, 100);

    // DOM.progWrap.on('click', function (e) {
    //     let target = $(this).attr('data-header-id');
    //     let offset = viewportBreak({ desktop: -100, mobile: -30 });
    //     if (!isTouchDevice()) {
    //         lenis.scrollTo(`[data-section-id="${target}"]`, {
    //             offset: offset
    //         })
    //     } else {
    //         let targetTop = $(`[data-section-id="${target}"]`).get(0).offsetTop + $(window).height() + offset;
    //         $('html').animate({
    //             scrollTop: targetTop
    //         }, 800);
    //     }

    //     history.replaceState({}, '', `${window.location.pathname}#${target}`);
    //     return false;
    // })

    const checkMenuActive = () => {
        if ($('.header-menu-label-item.active').length === 0) {
            gsap.set('.header-menu-label', { '--d-width': '0px' });
        }
        else {
            gsap.set('.header-menu-label', { '--d-width': `${$('.header-menu-label-item.active').eq(0).width()}px` });
        }
        requestAnimationFrame(checkMenuActive);
    }
    requestAnimationFrame(checkMenuActive);
}

const hoverDot = () => {
    $('.header-menu-prog-item-wrap').on('mouseenter', function (e) {
        let content = $(this).attr('data-header-id');
        $('.header-menu-prog-label').text(content);
        gsap.to('.header-menu-prog-label', { autoAlpha: 1 });
    })
    $('.header-menu-prog-item-wrap').on('mouseleave', function (e) {
        gsap.to('.header-menu-prog-label', { autoAlpha: 0 })
    })
}

function checkHoverDot() {
    if ($('.header-menu-prog-item-wrap:hover').length) {
        let target = $('.header-menu-prog-item-wrap:hover')
        let currX = xGetter('.header-menu-prog-label')
        xSetter('.header-menu-prog-label')(lerp(currX, target.get(0).offsetLeft - $('.header-menu-prog-label').outerWidth() / 2 + target.outerWidth() / 2));
    }
    requestAnimationFrame(checkHoverDot);
}

const updateHeaderBarByScroll = () => {
    let tlHeaderTrigger = gsap.timeline({
        scrollTrigger: {
            trigger: '.home-main',
            start: `top+=${$('.header').outerHeight()} top`,
            onEnter: () => {
                $('.header-logo').addClass('active')
                $('.header-menu').addClass('active')
                $('.header-hamburger').addClass('active')

                if ($(window).width() <= 991) {
                    gsap.to('.header-main-schedule', {width: 0, overwrite: true})
                    gsap.to('.header-hamburger', {width: 0, overwrite: true})
                }
            },
            onLeaveBack: () => {
                $('.header-logo').removeClass('active')
                $('.header-menu').removeClass('active')
                $('.header-hamburger').removeClass('active')
                if ($(window).width() <= 991) {
                    gsap.to('.header-main-schedule', {width: 'auto', overwrite: true})
                    gsap.to('.header-hamburger', {width: '6rem', overwrite: true})
                }
            }
        }
    })
    $('.header-hamburger').on('click', function(e) {
        e.preventDefault();
        if (!$(this).hasClass('active')) {
            $('.header-menu').addClass('active')
            $(this).addClass('active')
        } else {
            $('.header-menu').removeClass('active')
            $(this).removeClass('active')
        }
    })
}

const header = {
    setup() {
        setupDot();
    },
    init() {
        hoverDot();
        checkHoverDot();
        updateProgressByScroll();
        updateHeaderBarByScroll();
    }
}

const initHeader = () => {
    if ($(window).width() > 767) {
        header.setup();
        header.init();
    }   
}

export default initHeader;