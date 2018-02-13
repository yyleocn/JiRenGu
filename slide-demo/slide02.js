let slideInit = (container_) => {
    let $container = jQuery(container_);
    let $slideImgArr = $container.children('img.slideItem');
    let maxIndex = 0;
    let slideRunning = false;
    $slideImgArr.each((index_, item_) => {
        jQuery(item_).data('index', index_);
        maxIndex = index_;
    });
    let slideRun = (item_, reverse_) => {
        if (slideRunning) {
            return
        }
        if (jQuery(item_).hasClass('current')) {
            return
        }
        let nextClass = 'next';
        let prevClass = 'prev';
        if (reverse_) {
            nextClass = 'prev';
            prevClass = 'next';
        }
        let $next = jQuery(item_).addClass(nextClass);
        let $current = $slideImgArr.filter('.current');
        $next.offset();
        $next.addClass('current').removeClass(nextClass);
        $current.addClass(prevClass).removeClass('current');
        slideRunning=true;
        $current.one('transitionend', event_ => {
            jQuery(event_.target).removeClass('current next prev');
            slideRunning=false;
        });
    };

    let slideButtonClick = (reverse_) => {
        let $currentItem = $slideImgArr.filter('.current');
        let currentIndex = $currentItem.data('index');
        let nextIndex;
        if (reverse_) {
            nextIndex = currentIndex - 1;
            if (nextIndex < 0) {
                nextIndex = maxIndex;
            }
        } else {
            nextIndex = currentIndex + 1;
            if (nextIndex > maxIndex) {
                nextIndex = 0;
            }
        }
        slideRun($slideImgArr[nextIndex], reverse_);
    };

    let $nextBtn = jQuery('<i/>', {
        class: 'iconfont icon-next',
    });
    $nextBtn.on('click', slideButtonClick.bind(null, false));
    let $prevBtn = jQuery('<i/>', {
        class: 'iconfont icon-prev',
    });
    $prevBtn.on('click', slideButtonClick.bind(null, true));

    $container.append($prevBtn).append($nextBtn);

    let slideHandler = null;
    let slideStart = () => {
        if (slideHandler) {
            return;
        }
        slideHandler = setInterval(
            slideButtonClick, 2000
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
};

jQuery('.slideBox').each((index_, item_) => {
    slideInit(item_);
});