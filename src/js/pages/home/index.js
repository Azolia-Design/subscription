import { parseRem, selector } from "../../helper/index";
import { lerp, xSetter, ySetter, rotZSetter, xGetter, yGetter, rotZGetter, typeOpts, findClosestEdge, closestEdge, distMetric, pointerCurr } from "../../helper";
import Flip from '../../vendors/Flip';

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
                list: $('.home-benefit-list'),
                item: $('.home-benefit-item')
            }
            let settings = {
                flip: {
                    absoluteOnLeave: false,
                    absolute: false,
                    scale: true,
                    simple: true
                },
                scrollTrigger: {
                    start: 'center center',
                    end: '+=300%',
                },
                stagger: 0
            }

            settings = Object.assign({}, settings);

            BENEFIT.list.addClass('benefit--switch');
            let finalState = Flip.getState(BENEFIT.item);
            BENEFIT.list.removeClass('end-state');
            const tl = Flip.to(finalState, {
                ease: 'none',
                absoluteOnLeave: settings.flip.absoluteOnLeave,
                absolute: settings.flip.absolute,
                scale: settings.flip.scale,
                simple: settings.flip.simple,
                scrollTrigger: {
                    trigger: BENEFIT.list,
                    start: settings.scrollTrigger.start,
                    end: settings.scrollTrigger.end,
                    pin: BENEFIT.list.parent(),
                    scrub: true,
                },
                stagger: settings.stagger
            })
        }
        //benefitStackScroll();

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
                gsap.to('.home-project-wrap-top', {clipPath: `polygon(0% ${t}%, 100% ${t}%, 100% ${b}%, 0% ${b}%)`, duration: .8, ease:'power3.out'});
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
                        gsap.to('.home-project-wrap-top', {clipPath: `polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)`, duration: .5, ease:'power3.out'});
                    }
                    if ($(this).is(':last-child')){
                        console.log('last');
                        gsap.to('.home-project-wrap-top', {clipPath: `polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)`, duration: .5, ease:'power3.out'});
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