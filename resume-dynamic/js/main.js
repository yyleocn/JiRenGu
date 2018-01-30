!function () {
    let mainCSS = document.querySelector('#cssBox');
    let mainCSSText = document.querySelector('#mainCSSText');
    let mainCSSRender = (content_) => {
        mainCSS.innerHTML = content_;
        mainCSSText.innerHTML = Prism.highlight(content_, Prism.languages.css);
        mainCSSText.scrollTop = 9999;
    };

    let mainCSSAutoRender = (content_, callback_) => {
        let i = 0;
        let baseText = mainCSS.innerHTML;
        intervalHandler = setInterval(() => {
            i++;
            if (i >= content_.length) {
                clearInterval(intervalHandler);
                intervalHandler = undefined;
                if (callback_) {
                    callback_();
                }
                return;
            }
            mainCSSRender(baseText + content_.substr(0, i));
        }, 30);
    };

    let intervalHandler = undefined;
    new Promise((resolve_, reject_) => {
        $.ajax({
            url: './css/main.css',
            success: (data_) => {
                mainCSSAutoRender(data_ + '\n', resolve_);
            }
        });
    });
}();
