gsap.registerPlugin(ScrollTrigger);

let lenis;

const initLenis = () => {
    lenis = new Lenis({
        lerp: 0.05,
    })
    lenis.on('scroll', ScrollTrigger.update)

	gsap.ticker.add((time)=>{
        lenis.raf(time * 1500)
    })
    gsap.ticker.lagSmoothing(0)
}

export {
	lenis,
    initLenis,
};