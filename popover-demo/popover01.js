let stopPropagation = (event_) => {
    event_.stopPropagation();
};

jQuery('button[data-action]').each((index_, item_) => {
    let $item = jQuery(item_);
    if ($item.data('action') !== 'popover') {
    } else {
        let target = $item.data('target');
        let $target = jQuery(`div[data-popover=${target}]`).eq(0);
        if (!$target.length) {
            return
        }
        let count = 0;
        let hideFunc = (event_) => {
            $target.hide();
            console.log(count++);
        };
        $target.on('click', stopPropagation);
        $item.on('click', (event_) => {
            event_.stopPropagation();
            $target.toggle();
            if ($target.is(':visible')) {
                jQuery(document).one('click', hideFunc);
            } else {
                jQuery(document).off('click', hideFunc);
            }
        })
    }
});