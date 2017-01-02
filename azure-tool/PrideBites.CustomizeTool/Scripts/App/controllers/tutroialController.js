define("tutorialController", ['jquery'], function ($) {
    // Set cookie name
    var cookieName = "PB.TUTORIALVID";

    // Check the cookie. If the tutorial has not been seen, update, and return the status
    function showVideo() {
        var tutorialStatus = checkCookie();
        if (tutorialStatus != 'seenRecently') {
            var date = new Date();
            var minutes = 15;
            date.setTime(date.getTime() + (minutes * 60 * 1000));
            $.cookie(cookieName, 'seenRecently', { path: '/', expires: date }); 
        }
        return tutorialStatus;
    }

    function checkCookie() {
        return $.cookie(cookieName);
    }

    return { showVideo: showVideo };
});