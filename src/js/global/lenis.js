gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
    lerp: false,
    duration: 1.6
})

const initLenis = () => {
    lenis.on("scroll", ({ scroll, limit, velocity, direction, progress }) => {
        ScrollTrigger.update
    });

	gsap.ticker.add((time)=>{
        lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    return lenis;
}

const scrollTop = () => {
    // return (onComplete) => {
    //     lenis.scrollTo('top', {
    //         duration: .0001,
    //         lock: true,
    //         onComplete: onComplete?.()
    //     })
    // }
}

export {
	lenis,
    initLenis,
    scrollTop
};