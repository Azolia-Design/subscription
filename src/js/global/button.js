import { lenis } from "./lenis";
import { cvUnit, isTouchDevice, viewportBreak } from "../helper/viewport";

const initButton = () => {
  $(".btn").each((_, el) => {
    let bgOverlay = $("<div></div>").addClass("btnoverlay");
    $(el).append(bgOverlay);
  });

  $("a.btn").each((_, item) => {
    let href = $(item).attr("href");
    if (href.startsWith("./")) {
      href = href.slice(2);
    }
    $(item).attr("href", `${origin}/${href}`);
  });

  $("a.btn").on("click", function (e) {
    const url = new URL($(this).attr("href"));
    if (url.pathname === window.location.pathname) {
      if (url.hash) {
        e.preventDefault();
        let target = url.hash.replace("#", "");
        if ($("html").hasClass("lenis-smooth")) {
          requestAnimationFrame(() => lenis.scrollTo(`[id="${target}"]`));
        } else {
          //update later
          let targetTop =
            $(`[id="${target}"]`).get(0).offsetTop + $(window).height();
          $("html").animate({
            scrollTop: targetTop,
          });
        }

        history.replaceState({}, "", `${window.location.pathname}${url.hash}`);
        return false;
      }
    }
  });

  if (window.location.hash) {
    let target = window.location.hash.replace("#", "");
    if ($("html").hasClass("lenis-smooth")) {
      requestAnimationFrame(() => lenis.scrollTo(`[id="${target}"]`));
    } else {
      //update later
      let targetTop =
        $(`[id="${target}"]`).get(0).offsetTop + $(window).height();
      $("html").animate({
        scrollTop: targetTop,
      });
    }
  }
};

export default initButton;
