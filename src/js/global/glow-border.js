import { lerp, xSetter, ySetter, xGetter, yGetter, opacityGetter, opacitySetter, inView } from "../helper/index";
import { cvUnit} from "../helper/viewport";


const initGlowBorder = () => {
    function dotRunAroundBorder() {
        const createElement = () => {
            $('[data-dot-glow-test]').each((idx, el) => {
                const outerBorder = document.createElement('div');
                const innerBorder = document.createElement('div');

                $(outerBorder).addClass('border-dot-outer');
                $(innerBorder).addClass('border-dot-inner');

                $(outerBorder).append(innerBorder)
                $(outerBorder).css('borderRadius', parseFloat($(el).css("borderRadius")) + "px")

                $(el).prepend(outerBorder)
            })
        }

        const applyVariant = () => {
            const target = $('[data-dot-glow-test]')

            target.each((idx, el) => {
                const element = $(el).find('.border-dot-outer')
                const target = $(el).find('.border-dot-inner')
                const radius = parseFloat($(el).css("borderRadius"))
                $(element).css('--border-radius', radius)
                
                const dimension = {
                    width: $(element).width(),
                    height: $(element).height(),
                }

                const elRatio = dimension.width / dimension.height
                $(element).css('--ratio-w', radius / dimension.width * 100)
                $(element).css('--ratio-h', radius / dimension.height * 100)

                //  Peripheral of Target
                const PeripCircle = Math.PI * 2 * radius
                const LengthLongEdge = dimension.width - radius * 2
                const LengthWideEdge = dimension.height - radius * 2
                const PeripTarget = (LengthLongEdge + LengthWideEdge) * 2 + PeripCircle

                const ratioLong = LengthLongEdge / PeripTarget
                const ratioWide = LengthWideEdge / PeripTarget
                const ratioPeripCircle = PeripCircle / PeripTarget


                const tlItem = gsap.timeline({ repeat: -1 })
                const duration = 5

                console.log(((LengthLongEdge / 2) / PeripTarget) * duration);
                tlItem
                    .to(target, {
                        x: dimension.width / 2 - radius,
                        y: 0,
                        duration: ((LengthLongEdge / 2) / PeripTarget) * duration,
                        ease: "none"
                    })
                    .to(target, {
                        motionPath: {
                            type: "quadratic",
                            path: [
                                {x: dimension.width / 2, y: radius},
                            ],
                            autoRotate: false
                        },
                        ease: "none",
                        duration: ((PeripCircle / 4) / PeripTarget) * duration,
                    })
                    .to(target, {
                        x: dimension.width / 2,
                        y: dimension.height - radius,
                        duration: ((LengthWideEdge) / PeripTarget) * duration,
                        ease: "none"
                    })
                    .to(target, {
                        motionPath: {
                            type: "quadratic",
                            path: [
                                {x: dimension.width / 2 - radius, y: dimension.height}
                            ],
                            autoRotate: false
                        },
                        ease: "none",
                        duration: ((PeripCircle / 4) / PeripTarget) * duration,
                    })
                    .to(target, {
                        x: -dimension.width / 2 + radius,
                        y: dimension.height,
                        duration: ((LengthLongEdge) / PeripTarget) * duration,
                        ease: "none"
                    })
                    .to(target, {
                        motionPath: {
                            type: "quadratic",
                            path: [
                                {x: -dimension.width / 2, y: dimension.height - radius}
                            ],
                            autoRotate: false
                        },
                        ease: "none",
                        duration: ((PeripCircle / 4) / PeripTarget) * duration,
                    })
                    .to(target, {
                        x: -dimension.width / 2,
                        y: radius,
                        duration: ((LengthWideEdge) / PeripTarget) * duration,
                        ease: "none"
                    })
                    .to(target, {
                        motionPath: {
                            type: "quadratic",
                            path: [
                                {x: -dimension.width / 2 + radius, y: 0},
                            ],
                            autoRotate: false
                        },
                        ease: "none",
                        duration: ((PeripCircle / 4) / PeripTarget) * duration,
                    })
                    .to(target, {
                        x: 0,
                        y: 0,
                        duration: ((LengthLongEdge / 2) / PeripTarget) * duration,
                        ease: "none"
                    })

                    // .to(target, {
                    //     motionPath: {
                    //         type: "quadratic",
                    //         path: [
                    //             {x:0, y:0},
                    //             {x: dimension.width / 2 - radius, y: 0},
                    //             {x: dimension.width / 2, y: radius},
                    //             {x: dimension.width / 2, y: dimension.height - radius},
                    //             {x: dimension.width / 2 - radius, y: dimension.height},
                    //             {x: -dimension.width / 2 + radius, y: dimension.height},
                    //             {x: -dimension.width / 2, y: dimension.height - radius},
                    //             {x: -dimension.width / 2, y: radius},
                    //             {x: -dimension.width / 2 + radius, y: 0},
                    //             {x:0, y:0}
                    //         ],
                    //         autoRotate: false
                    //       },
                    //       ease: Linear.easeNone,
                    //       duration: 5
                    // })


                // const easeInOut = `cubic-bezier(1, 0.1, 0, 0.9)`
                // animation-timing-function: ${easeInOut}

                // const keyframes = `
                //     @keyframes DotAroundBorder {
                //         0% {
                //             top: 0%;
                //             left: 50%;
                //         }
                //         ${LengthLongEdge / 2 / PeripTarget * 100}% {
                //             top: 0%;
                //             left: ${100 - radius/dimension.width * 100}%;
                //             animation-timing-function: ${easeInOut}

                //         }
                //         ${(LengthLongEdge / 2 + PeripCircle / 4) / PeripTarget * 100}% {
                //             top: ${radius/dimension.height * 100}%;
                //             left: 100%;
                //         }
                //         ${(LengthLongEdge / 2 + PeripCircle / 4 + LengthWideEdge) / PeripTarget * 100}% {
                //             top: ${100 - radius/dimension.height * 100}%;
                //             left: 100%;
                //         }
                //         ${(LengthLongEdge / 2 + PeripCircle / 2 + LengthWideEdge) / PeripTarget * 100}% {
                //             top: 100%;
                //             left: ${100 - radius/dimension.width * 100}%;
                //         }
                //         ${(LengthLongEdge * 3 / 2 + PeripCircle / 2 + LengthWideEdge) / PeripTarget * 100}% {
                //             top: 100%;
                //             left: ${radius/dimension.width * 100}%;
                //         }
                //         ${(LengthLongEdge * 3 / 2 + PeripCircle * 3 / 4 + LengthWideEdge) / PeripTarget * 100}% {
                //             top: ${100 - radius/dimension.height * 100}%;
                //             left: 0%;
                //         }
                //         ${(LengthLongEdge * 3 / 2 + PeripCircle * 3 / 4 + LengthWideEdge * 2) / PeripTarget * 100}% {
                //             top: ${radius/dimension.height * 100}%;
                //             left: 0%;
                //         }
                //         ${(LengthLongEdge * 3 / 2 + PeripCircle + LengthWideEdge * 2) / PeripTarget * 100}% {
                //             top: 0%;
                //             left: ${radius/dimension.width * 100}%;
                //         }
                //         ${(LengthLongEdge * 2 + PeripCircle + LengthWideEdge * 2) / PeripTarget * 100}% {
                //             top: 0%;
                //             left: 50%;
                //         }
                //     }
                // `;

                // console.log(keyframes);
                // Create a style element and append it to the head
                // const styleSheet = document.createElement("style");
                // styleSheet.type = "text/css";
                // styleSheet.innerText = keyframes;
                // document.head.appendChild(styleSheet);

                // Apply the animation to the element
                // $(target).css('animation', 'DotAroundBorder 8s linear infinite');
            })
        }
        createElement()
        applyVariant()
    }
    // dotRunAroundBorder()

    function borderGlow() {

        const CreateGlowDiv = () => {
            $('[data-border-glow]').each((idx, el) => {
                const option = JSON.parse($(el).attr('data-glow-option'))

                // Create Element
                const outerBorder = document.createElement('div');
                const innerBorder = document.createElement('div');
                const lineBorder = document.createElement('div');
                
                $(outerBorder).addClass('border-outer');
                $(innerBorder).addClass('border-inner');
                $(lineBorder).addClass('glow-el');

                const wrapOuterGlow = document.createElement('div');
                const innerOuterGlow = document.createElement('div');
                const elementOuterGlow = document.createElement('div');

                $(wrapOuterGlow).addClass('glow-outer');
                $(innerOuterGlow).addClass('glow-outer-inner');
                $(elementOuterGlow).addClass('glow-el');

                const wrapInnerGlow = document.createElement('div');
                const innerInnerGlow = document.createElement('div');
                const elementInnerGlow = document.createElement('div');

                $(wrapInnerGlow).addClass('glow-inner');
                $(innerInnerGlow).addClass('glow-inner-inner');
                $(elementInnerGlow).addClass('glow-el');

                // Set Border Radius for Border
                // $([outerBorder, wrapOuterGlow, wrapInnerGlow]).css('--border-radius', parseFloat($(el).css("borderRadius")) + "px")

                // Set Border Width for Border
                $([outerBorder, wrapOuterGlow, wrapInnerGlow]).css('--border-width', `${parseFloat(option.width) || 1}px`)

                //Set Inset for Border
                if (option.inset) {
                    if (!option.inset.x && !option.inset.y) {
                        $([outerBorder, wrapOuterGlow, wrapInnerGlow]).css('width', `calc(100% - ${parseFloat(option.inset)}px)`)
                        $([outerBorder, wrapOuterGlow, wrapInnerGlow]).css('height', `calc(100% - ${parseFloat(option.inset)}px)`)
                        
                    }
                    if (option.inset.x) {
                        $([outerBorder, wrapOuterGlow, wrapInnerGlow]).css('width', `calc(100% - ${parseFloat(option.inset.x)}px)`)
                    }
                    if (option.inset.y) {
                        $([outerBorder, wrapOuterGlow, wrapInnerGlow]).css('height', `calc(100% - ${parseFloat(option.inset.y)}px)`)
                    }
                }
                $([outerBorder, wrapOuterGlow, wrapInnerGlow]).css('--opacity', (option.opacity || 1))


                //Set Glow for Glow Dot
                if (option.glow > 10) {
                    $([lineBorder, elementOuterGlow, elementInnerGlow]).addClass('glow-big');
                } else if (option.glow > 6) {
                    $([lineBorder, elementOuterGlow, elementInnerGlow]).addClass('glow-nor');
                } else {
                    // $([lineBorder, elementOuterGlow, elementInnerGlow]).addClass('glow-el');
                }
                $([outerBorder, wrapOuterGlow, wrapInnerGlow]).css('--glow', (option.glow || 4) + "rem")

                if (option.color === undefined) {
                    option.color = "rgba(255, 255, 255, 1)";
                }
                $([outerBorder, wrapOuterGlow, wrapInnerGlow]).css('--bg-cl', option.color)

                if (option.position) {
                    $(lineBorder).addClass('force-cl');
                }

                // Append Element
                $(innerBorder).append(lineBorder)
                $(outerBorder).append(innerBorder)

                $(innerOuterGlow).append(elementOuterGlow)
                $(wrapOuterGlow).append(innerOuterGlow)

                $(innerInnerGlow).append(elementInnerGlow)
                $(wrapInnerGlow).append(innerInnerGlow)

                if (!$(el).parents('[data-glow-option]').length && !option.position) {
                    $(el).prepend(wrapOuterGlow)
                    $(el).prepend(wrapInnerGlow)
                }

                $(el).prepend(outerBorder)
            })
        }

        const AnimDotGlow = () => {
            let target = $('[data-border-glow]');
            gsap.set(".border-inner, .glow-outer-inner, .glow-inner-inner", {opacity: 0})

            // console.log(target);

            function initDotGlow() {
                let targetPos = {
                    x: xGetter('.cursor'),
                    y: yGetter('.cursor')
                }

                target.each((idx, el) => {
                    let isGetData = false
                    let option
                    let borderTarget
                    let glowOuter
                    let glowInner


                    if (!isGetData) {
                        option = JSON.parse($(el).attr('data-glow-option'))
                        borderTarget = $(el).find(".border-inner")
                        glowOuter = $(el).find(".glow-outer-inner")
                        glowInner = $(el).find(".glow-inner-inner")
                        isGetData = true
                    }

                    let xBorderTarget = xGetter(borderTarget.get(0))
                    let yBorderTarget = yGetter(borderTarget.get(0))

                    let xGlowOuter = xGetter(glowOuter.get(0))
                    let yGlowOuter = yGetter(glowOuter.get(0))

                    let xGlowInner = xGetter(glowInner.get(0))
                    let yGlowInner = yGetter(glowInner.get(0))

                    // Move with Cursor
                    const MagicMath = () => {
                        // Calculate Glow Dot Move
                        const maxXMove = $(el).outerWidth()/2
                        const maxYMove = $(el).outerHeight()/2

                        let xMove = targetPos.x - (el.getBoundingClientRect().left + $(el).outerWidth()/2)
                        let yMove = targetPos.y - (el.getBoundingClientRect().top + $(el).outerHeight()/2)

                        let limitBorderXMove = Math.max(Math.min(xMove, maxXMove), -maxXMove)
                        let limitBorderYMove = Math.max(Math.min(yMove, maxYMove), -maxYMove)
                        
                        let limitGlowOuterXMove = Math.max(Math.min(xMove, (maxXMove - parseFloat($(el).css("borderRadius")))), -(maxXMove - parseFloat($(el).css("borderRadius"))))
                        let limitGlowOuterYMove = Math.max(Math.min(yMove, (maxYMove - parseFloat($(el).css("borderRadius")))), -(maxYMove - parseFloat($(el).css("borderRadius"))))

                        let GlowInnerXMove
                        let GlowInnerYMove

                        // Calculate Magnetic Area
                        let boundingMagnet = {
                            top: el.getBoundingClientRect().top - cvUnit(option.magnetic * 10 /2 || 0, "rem"),
                            right: el.getBoundingClientRect().right + cvUnit(option.magnetic * 10 /2 || 0, "rem"),
                            bottom: el.getBoundingClientRect().bottom + cvUnit(option.magnetic * 10 /2 || 0, "rem"),
                            left: el.getBoundingClientRect().left - cvUnit(option.magnetic * 10 /2 || 0, "rem"),
                        }

                        const changeOpacityTarget = [borderTarget]

                        if (glowOuter.length) {
                            changeOpacityTarget.push(glowOuter)
                            changeOpacityTarget.push(glowInner)
                        }

                        // Anim opacity
                        const changeOpacity = {
                            change: () => {
                                let opacityTarget = opacityGetter(borderTarget.get(0))

                                if (borderTarget.hasClass('active')) {
                                    let xOffset = Math.abs(xMove) - maxXMove
                                    let yOffset = Math.abs(yMove) - maxYMove

                                    let xNormalize = Math.min(Math.abs((Math.abs(xMove) - $(el).outerWidth()/2 ) / cvUnit(option.magnetic * 10 /2 || 1, "rem") -1), 1) // Run 0 - 1
                                    let yNormalize = Math.min(Math.abs((Math.abs(yMove) - $(el).outerHeight()/2) / cvUnit(option.magnetic * 10 /2 || 1, "rem") - 1), 1) // Run 0 - 1


                                    if (xOffset > 0 && yOffset > 0) {
                                        if (xOffset <= yOffset) {
                                            // Opacity Set by Y Pos
                                            $(changeOpacityTarget).each((idx, el) => {
                                                opacitySetter(el)(lerp(opacityTarget, yNormalize * 1.15 , .95))
                                            })
                                        } else {
                                            // Opacity Set by X Pos
                                            $(changeOpacityTarget).each((idx, el) => {
                                                opacitySetter(el)(lerp(opacityTarget, xNormalize * 1.15, .95))
                                            })
                                        }
                                    } else {
                                        if (xOffset <= 0) {
                                            // Opacity Set by Y Pos
                                            $(changeOpacityTarget).each((idx, el) => {
                                                opacitySetter(el)(lerp(opacityTarget, yNormalize * 1.15, .95))
                                            })
                                        }
                                        if (yOffset <= 0) {
                                            // Opacity Set by X Pos
                                            $(changeOpacityTarget).each((idx, el) => {
                                                opacitySetter(el)(lerp(opacityTarget, xNormalize * 1.15, .95))
                                            })
                                        }
                                        if (xOffset <= 0 && yOffset <= 0) {
                                            // This is Hovering
                                            $(changeOpacityTarget).each((idx, el) => {
                                                opacitySetter(el)(lerp(opacityTarget, 1, .95))
                                            })
                                        }
                                    }
                                }
                            },
                            default: () => {
                                gsap.set(changeOpacityTarget, {opacity: 0,})
                            },
                            visible: () => {
                                gsap.set(changeOpacityTarget, {opacity: 1})
                            }
                        }

                        // Check target in magnetic area yet
                        if (!option.position) {
                            if (boundingMagnet.left <= targetPos.x && targetPos.x <= boundingMagnet.right && boundingMagnet.top <= targetPos.y && targetPos.y <= boundingMagnet.bottom) {
                                //Anim Border
                                borderTarget.addClass('active')
                                xSetter(borderTarget.get(0))(lerp(xBorderTarget, limitBorderXMove, .55))
                                ySetter(borderTarget.get(0))(lerp(yBorderTarget, limitBorderYMove, .55))

                                xSetter(glowOuter.get(0))(lerp(xGlowOuter, xMove, .55))
                                ySetter(glowOuter.get(0))(lerp(yGlowOuter, yMove, .55))

                                xSetter(glowInner.get(0))(lerp(xGlowInner, xMove, .55))
                                ySetter(glowInner.get(0))(lerp(yGlowInner, yMove, .55))

                                changeOpacity.change()
                            } else {
                                // Reset Border and Glow Position
                                borderTarget.removeClass('active')
                                xSetter(borderTarget.get(0))(lerp(xBorderTarget, limitBorderXMove, .55))
                                ySetter(borderTarget.get(0))(lerp(yBorderTarget, limitBorderYMove, .55))

                                xSetter(glowOuter.get(0))(lerp(xGlowOuter, xMove, .55))
                                ySetter(glowOuter.get(0))(lerp(yGlowOuter, yMove, .55))

                                xSetter(glowInner.get(0))(lerp(xGlowInner, xMove, .55))
                                ySetter(glowInner.get(0))(lerp(yGlowInner, yMove, .55))
                                
                                changeOpacity.default()
                            }
                        }

                        /// Check State Position of this border
                        if (option.position) {
                            if (boundingMagnet.left <= targetPos.x && targetPos.x <= boundingMagnet.right && boundingMagnet.top <= targetPos.y && targetPos.y <= boundingMagnet.bottom) {
                                // Anim
                                xSetter(borderTarget.get(0))(lerp(xBorderTarget, limitBorderXMove, .1))
                                ySetter(borderTarget.get(0))(lerp(yBorderTarget, limitBorderYMove, .1))

                                xSetter(glowOuter.get(0))(lerp(xGlowOuter, limitBorderXMove, .15))
                                ySetter(glowOuter.get(0))(lerp(yGlowOuter, limitBorderYMove, .15))

                                xSetter(glowInner.get(0))(lerp(xGlowInner, limitBorderXMove, .15))
                                ySetter(glowInner.get(0))(lerp(yGlowInner, limitBorderYMove, .15))
                                changeOpacity.visible()
                            } else {
                                // Reset Border and Glow Position
                                changeOpacity.visible()
                                xSetter(borderTarget.get(0))(lerp(xBorderTarget, 0, .05))
                                ySetter(borderTarget.get(0))(lerp(yBorderTarget, 0, .05))

                                xSetter(glowOuter.get(0))(lerp(xGlowOuter, 0, .05))
                                ySetter(glowOuter.get(0))(lerp(yGlowOuter, 0, .05))

                                xSetter(glowInner.get(0))(lerp(xGlowInner, 0, .05))
                                ySetter(glowInner.get(0))(lerp(yGlowInner, 0, .05))

                                // Check State Position of this border
                                const pos = option.position.split(" ")
                                $(pos).each((idx, posTarget) => {
                                    switch (posTarget) {
                                        case 'top':
                                            ySetter(borderTarget.get(0))(lerp(yBorderTarget, -maxYMove, .05))
                                            ySetter(glowOuter.get(0))(lerp(yGlowOuter, -maxYMove, .05))
                                            ySetter(glowInner.get(0))(lerp(yGlowInner, -maxYMove, .05))
                                            break;
                                        case 'bottom':
                                            ySetter(borderTarget.get(0))(lerp(yBorderTarget, maxYMove, .05))
                                            ySetter(glowOuter.get(0))(lerp(yGlowOuter, maxYMove, .05))
                                            ySetter(glowInner.get(0))(lerp(yGlowInner, maxYMove, .05))
                                            break;
                                        case 'left':
                                            xSetter(borderTarget.get(0))(lerp(xBorderTarget, -maxXMove, .05))
                                            xSetter(glowOuter.get(0))(lerp(xGlowOuter, -maxXMove, .05))
                                            xSetter(glowInner.get(0))(lerp(xGlowInner, -maxXMove, .05))
                                            break;
                                        case 'right':
                                            xSetter(borderTarget.get(0))(lerp(xBorderTarget, maxXMove, .05))
                                            xSetter(glowOuter.get(0))(lerp(xGlowOuter, maxXMove, .05))
                                            xSetter(glowInner.get(0))(lerp(xGlowInner, maxXMove, .05))
                                            break;
                                    }
                                })
                            }
                        }
                    }


                    if (inView(el)) {
                        MagicMath()
                    }
                })
                requestAnimationFrame(initDotGlow)
            }
            requestAnimationFrame(initDotGlow)
        }
        if ($(window).width() > 991) {
            CreateGlowDiv()
            AnimDotGlow()
        }
    }
    borderGlow()
}


export default initGlowBorder