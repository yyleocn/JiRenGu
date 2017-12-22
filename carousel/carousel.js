let $carouselBox = jQuery('.carouselBox');
let $carouselContent = jQuery('.carouselBox .carouselContent');
let $carouselImgArr = jQuery('.carouselBox .carouselContent img');
let $carouselTagList = jQuery('.carouselBox .carouselTagList');
$carouselImgArr.each(function (index_, imgDOM_) {
    let $carouselTag = jQuery('<div/>', {
        text: index_ + 1,
        class: 'carouselTag'
    });
    $carouselTag.on('click', function () {
        $carouselContent.css({
            left: (-1 * imgDOM_.offsetLeft) + 'px'
        });
        jQuery(this).addClass('active').siblings('.active').removeClass('active');
    });
    $carouselTagList.append($carouselTag);
});

let carouseNext = function () {
    let $carouselTagArr = jQuery('div.carouselTag');
    let $nextTag = $carouselTagArr.filter('.active+.carouselTag:first');
    if (!$nextTag.length) {
        $nextTag = $carouselTagArr.filter(':first');
    }
    if (!$nextTag.length) {
        return;
    }
    $nextTag.trigger('click');
};

let intervalHandler;

carouseNext();
intervalHandler = setInterval(carouseNext, 3000);

$carouselBox.on('mouseenter', function () {
    if (intervalHandler) {
        clearInterval(intervalHandler);
    }
});
$carouselBox.on('mouseleave', function () {
    intervalHandler = setInterval(carouseNext, 3000);
});