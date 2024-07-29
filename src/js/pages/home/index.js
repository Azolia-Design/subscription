import { debounce, parseRem, selector } from "../../helper/index";
import {
  cvUnit,
  percentage,
  viewport,
  viewportBreak,
} from "../../helper/viewport";
import { lenis } from "../../global/lenis";
import {
  lerp,
  xSetter,
  ySetter,
  rotZSetter,
  xGetter,
  yGetter,
  rotZGetter,
  pointerCurr,
  typeOpts,
} from "../../helper/index";
import { SplitText } from "../../libs/SplitText";

const home = {
  namespace: "home",
  afterEnter(data) {
    console.log(`enter ${this.namespace}`);
    let cont = $("body");

    function headerAnim() {
      let headTxt = new SplitText(".home-hero-title", typeOpts.words);
      let scheduleTxt = new SplitText(".header-main-schedule", typeOpts.chars);
      let tlSplitHead = gsap.timeline({
        onComplete: () => {
          headTxt.revert();
          scheduleTxt.revert();
        },
      });
      tlSplitHead
        .from(
          ".home-hero-logo",
          { yPercent: 60, autoAlpha: 0, duration: 1, ease: "power2.out" },
          0
        )
        .from(
          headTxt.words,
          {
            yPercent: 60,
            autoAlpha: 0,
            stagger: 0.03,
            duration: 0.6,
            ease: "power2.out",
          },
          "<=.2"
        );

      if ($(window).width() > 767) {
        tlSplitHead
          .from(
            ".home-hero-btn",
            { yPercent: 60, autoAlpha: 0, duration: 0.6, ease: "power2.out" },
            "<=.4"
          )
          .from(
            ".home-hero-discover",
            { autoAlpha: 0, duration: 0.6, ease: "power2.out" },
            "<=.2"
          )
          .from(
            scheduleTxt.chars,
            {
              yPercent: 60,
              autoAlpha: 0,
              stagger: 0.01,
              duration: 0.8,
              ease: "power2.out",
            },
            "<=0"
          );
      }
      tlSplitHead.from(
        ".header-main-inner",
        { autoAlpha: 0, duration: 0.6, ease: "power2.out" },
        "<=.2"
      );
    }
    headerAnim();

    function initAccordion(wrap) {
      const parent = selector(wrap);
      const DOM = {
        accordion: parent(".accordion"),
        accordionTitle: parent(".accordion-title"),
        accordionContent: parent(".accordion-content"),
      };
      parent(DOM.accordionContent).hide();
      function activeAccordion(index) {
        DOM.accordionContent.eq(index).slideToggle("slow");
        DOM.accordion.eq(index).toggleClass("active");

        DOM.accordionContent
          .not(DOM.accordionContent.eq(index))
          .slideUp("slow");
        DOM.accordion.not(DOM.accordion.eq(index)).removeClass("active");
      }

      DOM.accordionTitle.on("click", function () {
        let index = $(this).parent().index();
        activeAccordion(index);
        gsap.globalTimeline
          .getChildren()
          .filter((e) => e.data === "footer-curtain")
          .forEach((el) => {
            el.scrollTrigger.refresh();
          });
      });
    }

    function heroParallax() {
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: cont.find(".home-hero"),
          start: "top top",
          end: "bottom top",
          scrub: 0.3,
        },
      });
      tl.to(cont.find(".home-hero-bg img"), { y: "19rem", ease: "none" });
    }
    heroParallax();

    /** (💡)  - BENEFIT */
    function homeBenefit() {
      function stackScroll() {
        const BENEFIT = {
          stage: $(".home-benefit"),
          wrap: $(".home-benefit--wrap"),
          list: $(".home-benefit-list"),
          item: $(".home-benefit-item"),
          mainItem: $(".home-benefit-main"),
          otherItem: $(".home-benefit-other"),
          otherWrap: $(".home-benefit-other-wrap"),
        };

        let mainItemSelect = selector(BENEFIT.mainItem);
        let totalDistance =
          BENEFIT.mainItem.width() +
          BENEFIT.otherItem.width() * BENEFIT.otherItem.length;
        let otherWrapDistance = BENEFIT.mainItem.outerWidth();

        // const ITEM_WIDTH = ($('.container').width() - percentage(37, $('.container').width())) / viewportBreak({ desktop: 5, tablet: 2 });
        const ITEM_WIDTH =
          ($(BENEFIT.otherItem).outerWidth() * (BENEFIT.otherItem.length - 1) -
            ($(".container").width() -
              $(BENEFIT.otherItem).last().outerWidth())) /
          (BENEFIT.otherItem.length - 1);

        if ($(window).width() > 991) {
          gsap.set(BENEFIT.stage, {
            height: totalDistance * 1.2 + cvUnit(100, "rem"),
          });
        }

        let scrollerTl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: BENEFIT.stage,
            start: `top-=${$("header").outerHeight()} top`,
            end: "bottom bottom",
            scrub: 0.6,
          },
        });
        scrollerTl
          .to(
            mainItemSelect("h2"),
            {
              scale: 0.56,
              transformOrigin: "top left",
              ease: "linear",
              duration: 1,
            },
            0
          )
          .to(
            mainItemSelect("p"),
            {
              marginTop: -cvUnit(
                viewportBreak({ desktop: 140, tablet: 50 }),
                "rem"
              ),
              scale: 0.8,
              duration: 1,
            },
            0
          )
          .to(
            mainItemSelect(".home-benefit-main-btn"),
            {
              scale: 0.8,
              duration: 1,
            },
            0
          )
          .to(
            BENEFIT.otherWrap,
            {
              x: -otherWrapDistance,
              duration: 1,
            },
            0
          );
        BENEFIT.otherItem.each((index, item) => {
          let itemSelect = selector(item);
          gsap.set(itemSelect(".home-benefit-item-overlay"), { scaleX: 0 });
          let label = $(item)
            .find(".home-benefit-other-title")
            .text()
            .toLowerCase()
            .replace(" ", "-");
          $(item).attr("data-label", `${label}`);

          scrollerTl
            .add(`label${index}`)
            .to(item, {
              duration: 1,
            })
            .to(
              itemSelect("h3"),
              {
                scale: viewportBreak({ desktop: 0.75, tablet: 0.5 }),
                transformOrigin: "top left",
                duration: 1,
              },
              "<=0"
            )
            .to(
              itemSelect(".home-benefit-item-overlay"),
              {
                scaleX: 1,
                transformOrigin: "right",
                duration: 1,
              },
              "<=0"
            )
            .to(
              itemSelect("p"),
              {
                autoAlpha: 0,
                duration: 1,
              },
              "<=0.2"
            )
            .to(
              itemSelect(".home-benefit-other-img"),
              {
                autoAlpha: 0,
                duration: 1,
                scale: 0.6,
              },
              "<=0.2"
            );

          BENEFIT.otherItem.each((idx, el) => {
            if (idx > index) {
              scrollerTl.to(
                el,
                {
                  x: -(ITEM_WIDTH * (index + 1)),
                  paddingLeft: viewportBreak({
                    desktop: cvUnit(40, "rem"),
                    tablet: cvUnit(24, "rem"),
                  }),
                  duration: 1,
                },
                "<=0"
              );
            }
          });
        });
        scrollerTl
          .to(
            BENEFIT.wrap,
            {
              scale: viewportBreak({ desktop: 0.5, tablet: 0.8 }),
              autoAlpha: 0,
              duration: 2,
            },
            ">=-.8"
          )
          .to(
            BENEFIT.wrap,
            {
              yPercent: -8,
              duration: 1,
            },
            "<= .8"
          );

        $(".home-benefit-other-sub-btn").on("click", function (e) {
          e.preventDefault();
          let target = $(this)
            .closest(".home-benefit-item.home-benefit-other")
            .index();
          toLabel(1, scrollerTl, `label${target}`);
        });
        function toLabel(duration, timeline, label) {
          lenis.stop();
          const yStart =
            $(".home-benefit").offset().top - $(".header").outerHeight();
          const now = timeline.progress();
          timeline.seek(label);
          const goToProgress = timeline.progress();
          timeline.progress(now);
          lenis.scrollTo(
            yStart +
              (timeline.scrollTrigger.end - timeline.scrollTrigger.start) *
                goToProgress,
            {
              duration: duration,
              force: true,
            }
          );
        }
      }

      function animText() {
        let mainTitleTxt = new SplitText(
          ".home-benefit-main-title",
          typeOpts.words
        );
        let mainSubTxt = new SplitText(
          ".home-benefit-main-sub",
          typeOpts.words
        );

        let tlSplitHead = gsap.timeline({
          scrollTrigger: {
            trigger: ".home-benefit-list",
            start: "top bottom-=10%",
            // markers: true
          },
          onComplete: () => {
            mainTitleTxt.revert();
            mainSubTxt.revert();
          },
        });

        tlSplitHead
          .from(
            mainTitleTxt.words,
            {
              yPercent: 60,
              autoAlpha: 0,
              stagger: 0.03,
              duration: 0.6,
              ease: "power2.out",
            },
            0
          )
          .from(
            mainSubTxt.words,
            {
              yPercent: 60,
              autoAlpha: 0,
              stagger: 0.03,
              duration: 0.6,
              ease: "power2.out",
            },
            "<=.4"
          );

        $(".home-benefit-other").each((idx, el) => {
          if (idx < 3) {
            let otherTitleTxt = new SplitText(
              $(el).find(".home-benefit-other-title"),
              typeOpts.chars
            );
            let otherSubTxt = new SplitText(
              $(el).find(".home-benefit-other-sub-txt"),
              typeOpts.words
            );

            tlSplitHead
              .from(
                otherTitleTxt.chars,
                {
                  yPercent: 60,
                  autoAlpha: 0,
                  stagger: 0.01,
                  duration: 0.6,
                  ease: "power2.out",
                  onComplete: () => {
                    otherTitleTxt.revert();
                  },
                },
                0
              )
              .from(
                otherSubTxt.words,
                {
                  yPercent: 60,
                  autoAlpha: 0,
                  stagger: 0.03,
                  duration: 0.6,
                  ease: "power2.out",
                  onComplete: () => {
                    otherSubTxt.revert();
                  },
                },
                "<=.2"
              );
          }
        });
      }

      animText();
      if ($(window).width() > 767) {
        stackScroll();
      }
    }
    homeBenefit();

    /** (💡)  - SHOWREEL */
    function homeShowreel() {
      function galleryZoom() {
        const GALLERY = {
          wrap: $(".home-showreel"),
          item: ({ wrap, item }) =>
            GALLERY.otherWrap.eq(wrap).find(GALLERY.otherInner).eq(item),
          mainWrap: $(".home-showreel-main--inner"),
          mainInner: $(".home-showreel-item-main"),
          otherWrap: $(".home-showreel-other--inner"),
          otherInner: $(".home-showreel-item-other"),
          thumbPlay: $(".home-showreel-play"),
        };

        let showreelTl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: GALLERY.wrap,
            start: `top bottom`,
            end: "bottom bottom",
            scrub: 0.6,
          },
        });

        const getOtherItem = ({ wrap, item }) =>
          GALLERY.otherWrap.eq(wrap).find(GALLERY.otherInner).eq(item);
        viewportBreak({
          tablet: () => {
            gsap.set(GALLERY.mainWrap, { padding: 0 });
          },
        });
        showreelTl
          .to(".home-showreel-item-overlay", { autoAlpha: 0, duration: 0.15 })
          .from(
            [
              getOtherItem({ wrap: 0, item: 2 }),
              getOtherItem({ wrap: 1, item: 2 }),
            ],
            { y: 80, duration: 0.2 },
            "<=0"
          )
          .from(
            [
              getOtherItem({ wrap: 0, item: 1 }),
              getOtherItem({ wrap: 1, item: 1 }),
            ],
            { y: 200, duration: 0.2 },
            "<=0"
          )
          .from(
            [
              getOtherItem({ wrap: 0, item: 0 }),
              getOtherItem({ wrap: 1, item: 0 }),
            ],
            { y: 320, duration: 0.2 },
            "<=0"
          )
          .fromTo(
            GALLERY.mainWrap,
            {
              clipPath: `inset(14% 37.35% 14% 37.35% round ${cvUnit(
                20,
                "rem"
              )}px)`,
            },
            {
              clipPath: `inset(0% 0% 0% 0% round ${cvUnit(20, "rem")}px)`,
              duration: 1,
            },
            ">=-0.1"
          )
          .to(
            GALLERY.otherInner.find(".img"),
            { scale: 1.6, duration: 1 },
            "<=0"
          )
          .to(
            getOtherItem({ wrap: 0, item: 2 }),
            { xPercent: -255, duration: 1 },
            "<=0"
          )
          .to(
            getOtherItem({ wrap: 0, item: 1 }),
            { xPercent: -460, duration: 1 },
            "<=0"
          )
          .to(
            getOtherItem({ wrap: 0, item: 0 }),
            { xPercent: -760, duration: 1 },
            "<=0"
          )
          .to(
            getOtherItem({ wrap: 1, item: 2 }),
            { xPercent: 255, duration: 1 },
            "<=0"
          )
          .to(
            getOtherItem({ wrap: 1, item: 1 }),
            { xPercent: 460, duration: 1 },
            "<=0"
          )
          .to(
            getOtherItem({ wrap: 1, item: 0 }),
            { xPercent: 760, duration: 1 },
            "<=0"
          )
          .from(
            GALLERY.thumbPlay,
            { autoAlpha: 0, y: 0, duration: 0.5 },
            ">=-1"
          )
          .from(
            ".home-showreel-play-wrapper",
            { autoAlpha: 0, y: 0, duration: 0.5 },
            "<=0"
          )
          .from(".home-showreel-play-ic", { scale: 0.8, duration: 1 }, "<=0")
          .from(
            ".home-showreel-play-ic svg",
            { scale: 1.4, duration: 1 },
            "<=0"
          )
          .from(
            ".home-showreel-play-first",
            { x: -cvUnit(200, "rem"), duration: 1 },
            "<=0"
          )
          .from(
            ".home-showreel-play-last",
            { x: cvUnit(200, "rem"), duration: 1 },
            "<=0"
          );
      }
      function playShowreel() {
        let DOM = {
          stage: $(".home-showreel"),
          vid_wrap: $(".home-showreel--wrap"),
          link_vid: $(".home-showreel-thumb-link"),
          thumbnail: $(".home-showreel-thumb img"),
          play: $(".home-showreel-play"),
          video: $(".home-showreel-thumb-link-vid"),
        };
        DOM.link_vid.on("click", function (e) {
          e.preventDefault();
          if ($(this).attr("data-video") == "to-play") {
            $(this).attr("data-video", "to-pause");
            let heightVidWrap = viewportBreak({
              desktop: DOM.vid_wrap.height(),
              tablet: $(".home-showreel-main--inner").height(),
            });
            let scrollTarget =
              DOM.stage.outerHeight() +
              DOM.stage.offset().top -
              $(window).height();
            lenis.scrollTo(scrollTarget);

            DOM.thumbnail.addClass("hidden");
            DOM.video.removeClass("hidden");
            DOM.play.addClass("hidden");
            DOM.video.get(0).pause();
            DOM.video.get(0).play();
          } else {
            $(this).attr("data-video", "to-play");
            // $('.home-hero-vid-thumbnail').removeClass('hidden')
            // $('.home-hero-vid-video').addClass('hidden')
            //$('.home-hero-vid-thumbnail').find('video').get(0).play()
            DOM.play.removeClass("hidden");
            DOM.video.get(0).pause();
          }
        });

        $(".home-showreel-play-wrapper").on("click", function (e) {
          e.preventDefault();
          DOM.link_vid.trigger("click");
        });
      }

      function animShowreel() {
        const target = $(".home-showreel");
        let tlFade = gsap.timeline({
          scrollTrigger: {
            trigger: target,
            start: "bottom top+=45%",
            end: "bottom top-=40%",
            scrub: 0.3,
          },
        });
      }
      animShowreel();

      playShowreel();
      if ($(window).width() > 767) {
        galleryZoom();
      }
    }
    homeShowreel();

    /** (💡)  - SERVICE */
    function homeService() {
      initAccordion(".home-service-listing");

      const widthCursor = $(".cursor-wrap .cursor-border").outerWidth();
      const heightCursor = $(".cursor-wrap .cursor-border").outerHeight();
      $(".home-service-item").hover(
        function () {
          let width =
            $(this).find(".home-service-item-toggle svg").outerWidth() + 4;
          let height =
            $(this).find(".home-service-item-toggle svg").outerHeight() + 4;
          $(".cursor-wrap .cursor-border").css("width", width + "px");
          $(".cursor-wrap .cursor-border").css("height", height + "px");
          $(".cursor-wrap .cursor-dot").hide(300);
        },
        function () {
          $(".cursor-wrap .cursor-dot").show(300);
          $(".cursor-wrap .cursor-border").css("width", widthCursor + "px");
          $(".cursor-wrap .cursor-border").css("height", heightCursor + "px");
        }
      );
      function homeServicePreamble() {
        const WrapHeightRatio = parseInt(
          parseFloat($(".home-service-preamble").css("height")) /
            $(window).height()
        );

        let tlImg = gsap.timeline({
          scrollTrigger: {
            trigger: ".home-service-preamble",
            start: `top+=${parseRem(190)} top`,
            end: `top+=${$(window).width()} top`,
            scrub: 1,
          },
        });
        tlImg.to(".home-service-preamble-bg", {
          autoAlpha: 1,
          duration: 1,
          ease: "linear",
        });

        let tlItem = gsap.timeline({
          scrollTrigger: {
            trigger: ".home-service-preamble",
            start: `top+=${$(window).width() * 0.5} top`,
            end: `bottom bottom`,
            scrub: 1,
          },
        });

        $(".home-service-preamble-inner-item").each((idx, el) => {
          if (idx === 0) {
            tlItem
              .fromTo(
                el,
                { opacity: 0 },
                { opacity: 1, duration: 1, ease: "none" },
                0
              )
              .fromTo(
                el,
                { opacity: 1 },
                { opacity: 0, duration: 1, ease: "none" },
                `>=.5`
              );
          } else if (idx < $(".home-service-preamble-inner-item").length - 1) {
            tlItem
              .fromTo(
                el,
                { opacity: 0 },
                { opacity: 1, duration: 1, ease: "none" },
                `>=0`
              )
              .fromTo(
                el,
                { opacity: 1 },
                { opacity: 0, duration: 1, ease: "none" },
                `>=.5`
              );
          } else {
            tlItem.fromTo(
              el,
              { opacity: 0 },
              { opacity: 1, duration: 1, ease: "none" },
              `>=0`
            );
          }
          gsap.set(el, { opacity: 0 });
        });
      }

      function homeServiceMain() {
        $(".home-service-item").each((idx, el) => {
          let itemTitleTxt = new SplitText(
            $(el).find(".home-service-item-title"),
            typeOpts.chars
          );
          let itemToggle = $(el).find(".home-service-item-toggle");
          let tlItem = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: "top top+=80%",
              // markers: true
            },
            onComplete: () => {
              itemTitleTxt.revert();
            },
          });
          tlItem
            .from(
              $(el).find(".line"),
              {
                scaleX: 0,
                transformOrigin: "left",
                duration: 0.6,
                ease: "power2.out",
              },
              0
            )
            .from(
              itemTitleTxt.chars,
              {
                yPercent: 60,
                autoAlpha: 0,
                stagger: 0.03,
                duration: 0.6,
                ease: "power2.out",
              },
              0
            )
            .from(
              itemToggle,
              { y: 60, autoAlpha: 0, duration: 0.8, ease: "power2.out" },
              0
            );
        });

        $(".home-service-thumb-item").each((idx, el) => {
          let clone = $(el).find("img");
          for (let i = 1; i <= 5; i++) {
            let cloner = clone.clone();
            cloner.addClass("cloner");
            $(el).append(cloner);
          }
        });
        if ($(window).width() > 991) {
          console.log("run");
          $(".home-service-item").on("mouseenter", function (e) {
            let idx = Number($(this).attr("data-thumb-image")) - 1;

            if (
              $(".home-service-thumb")
                .find(".home-service-thumb-item")
                .eq(idx)
                .hasClass("active")
            )
              return;
            $(".home-service-thumb")
              .find(".home-service-thumb-item")
              .eq(idx)
              .addClass("active");
          });
          $(".home-service-item").on("mouseleave", function (e) {
            let idx = Number($(this).attr("data-thumb-image")) - 1;
            $(".home-service-thumb")
              .find(".home-service-thumb-item")
              .eq(idx)
              .removeClass("active");
          });

          function initMouseMove() {
            const target = $(".home-service-thumb");
            if (target.hasClass("active")) {
              let tarCurrX = xGetter(target.get(0));
              let tarCurrY = yGetter(target.get(0));
              let tarCurrRot = rotZGetter(target.get(0));

              let tarX =
                -target.outerWidth() / 4 +
                ((pointerCurr().x -
                  $(".home-service-listing").get(0).getBoundingClientRect()
                    .left) /
                  $(".home-service-listing").outerWidth()) *
                  ($(".home-service-listing").outerWidth() / 3 -
                    target.outerWidth() / 2);
              let tarY =
                -target.outerHeight() / 4 +
                ((pointerCurr().y -
                  $(".home-service-listing").get(0).getBoundingClientRect()
                    .top) /
                  $(".home-service-listing").outerHeight()) *
                  ($(".home-service-listing").outerHeight() -
                    target.outerHeight() / 2);

              xSetter(target.get(0))(lerp(tarCurrX, tarX, 0.05));
              ySetter(target.get(0))(lerp(tarCurrY, tarY, 0.05));
              rotZSetter(target.get(0))(
                lerp(
                  tarCurrRot,
                  Math.min(Math.max((tarX - tarCurrX) / 40, -7), 7),
                  0.1
                )
              );
            }
            requestAnimationFrame(initMouseMove);
          }
          requestAnimationFrame(initMouseMove);
        }
      }
      ScrollTrigger.create({
        trigger: ".home-service",
        start: "top bottom",
        end: "bottom top",
        toggleClass: { targets: ".home-service-thumb", className: "active" },
      });
      ScrollTrigger.create({
        trigger: ".home-service",
        start: "top bottom",
        once: true,
        onEnter: () => {
          homeServicePreamble();
          requestAnimationFrame(() => {
            homeServiceMain();
          });
        },
      });
    }
    homeService();

    /** (💡)  - PROCESS */
    function homeProcess() {
      ScrollTrigger.create({
        trigger: ".home-process",
        start: "top bottom",
        once: true,
        onEnter: () => {
          let titleTxt = new SplitText(".home-process-title", typeOpts.chars);
          let descTxt = new SplitText(".home-process-desc", typeOpts.words);

          let tlSplitHead = gsap.timeline({
            scrollTrigger: {
              trigger: ".home-process",
              start: "top top+=80%",
              // endTrigger: '.home-skill-title',
              end: "bottom top+=40%",
              // markers: true,
              // scrub: true
            },
            onComplete: () => {
              titleTxt.revert();
              descTxt.revert();
            },
          });

          tlSplitHead.from(
            titleTxt.chars,
            {
              yPercent: 60,
              autoAlpha: 0,
              stagger: 0.035,
              duration: 0.8,
              ease: "power2.out",
            },
            0
          );
          if ($(window).width() > 767) {
            tlSplitHead.from(
              ".home-process-btn",
              { yPercent: 50, autoAlpha: 0, duration: 0.8, ease: "power2.out" },
              "<=.8"
            );
            tlSplitHead.from(
              descTxt.words,
              {
                yPercent: 60,
                autoAlpha: 0,
                stagger: 0.025,
                duration: 0.8,
                ease: "power2.out",
              },
              "<=.2"
            );
          }

          if ($(window).width() <= 767) {
            tlSplitHead.from(
              descTxt.words,
              {
                yPercent: 60,
                autoAlpha: 0,
                stagger: 0.025,
                duration: 0.8,
                ease: "power2.out",
              },
              "<=.5"
            );

            gsap.from(".home-process-btn", {
              scrollTrigger: {
                trigger: ".home-process-btn",
                start: "top top+=80%",
              },
              yPercent: 50,
              autoAlpha: 0,
              duration: 0.8,
              ease: "power2.out",
            });
          }

          $(".home-process-step").each((idx, el) => {
            let clone = $(el).find(".img");
            for (let i = 1; i <= 5; i++) {
              let cloner = clone.clone();
              cloner.addClass("cloner");
              $(el).find(".home-process-step-img").append(cloner);
            }

            let tl = gsap.timeline({
              scrollTrigger: {
                trigger: el,
                start: "top top+=60%",
                end: "bottom top+=70%",
                scrub: 0.3,
              },
            });
            if (idx % 2 == 0) {
              tl.from(
                $(el).find(".home-process-step-background"),
                {
                  scale: 0,
                  borderRadius: "8rem",
                  ease: "sine.out",
                  duration: 4,
                },
                0
              )
                .from(
                  $(el).find(".home-process-step-img"),
                  {
                    autoAlpha: 0,
                    scale: 0.8,
                    yPercent: 20,
                    ease: "sine.inOut",
                    duration: 1,
                  },
                  2
                )
                .from(
                  $(el).find(".home-process-step-label"),
                  { autoAlpha: 0, ease: "sine.in", duration: 1 },
                  "<=.2"
                )
                .from(
                  $(el).find(".home-process-step-title"),
                  { autoAlpha: 0, ease: "sine.in", duration: 1 },
                  "<=.4"
                )
                .from(
                  $(el).find(".home-process-step-desc"),
                  { autoAlpha: 0, ease: "sine.in", duration: 1 },
                  "<=.4"
                );
            } else {
              tl.from(
                $(el).find(".home-process-step-background"),
                {
                  scale: 0,
                  borderRadius: "8rem",
                  ease: "sine.out",
                  duration: 4,
                },
                0
              )
                .from(
                  $(el).find(".home-process-step-img"),
                  {
                    autoAlpha: 0,
                    scale: 0.8,
                    yPercent: 20,
                    ease: "sine.inOut",
                    duration: 1,
                  },
                  2
                )
                .from(
                  $(el).find(".home-process-step-label"),
                  { autoAlpha: 0, ease: "sine.in", duration: 1 },
                  "<=1.2"
                )
                .from(
                  $(el).find(".home-process-step-title"),
                  { autoAlpha: 0, ease: "sine.in", duration: 1 },
                  "<=.2"
                )
                .from(
                  $(el).find(".home-process-step-desc"),
                  { autoAlpha: 0, ease: "sine.in", duration: 1 },
                  "<=.2"
                );
            }
          });
        },
      });
    }
    // homeProcess()

    /** (💡)  - PORTFOLIO */
    function homePortfolio() {
      function scrollAnimationGrid() {
        const gridItems = $(".home-portfolio-project-item");
        gridItems.each((idx, item) => {
          const yPercentRandomVal = gsap.utils.random(0, 60);
          let tl = gsap.timeline({
            scrollTrigger: {
              trigger: item,
              start: "top bottom",
              end: "top top-=25%",
              scrub: gsap.utils.random(0.3, 1.4),
            },
          });
          requestAnimationFrame(() => {
            tl.set(item, {
              transformOrigin: `50% 200%`,
            }).fromTo(
              item,
              {
                scale: 1,
                yPercent: yPercentRandomVal,
              },
              {
                ease: "none",
                scale: 0.5,
                yPercent: 0,
                borderRadius: "50%",
              }
            );
          });
        });
      }
      //scrollAnimationGrid();

      function changeTxtScrollAnim() {
        $(".home-portfolio-content-title .h0").each((idx, el) => {
          let tlChangeTxtScrollAnim = gsap.timeline({
            scrollTrigger: {
              trigger: ".home-portfolio-project",
              start: `${
                ((idx + 0) * $(".home-portfolio-project").height()) /
                $(".home-portfolio-content-title .h0").length
              } top`,
              end: `${
                ((idx + 1) * $(".home-portfolio-project").height()) /
                $(".home-portfolio-content-title .h0").length
              } top`,
              onUpdate: () => {
                $(".home-portfolio-content-title .h0").removeClass("active");
                $(el).addClass("active");
              },
            },
          });
        });
      }
      //changeTxtScrollAnim()

      function parallaxTitle() {
        let tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".home-portfolio-content",
            start: "top+=55% top+=50%",
            end: "top+=55% top+=15%",
            markers: true,
            scrub: 1.1,
          },
        });
        tl.to(".home-portfolio-content-intro", {
          y: 150,
          ease: "linear",
          duration: 1,
        });
      }
      // parallaxTitle();

      function hoverProject() {
        if ($(window).width() <= 991) {
          changeProjHtml();
        }

        const line = document.createElement("div");
        $(line).addClass("line");
        $(".home-project-item:last-child").append(line);

        const target = $(".home-project-thumb");
        ScrollTrigger.create({
          trigger: ".home-project",
          start: "top bottom",
          end: "bottom top",
          toggleClass: { targets: target, className: "active" },
        });

        function projectClippath(index, action) {
          let t =
            (index / $(".home-project-wrap-bot .home-project-item").length) *
            100;
          let b =
            ((index + 1) /
              $(".home-project-wrap-bot .home-project-item").length) *
            100;
          gsap.set(".home-project-wrap-top", {
            clipPath: `polygon(0% ${t}%, 100% ${t}%, 100% ${b}%, 0% ${b}%)`,
          });
        }

        const targetMove = $(".home-project-wrap-top");
        gsap.set(targetMove, { clipPath: `polygon(0 0, 100% 0, 100% 0, 0 0)` });

        if ($(window).width() > 991) {
          $(".home-project-item").on("pointerleave", function (e) {
            $(".home-project-thumb")
              .find(`[data-thumb-name]`)
              .removeClass("active");
          });

          $(".home-project-item").on("pointerenter", function (e) {
            let nameSpace = $(this)
              .find("[data-project-name]")
              .attr("data-project-name");

            $(".home-project-thumb")
              .find(`[data-thumb-name]`)
              .removeClass("active");
            $(".home-project-thumb")
              .find(`[data-thumb-name="${nameSpace}"]`)
              .addClass("active");
          });

          $(".home-project-wrap-bot .home-project-item").on(
            "pointerenter",
            function (e) {
              let index = $(this).index();
              projectClippath(index);
            }
          );
          $(".home-project-wrap-bot .home-project-item").on(
            "pointerleave",
            function (e) {
              if (
                !$(".home-project-wrap-bot:hover").length &&
                !$(".home-project-wrap-top:hover").length
              ) {
                if ($(this).is(":first-child")) {
                  let index = -1;
                  let t =
                    (index /
                      $(".home-project-wrap-bot .home-project-item").length) *
                    100;
                  let b =
                    ((index + 1) /
                      $(".home-project-wrap-bot .home-project-item").length) *
                    100;
                  gsap.set(".home-project-wrap-top", {
                    clipPath: `polygon(0% ${t}%, 100% ${t}%, 100% ${b}%, 0% ${b}%)`,
                  });
                }
                if ($(this).is(":last-child")) {
                  let index = $(
                    ".home-project-wrap-bot .home-project-item"
                  ).length;
                  let t =
                    (index /
                      $(".home-project-wrap-bot .home-project-item").length) *
                    100;
                  let b =
                    ((index + 1) /
                      $(".home-project-wrap-bot .home-project-item").length) *
                    100;
                  gsap.set(".home-project-wrap-top", {
                    clipPath: `polygon(0% ${t}%, 100% ${t}%, 100% ${b}%, 0% ${b}%)`,
                  });
                }
              }
            }
          );
          initMouseMove();
        } else {
          $(".home-project-wrap-bot .home-project-item").each((idx, el) => {
            ScrollTrigger.create({
              trigger: el,
              start: "top center-=5%",
              end: "bottom center-=5%",
              // markers: true,
              onLeave: () => {
                if (
                  idx ==
                  $(".home-project-wrap-bot .home-project-item").length - 1
                ) {
                  $(".home-project-thumb")
                    .find(`[data-thumb-name]`)
                    .removeClass("active");
                  let index = $(
                    ".home-project-wrap-bot .home-project-item"
                  ).length;
                  let t =
                    (index /
                      $(".home-project-wrap-bot .home-project-item").length) *
                    100;
                  let b =
                    ((index + 1) /
                      $(".home-project-wrap-bot .home-project-item").length) *
                    100;
                  gsap.set(".home-project-wrap-top", {
                    clipPath: `polygon(0% ${t}%, 100% ${t}%, 100% ${b}%, 0% ${b}%)`,
                  });
                }
              },
              onLeaveBack: () => {
                if (idx == 0) {
                  $(".home-project-thumb")
                    .find(`[data-thumb-name]`)
                    .removeClass("active");
                  let index = -1;
                  let t =
                    (index /
                      $(".home-project-wrap-bot .home-project-item").length) *
                    100;
                  let b =
                    ((index + 1) /
                      $(".home-project-wrap-bot .home-project-item").length) *
                    100;
                  gsap.set(".home-project-wrap-top", {
                    clipPath: `polygon(0% ${t}%, 100% ${t}%, 100% ${b}%, 0% ${b}%)`,
                  });
                }
              },
              onUpdate: () => {
                let nameSpace = $(el)
                  .find("[data-project-name]")
                  .attr("data-project-name");
                $(".home-project-thumb")
                  .find(`[data-thumb-name]`)
                  .removeClass("active");
                $(".home-project-thumb")
                  .find(`[data-thumb-name="${nameSpace}"]`)
                  .addClass("active");

                let index = $(el).index();
                projectClippath(index);
                initClickThumb(index);
              },
            });
          });
          $(".home-project-wrap-bot .home-project-item").on(
            "click",
            function (e) {
              let nameSpace = $(this)
                .find("[data-project-name]")
                .attr("data-project-name");

              $(".home-project-thumb")
                .find(`[data-thumb-name]`)
                .removeClass("active");
              $(".home-project-thumb")
                .find(`[data-thumb-name="${nameSpace}"]`)
                .addClass("active");

              let index = $(this).index();
              projectClippath(index);
              initClickThumb(index);
            }
          );
        }

        function initMouseMove() {
          let offsetL = parseFloat(target.css("left"));
          if (target.hasClass("active")) {
            let tarCurrX = xGetter(target.get(0));
            let tarCurrY = yGetter(target.get(0));
            let tarCurrRot = rotZGetter(target.get(0));

            let tarX =
              (pointerCurr().x / $(".home-project").outerWidth()) *
              ($(".home-project-item-view").get(0).getBoundingClientRect()
                .left -
                offsetL -
                target.width());
            let tarY =
              -target.height() / 4 +
              ((pointerCurr().y -
                $(".home-project").get(0).getBoundingClientRect().top) /
                $(".home-project").height()) *
                ($(".home-project").height() - target.height() / 2);

            xSetter(target.get(0))(lerp(tarCurrX, tarX, 0.05));
            ySetter(target.get(0))(lerp(tarCurrY, tarY, 0.05));
            rotZSetter(target.get(0))(
              lerp(
                tarCurrRot,
                Math.min(Math.max((tarX - tarCurrX) / 100, -4), 4),
                0.08
              )
            );
          }
          requestAnimationFrame(initMouseMove);
        }

        function initClickThumb(idx) {
          gsap.to(target, {
            y:
              cvUnit(viewportBreak({ tablet: 80, mobile: 100 }), "rem") +
              ($(".home-project-item").eq(0).outerHeight() -
                target.outerHeight()) /
                2 +
              idx * $(".home-project-item").eq(0).outerHeight(),
            overwrite: true,
          });
        }

        function changeProjHtml() {
          $(".home-project-item").each((idx, el) => {
            let targetItem = $(el);
            let linkItem = $(el).find(".home-project-item-view");

            let changeLink = $("<a>", {
              html: linkItem.html(),
              href: targetItem.attr("href"),
              target: "_blank",
              class: linkItem.attr("class"),
            });
            linkItem.replaceWith(changeLink);

            let changeTarget = $("<div>", {
              html: targetItem.html(),
              class: targetItem.attr("class"),
            });
            targetItem.replaceWith(changeTarget);
          });
        }
      }
      hoverProject();

      function projectCurtain() {
        let amount = 11;
        let offset = $(".home-curtain").height() / (amount - 1);

        const clone = $(".home-curtain-inner").eq(0);
        for (let i = 1; i < amount; i++) {
          let cloner = clone.clone();
          $(".home-curtain").append(cloner);
        }
        let tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".home-curtain",
            start: `top-=${
              $(window).width > 991 ? "-40%" : $(window).height()
            } bottom`,
            end: "top top-=70%",
            scrub: true,
            // markers: true
          },
          defaults: {
            ease: "none",
          },
        });

        tl.to(
          ".home-curtain-inner",
          {
            scaleY: 1,
            stagger: -0.1,
            duration: 1,
            y: -offset,
          },
          0
        );
      }
      projectCurtain();
    }
    homePortfolio();

    /** (💡)  - TESTIMONIAL */
    function homeTesti() {
      if ($(window).width() > 767) {
        $(".home-testi").css(
          "height",
          +$(window).height() +
            $(".home-testi-content-item").eq(0).height() *
              1.5 *
              $(".home-testi-content-item").length +
            "px"
        );
        let tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".home-testi",
            start: `top top`,
            end: "bottom bottom",
            scrub: 0.1,
            onUpdate: (timeline) => {
              gsap.set(".home-testi-content-progress-inner", {
                y: timeline.progress * cvUnit(180, "rem"),
              });
            },
          },
        });
        tl.fromTo(
          ".home-testi-text-wrap",
          {
            y: cvUnit(-100, "rem"),
          },
          {
            y: cvUnit(-90, "rem"),
            ease: "none",
          }
        );

        let tlScrub = gsap.timeline({
          scrollTrigger: {
            trigger: ".home-testi",
            start: `top+=${$(window).height()} bottom`,
            end: `bottom-=${$(window).height()} top`,
            scrub: 0.2,
            snap: {
              // To update exact position and check directional
              snapTo(value) {
                const dataLength = $(".home-testi-content-item").length;
                if (value > 0 && value <= 0.1) {
                  return 0;
                } else if (value > 0.1 && value <= 0.433) {
                  return 0.33;
                } else if (value > 0.433 && value <= 0.766) {
                  return 0.66;
                } else if (value > 0.766 && value <= 1) {
                  return 1;
                } else {
                  return value;
                }
              },
              duration: { min: 0.15, max: 1 },
              delay: 0.01,
            },
            // markers: true,
            // onUpdate: (timeline) => {
            //     console.log(timeline.progress);
            // }
          },
        });

        let timeDelay = 0;
        let timeAnim = 1;
        let zUnit = $(window).width() > 991 ? 600 : 1200;
        let yUnit = $(window).width() > 991 ? 90 : 100;

        const setUnit = (number, brightness) => {
          return `z: ${cvUnit(-zUnit * number, "rem")}, y: ${cvUnit(
            -yUnit * number,
            "rem"
          )}, filter: "brightness(${brightness})"`;
        };

        $(".home-testi-content-item").each((idx, el) => {
          // if (idx == 0) {
          //     tlScrub
          //         .fromTo($(el), { z: cvUnit(zUnit * 2, 'rem'), yPercent: 75, filter: "brightness(1)" }, { z: 0, yPercent: 0, filter: "brightness(1)", ease: 'power1.out', duration: timeAnim * 2 }, 0)
          // }
          if (idx > 0 && idx < $(".home-testi-content-item").length) {
            tlScrub
              .fromTo(
                $(el),
                {
                  z: cvUnit(zUnit, "rem"),
                  yPercent: 200,
                  filter: "brightness(1)",
                },
                {
                  z: 0,
                  yPercent: 0,
                  filter: "brightness(1)",
                  ease: "power3.out",
                  duration: timeAnim,
                },
                `>=${timeDelay}`
              )
              .fromTo(
                $(el).prev(),
                { z: 0, y: 0, filter: "brightness(1)" },
                {
                  z: cvUnit(-zUnit, "rem"),
                  y: cvUnit(-yUnit, "rem"),
                  filter: "brightness(.67)",
                  ease: "power2.out",
                  duration: timeAnim,
                },
                "<=0"
              );
            if (idx > 1) {
              tlScrub.fromTo(
                $(el).prev().prev(),
                {
                  z: cvUnit(-zUnit, "rem"),
                  y: cvUnit(-yUnit, "rem"),
                  filter: "brightness(.67)",
                },
                {
                  z: cvUnit(-zUnit * 2, "rem"),
                  y: cvUnit(-yUnit * 2, "rem"),
                  filter: "brightness(.33)",
                  ease: "power2.out",
                  duration: timeAnim,
                },
                "<=0"
              );
            }
            if (idx > 2) {
              tlScrub.fromTo(
                $(el).prev().prev().prev(),
                {
                  z: cvUnit(-zUnit * 2, "rem"),
                  y: cvUnit(-yUnit * 2, "rem"),
                  filter: "brightness(.33)",
                },
                {
                  z: cvUnit(-zUnit * 3, "rem"),
                  y: cvUnit(-yUnit * 3, "rem"),
                  filter: "brightness(0)",
                  ease: "power2.out",
                  duration: timeAnim,
                },
                "<=0"
              );
            }
          }
          // if (idx == ($('.home-testi-content-item').length - 1)) {
          //     tlScrub
          //         .fromTo($(el), { z: 0, y: 0, filter: "brightness(1)" }, { z: cvUnit(-zUnit, 'rem'), y: cvUnit(-yUnit, 'rem'), filter: "brightness(.67)", ease: 'power3.out', duration: timeAnim }, `>=${timeDelay}`)
          //         .fromTo($(el).prev(), { z: cvUnit(-zUnit, 'rem'), y: cvUnit(-yUnit, 'rem'), filter: "brightness(.67)" }, { z: cvUnit(-zUnit * 2, 'rem'), y: cvUnit(-yUnit * 2, 'rem'), filter: "brightness(.33)", ease: 'power3.out', duration: timeAnim }, "<=0")
          //         .fromTo($(el).prev().prev(), { z: cvUnit(-zUnit * 2, 'rem'), y: cvUnit(-yUnit * 2, 'rem'), filter: "brightness(.33)" }, { z: cvUnit(-zUnit * 3, 'rem'), y: cvUnit(-yUnit * 3, 'rem'), filter: "brightness(0)", ease: 'power3.out', duration: timeAnim }, "<=0")
          // }
        });
        gsap.set(".home-testi-content-item", {
          z: 0,
          y: 0,
          filter: "brightness(1)",
        });
      } else {
        let parent = $(".home-testi-content");
        parent.find('[data-swiper="swiper"]').addClass("swiper");
        parent
          .find('[data-swiper="swiper-wrapper"]')
          .addClass("swiper-wrapper");
        parent.find('[data-swiper="swiper-slide"]').addClass("swiper-slide");

        new Swiper(".home-testi-content-wrap", {
          spaceBetween: cvUnit(20, "rem"),
          slidesPerView: 1,
          scrollbar: {
            el: ".home-testi-content-progress",
          },
        });
      }
    }
    homeTesti();

    /** (💡)  - PRICING */
    function homePricing() {
      ScrollTrigger.create({
        trigger: ".home-pricing",
        start: "top bottom",
        once: true,
        onEnter: () => {
          let titleTxt = new SplitText(
            ".home-pricing-text-title",
            typeOpts.words
          );
          let subArray = [];

          let tlSplitHead = gsap.timeline({
            scrollTrigger: {
              trigger: ".home-pricing",
              start: "top top+=40%",
            },
            onComplete: () => {
              titleTxt.revert();
              $(subArray).each((idx, el) => el.revert());
            },
          });
          tlSplitHead
            .from(
              titleTxt.words,
              {
                yPercent: 60,
                autoAlpha: 0,
                stagger: 0.02,
                duration: 0.6,
                ease: "power2.out",
              },
              0.3
            )
            .from(
              ".home-pricing-plan-switch",
              {
                yPercent: 60,
                autoAlpha: 0,
                duration: 0.8,
                ease: "power2.out",
                clearProps: "all",
              },
              "<=.2"
            );

          $(".home-pricing-text-sub-item").each((idx, el) => {
            let subTxt = new SplitText(
              $(el).find(".home-pricing-text-sub-item-txt"),
              typeOpts.words
            );

            tlSplitHead
              .from(
                $(el).find(".dot"),
                {
                  yPercent: 60,
                  autoAlpha: 0,
                  duration: 0.4,
                  ease: "power2.out",
                  clearProps: "all",
                },
                0.3 + idx * 0.1
              )
              .from(
                subTxt.words,
                {
                  yPercent: 60,
                  autoAlpha: 0,
                  stagger: 0.02,
                  duration: 0.6,
                  ease: "power2.out",
                },
                0.35 + idx * 0.1
              );

            subArray.push(subTxt);
          });
          let tlPricing = gsap.timeline({
            scrollTrigger: {
              trigger: ".home-pricing--wrap",
              start: "top top+=60%",
            },
          });

          tlPricing
            .from(
              ".home-pricing-plan-item.popular",
              {
                y: cvUnit(60, "rem"),
                autoAlpha: 0,
                duration: 0.8,
                ease: "power2.out",
                clearProps: "all",
              },
              "<=1"
            )
            .from(
              ".home-pricing-plan-item:not(.popular)",
              {
                y: cvUnit(60, "rem"),
                autoAlpha: 0,
                duration: 0.8,
                ease: "power2.out",
                clearProps: "all",
              },
              "<=.2"
            );

          let ctaHeadingTxt = new SplitText(
            ".home-pricing-plan-cta-heading",
            typeOpts.lines
          );

          let tlCTAHead = gsap.timeline({
            scrollTrigger: {
              trigger: ".home-pricing-plan-cta",
              start: "top top+=80%",
            },
            onComplete: () => {
              ctaHeadingTxt.revert();
            },
          });

          tlCTAHead
            .from(
              ctaHeadingTxt.lines,
              {
                yPercent: 60,
                autoAlpha: 0,
                stagger: 0.3,
                duration: 0.6,
                ease: "power2.out",
              },
              0
            )
            .from(
              ".home-pricing-plan-cta .btn",
              {
                yPercent: 60,
                autoAlpha: 0,
                stagger: 0.3,
                duration: 0.6,
                ease: "power2.out",
                clearProps: "all",
              },
              "<=.3"
            );
        },
      });

      function switchPlan() {
        const DOM = {
          btnPlan: $(
            ".home-pricing-plan-switch-wrap .home-pricing-plan-switch-btn"
          ),
          btnOverlay: $(".home-pricing-plan-switch-overlay"),
          periodic: $(".home-pricing-plan-item-price-periodic"),
          price: $(".home-pricing-plan-item-price-txt"),
          btnPurchase: $(".home-pricing-plan-item-btn > .btn-purchase"),
          priceOff: $(".home-pricing-plan-item-off"),
        };
        const data = [
          {
            name: "quarter-time",
            price_id: {
              monthly: "https://buy.stripe.com/test_eVabJk3j0fEG9fa7st",
              quarterly: "https://buy.stripe.com/test_7sIdRs8Dkakm9fa6oq",
            },
          },
          {
            name: "part-time",
            price_id: {
              monthly: "https://buy.stripe.com/test_8wM7t48DkfEG62Y5kn",
              quarterly: "https://buy.stripe.com/test_eVafZA1aSgIK9fa7sw",
            },
          },
          {
            name: "full-time",
            price_id: {
              monthly: "https://buy.stripe.com/test_cN2cNodXEeAC2QMfZ4",
              quarterly: "https://buy.stripe.com/test_5kAcNo06O8ceajedQV",
            },
          },
        ];

        function activePlan(index) {
          gsap.to(DOM.btnOverlay, {
            x: index * DOM.btnOverlay.width(),
          });
          let tl = gsap.timeline();
          tl.to(DOM.btnOverlay.eq(1), { autoAlpha: 0.5 })
            .to(DOM.btnOverlay.eq(0), { autoAlpha: 1 }, 0.2)
            .to(DOM.btnOverlay.eq(1), { autoAlpha: 1 }, 0.5)
            .to(DOM.btnOverlay.eq(0), { autoAlpha: 0 }, 0.5);

          DOM.price.each((i, item) => {
            let text = $(item).find("h3");
            text.removeClass("active");
            text.eq(index).addClass("active");
          });

          DOM.periodic.each((i, item) => {
            let text = $(item).find("p");
            text.removeClass("active");
            text.eq(index).addClass("active");
          });

          if (index > 0) {
            // DOM.priceOff.removeClass('active')
            DOM.priceOff.slideUp("fast");
          } else {
            // DOM.priceOff.addClass('active')
            DOM.priceOff.slideDown("fast");
          }

          let currPlan = DOM.btnPlan.eq(index).text();
          let subsType = index === 0 ? "quarterly" : "monthly";
          DOM.btnPurchase.each((i, item) => {
            if ($(item).attr("data-purchase-method") === "subscription") {
              let priceId = $(item).attr("data-price");
              let dataSrc = data.filter((el) => el.name === priceId);
              $(item).attr("href", dataSrc[0].price_id[subsType]);
            } else return;
          });
        }

        activePlan(0);
        DOM.btnPlan.on("click", function (e) {
          let index = $(this).index();
          e.preventDefault();
          activePlan(index);
        });
      }
      switchPlan();

      // function testPayment() {
      //     $('.btn-purchase').on('click', function (e) {
      //         e.preventDefault()
      //         let planId = $(this).attr('data-purchase-id')
      //         fetch('http://localhost:4000/create-checkout-session', {
      //             method: 'POST',
      //             headers: {
      //                 'Content-Type': 'application/json'
      //             },
      //             body: JSON.stringify({
      //                 items: [
      //                     { id: planId }
      //                 ]
      //             })
      //         }).then(res => {
      //             if (res.ok) return res.json()
      //             return res.json().then(json => Promise.reject(json))
      //         }).then(({ url }) => {
      //             window.location = url
      //         }).catch(e => {
      //             console.error(e.message)
      //         })
      //     })
      // }
      // testPayment()
    }
    requestAnimationFrame(() => {
      homePricing();
    });

    /** (💡)  - INDUSTRIES */
    function homeExplore() {
      ScrollTrigger.create({
        trigger: ".home-explore",
        start: "top bottom",
        once: true,
        onEnter: () => {
          let headTxt = new SplitText(
            ".home-explore-heading h3",
            typeOpts.chars
          );

          let tlSplitHead = gsap.timeline({
            scrollTrigger: {
              trigger: ".home-explore-heading",
              start: "top top+=90%",
              end: "bottom top+=40%",
              scrub: 0.1,
            },
          });
          tlSplitHead.from(
            headTxt.chars,
            {
              color: "#121212",
              stagger: 0.05,
              duration: 0.6,
              ease: "power1.out",
            },
            0
          );

          let titleTxt = new SplitText(
            ".home-explore-industries-title",
            typeOpts.words
          );

          let tlSplitTitle = gsap.timeline({
            scrollTrigger: {
              trigger: ".home-explore-industries-title",
              start: "top top+=95%",
            },
          });

          tlSplitTitle.from(
            titleTxt.words,
            {
              yPercent: 60,
              autoAlpha: 0,
              stagger: 0.02,
              duration: 0.6,
              ease: "power2.out",
            },
            0
          );

          if ($(window).width() > 991) {
            function parallaxLogo() {
              let target = $(".home-explore-img img");
              let tarCurrX = xGetter(target.get(0));
              let tarCurrY = yGetter(target.get(0));
              let moveX =
                (pointerCurr().x / $(window).width() - 0.5) *
                2 *
                (target.width() / 4);
              let moveY =
                (pointerCurr().y / $(window).height() - 0.5) *
                2 *
                (target.height() / 8);
              xSetter(target.get(0))(lerp(tarCurrX, moveX, 0.01));
              ySetter(target.get(0))(lerp(tarCurrY, moveY, 0.01));

              requestAnimationFrame(parallaxLogo);
            }
            requestAnimationFrame(parallaxLogo);
          } else {
            gsap.fromTo(
              ".home-explore-img img",
              {
                yPercent: viewportBreak({ tablet: 20, mobile: 40 }),
              },
              {
                scrollTrigger: {
                  trigger: ".home-explore-heading",
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.2,
                },
                yPercent: -50,
                ease: "none",
              }
            );
          }

          const DOM = {
            radarScan: $(".home-explore-industries-radar-scan"),
            lineItem: $(".home-explore-industries-radar-wrapper-item-line"),
            dot: $(".home-explore-industries-radar-wrapper-item-line-dot-wrap"),
          };
          gsap.set(DOM.radarScan, { rotate: -10 });
          let lifeCycleTime = 8;

          let tl = gsap.timeline({
            repeat: -1,
            defaults: {
              ease: "none",
            },
          });

          tl.fromTo(
            DOM.radarScan,
            {
              rotate: 0 - 10,
            },
            {
              rotate: 270 - 10,
              duration: lifeCycleTime,
              ease: "none",
            },
            0
          );
          DOM.lineItem.each((idx, el) => {
            tl.to(
              $(el).find(DOM.dot),
              {
                onStart: () => {
                  $(el).find(DOM.dot).addClass("active");
                },
              },
              `${
                0.1254480287 * lifeCycleTime +
                0.1111111111 * idx * lifeCycleTime
              }`
            ).to(
              $(el).find(DOM.dot),
              {
                onStart: () => {
                  $(el).find(DOM.dot).removeClass("active");
                },
              },
              "<=2"
            );
          });

          $(".home-explore-industries-radar-wrapper-item-line-dot-wrap").on(
            "pointerenter",
            function (e) {
              $(this).addClass("on-hover");
            }
          );
          $(".home-explore-industries-radar-wrapper-item-line-dot-wrap").on(
            "pointerleave",
            function (e) {
              $(this).removeClass("on-hover");
            }
          );
        },
      });
    }
    //homeExplore()

    /** (💡)  - FAQ */
    function homeFaq() {
      initAccordion(".home-faq-content-listing");
    }
    homeFaq();

    // popup
    const initPopup = (name) => {
      let popupWrap = $(`[data-popup-${name}='wrap']`);
      const required = (message) => ({ message, required: true });
      const regexp = (pattern, message) => ({ regexp: pattern, message });

      const REGEXP = {
        email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
      };
      const popupAction = {
        open: () => {
          popupWrap.addClass("active");
          requestAnimationFrame(() => $(".header-bar").addClass("force"));
          lenis.stop();
        },
        close: () => {
          if (!popupWrap.hasClass("active")) return;
          setTimeout(() => {
            popupWrap.removeClass("active");
            $(".header-bar").removeClass("force");
          }, 100);
          lenis.start();
        },
      };
      $(`[data-popup-${name}]`).on("click", function (e) {
        if ($(this).attr(`data-popup-${name}`) === "open") {
          e.preventDefault();
          popupAction.open();
        } else if ($(this).attr(`data-popup-${name}`) === "close") {
          e.preventDefault();
          popupAction.close();
        } else return;
      });

      $(window).on("click", (e) => {
        if (!$(`[data-popup-${name}='open']:hover`).length) {
          if ($(`[data-popup-${name}="wrap"]`).hasClass("active")) return;
          popupAction.close();
        }
      });

      $(`[data-popup-${name}="wrap"] .popup-overlay`).on("click", function (e) {
        popupAction.close();
      });

      function accordion() {
        let Accordion = function (el, multiple) {
          this.el = el || {};
          this.multiple = multiple || false;

          // Variables privadas
          var links = this.el.find(".js-accordion-link");
          // Evento
          links.on(
            "click",
            { el: this.el, multiple: this.multiple },
            this.dropdown
          );
        };

        Accordion.prototype.dropdown = function (e) {
          var $el = e.data.el,
            $this = $(this),
            $next = $this.next();

          $next.slideToggle();
          $this.parent().toggleClass("is-open");

          if (!e.data.multiple) {
            $el
              .find(".js-accordion-submenu")
              .not($next)
              .slideUp()
              .parent()
              .removeClass("is-open");
            $el.find(".js-accordion-submenu").not($next).slideUp();
          }
        };
        let accordion = new Accordion($("#accordion"), false);

        let accordionLabel = $(
          ".popup-contact-inner-content-sidebar-form-accordion-label"
        );
        const topicInput = $("#topic");
        if (topicInput.val()) {
          accordionLabel.html(`${topicInput.val()}`);
        } else {
          accordionLabel.html("Topic");
        }

        $(".accordion__submenu-item").on("click", function (e) {
          const submenuLabel = e.target.parentNode.querySelector(
            ".accordion__submenu-label"
          ).innerHTML;
          if (topicInput.val() === submenuLabel) {
            topicInput.attr("value", "");
            accordionLabel.html("Topic");
            accordionLabel.css("color", "")
          } else {
            topicInput.attr("value", `${submenuLabel}`);
            accordionLabel.html(`${submenuLabel}`);
            accordionLabel.css("color", "#010101")
          }
          $(".accordion__submenu-item").not($(this)).removeClass("active");
          $(this).toggleClass("active");
        });
      }
      accordion();

      const mapFormToObject = (form, originFormData) => {
        /** -NOTE-
         * read it: https://stackoverflow.com/questions/12077859/difference-between-this-and-event-target
         * form: this property will be
         *          [e.target]: when the form have event
         *       or [$(formID).get(0)]: when the form don't have event
         */

        let formData = originFormData || new FormData(form);

        const parsedFormData = [...formData.entries()].reduce((prev, cur) => {
          const name = cur[0];
          const val = cur[1];
          let dataName;

          for (let field of form) {
            let fieldDataName = field.dataset.name;
            let fieldName = field.name;
            if (name === fieldName) dataName = fieldDataName;
          }

          return {
            ...prev,
            [name]: {
              value: val,
              name: dataName,
              validType: [],
            },
          };
        }, {});
        return parsedFormData;
      };

      const mapObjectFormToValidate = (form, obj) => {
        const parsedFormData = [...Object.entries(obj)].reduce((prev, cur) => {
          const name = cur[0];
          const val = cur[1];
          let validArr = val.validType;

          for (let field of form) {
            let fieldName = field.name;
            let fieldType = field.type;
            let fieldRequired = field.required || false;
            let REGEXP_TYPE = ["email"];
            if (name === fieldName) {
              if (fieldRequired) {
                let CusMessage = field.getAttribute("mess-required");
                validArr.unshift(required(CusMessage));
              }
              if (REGEXP_TYPE.includes(fieldType)) {
                let CusMessage = field.getAttribute("mess-regexp");
                let CusRegexp = field.getAttribute("cus-regexp");
                validArr.unshift(regexp(CusRegexp || fieldType, CusMessage));
              }
            }
            continue;
          }
          return {
            ...prev,
            [name]: val,
          };
        }, {});
        return parsedFormData;
      };

      const validateForm = ({ formsObj: forms, rules }) => {
        const errors = {};
        for (let name in rules) {
            for (let rule of rules[name].validType) {
                if (rule.required && forms[name]) {
                    if (!forms[name].value.trim() || forms[name].value.trim() == "false") {
                        errors[name] = rule.message || ERROR_MESSAGE.required(forms[name].name);
                    }
                }
                if (rule.regexp && forms[name]) {
                    let regexp = rule.regexp;
                    if (regexp in REGEXP) {
                        regexp = new RegExp(REGEXP[regexp]);
                    }
                    else if (!(regexp instanceof RegExp)) {
                        regexp = new RegExp()
                    }
                    if (!regexp.test(forms[name].value.trim())) {
                        errors[name] = rule.message || ERROR_MESSAGE.regexp;
                    }
                }
            }
        }
        return {
            errors,
            isValidated: Object.keys(errors).length === 0
        };
    }

      const submitForm = ({ formsObj, rules }) => {
        let validateInfo = { status: false, resultForm: {} };

        const { errors, isValidated } = validateForm({ formsObj, rules });
        if (isValidated) {
            validateInfo.status = true;
            Object.entries(rules).forEach(([key, { value }]) => {
                validateInfo.resultForm[key.toLowerCase()] = value;
            });
            return { validateInfo };
        }
        else {
            validateInfo.status = false;
            return { errors, validateInfo };
        }
    }

      const errorValidation = {
        singleActive: (input, error) => {
            let errorEl = $(input).find('.input-field-error');
            if (error) {
                $(errorEl).html(error);
                $(errorEl).slideDown('fast');
            }
            else {
                $(errorEl).slideUp('fast', () => $(errorEl).html(''));
            }
        },
        active: (form, errors) => {
            Array.from(form.querySelectorAll('.input-field-group input')).forEach(node => {
                let errorEl = node.parentElement.querySelector('.input-field-error');
                if (errors.hasOwnProperty(node.getAttribute('name'))) {
                    errorEl.innerHTML = errors[node.getAttribute('name')];
                    $(errorEl).slideDown('fast');
                }
                else {
                    $(errorEl).slideUp('fast', () => errorEl.innerHTML = '');
                }
            });
        },
        reset: (form) => {
            Array.from(form.querySelectorAll('.input-field-group input')).forEach(node => {
                let errorEl = node.parentElement.querySelector('.input-field-error');
                $(errorEl).slideUp('fast', () => errorEl.innerHTML = '');
            });
        }
    }

      const validateInput = ({
        targetInputObject: input,
        targetInputRule: rules,
      }) => {
        let errors;
        const isEmpty = (value) =>
          value == null ||
          (typeof value === "string" && value.trim().length === 0);
        for (let rule of rules.validType) {
          if (rule.required) {
            if (!input.value.trim() || input.value.trim() == "false") {
              errors = rule.message || ERROR_MESSAGE.required(input.name);
            }
          }
          if (rule.regexp) {
            let regexp = rule.regexp;
            if (regexp in REGEXP) {
              regexp = new RegExp(REGEXP[regexp]);
            } else if (!(regexp instanceof RegExp)) {
              regexp = new RegExp();
            }
            if (!regexp.test(input.value.trim())) {
              errors = rule.message || ERROR_MESSAGE.regexp;
            }
          }
        }
        return errors;
      };

      const validateOnInput = ({ targetInputObject, targetInputRule }) => {
        let validateInfo = { status: false, resultForm: {} };
        const error = validateInput({ targetInputObject, targetInputRule });

        return error;
      };

      const formHandler = (formID, options = {}) => {
        const formTarget = $(formID).get(0);
        let formsObj = mapFormToObject(formTarget);
        let rules = mapObjectFormToValidate(formTarget, formsObj);

        const validateThisInput = (e) => {
          let targetInputObject = {
            ...formsObj[$(e.target).attr("name")],
            value: $(e.target).val(),
          };
          let targetInputRule = { ...rules[$(e.target).attr("name")] };
          const error = validateOnInput({ targetInputObject, targetInputRule });
          errorValidation.singleActive(
            $(e.target).closest(".input-field-group"),
            error
          );
        };

        $(`${formID} .input-field-group input`).bind(
          "input",
          debounce(validateThisInput)
        );

        $(`${formID} [data-form-btn="submit"]`).on("click", function (e) {
          const { onSuccess, onError } = options;
          formsObj = mapFormToObject(formTarget);
          rules = mapObjectFormToValidate(formTarget, formsObj);

          const { errors, validateInfo } = submitForm({ formsObj, rules });
          if (validateInfo.status) {
            onSuccess?.(validateInfo);
            $(this).closest("form").trigger("submit");
            errorValidation.reset($(formID).get(0));
          } else {
            e.preventDefault();
            onError?.(errors);
            errorValidation.active($(formID).get(0), errors);
          }
          return false;
        });
      };

      formHandler("#contact-form", {});

    };
    initPopup("contact");
  },
  beforeLeave() {
    console.log(`leave ${this.namespace}`);
  },
};
export default home;
