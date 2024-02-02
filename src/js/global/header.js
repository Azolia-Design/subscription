import { xGetter, xSetter, lerp } from "../helper/index";

const setupDot = () => {
    let allSections = $('[data-section]');
    let tempLabel = $('.header-menu-label-item').eq(0).clone();
    let tempProg = $('.header-menu-prog-item').eq(0).clone();

    $('.header-menu-label').find('.header-menu-label-item').remove();
    $('.header-menu-prog').find('.header-menu-prog-item').remove();
    allSections.each((idx, el) => {
        let htmlLabel = tempLabel.clone();
        htmlLabel.html(`${$(el).attr('data-section-id')}`).attr('data-header-id',`${$(el).attr('data-section-id')}`)
        $('.header-menu-label').append(htmlLabel)

        let htmlProg = tempProg.clone();
        htmlProg.attr('href', `#${$(el).attr('data-section-id')}`)
        htmlProg.find('.header-menu-prog-item-txt').text(`${$(el).attr('data-section-id')}`)
        htmlProg.attr('data-header-id',`${$(el).attr('data-section-id')}`)
        $('.header-menu-prog').append(htmlProg)
    })
}

const updateProgressByScroll = () => {
    let allSections = $('[data-section]');
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
                    $(`.header-menu-label-item[data-header-id="${id}"]`).addClass('active');
                    $(`.header-menu-label-item`).not(`[data-header-id="${id}"]`).removeClass('active');
                    $(`.header-menu-prog-item[data-header-id="${id}"]`).addClass('active');
                    $(`.header-menu-prog-item`).not(`[data-header-id="${id}"]`).removeClass('active');
                    let percent = Math.ceil((self.progress * 100) - 100);
                    gsap.to($(`.header-menu-prog-item[data-header-id="${id}"]`).find('.header-menu-prog-item-inner'), {xPercent: percent, duration: .3, overwrite: true})
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
}

const hoverDot = () => {
    $('.header-menu-prog-item').on('mouseenter', function (e) {
        let content = $(this).attr('data-header-id');
        $('.header-menu-prog-label').text(content);
        gsap.to('.header-menu-prog-label', { autoAlpha: 1 });
    })
    $('.header-menu-prog-item').on('mouseleave', function (e) {
        gsap.to('.header-menu-prog-label', { autoAlpha: 0 })
    })
}

function checkHoverDot() {
    if ($('.header-menu-prog-item:hover').length) {
        console.log("hovering");
        let target = $('.header-menu-prog-item:hover')
        let currX = xGetter('.header-menu-prog-label')
        xSetter('.header-menu-prog-label')(lerp(currX, target.get(0).offsetLeft - $('.header-menu-prog-label').width() / 2 + target.width() / 2));
    }
    requestAnimationFrame(checkHoverDot);
}

checkHoverDot();

const updateHeaderBarByScroll = () => {
    let tlHeaderTrigger = gsap.timeline({
        scrollTrigger: {
            trigger: '.home-main',
            start: `top+=${$('.header').outerHeight()} top`,
            onEnter: () => {
                $('.header-logo').addClass('active')
                $('.header-menu').addClass('active')
                $('.header-hamburger').addClass('active')
            },
            onLeaveBack: () => {
                $('.header-logo').removeClass('active')
                $('.header-menu').removeClass('active')
                $('.header-hamburger').removeClass('active')
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
        updateProgressByScroll();
        updateHeaderBarByScroll();
    }
}

const initHeader = () => {
    header.setup();
    header.init();
}

export default initHeader;