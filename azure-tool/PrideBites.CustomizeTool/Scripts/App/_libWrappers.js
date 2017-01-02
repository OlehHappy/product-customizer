define("jquery", [], function () {
    /*JQuery Extensions*/
    jQuery.fn.fadeSlideRight = function (speed, fn) {
        return jQuery(this).animate({
            'opacity': 1,
            'width': 'toggle'
        }, speed || 400, function () {
            jQuery.isFunction(fn) && fn.call(this);
        });
    }

    jQuery.fn.fadeSlideLeft = function (speed, fn) {
        return jQuery(this).animate({
            'opacity': 0,
            'width': '0px'
        }, speed || 400, function () {
            jQuery.isFunction(fn) && fn.call(this);
        });
    }


    return jQuery;
});
define("ko", [], function () {
    return ko;
});
