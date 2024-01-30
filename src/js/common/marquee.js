import { viewport } from '../helper/viewport';
const marqueeGS = (data) => {
    const { parent, duration, start, stopWhenScroll } = data;
    const direction = {
        right: "-=",
        left: "+="
    };
    const DOM = {
        wrap: parent('.marquee'),
        list: parent('.marquee-inner'),
        item: parent('.marquee-inner-item')
    }

    let isHover = false;

    let tlMarquee = gsap.timeline({
        repeat: -1,
        // onReverseComplete() {
        //     this.totalTime(this.rawTime() + this.duration() * 10);
        // },
        onUpdate: () => {
            if (!isHover) {
                let tlDir = lenis.direction >= 0 ? 1 : -1;
                gsap.to(tlMarquee, {timeScale: tlDir * Math.min(Math.max(lenis.velocity/2, 1), 4), duration: .1, ease: 'none' })
            }
        }
    })

    ScrollTrigger.create({
        trigger: DOM.wrap,
        start: 'top bottom',
        once: true,
        onEnter: () => {
            let cloneAmount = 2;
            const cloneAdditional = Math.floor(viewport.width / DOM.item.width());
            if (cloneAdditional >= 1) {
                cloneAmount += cloneAdditional;
            }

            DOM.item.css({ position: "relative", top: 0, left: 0 });
            gsap.set(DOM.item, { x: -1 * DOM.item.eq(0).width() });

            new Array(cloneAmount).fill().forEach((_, index) => {
                let itemClone = DOM.item.clone();
                gsap.set(itemClone,{ position: "absolute", top: 0, left: 0, x: index * DOM.item.width(), height: '100%' })
                DOM.list.append(itemClone);
            })

            tlMarquee.seek(28800);
            tlMarquee.to(DOM.list, {
                x: direction[start || "left"] + `${DOM.item.eq(0).width()}`,
                duration: DOM.item.eq(0).width() / duration,
                ease: "linear",
            })
        }
    })

    if (stopWhenScroll) {
        DOM.wrap.on("pointerenter", (event) => {
            isHover = true;
            gsap.to(tlMarquee, { timeScale: 0, ease: 'power1.inOut', duration: 0.3, overwrite: true });
        });
        DOM.wrap.on("pointerleave", (event) => {
            isHover = false;
            gsap.to(tlMarquee, { timeScale: 1, ease: 'power1.inOut', duration: 0.3, overwrite: true });
        });
    }

    return tlMarquee;
}

const marqueeCSS = (data) => {
    const { parent, duration, start, delay, stopWhenScroll } = data;
    const direction = {
        right: "reverse",
        left: "normal"
    };
    const DOM = {
        wrap: parent('.marquee'),
        list: parent('.marquee-inner'),
        item: parent('.marquee-inner-item')
    }
    let cloneAmount = 2;
    const cloneAdditional = Math.floor(viewport.width / DOM.item.width());
    if (cloneAdditional >= 1) {
        cloneAmount += cloneAdditional;
    }

    new Array(cloneAmount).fill().forEach((_, index) => {
        let itemClone = DOM.item.clone();
        DOM.list.append(itemClone);
    })
    DOM.list.addClass('marquee-anim');
    gsap.set(parent('.marquee-anim'), {
        '--duration': DOM.item.width() / duration ||  parent('.marquee-anim').css('--duration'),
        '--direction': direction[start] || parent('.marquee-anim').css('--direction'),
        '--delay': delay || parent('.marquee-anim').css('--delay')
    })
    new Array(1).fill().forEach((_, index) => {
        let itemClone = parent('.marquee-inner').clone();
        DOM.wrap.append(itemClone);
    })
}
export { marqueeGS, marqueeCSS }