let slideImgArr = jQuery('img.slideItem');

let slideRun = (item_, reverse_) => {
    if (jQuery(item_).hasClass('current')) {
        return
    }
    let nextClass = 'next';
    let prevClass = 'prev';
    if (reverse_) {
        nextClass = 'prev';
        prevClass = 'next';
    }
    let next = jQuery(item_).addClass(nextClass);
    let current = slideImgArr.filter('.current');
    next.offset();
    next.addClass('current').removeClass(nextClass);
    current.addClass(prevClass).removeClass('current');
    current.one('transitionend', event_ => {
        jQuery(event_.target).removeClass('current next prev');
    });
};

let slideNext = (reverse_) => {
    let currentItem = slideImgArr.filter('.current');
    let currentIndex = slideImgArr.index(currentItem[0]);

    let nextIndex;
    if (reverse_) {
        nextIndex = currentIndex - 1;
        if (nextIndex < 0) {
            nextIndex = slideImgArr.length - 1;
        }
    } else {
        nextIndex = currentIndex + 1;
        if (nextIndex >= slideImgArr.length) {
            nextIndex = 0;
        }
    }
    slideRun(slideImgArr.eq(nextIndex));
};

let slideHandler = null;

let slideStart = () => {
    if (slideHandler) {
        return;
    }
    slideHandler = setInterval(
        slideNext, 2000
    );
};
let slideStop = () => {
    if (!slideHandler) {
        return;
    }
    clearInterval(slideHandler);
    slideHandler = null;
};

jQuery(document).on('webkitvisibilitychange', (event_) => {
    if (document.hidden) {
        slideStop();
    } else {
        slideStart();
    }
});

slideStart();