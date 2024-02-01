import { parseRem, selector } from "../../helper/index";
import { lerp, xSetter, ySetter, rotZSetter, xGetter, yGetter, rotZGetter, findClosestEdge, FloatingAnimation, pointerCurr } from "../../helper";
import Flip from '../../vendors/Flip';
import {lenis} from '../../common/lenis'

const home = {
    namespace: "home",
    afterEnter(data) {
        console.log(`enter ${this.namespace}`);
        let cont = $('body');

        function updateHeader() {
            let allSections = $('[data-section]');
            let tempLabel = $('.header-menu-label-item').eq(0).clone();
            let tempProg = $('.header-menu-prog-item').eq(0).clone();

            $('.header-menu-label').find('.header-menu-label-item').remove();
            $('.header-menu-prog').find('.header-menu-prog-item').remove();
            allSections.each((idx, el) => {
                let htmlLabel = tempLabel.clone();
                htmlLabel.html(`${$(el).attr('data-section-id')}`)
                $('.header-menu-label').append(htmlLabel)

                let htmlProg = tempProg.clone();
                htmlProg.find('.header-menu-prog-item-link').attr('href', `#${$(el).attr('data-section-id')}`)
                $('.header-menu-prog').append(htmlProg)
            })
        }
        updateHeader()
        function handleHeader() {
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
        handleHeader()
        function heroParallax() {
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: cont.find('.home-hero'),
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                }
            })
            tl.to(cont.find('.home-hero-bg img'), {y: '19rem', ease: 'none'})
        }
        heroParallax()

        function benefitStackScroll() {
            const BENEFIT = {
                wrap: $('.home-benefit'),
                list: $('.home-benefit-list'),
                item: $('.home-benefit-item'),
                mainItem: $('.home-benefit-main'),
                otherItem: $('.home-benefit-other'),
                otherWrap: $('.home-benefit-other-wrap')
            }
            let scrollerTl = gsap.timeline({
                scrollTrigger: {
                    trigger: BENEFIT.wrap,
                    start: `top-=${$('header').outerHeight()} top`,
                    end: 'bottom bottom',
                    scrub: true
                }
            })

            let mainItemSelect = selector(BENEFIT.mainItem);
            scrollerTl
                .to(mainItemSelect('h2'), {
                    scale: 0.56, transformOrigin: "top left", ease: "linear",
                    duration: 1
                }, 0)
                .to(mainItemSelect('p'), {
                    marginTop: "-6rem", ease: "linear",
                    duration: 1
                }, 0)
                .to(BENEFIT.otherWrap, {
                    x: -BENEFIT.mainItem.width() + parseRem(100), ease: "linear",
                    duration: 1
                }, 0)

            BENEFIT.otherItem.each((index, item) => {
                const ITEM_WIDTH = 210 + parseRem(100);
                let itemSelect = selector(item);
                    gsap.set(itemSelect('span'), { scaleX: 0 });
                    scrollerTl
                        .to(item, {
                            duration: 1,
                            paddingLeft: parseRem(40)
                        })
                        .to(itemSelect('h3'), {
                            scale: .75, transformOrigin: "top left", ease: "linear", duration: 1
                        }, '<=0')
                        .to(itemSelect('span'), {
                            scaleX: 1, transformOrigin: "right", ease: "linear", duration: 1
                        }, "<=0")
                        .to(itemSelect('p'), {
                            autoAlpha: 0, ease: "linear", duration: 1,
                            // onComplete: () => $(item).removeClass('active')
                        }, '<=0.2')

                    BENEFIT.otherItem.each((idx, el) => {
                        if (idx > index) {
                            scrollerTl
                                .to(el, {
                                    x: -(ITEM_WIDTH * ( 1 + index )), ease: "linear",
                                    duration: 1,
                                }, '<=0')
                        }
                    })
            })
        }
        benefitStackScroll();

        function showreelGalleryZoom() {
            const GALLERY = {
                wrap: $('.home-showreel'),
                list: $('.home-showreel--inner'),
                item: $('.home-showreel-item'),
                mainItem: $('.home-showreel-item-main'),
                otherItem: $('.home-showreel-item-other')
            }
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: GALLERY.wrap,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                    markers: true
                }
            })

            tl
                .to(GALLERY.list, {
                    scale: 5, ease: 'none'
                })
                .to(GALLERY.otherItem.find('img'), {
                    opacity: 0, ease: 'none'
                }, "<= 0")
                .from(GALLERY.mainItem.find('img'), {
                    scale: 1.5, ease: 'none'
                }, "<= 0")
        }
        // showreelGalleryZoom()

        function homeSkill() {
            ScrollTrigger.create({
                trigger: '.home-skill',
                start: 'top bottom',
                end: 'bottom top',
                toggleClass: {targets: '.home-skill-thumb', className: "active"},
            })
            ScrollTrigger.create({
                trigger: '.home-skill',
                start: 'top bottom',
                once: true,
                onEnter: () => {
                    // $('.home-skill-item').each((idx, el) => {
                    //     const splitText = new SplitText($(el).find('.home-skill-item-title'), {type: "chars,lines", charsClass: 'char'})

                    //     
                    // })
                    $('.home-skill-item').on('mouseenter', function(e) {
                        let idx = $(this).index()
                        $('.home-skill-thumb').find('.home-skill-thumb-item').eq(idx).addClass('active')
                    })
                    $('.home-skill-item').on('mouseleave', function(e) {
                        let idx = $(this).index()
                        $('.home-skill-thumb').find('.home-skill-thumb-item').eq(idx).removeClass('active')
                    })
                    $('.home-skill-thumb-item').each((idx, el) => {
                        let clone = $(el).find('img')
                        for (let i = 1; i <= 5; i++) {
                            let cloner = clone.clone()
                            cloner.addClass('cloner')
                            $(el).append(cloner)
                        }
                    })

                    function initMouseMove() {
                        const target = $('.home-skill-thumb')
                        if (target.hasClass('active')) {
                            let tarCurrX = xGetter(target.get(0))
                            let tarCurrY = yGetter(target.get(0))
                            let tarCurrRot = rotZGetter(target.get(0))

                            let tarX = -target.outerWidth()/4 + (pointerCurr().x - $('.home-skill-listing').get(0).getBoundingClientRect().left)/$('.home-skill-listing').outerWidth() * ($('.home-skill-listing').outerWidth() - $('.home-skill-item-desc').get(0).getBoundingClientRect().left - target.outerWidth()/2)
                            let tarY =  -target.outerHeight()/4 + (pointerCurr().y - $('.home-skill-listing').get(0).getBoundingClientRect().top)/$('.home-skill-listing').outerHeight() * ($('.home-skill-listing').outerHeight() - target.outerHeight()/2)

                            xSetter(target.get(0))(lerp(tarCurrX, tarX, .05))
                            ySetter(target.get(0))(lerp(tarCurrY, tarY, .05))
                            rotZSetter(target.get(0))(lerp(tarCurrRot, (Math.min(Math.max((tarX - tarCurrX)/40, -7), 7)), .1))
                        }
                        requestAnimationFrame(initMouseMove)
                    }
                    requestAnimationFrame(initMouseMove)
                }
            })
        }
        homeSkill()

        function homeProcess() {
            $('.home-process-step').each((idx, el) => {
                let clone = $(el).find('.img')
                
                for (let i = 1; i <= 5; i++) {
                    let cloner = clone.clone()
                    cloner.addClass('cloner')
                    $(el).find('.home-process-step-img').append(cloner)
                }

                let tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: el,
                        start: 'top top+=60%',
                        end: 'bottom top+=60%',
                        scrub: true,
                        // markers: true,
                    },
                })
                tl
                .from($(el).find('.home-process-step-background'), {
                    scale: 0,
                    borderRadius: '1rem',
                    ease: 'sine.out'
                }, 0)
                .from($(el).find('.home-process-step-img, .home-process-step-content'), {
                    opacity: 0,
                    ease: 'sine.in'
                }, "<=.2")
            })
        }
        homeProcess()

        function homePortfolio() {
            function scrollAnimationGrid() {
                const gridItems = $('.home-portfolio-project-item');
                gridItems.each((idx, item) => {
                    const yPercentRandomVal = gsap.utils.random(0,60);
                    let tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: item,
                            start: "top bottom",
                            end: "top top-=25%",
                            scrub: gsap.utils.random(.4,2),
                        }
                    })
                    requestAnimationFrame(() => {
                        tl
                        .set(item, {
                            transformOrigin: `50% 200%`
                        })
                        .fromTo(item, {
                            scale: 1,
                            yPercent: yPercentRandomVal,
                        },{
                            ease: 'none',
                            scale: 0.5,
                            yPercent: 0,
                            borderRadius: '50%'
                        })
                    })

                });
            }
            scrollAnimationGrid();
        }
        homePortfolio()

        function homeProject() {
            const line = document.createElement('div')
            $(line).addClass('line')
            $('.home-project-item:last-child').append(line)

            const projectBack = () => {
                const PROJECT = {
                    wrap: $('.home-project-item'),
                    target: $('.home-project-item-disco'),
                }

                const mouseAction = {
                    Enter: (ev, el) => {
                        const edge = findClosestEdge(ev, el.get(0));
                        const _target = el.find(PROJECT.target);

                        gsap.timeline({
                            duration: 0.4, ease: 'linear',
                        }).set(_target, {
                            y: edge === 'top' ? '-101%' : '101%',
                        },0)
                        .to(_target, {
                            y: 0, overwrite: true
                        },0)
                    },
                    Leave: (ev, el) => {
                        const edge = findClosestEdge(ev, el.get(0));
                        const _target = el.find(PROJECT.target);

                        gsap.timeline({
                            duration: 0.4, ease: 'linear'
                        }).to(_target, {
                            y: edge === 'top' ? '-101%' : '101%', overwrite: true
                        }, 0)
                    }
                }
                PROJECT.wrap.on("pointerenter", function(ev) {
                    let index = $(this).index();
                    mouseAction.Enter(ev, PROJECT.wrap.eq(index));
                });

                PROJECT.wrap.on("pointerleave", function(ev) {
                    let index = $(this).index();
                    mouseAction.Leave(ev, PROJECT.wrap.eq(index));
                });
            }
            // projectBack()

            $('.home-project-item').on('pointerleave', function(e) {
                $(".home-project-thumb").find(`[data-thumb-name]`).removeClass('active')
            })

            $('.home-project-item').on('pointerenter', function(e) {
                let nameSpace = $(this).find('[data-project-name]').attr('data-project-name')

                $(".home-project-thumb").find(`[data-thumb-name]`).removeClass('active')
                $(".home-project-thumb").find(`[data-thumb-name="${nameSpace}"]`).addClass('active')
            })


            const target = $('.home-project-thumb')
            ScrollTrigger.create({
                trigger: '.home-project',
                start: 'top bottom',
                end: 'bottom top',
                toggleClass: {targets: target, className: "active"},
            })

            function projectClipath(index) {
                let t = index / $('.home-project-wrap-bot .home-project-item').length * 100
                let b = (index + 1) / $('.home-project-wrap-bot .home-project-item').length * 100;
                gsap.set('.home-project-wrap-top', {clipPath: `polygon(0% ${t}%, 100% ${t}%, 100% ${b}%, 0% ${b}%)`});
            }

            const targetMove = $('.home-project-wrap-top')
            gsap.set(targetMove, {clipPath: `polygon(0 0, 100% 0, 100% 0, 0 0)`})

            $('.home-project-wrap-bot .home-project-item').on('pointerenter', function(e) {
                let index = $(this).index()
                projectClipath(index)
            })
            $('.home-project-wrap-bot .home-project-item').on('pointerleave', function(e) {
                if (!$('.home-project-wrap-bot:hover').length) {
                    if ($(this).is(':first-child')){
                        console.log('first');
                        let index = -1;
                        let t = index / $('.home-project-wrap-bot .home-project-item').length * 100
                        let b = (index + 1) / $('.home-project-wrap-bot .home-project-item').length * 100;
                        gsap.set('.home-project-wrap-top', {clipPath: `polygon(0% ${t}%, 100% ${t}%, 100% ${b}%, 0% ${b}%)`});
                    }
                    if ($(this).is(':last-child')){
                        console.log('last');
                        let index = $('.home-project-wrap-bot .home-project-item').length
                        let t = index / $('.home-project-wrap-bot .home-project-item').length * 100
                        let b = (index + 1) / $('.home-project-wrap-bot .home-project-item').length * 100;
                        gsap.set('.home-project-wrap-top', {clipPath: `polygon(0% ${t}%, 100% ${t}%, 100% ${b}%, 0% ${b}%)`});
                    }
                }
                
            })
            
            function initMouseMove() {
                let offsetL =  parseFloat(target.css('left'))
                let rotVl
                if (target.hasClass('active')) {
                    let tarCurrX = xGetter(target.get(0))
                    let tarCurrY = yGetter(target.get(0))
                    let tarCurrRot = rotZGetter(target.get(0))

                    let tarX = (pointerCurr().x/$('.home-project').outerWidth()) * ($('.home-project-item-view').get(0).getBoundingClientRect().left - offsetL - target.width())
                    let tarY = -target.height()/4 + (pointerCurr().y - $('.home-project').get(0).getBoundingClientRect().top)/$('.home-project').height() * ($('.home-project').height() - target.height()/2)

                    let rotValue = (pointerCurr().x - (target.width()/2 + offsetL + tarCurrX))/$('.home-project').outerWidth()

                    xSetter(target.get(0))(lerp(tarCurrX, tarX, .05))
                    ySetter(target.get(0))(lerp(tarCurrY, tarY, .05))

                    if (pointerCurr().x < (target.width()/2 + offsetL + tarCurrX)){rotVl = -1}
                    else {rotVl = 1}
                    // rotZSetter(target.get(0))(lerp(tarCurrRot, rotVl * rotValue * (Math.min(Math.max(((tarX + tarY) - (tarCurrX + tarCurrY))/5, -15), 15)), .06))
                }
                requestAnimationFrame(initMouseMove)
            }
            requestAnimationFrame(initMouseMove)
        }
        homeProject()

        function homeCurtain() {
            let amount = 11;
            let offset = $('.home-curtain').height() /  (amount - 1);
            // $('.home-curtain-inner').css('height', ' ' + offset  + 'px')

            const clone = $('.home-curtain-inner').eq(0)
            for (let i = 1; i < amount; i++) {
                let cloner = clone.clone()
                $('.home-curtain').append(cloner)
            }
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: '.home-curtain',
                    start: 'top bottom',
                    end: 'top top-=70%',
                    scrub: true,
                },
                defaults: {
                    ease: 'none'
                }
            })

            tl
            .to('.home-curtain-inner', {
                scaleY: 1,
                stagger: -.1,
                duration: 1,
                y:  -offset,
            }, 0)
        }
        homeCurtain()

        function homeIndustries() {
            const DOM = {
                radarScan: $('.home-explore-industries-radar-scan'),
                lineItem: $('.home-explore-industries-radar-wrapper-item-line'),
                dot: $('.home-explore-industries-radar-wrapper-item-line-dot-wrap')
            }
            gsap.set(DOM.radarScan, {rotate: -10})
            let lifeCycleTime = 8

            let tl = gsap.timeline({
                repeat: -1,
                defaults: {
                    ease: 'none'
                }
            })

            tl
            .fromTo(DOM.radarScan, {
                rotate: 0 - 10,
            }, {
                rotate: 270 - 10,
                duration: lifeCycleTime,
                ease: 'none',
            }, 0)
            DOM.lineItem.each((idx, el) => {
                tl
                .to($(el).find(DOM.dot), {
                    onStart: () => {
                        $(el).find(DOM.dot).addClass('active')
                    }
                }, `${ (0.1254480287 * lifeCycleTime) + (0.1111111111 * idx * lifeCycleTime)}`)
                .to($(el).find(DOM.dot), {
                    onStart: () => {
                        $(el).find(DOM.dot).removeClass('active')
                    }
                }, '<=2')
            })

            $('.home-explore-industries-radar-wrapper-item-line-dot-wrap').on('pointerenter', function(e) {
                $(this).addClass('on-hover')
            })
            $('.home-explore-industries-radar-wrapper-item-line-dot-wrap').on('pointerleave', function(e) {
                $(this).removeClass('on-hover')
            })
        }
        homeIndustries()

        function switchPlanPricing() {
            const DOM = {
                btnPlan: $('.home-pricing-plan-switch-wrap .home-pricing-plan-switch-btn'),
                btnOverlay: $('.home-pricing-plan-switch-overlay'),
                periodic: $('.home-pricing-plan-item-price-periodic'),
                price: $('.home-pricing-plan-item-price-txt')
            }
            function activePlan(index) {
                gsap.to(DOM.btnOverlay, {
                    x: index * DOM.btnOverlay.width()
                })
                let tl = gsap.timeline();
                tl
                    .to(DOM.btnOverlay.eq(1), { autoAlpha: .5 })
                    .to(DOM.btnOverlay.eq(0), { autoAlpha: 1 }, 0.2)
                    .to(DOM.btnOverlay.eq(1), { autoAlpha: 1 }, 0.5)
                    .to(DOM.btnOverlay.eq(0), { autoAlpha: 0 }, 0.5);

                DOM.price.each((i, item) => {
                    let text = $(item).find('h3');
                    text.removeClass('curr');
                    text.eq(index).addClass('curr');
                })

                DOM.periodic.each((i, item) => {
                    let text = $(item).find('p');
                    text.removeClass('curr');
                    text.eq(index).addClass('curr');
                })
            }

            DOM.btnPlan.on('click', function (e) {
                let index = $(this).index();
                e.preventDefault();
                console.log(index);
                activePlan(index);
            })
        }
        switchPlanPricing();

        function faqAccordion() {
            const parent = selector('.home-faq-content-listing');
            const DOM = {
                accordion: parent('.home-faq-content-item'),
                accordionTitle: parent('.home-faq-content-item-ques'),
                accordionContent: parent('.home-faq-content-item-answer')
            }
            parent(DOM.accordionContent).hide();
            function activeAccordion(index) {
                DOM.accordionContent.eq(index).slideToggle("slow");
                DOM.accordion.eq(index).toggleClass("active");

                DOM.accordionContent.not(DOM.accordionContent.eq(index)).slideUp("slow");
                DOM.accordion.not(DOM.accordion.eq(index)).removeClass("active");
            };

            DOM.accordionTitle.on("click", function () {
                let index = $(this).parent().index();
                activeAccordion(index);
            })
        }
        faqAccordion();

        
        function footer() {
            function bearMove() {
                new FloatingAnimation('.footer-curtain-logo img', 20, 10, 10, 10)

                function parallaxBear() {
                    let target = $('.footer-curtain-logo')
                    let tarCurrX = xGetter(target.get(0))
                    let tarCurrY = yGetter(target.get(0))
                    let moveX = (pointerCurr().x/$(window).width() - 0.5) * (target.width()/2)
                    let moveY = (pointerCurr().y/$(window).height() - 0.5) * (target.height()/2/4)
                    xSetter(target.get(0))(lerp(tarCurrX, moveX, .005))
                    ySetter(target.get(0))(lerp(tarCurrY, moveY, .005))

                    requestAnimationFrame(parallaxBear)    
                }
                requestAnimationFrame(parallaxBear)
            }
            bearMove()


            function curtainFooter() {
                gsap.to('.footer-curtain-inner', {
                    scrollTrigger: {
                        trigger: '.footer-curtain',
                        start: 'top bottom',
                        end: 'bottom top+=60%',
                        scrub: true,
                    },
                    scaleY: .0,
                    transformOrigin: 'bottom',
                    stagger: {
                        amount: .25
                    },
                    ease: 'power1.inOut'
                })
            }
            // curtainFooter()
        }
        footer()
    },
    beforeLeave() {
        console.log(`leave ${this.namespace}`);
    }
}
export default home;