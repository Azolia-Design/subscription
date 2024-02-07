import { debounce } from "../helper/index";
const refreshOnBreakpoint = () => {
    let initialViewportWidth = window.innerWidth || document.documentElement.clientWidth;
    let newViewportWidth;
    // portrait mobile viewport initial, any change refresh
    if (initialViewportWidth < 480) {
        $(window).on('resize', debounce(function() {
            newViewportWidth = window.innerWidth || document.documentElement.clientWidth;
            if (newViewportWidth > 479) {
                location.reload();
            }
        }))
    }
    // landscape mobile viewport initial, any change refresh
    else if (initialViewportWidth < 768) {
        $(window).on('resize', debounce(function() {
            newViewportWidth = window.innerWidth || document.documentElement.clientWidth;
            if (newViewportWidth > 767) {
                location.reload();
            }
        }))
    }
    // tablet viewport initial, any change refresh
    else if (initialViewportWidth > 767 && initialViewportWidth < 992)  {
        $(window).on('resize', debounce(function() {
            newViewportWidth = window.innerWidth || document.documentElement.clientWidth;
            if (newViewportWidth < 768 || newViewportWidth > 991) {
                location.reload();
            }
        }))
    }
    // web viewport initial, any change refresh
    else if (initialViewportWidth > 991) {
        $(window).on('resize', debounce(function() {
            newViewportWidth = window.innerWidth || document.documentElement.clientWidth;
            if (newViewportWidth < 992) {
                location.reload();
            }
        }))
    }
}
export default refreshOnBreakpoint;