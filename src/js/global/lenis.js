gsap.registerPlugin(ScrollTrigger);

let lenis;

const initLenis = () => {
    lenis = new Lenis()
    lenis.on('scroll', ScrollTrigger.update)

	gsap.ticker.add((time)=>{
        lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)
}

export {
	lenis,
    initLenis,
};