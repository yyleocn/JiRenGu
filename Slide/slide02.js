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
    setTimeout(() => {
            next.addClass('current').removeClass(nextClass);
            current.addClass(prevClass).removeClass('current');
            current.one('transitionend', event_ => {
                jQuery(event_.target).removeClass('current next prev');
            });
        }, 1
    )
    ;
};

let slideNext = () => {
    let currentItem = slideImgArr.filter('.current');
    let currentIndex = slideImgArr.index(currentItem[0]);
    let nextIndex = currentIndex + 1;
    if (nextIndex >= slideImgArr.length ) {
        nextIndex = 0;
    }
    console.log(nextIndex);
    slideRun(slideImgArr.eq(nextIndex));
};

setInterval(
    slideNext, 2000
);