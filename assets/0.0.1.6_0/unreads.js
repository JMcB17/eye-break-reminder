$(function () {
    // Set starting slide to 1
    var startSlide = 1;
    // Get slide number if it exists
    if (window.location.hash) {
        startSlide = window.location.hash.replace('#', '');
    }
    // Initialize Slides
    $('#slides').slides({
        preload: true,
        preloadImage: 'img/loading.gif',
        generatePagination: true,
        play: 50000,
        pause: 5000,
        hoverPause: true,
        // Get the starting slide
        //start: startSlide,
        animationComplete: function (current) {
            // Set the slide number as a hash
            window.location.hash = '#' + current;
        }
    });
});
//analytics code
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-32931889-1']);
_gaq.push(['_trackPageview']);

(function () {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    //ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
$(document).ready(function () {
    assignUnloadEvent();
});
function assignUnloadEvent() {
    if (window.location.href.indexOf("?src=options") < 0) {
        $(window).on('beforeunload', function () {
            var bgPage = chrome.extension.getBackgroundPage();
            bgPage.sks_ece_resetTabId();
        });
    }
}
