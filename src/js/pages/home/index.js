import { parseRem, selector } from "../../helper/index";
import { cvUnit, percentage } from "../../helper/viewport";
import { lenis } from "../../common/lenis";
import { lerp, xSetter, ySetter, rotZSetter, xGetter, yGetter, rotZGetter, findClosestEdge, FloatingAnimation, pointerCurr } from "../../helper";

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
                htmlLabel.html(`${$(el).attr('data-section-id')}`).attr('data-header-id',`${$(el).attr('data-section-id')}`)
                $('.header-menu-label').append(htmlLabel)

                let htmlProg = tempProg.clone();
                htmlProg.find('.header-menu-prog-item-link').attr('href', `#${$(el).attr('data-section-id')}`)
                htmlProg.attr('data-header-id',`${$(el).attr('data-section-id')}`)
                $('.header-menu-prog').append(htmlProg)
            })
        }
        function headerScroll() {
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
        headerScroll()
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
                    scrub: .3,
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
                    marginTop: "-6rem",
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
                                    paddingLeft: parseRem(40),
                                    duration: 1
                                }, '<=0')
                        }
                    })
            })
            scrollerTl
                .to(BENEFIT.wrap, {
                    scale: 0.5, autoAlpha: 0,
                    duration: 2,
                }, '>=-.8')

                .to(BENEFIT.wrap, {
                    yPercent: -8,
                    duration: 1
                }, "<= .8")

            $('.home-benefit-other-sub-btn').on('click', function(e) {
                e.preventDefault();
                let target = $(this).closest('.home-benefit-item.home-benefit-other').index();
                scrollToLabel(1, scrollerTl, `label${target}`)
            })

            gsap.set('.home-showreel', { marginTop: -cvUnit(60, "vh") })

            function scrollToLabel(duration, timeline, label) {
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
        benefitStackScroll();

        function showreelGalleryZoom() {
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
            showreelTl
                .to('.home-showreel-item-overlay', { autoAlpha: 0, duration: .15 })
                .from([getOtherItem({ wrap: 0, item: 2 }), getOtherItem({ wrap: 1, item: 2 })], { y: 80, duration: .2 }, "<=0")
                .from([getOtherItem({ wrap: 0, item: 1 }), getOtherItem({ wrap: 1, item: 1 })], { y: 200, duration: .2 }, "<=0")
                .from([getOtherItem({ wrap: 0, item: 0 }), getOtherItem({ wrap: 1, item: 0 })], { y: 320, duration: .2 }, "<=0")
                .fromTo(GALLERY.mainWrap, { "clipPath": `inset(14% 37.35% 14% 37.35% round ${cvUnit(20, "rem")}px)`},{"clipPath": `inset(0% 0% 0% 0% round ${cvUnit(20, "rem")}px)`, duration: 1 }, ">=-0.1")
                .to(GALLERY.otherInner.find(".img"), { scale: 1.6, duration: 1 }, "<=0")
                .to(getOtherItem({ wrap: 0, item: 2 }), { xPercent: -255, duration: 1 }, "<=0")
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

        function homeTesti() {
            $('.home-testi').css('height', + $(window).height() + ($('.home-testi-content-item').eq(0).height() * 1.5 * $('.home-testi-content-item').length) + 'px')

            ScrollTrigger.create({
                trigger: '.home-testi',
                    start: `top top`,
                    end: 'bottom bottom',
                    scrub: true,
                    onUpdate: (timeline) => {
                        gsap.set('.home-testi-content-progress-inner', {y: timeline.progress * parseRem(160)})
                    }
            })



            let tlScrub = gsap.timeline({
                scrollTrigger: {
                    trigger: '.home-testi',
                    start: `top+=0% top`,
                    end: 'bottom bottom',
                    scrub: .2,
                }
            })

            // tlScrub
            // .fromTo($('.home-testi-content-item').eq(0), {
            //     scale: .95,
            //     y: '-3rem',
            //     autoAlpha: .9
            // },{
            //     scale: 1,
            //     y: '0rem',
            //     autoAlpha: 1,
            //     duration: .2
            // }, 0)
            // .fromTo($('.home-testi-content-item').eq(1), {
            //     scale: .8,
            //     y: '-10rem',
            //     autoAlpha: .0
            // },{
            //     scale: .95,
            //     y: '-3rem',
            //     autoAlpha: .8,
            //     duration: .2
            // }, "<=0")
            // .fromTo($('.home-testi-content-item-fg').eq(0), {
            //     autoAlpha: 1,
            //     backgroundPosition: '0% 0%',
            // },{
            //     backgroundPosition: '0% 100%',
            //     autoAlpha: 0,
            //     // ease: 'expo.inOut',
            //     duration: .2
            // }, "<=0")


            let timeDelay = .5
            let timeAnim = 1
            let translateY = cvUnit(30, "rem")
            let offsettranslateY = 1.5

            $('.home-testi-content-item').each((idx, el) => {
                if (idx == 0) {
                    tlScrub
                    .to($(el), {scale: 1.1, y: translateY, ease: 'power2.out', duration: timeAnim}, `0 + ${idx * (timeAnim + timeDelay)}`)
                    .to($(el), {autoAlpha: 0, ease: 'power2.in', duration: timeAnim/2}, "<=0")
                    .fromTo($(el).next(), {scale: .95, y: -translateY, autoAlpha: .8}, {scale: 1, y: 0, autoAlpha: 1, duration: 1}, "<=0")
                    .fromTo($(el).next().next(), { scale: .8, y: -offsettranslateY * translateY, autoAlpha: 0}, {scale: .95, y: -translateY, autoAlpha: .8, duration: 1}, "<=0")
                }
                if (0 < idx && idx < ($('.home-testi-content-item').length - 2)) {
                    tlScrub
                    .to($(el), {scale: 1.1, y: translateY, ease: 'power2.out', duration: timeAnim}, `0 + ${idx * (timeAnim + timeDelay)}`)
                    .to($(el), {autoAlpha: 0, ease: 'power2.in', duration: timeAnim/2}, "<=0")
                    .fromTo($(el).next(), {scale: .95, y: -translateY, autoAlpha: .8}, {scale: 1,y: 0, autoAlpha: 1, duration: 1}, "<=0")
                    .fromTo($(el).next().next(), {scale: .8, y: -offsettranslateY * translateY, autoAlpha: 0}, {scale: .95, y: -translateY, autoAlpha: .8, duration: 1}, "<=0")
                }
                if (idx == ($('.home-testi-content-item').length - 2)) {
                    tlScrub
                    .to($(el), {scale: 1.1, y: translateY, ease: 'power2.out', duration: timeAnim}, `0 + ${idx * (timeAnim + timeDelay)}`)
                    .to($(el), {autoAlpha: 0, ease: 'power2.in', duration: timeAnim/2,}, "<=0")
                    .fromTo($(el).next(), { scale: .95, y: -translateY, autoAlpha: .8}, {scale: 1, y: 0, autoAlpha: 1, duration: 1}, "<=0")
                }
            })
        }
        homeTesti()

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
                // new FloatingAnimation('.footer-curtain-logo img', 20, 10, 10, 10)
                function parallaxBear() {
                    let target = $('.footer-curtain-logo')
                    let tarCurrX = xGetter(target.get(0))
                    let tarCurrY = yGetter(target.get(0))
                    let moveX = (pointerCurr().x/$(window).width() - 0.5) * 2 * (target.width()/2)
                    let moveY = (pointerCurr().y/$(window).height() - 0.5) * 2 * (target.height()/8)
                    xSetter(target.get(0))(lerp(tarCurrX, moveX, .01))
                    ySetter(target.get(0))(lerp(tarCurrY, moveY, .01))

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