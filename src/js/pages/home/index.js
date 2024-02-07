import { parseRem, selector } from "../../helper/index";
import { cvUnit, percentage, viewport, viewportBreak } from "../../helper/viewport";
import { lenis } from "../../global/lenis";
import { lerp, xSetter, ySetter, rotZSetter, xGetter, yGetter, rotZGetter, findClosestEdge, FloatingAnimation, pointerCurr } from "../../helper/index";
import { planListing } from '../../../../plan-data';

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
                    scrub: .3,
                }
            })
            tl.to(cont.find('.home-hero-bg img'), {y: '19rem', ease: 'none'})
        }
        heroParallax()

        /** (💡)  - BENEFIT */
        function homeBenefit() {
            function stackScroll() {
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
                let otherWrapDistance = viewportBreak({
                    desktop: BENEFIT.mainItem.width() + cvUnit(parseInt(BENEFIT.mainItem.css('padding-left'), 10), "rem") + cvUnit(15, 'rem'),
                    tablet: BENEFIT.mainItem.width() + cvUnit(parseInt(BENEFIT.mainItem.css('padding-left'), 10), "rem") + cvUnit(1, 'rem')
                });

                const ITEM_WIDTH = ($('.container').width() - percentage(25, $('.container').width())) / viewportBreak({ desktop: 5, tablet: 2.8 });
                gsap.set(BENEFIT.stage, { height: totalDistance * 1.2 + cvUnit(100, "rem") });

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
                        scrub: .6,
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
                        marginTop: -cvUnit(6, "rem"),
                        duration: 1
                    }, 0)
                    .to(BENEFIT.otherWrap, {
                        x: -otherWrapDistance,
                        duration: 1
                    }, 0)
                BENEFIT.otherItem.each((index, item) => {
                    let itemSelect = selector(item);
                    gsap.set(itemSelect('.home-benefit-item-overlay'), { scaleX: 0 });
                    let label = $(item).find('.home-benefit-other-title').text().toLowerCase().replace(' ', '-');
                    $(item).attr('data-label', `${label}`)

                    scrollerTl
                            .add(`label${index}`)
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
                                        paddingLeft: viewportBreak({ desktop: cvUnit(40, 'rem'), tablet: cvUnit(24, 'rem') }),
                                        duration: 1
                                    }, '<=0')
                            }
                        })
                })
                gsap.set('.home-showreel', { marginTop: -cvUnit(viewportBreak({ desktop: 60, tablet: 85 }), "vh") })
                scrollerTl
                    .to(BENEFIT.wrap, {
                        scale: viewportBreak({ desktop: 0.5, tablet: 0.8 }), autoAlpha: 0,
                        duration: 2,
                    }, '>=-.8')

                    .to(BENEFIT.wrap, {
                        yPercent: -8,
                        duration: 1
                    }, "<= .8")

            }
            function scrollToLabel() {
                $('.home-benefit-other-sub-btn').on('click', function(e) {
                    e.preventDefault();
                    let target = $(this).closest('.home-benefit-item.home-benefit-other').index();
                    toLabel(1, scrollerTl, `label${target}`)
                })
                function toLabel(duration, timeline, label) {
                    const yStart = $('.home-benefit').offset().top - $('.header').outerHeight()
                    const now = timeline.progress()
                    timeline.seek(label)
                    const goToProgress = timeline.progress()
                    timeline.progress(now)
                    lenis.scrollTo(yStart + ( timeline.scrollTrigger.end - timeline.scrollTrigger.start ) * goToProgress, {
                        duration: duration,
                        force: true
                    })
                }
            }
            if ($(window).width() > 767) {
                stackScroll();
                scrollToLabel();
            }
        }
        homeBenefit();

        /** (💡)  - SHOWREEL */
        function homeShowreel() {
            function galleryZoom() {
                const GALLERY = {
                    wrap: $('.home-showreel'),
                    item: ({ wrap, item }) => GALLERY.otherWrap.eq(wrap).find(GALLERY.otherInner).eq(item),
                    mainWrap: $('.home-showreel-main--inner'),
                    mainInner: $('.home-showreel-item-main'),
                    otherWrap: $('.home-showreel-other--inner'),
                    otherInner: $('.home-showreel-item-other'),
                    thumbPlay: $('.home-showreel-play')
                }

                let showreelTl = gsap.timeline({
                    defaults: { ease: 'none' },
                    scrollTrigger: {
                        trigger: GALLERY.wrap,
                        start: `top bottom`,
                        end: 'bottom bottom',
                        scrub: .6
                    }
                })

                const getOtherItem = ({ wrap, item }) => GALLERY.otherWrap.eq(wrap).find(GALLERY.otherInner).eq(item);
                viewportBreak({
                    tablet: () => {
                        gsap.set(GALLERY.mainWrap, { "padding": 0 })
                    }
                })
                showreelTl
                    .to('.home-showreel-item-overlay', { autoAlpha: 0, duration: .15 })
                    .from([getOtherItem({ wrap: 0, item: 2 }), getOtherItem({ wrap: 1, item: 2 })], { y: 80, duration: .2 }, "<=0")
                    .from([getOtherItem({ wrap: 0, item: 1 }), getOtherItem({ wrap: 1, item: 1 })], { y: 200, duration: .2 }, "<=0")
                    .from([getOtherItem({ wrap: 0, item: 0 }), getOtherItem({ wrap: 1, item: 0 })], { y: 320, duration: .2 }, "<=0")
                    .fromTo(GALLERY.mainWrap, { "clipPath": `inset(14% 37.35% 14% 37.35% round ${cvUnit(20, "rem")}px)`},{"clipPath": `inset(0% 0% 0% 0% round ${cvUnit(20, "rem")}px)`, duration: 1 }, ">=-0.1")
                    .to(GALLERY.otherInner.find(".img"), { scale: 1.6, duration: 1 }, "<=0")
                    .to(getOtherItem({ wrap: 0, item: 2 }), { xPercent:  -255, duration: 1 }, "<=0")
                    .to(getOtherItem({ wrap: 0, item: 1 }), { xPercent: -460, duration: 1 }, "<=0")
                    .to(getOtherItem({ wrap: 0, item: 0 }), { xPercent: -760, duration: 1 }, "<=0")
                    .to(getOtherItem({ wrap: 1, item: 2 }), { xPercent: 255, duration: 1 }, "<=0")
                    .to(getOtherItem({ wrap: 1, item: 1 }), { xPercent: 460, duration: 1 }, "<=0")
                    .to(getOtherItem({ wrap: 1, item: 0 }), { xPercent: 760, duration: 1 }, "<=0")
                    .from(GALLERY.thumbPlay, { autoAlpha: 0, y: 0, duration: .5 }, ">=-1")
                    .from('.home-showreel-play-ic', { scale: 0.8, duration: 1 }, "<=0")
                    .from('.home-showreel-play-ic svg', { scale: 1.4, duration: 1 }, "<=0")
                    .from('.home-showreel-play-first', {x: -cvUnit(200, 'rem'), duration: 1}, '<=0')
                    .from('.home-showreel-play-last', {x: cvUnit(200, 'rem'), duration: 1}, '<=0')
            }
            function playShowreel() {
                let DOM = {
                    stage: $('.home-benefit'),
                    vid_wrap: $('.home-showreel--wrap'),
                    link_vid: $('.home-showreel-thumb-link'),
                    thumbnail: $('.home-showreel-thumb img'),
                    play: $('.home-showreel-play'),
                    video: $('.home-showreel-thumb-link-vid')
                }
                DOM.link_vid.on('click', function(e) {
                    e.preventDefault();
                    console.log("click")
                    if ($(this).attr('data-video') == 'to-play') {
                        $(this).attr('data-video', 'to-pause')
                        /** -NOTE-
                         *      DOM.stage.outerHeight() + DOM.stage.get(0).offsetTop -> vị trí hiện tại ở cuối DOM tổng
                         *      + DOM.vid_wrap.height() -> vị trí hiện tại ở đầu vid_wrap
                         *      + cvUnit(viewportBreak({ desktop: 60, tablet: 85 }), "vh") -> thêm vào vì ở trên đã section Benefit đã âm margin-top */
                        let heightVidWrap = viewportBreak({ desktop: DOM.vid_wrap.height(), tablet: $('.home-showreel-main--inner').height() })
                        let scrollTarget = DOM.stage.outerHeight() + DOM.stage.get(0).offsetTop + heightVidWrap + cvUnit(viewportBreak({ desktop: 60, tablet: 85 }), "vh");
                        lenis.scrollTo(scrollTarget)

                        DOM.thumbnail.addClass('hidden');
                        DOM.video.removeClass('hidden');
                        DOM.play.addClass('hidden');
                        DOM.video.get(0).pause();
                        DOM.video.get(0).play();
                    } else {
                        $(this).attr('data-video', 'to-play')
                        // $('.home-hero-vid-thumbnail').removeClass('hidden')
                        // $('.home-hero-vid-video').addClass('hidden')
                        //$('.home-hero-vid-thumbnail').find('video').get(0).play()
                        DOM.play.removeClass('hidden');
                        DOM.video.get(0).pause();
                    }
                })
            }

            playShowreel();
            if ($(window).width() > 767) {
                galleryZoom()
            }
        }
        homeShowreel()

        /** (💡)  - SKILL */
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
                    $('.home-skill-thumb-item').each((idx, el) => {
                        let clone = $(el).find('img')
                        for (let i = 1; i <= 5; i++) {
                            let cloner = clone.clone()
                            cloner.addClass('cloner')
                            $(el).append(cloner)
                        }
                    })
                    if ($(window).width() > 991) {
                        $('.home-skill-item').on('mouseenter', function(e) {
                            let idx = $(this).index()
                            $('.home-skill-thumb').find('.home-skill-thumb-item').eq(idx).addClass('active')
                        })
                        $('.home-skill-item').on('mouseleave', function(e) {
                            let idx = $(this).index()
                            $('.home-skill-thumb').find('.home-skill-thumb-item').eq(idx).removeClass('active')
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
                    } else if ($(window).width() > 767) {
                        $('.home-skill-item').on('click', function(e) {
                            e.preventDefault()
                            if (!$(this).hasClass('active')) {
                                $('.home-skill-item').removeClass('active')
                                $(this).addClass('active')
                                $('.home-skill-thumb').find('.home-skill-thumb-item').removeClass('active')
                                let idx = $(this).index()
                                $('.home-skill-thumb').find('.home-skill-thumb-item').eq(idx).addClass('active')
                                gsap.to('.home-skill-thumb', {y: (cvUnit(40, 'rem') + ($('.home-skill-item').eq(0).outerHeight() - $('.home-skill-thumb').outerHeight())/2) + idx * $('.home-skill-item').eq(0).outerHeight(), duration: 1})
                            } else {
                                $('.home-skill-thumb').find('.home-skill-thumb-item').removeClass('active')
                                $('.home-skill-item').removeClass('active')
                            }
                        })
                    } else {
                        $('.home-skill-item').on('click', function(e) {
                            e.preventDefault()
                            if (!$(this).hasClass('active')) {
                                let idx = $(this).index()

                                $('.home-skill-item').removeClass('active')
                                $('.home-skill-item .home-skill-item-desc').slideUp(300, 'linear')
                                $(this).addClass('active')
                                $(this).find('.home-skill-item-desc').slideDown(300, 'linear')
                                gsap.to('.home-skill-item', {paddingTop: cvUnit( 60.5, 'rem'), paddingBottom: cvUnit( 60.5, 'rem'), duration: .3, ease: 'none'})
                                gsap.to(this, {paddingTop: cvUnit( 27.5, 'rem'), paddingBottom: cvUnit( 27.5, 'rem'), duration: .3, ease: 'none', overwrite: true})
                                gsap.to($(this).find('.home-skill-item-title'), {marginBottom: cvUnit(12, 'rem'), duration: .3, ease: 'none', overwrite: true})
                                $('.home-skill-thumb').find('.home-skill-thumb-item').removeClass('active')
                                $('.home-skill-thumb').find('.home-skill-thumb-item').eq(idx).addClass('active')
                                requestAnimationFrame(() => {
                                    gsap.to('.home-skill-thumb', {y: cvUnit(80, 'rem') - $('.home-skill-thumb').outerHeight()*3/4 + ($(this).outerHeight()) + (idx - 1) * $('.home-skill-item:not(.active)').outerHeight(), duration: 1})
                                })
                            } else {
                                $('.home-skill-item').removeClass('active')
                                $('.home-skill-item .home-skill-item-desc').slideUp(300, 'linear')
                                gsap.to('.home-skill-item', {paddingTop: cvUnit( 60.5, 'rem'), paddingBottom: cvUnit( 60.5, 'rem'), duration: .3, ease: 'none'})
                                gsap.to('.home-skill-item .home-skill-item-title', {marginBottom: 0, duration: .3, ease: 'none'})
                                $('.home-skill-thumb').find('.home-skill-thumb-item').removeClass('active')
                            }
                        })
                    }
                }
            })
        }
        homeSkill()

        /** (💡)  - PROCESS */
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
                        end: 'bottom top+=70%',
                        scrub: .3,
                    },
                })
                if (idx % 2 == 0) {
                    tl
                    .from($(el).find('.home-process-step-background'), {scale: 0, borderRadius: '8rem', ease: 'sine.out', duration: 4}, 0)
                    .from($(el).find('.home-process-step-img'), {autoAlpha: 0, scale: .8, yPercent: 20, ease: 'sine.inOut', duration: 1}, 2)
                    .from($(el).find('.home-process-step-label'), {autoAlpha: 0, ease: 'sine.in', duration: 1}, '<=.2')
                    .from($(el).find('.home-process-step-title'), {autoAlpha: 0, ease: 'sine.in', duration: 1}, '<=.4')
                    .from($(el).find('.home-process-step-desc'), {autoAlpha: 0, ease: 'sine.in', duration: 1}, '<=.4')
                } else {
                    tl
                    .from($(el).find('.home-process-step-background'), {scale: 0, borderRadius: '8rem', ease: 'sine.out', duration: 4}, 0)
                    .from($(el).find('.home-process-step-img'), {autoAlpha: 0, scale: .8, yPercent: 20, ease: 'sine.inOut', duration: 1}, 2)
                    .from($(el).find('.home-process-step-label'), {autoAlpha: 0, ease: 'sine.in', duration: 1}, '<=1.2')
                    .from($(el).find('.home-process-step-title'), {autoAlpha: 0, ease: 'sine.in', duration: 1}, '<=.2')
                    .from($(el).find('.home-process-step-desc'), {autoAlpha: 0, ease: 'sine.in', duration: 1}, '<=.2')
                }
            })
        }
        homeProcess()

        /** (💡)  - PORTFOLIO */
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

            function hoverProject() {
                const line = document.createElement('div')
                $(line).addClass('line')
                $('.home-project-item:last-child').append(line)

                const target = $('.home-project-thumb')
                ScrollTrigger.create({
                    trigger: '.home-project',
                    start: 'top bottom',
                    end: 'bottom top',
                    toggleClass: {targets: target, className: "active"},
                })

                function projectClippath(index) {
                    let t = index / $('.home-project-wrap-bot .home-project-item').length * 100
                    let b = (index + 1) / $('.home-project-wrap-bot .home-project-item').length * 100;
                    gsap.set('.home-project-wrap-top', {clipPath: `polygon(0% ${t}%, 100% ${t}%, 100% ${b}%, 0% ${b}%)`});
                }

                const targetMove = $('.home-project-wrap-top')
                gsap.set(targetMove, {clipPath: `polygon(0 0, 100% 0, 100% 0, 0 0)`})

                if ($(window).width() > 991) {
                    $('.home-project-item').on('pointerleave', function(e) {
                        $(".home-project-thumb").find(`[data-thumb-name]`).removeClass('active')
                    })

                    $('.home-project-item').on('pointerenter', function(e) {
                        let nameSpace = $(this).find('[data-project-name]').attr('data-project-name')

                        $(".home-project-thumb").find(`[data-thumb-name]`).removeClass('active')
                        $(".home-project-thumb").find(`[data-thumb-name="${nameSpace}"]`).addClass('active')
                    })

                    $('.home-project-wrap-bot .home-project-item').on('pointerenter', function(e) {
                        let index = $(this).index()
                        projectClippath(index)
                    })
                    $('.home-project-wrap-bot .home-project-item').on('pointerleave', function(e) {
                        if (!$('.home-project-wrap-bot:hover').length) {
                            if ($(this).is(':first-child')){
                                let index = -1;
                                let t = index / $('.home-project-wrap-bot .home-project-item').length * 100
                                let b = (index + 1) / $('.home-project-wrap-bot .home-project-item').length * 100;
                                gsap.set('.home-project-wrap-top', {clipPath: `polygon(0% ${t}%, 100% ${t}%, 100% ${b}%, 0% ${b}%)`});
                            }
                            if ($(this).is(':last-child')){
                                let index = $('.home-project-wrap-bot .home-project-item').length
                                let t = index / $('.home-project-wrap-bot .home-project-item').length * 100
                                let b = (index + 1) / $('.home-project-wrap-bot .home-project-item').length * 100;
                                gsap.set('.home-project-wrap-top', {clipPath: `polygon(0% ${t}%, 100% ${t}%, 100% ${b}%, 0% ${b}%)`});
                            }
                        }

                    })
                    requestAnimationFrame(initMouseMove)
                } else {
                    $('.home-project-wrap-bot .home-project-item').on('click', function(e) {
                        let nameSpace = $(this).find('[data-project-name]').attr('data-project-name')

                        $(".home-project-thumb").find(`[data-thumb-name]`).removeClass('active')
                        $(".home-project-thumb").find(`[data-thumb-name="${nameSpace}"]`).addClass('active')

                        let index = $(this).index()
                        projectClippath(index)
                        initClickThumb(index)
                    })
                }

                function initMouseMove() {
                    let offsetL =  parseFloat(target.css('left'))
                    if (target.hasClass('active')) {
                        let tarCurrX = xGetter(target.get(0))
                        let tarCurrY = yGetter(target.get(0))
                        let tarCurrRot = rotZGetter(target.get(0))

                        let tarX = (pointerCurr().x/$('.home-project').outerWidth()) * ($('.home-project-item-view').get(0).getBoundingClientRect().left - offsetL - target.width())
                        let tarY = -target.height()/4 + (pointerCurr().y - $('.home-project').get(0).getBoundingClientRect().top)/$('.home-project').height() * ($('.home-project').height() - target.height()/2)

                        xSetter(target.get(0))(lerp(tarCurrX, tarX, .05))
                        ySetter(target.get(0))(lerp(tarCurrY, tarY, .05))
                        rotZSetter(target.get(0))(lerp(tarCurrRot, Math.min(Math.max((tarX - tarCurrX)/20, -7), 7), .08))
                    }
                    requestAnimationFrame(initMouseMove)
                }

                function initClickThumb(idx) {
                    gsap.to(target, {y: (cvUnit(80, 'rem') + ($('.home-project-item').eq(0).outerHeight() - target.outerHeight())/2) + idx * $('.home-project-item').eq(0).outerHeight()})
                }
            }
            hoverProject();

            function projectCurtain() {
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
                        scrub: true
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
            projectCurtain()
        }
        homePortfolio()

        /** (💡)  - INDUSTRIES */
        function homeIndustries() {
            if ($(window).width() > 991) {
                function parallaxLogo() {
                    let target = $('.home-explore-img img')
                    let tarCurrX = xGetter(target.get(0))
                    let tarCurrY = yGetter(target.get(0))
                    let moveX = (pointerCurr().x/$(window).width() - 0.5) * 2 * (target.width()/4)
                    let moveY = (pointerCurr().y/$(window).height() - 0.5) * 2 * (target.height()/8)
                    xSetter(target.get(0))(lerp(tarCurrX, moveX, .01))
                    ySetter(target.get(0))(lerp(tarCurrY, moveY, .01))

                    requestAnimationFrame(parallaxLogo)
                }
                requestAnimationFrame(parallaxLogo)
            } else {
                gsap.fromTo('.home-explore-img img', {
                    yPercent: viewportBreak({ tablet: 20, mobile: 40 })
                }, {
                    scrollTrigger: {
                        trigger: '.home-explore-heading',
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: .2
                    },
                    yPercent: -50,
                    ease: 'none'
                })
            }


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

        /** (💡)  - TESTIMONIAL */
        function homeTesti() {
            if ($(window).width() > 767) {
                $('.home-testi').css('height', + $(window).height() + ($('.home-testi-content-item').eq(0).height() * 1.5 * $('.home-testi-content-item').length) + 'px')
                let tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: '.home-testi',
                        start: `top top`,
                        end: 'bottom bottom',
                        scrub: true,
                        // markers: true,
                        onUpdate: (timeline) => {
                            gsap.set('.home-testi-content-progress-inner', {y: timeline.progress * parseRem(160)})
                        }
                    }
                })
                tl
                .fromTo('.home-testi-text-wrap', {
                    y: cvUnit(-100, 'rem'),
                }, {
                    y: cvUnit(-90, 'rem'),
                    ease: 'none'
                })

                let tlScrub = gsap.timeline({
                    scrollTrigger: {
                        trigger: '.home-testi',
                        start: `top+=0% bottom`,
                        end: 'bottom top',
                        scrub: .2,
                    }
                })

                let timeDelay = 1
                let timeAnim = 1
                let zUnit
                let yUnit
                if ($(window).width() > 991) {
                    zUnit = 600
                    yUnit = 90
                } else {
                    zUnit = 1200
                    yUnit = 100
                }
                $('.home-testi-content-item').each((idx, el) => {
                    if (idx == 0) {
                        tlScrub
                        .fromTo($(el), {z: cvUnit(zUnit * 2, 'rem'), yPercent: 75, filter:"brightness(1)"}, {z: 0, yPercent: 0, filter:"brightness(1)", ease: 'power1.out', duration: timeAnim}, 0)
                    }
                    if (idx > 0 && idx < ($('.home-testi-content-item').length)) {
                        tlScrub
                        .fromTo($(el), {z: cvUnit(zUnit, 'rem'), yPercent: 150, filter:"brightness(1)"}, {z: 0, yPercent: 0, filter:"brightness(1)", ease: 'power3.out', duration: timeAnim}, `0 + ${timeAnim + timeDelay + idx * (timeAnim + timeDelay)}`)
                        .fromTo($(el).prev(), {z: 0, y: 0, filter:"brightness(1)"}, {z: cvUnit(-zUnit, 'rem'), y: cvUnit(-yUnit, 'rem'), filter:"brightness(.67)", ease: 'power2.out', duration: timeAnim}, "<=0")
                        if (idx > 1) {
                            tlScrub
                            .fromTo($(el).prev().prev(), {z: cvUnit(-zUnit, 'rem'), y: cvUnit(-yUnit, 'rem'), filter:"brightness(.67)"}, {z: cvUnit(-zUnit * 2, 'rem'), y: cvUnit(-yUnit * 2, 'rem'), filter:"brightness(.33)", ease: 'power2.out', duration: timeAnim}, "<=0")
                        }
                        if (idx > 2) {
                            tlScrub
                            .fromTo($(el).prev().prev().prev(), {z: cvUnit(-zUnit * 2, 'rem'), y: cvUnit(-yUnit * 2, 'rem'), filter:"brightness(.33)"}, {z: cvUnit(-zUnit * 3, 'rem'), y: cvUnit(-yUnit * 3, 'rem'), filter:"brightness(0)", ease: 'power2.out', duration: timeAnim}, "<=0")
                        }
                    }
                    if (idx == ($('.home-testi-content-item').length -1)) {
                        tlScrub
                        .fromTo($(el), {z: 0, y: 0, filter:"brightness(1)"}, {z: cvUnit(-zUnit, 'rem'), y: cvUnit(-yUnit, 'rem'), filter:"brightness(.67)", ease: 'power3.out', duration: timeAnim}, `>=${timeAnim * .1}`)
                        .fromTo($(el).prev(), {z: cvUnit(-zUnit, 'rem'), y: cvUnit(-yUnit, 'rem'), filter:"brightness(.67)"}, {z: cvUnit(-zUnit * 2, 'rem'), y: cvUnit(-yUnit * 2, 'rem'), filter:"brightness(.33)", ease: 'power3.out', duration: timeAnim}, "<=0")
                        .fromTo($(el).prev().prev(), {z: cvUnit(-zUnit * 2, 'rem'), y: cvUnit(-yUnit * 2, 'rem'), filter:"brightness(.33)"}, {z: cvUnit(-zUnit * 3, 'rem'), y: cvUnit(-yUnit * 3, 'rem'), filter:"brightness(0)", ease: 'power3.out', duration: timeAnim}, "<=0")
                    }
                })
                gsap.set('.home-testi-content-item', {z: 0, y: 0, filter:"brightness(1)"})
            } else {
                let parent = $('.home-testi-content')
                parent.find('[data-swiper="swiper"]').addClass('swiper')
                parent.find('[data-swiper="swiper-wrapper"]').addClass('swiper-wrapper')
                parent.find('[data-swiper="swiper-slide"]').addClass('swiper-slide')

                new Swiper('.home-testi-content-wrap', {
                    spaceBetween: cvUnit(20, 'rem'),
                    slidesPerView: 1,
                    scrollbar: {
                        el: ".home-testi-content-progress",
                    },
                })
            }
        }
        homeTesti()

        /** (💡)  - PRICING */
        function homePricing() {
            function switchPlan() {
                const DOM = {
                    btnPlan: $('.home-pricing-plan-switch-wrap .home-pricing-plan-switch-btn'),
                    btnOverlay: $('.home-pricing-plan-switch-overlay'),
                    periodic: $('.home-pricing-plan-item-price-periodic'),
                    price: $('.home-pricing-plan-item-price-txt'),
                    btnPurchase: $('.home-pricing-plan-item-btn.btn-purchase')
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
                        text.removeClass('active');
                        text.eq(index).addClass('active');
                    })

                    DOM.periodic.each((i, item) => {
                        let text = $(item).find('p');
                        text.removeClass('active');
                        text.eq(index).addClass('active');
                    })

                    let currPlan = DOM.btnPlan.eq(index).text();
                    DOM.btnPurchase.each((i, item) => {
                        if ($(item).attr('data-purchase-method') === 'trial') {
                            $(item).attr('data-purchase-id', 0);
                        }
                        else if ($(item).attr('data-purchase-method') === 'subscription') {
                            let currLabel = $(item).siblings('.home-pricing-plan-item-label').text();
                            let planItemName = `${currLabel} ${currPlan}`
                            planListing.forEach((_, idx) => {
                                if (planListing.get(idx).name.toLowerCase() === planItemName.toLowerCase()) {
                                    $(item).attr('data-purchase-id', idx);
                                }
                            })
                        }
                        else return;
                    })
                }

                activePlan(0);
                DOM.btnPlan.on('click', function (e) {
                    let index = $(this).index();
                    e.preventDefault();
                    activePlan(index);
                })
            }
            switchPlan();

            function testPayment() {
                $('.btn-purchase').on('click', function(e) {
                    e.preventDefault()
                    console.log('clicked')
                    let planId = $(this).attr('data-button-id')
                    fetch('http://localhost:4000/create-checkout-session', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            items: [
                                {id: 1}
                            ]
                        })
                    }).then(res => {
                        if (res.ok) return res.json()
                        return res.json().then(json => Promise.reject(json))
                    }).then(({ url }) => {
                        console.log(url)
                        window.location = url
                    }).catch(e => {
                        console.error(e.message)
                    })
                })
            }
            testPayment()
        }
        homePricing();

        /** (💡)  - FAQ */
        function homeFaq() {
            function accordion() {
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
            accordion();
        }
        homeFaq();
    },
    beforeLeave() {
        console.log(`leave ${this.namespace}`);
    }
}
export default home;