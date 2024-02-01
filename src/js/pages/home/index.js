import { parseRem, selector } from "../../helper/index";
import { cvUnit, percentage } from "../../helper/viewport";
import { lerp, xSetter, ySetter, rotZSetter, xGetter, yGetter, rotZGetter, typeOpts, findClosestEdge, closestEdge, distMetric, pointerCurr } from "../../helper";
import Flip from '../../vendors/Flip';
import { lenis } from "../../common/lenis";

const home = {
    namespace: "home",
    afterEnter(data) {
        console.log(`enter ${this.namespace}`);
        let cont = $('body');

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
                stage: $('.home-benefit'),
                wrap: $('.home-benefit--wrap'),
                list: $('.home-benefit-list'),
                item: $('.home-benefit-item'),
                mainItem: $('.home-benefit-main'),
                otherItem: $('.home-benefit-other'),
                otherWrap: $('.home-benefit-other-wrap')
            }

            let mainItemSelect = selector(BENEFIT.mainItem);
            let totalDistance = BENEFIT.mainItem.width() + (BENEFIT.otherItem.width() * BENEFIT.otherItem.length);
            let otherWrapDistance = BENEFIT.mainItem.width() + cvUnit(parseInt(BENEFIT.mainItem.css('padding-left'), 10), "rem");
            const ITEM_WIDTH = ($('.container').width() - percentage(25, $('.container').width())) / 5;

            gsap.set(BENEFIT.stage, { height: totalDistance  });

            // BENEFIT.otherItem.each((_, item) => {
            //     let benefit = $(item).find('.home-benefit-other-title').text().toLowerCase().replace(' ', '-');
            //     $(item).attr('href', `#benefit-${benefit}`)
            // })

            let reqCheck;
            function checkHiddenImg() {
                BENEFIT.otherItem.each((idx, item) => {
                    if (idx + 1 < BENEFIT.otherItem.length) {
                        let rectCurrent = BENEFIT.otherItem.eq(idx).get(0).getBoundingClientRect();
                        let rectNext = BENEFIT.otherItem.eq(idx + 1).get(0).getBoundingClientRect();
                        let distanceItem = Math.abs(rectCurrent.left - rectNext.left);
                        let img = $(item).find('.home-benefit-other-img');
                        if (distanceItem <= ITEM_WIDTH) {
                            img.addClass('hidden');
                        }
                        else {
                            img.removeClass('hidden');
                        }
                    }
                })
                reqCheck = window.requestAnimationFrame(checkHiddenImg);
            }

            let scrollerTl = gsap.timeline({
                defaults: { ease: 'none' },
                scrollTrigger: {
                    trigger: BENEFIT.stage,
                    start: `top-=${$('header').outerHeight()} top`,
                    end: 'bottom bottom',
                    scrub: true,
                    onEnter: () => checkHiddenImg(),
                    onEnterBack: () => checkHiddenImg(),
                    onLeaveBack: () => window.cancelAnimationFrame(reqCheck),
                    onLeave: () => window.cancelAnimationFrame(reqCheck)
                }
            })
            scrollerTl
                .to(mainItemSelect('h2'), {
                    scale: 0.56, transformOrigin: "top left", ease: "linear",
                    duration: 1
                }, 0)
                .to(mainItemSelect('p'), {
                    marginTop: "-6rem",
                    duration: 1
                }, 0)
                .to(BENEFIT.otherWrap, {
                    x: -otherWrapDistance,
                    duration: 1
                }, 0)

            BENEFIT.otherItem.each((index, item) => {
                let itemSelect = selector(item);
                gsap.set(itemSelect('span'), { scaleX: 0 });
                let label = $(item).find('.home-benefit-other-title').text().toLowerCase().replace(' ', '-');
                $(item).attr('data-label', `${label}`)

                scrollerTl
                        .to(item, {
                            duration: 1
                        })
                        .to(itemSelect('h3'), {
                            scale: .75, transformOrigin: "top left", duration: 1
                        }, '<=0')
                        .to(itemSelect('.home-benefit-item-overlay'), {
                            scaleX: 1, transformOrigin: "right", duration: 1
                        }, '<=0')
                        .to(itemSelect('p'), {
                            autoAlpha: 0, duration: 1
                        }, '<=0.2')

                    BENEFIT.otherItem.each((idx, el) => {
                        if (idx > index) {
                            scrollerTl
                                .to(el, {
                                    x: -(ITEM_WIDTH * ( 1 + index )),
                                    paddingLeft: parseRem(40),
                                    duration: 1,
                                }, '<=0')
                        }
                    })
            })

            // scrollerTl.to('.home-benefit--wrap', {
            //     scale: 0.8, duration: 1
            // }, 6)

            let scaleTl = gsap.timeline({
                defaults: { ease: 'none' },
                scrollTrigger: {
                    trigger: BENEFIT.stage,
                    // start: `top-=${$('header').outerHeight()} top`,
                    end: 'bottom bottom-=10',
                    scrub: true
                }
            })

            scaleTl
                .set('.home-showreel', { marginTop: -cvUnit(80, "vh") })
                .to(BENEFIT.wrap, {
                    scale: 0.5, autoAlpha: 0,
                    duration: 2,
                }, 12)
                .to(BENEFIT.wrap, {
                    yPercent: -8,
                    duration: 1
                }, "<= .8")

            let benefitTl = gsap.timeline();
            benefitTl.add(scrollerTl).add(scaleTl);

            // BENEFIT.otherItem.on('click', function (e) {
            //     // let label = $(this).attr('data-label');
            //     scrollerTl.seek("50%");
            // })
        }
        benefitStackScroll();

        function showreelGalleryZoom() {
            const GALLERY = {
                wrap: $('.home-showreel'),
                item: $('.home-showreel-item'),
                mainWrap: $('.home-showreel-main--inner'),
                mainInner: $('.home-showreel-item-main'),
                otherWrap: $('.home-showreel-other--inner'),
                otherInner: $('.home-showreel-item-other'),
                thumbPlay: $('.home-showreel-play')
            }

            let tl = gsap.timeline({
                defaults: { ease: 'none' },
                scrollTrigger: {
                    trigger: GALLERY.wrap,
                    start: `top top+=30%`,
                    end: 'bottom bottom',
                    scrub: true
                }
            })

            tl
                .from(GALLERY.mainWrap, {
                    scaleX: .25, scaleY: .7,
                    duration: 1
                }, "<=0")
                .from(GALLERY.mainInner, {
                    scaleX: 4, scaleY: 1.428,
                    duration: 1
                }, "<=0")
                .from(GALLERY.mainInner.find('.img'), {
                    scaleY: 1.5,
                    duration: 1
                }, "<=0")
                .to(GALLERY.otherInner, {
                    scale: 1.2,
                    '-webkit-filter': 'blur(' + 2.5 + 'px' + ')',
                    'filter': 'blur(' + 2.5 + 'px' + ')'
                }, "<=0")
                .to(GALLERY.otherInner.find(".img"), {
                    scale: 1.6,
                    duration: 1
                }, "<=0")
                .to(GALLERY.otherWrap.eq(0).find(GALLERY.otherInner).eq(2), {
                    xPercent: -250,
                    duration: 1,
                }, "<=0")
                .to(GALLERY.otherWrap.eq(0).find(GALLERY.otherInner).eq(1), {
                    xPercent: -460,
                    duration: 1,
                }, "<=0")
                .to(GALLERY.otherWrap.eq(0).find(GALLERY.otherInner).eq(0), {
                    xPercent: -760,
                    duration: 1,
                }, "<=0")
                .to(GALLERY.otherWrap.eq(1).find(GALLERY.otherInner).eq(2), {
                    xPercent: 250,
                    duration: 1,
                }, "<=0")
                .to(GALLERY.otherWrap.eq(1).find(GALLERY.otherInner).eq(1), {
                    xPercent: 460,
                    duration: 1,
                }, "<=0")
                .to(GALLERY.otherWrap.eq(1).find(GALLERY.otherInner).eq(0), {
                    xPercent: 760,
                    duration: 1,
                }, "<=0")
                .from(GALLERY.thumbPlay, {
                    autoAlpha: 0, y: 30,
                    duration: .5
                })
        }
        showreelGalleryZoom()

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
                    $('.home-skill-item').each((idx, el) => {
                        const splitText = new SplitText($(el).find('.home-skill-item-title'), {type: "chars,lines", charsClass: 'char'})

                        $(el).on('mouseenter', function(e) {
                            gsap.to(splitText.chars, {x: 50, duration: .4, stagger: .012, overwrite: true,})
                            $('.home-skill-thumb').find('.home-skill-thumb-item').eq(idx).addClass('active')
                        })
                        $(el).on('mouseleave', function(e) {
                            gsap.to(splitText.chars, {x: 0, duration: .2, overwrite: true})
                            $('.home-skill-thumb').find('.home-skill-thumb-item').removeClass('active')
                        })
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

        function homePortfolio() {
            function scrollAnimationGrid() {
                const gridItems = $('.home-portfolio-project-item');
                gridItems.each((idx, item) => {
                    const yPercentRandomVal = gsap.utils.random(0,60);
                    let tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: item,
                            start: "top 100%",
                            end: "top 0%",
                            scrub: true,
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
            console.log('Init HomeProject');

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
                    rotZSetter(target.get(0))(lerp(tarCurrRot, rotVl * rotValue * (Math.min(Math.max(((tarX + tarY) - (tarCurrX + tarCurrY))/5, -15), 15)), .06))
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
                repeat: -1,
            }, 0)
            DOM.lineItem.each((idx, el) => {
                tl
                .fromTo($(el).find(DOM.dot), {
                    opacity: 0
                }, {
                    opacity: 1,
                    duration: .5,
                }, `${ (0.1254480287 * lifeCycleTime) + (0.1111111111 * idx * lifeCycleTime)}`)
                .to($(el).find(DOM.dot), {
                    opacity: 0,
                    duration: .5,
                }, '<=1.5')
            })


            // tl
            // .fromTo('.home-industries-wrap-radar-scan', {
            //     rotate:0,
            // }, {
            //     rotate: 180,
            //     duration: 4,
            //     ease: 'none',
            // })
            // .to('.home-industries-wrap-radar-scan', {
            //     rotate: 360,
            //     duration: 2,
            //     ease: 'none',
            // })
            // .fromTo('.home-industries-wrap-radar-wrapper-item-line .home-industries-wrap-radar-wrapper-item-line-dot-wrap', {
            //     autoAlpha: 0
            // }, {
            //     stagger: 4 / 9,
            //     autoAlpha: 1,
            //     duration: 4 / 9
            // }, 0)
            // .to('.home-industries-wrap-radar-wrapper-item-line .home-industries-wrap-radar-wrapper-item-line-dot-wrap', {
            //     stagger: 4 / 9,
            //     autoAlpha: 0,
            //     duration: 4 / 9
            // }, 4/9)
            // .to('.home-industries-wrap-radar-wrapper-item-line .home-industries-wrap-radar-wrapper-item-line-dot-wrap', {
            //     duration: 2
            // }, `>=2`)

            // tl
            // .to('radar-scan', {duration: 4})
            // .fromTo('.radar-item-group', {autoAplha: 0},{autoAplha: 1, stagger: 4/4, duration:4/4}, 0)


            // let waves = $('.home-industries-wrap-radar-wrapper-inner-wave')
            // clonseCounts = 10;
            // const clone = waves.clone()

            // for (let i = 1; i < clonseCounts; i++) {
            //     let cloner = clone
            //     waves.closest('.home-industries-wrap-radar-wrapper-inner').append(cloner)
            // }
            // const dur = 3,
            //     ease= 'none',
            //     delayValue = 2

            // waves.each((idx, el) => {
            //     gsap.fromTo(el, {scale: 0}, {scale: 1.5, duration: waves.length * delayValue, delay: (idx) * delayValue, repeat: -1, ease: ease})
            // })
            /* Dot Anim */
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
    },
    beforeLeave() {
        console.log(`leave ${this.namespace}`);
    }
}
export default home;