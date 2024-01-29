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

        function scrollAnimationGrid() {
            const gridItems = document.querySelectorAll('.home-portfolio-project-item');
            gridItems.forEach(item => {
                const yPercentRandomVal = gsap.utils.random(-100,100);
                gsap.timeline({
                    scrollTrigger: {
                        trigger: item,
                        start: "top 40%",
                        end: "top top",
                        scrub: true
                    }
                })
                .set(item, {
                    transformOrigin: `50% 200%`
                })
                .to(item, {
                    ease: 'none',
                    scale: 0.5,
                    borderRadius: '50%'
                })
            });
        }
        scrollAnimationGrid();

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
                // delay: lifeCycleTime/4,
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
                btnOverlay: $('.home-pricing-plan-switch-overlay')
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
            }

            DOM.btnPlan.on('click', function (e) {
                let index = $(this).index();
                e.preventDefault();
                console.log(index);
                activePlan(index);
            })
        }
        switchPlanPricing();
    },
    beforeLeave() {
        console.log(`leave ${this.namespace}`);
    }
}
export default home;