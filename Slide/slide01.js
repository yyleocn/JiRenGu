let $slideBox = jQuery('.slideBox');
let $slideContent = jQuery('.slideBox .slideContent');
let $slideImgArr = jQuery('.slideBox .slideContent img');
let $slideTagList = jQuery('.slideBox .slideTagList');
$slideImgArr.each(function (index_, imgDOM_) {
    let $slideTag = jQuery('<div/>', {
        text: index_ + 1,
        class: 'slideTag'
    });
    $slideTag.on('click', function () {
        $slideContent.css({
            left: (-1 * imgDOM_.offsetLeft) + 'px'
        });
        jQuery(this).addClass('active').siblings('.active').removeClass('active');
    });
    $slideTagList.append($slideTag);
});

let carouseNext = function () {
    let $slideTagArr = jQuery('div.slideTag');
    let $nextTag = $slideTagArr.filter('.active+.slideTag:first');
    if (!$nextTag.length) {
        $nextTag = $slideTagArr.filter(':first');
    }
    if (!$nextTag.length) {
        return;
    }
    $nextTag.trigger('click');
};

let intervalHandler;

carouseNext();
intervalHandler = setInterval(carouseNext, 3000);

$slideBox.on('mouseenter', function () {
    if (intervalHandler) {
        clearInterval(intervalHandler);
    }
});
$slideBox.on('mouseleave', function () {
    intervalHandler = setInterval(carouseNext, 3000);
});