const home = {
    namespace: "home",
    afterEnter(data) {
        console.log(`enter ${this.namespace}`);
        let cont = $('body');

        function homeHeroParallax() {
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
        homeHeroParallax()
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
    },
    beforeLeave() {
        console.log(`leave ${this.namespace}`);
    }
}
export default home;