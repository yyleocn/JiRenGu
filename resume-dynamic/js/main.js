!function () {
    let DEBUG = false;
    let cssDom = document.querySelector('#main-css');
    let editorDom = document.querySelector('#editor');
    let paperDom = document.querySelector('#paper');

    let editorRender = (content_) => {
        cssDom.innerHTML = content_;
        editorDom.innerHTML = Prism.highlight(content_, Prism.languages.css);
        editorDom.scrollTop = 9999;
    };

    let paperRender = (content_) => {
        paperDom.innerHTML = content_;
    };

    let autoRender = ({content_, render_, callback_, startContent_,}) => {
        let i = 0;
        let baseContent = startContent_ || '';
        if (DEBUG) {
            render_(baseContent + content_);
            if (callback_) {
                callback_();
            }
            return;
        }
        let intervalHandler = setInterval(() => {
            i++;
            if (i >= content_.length) {
                clearInterval(intervalHandler);
                if (callback_) {
                    callback_();
                }
                return;
            }
            render_(baseContent + content_.substr(0, i));
        }, 30);
    };


    new Promise((resolve_, reject_) => {
        $.ajax({
            url: './css/code-01.css',
            success: (data_) => {
                autoRender({
                    render_: editorRender,
                    startContent_: cssDom.innerHTML,
                    content_: data_ + '\n',
                    callback_: resolve_,
                });
            }
        });
    }).then(() => {
        return new Promise((resolve_, reject_) => {
            $.ajax({
                url: './static/self-introduction.md',
                success: (data_) => {
                    autoRender({
                        render_: paperRender,
                        startContent_: paperDom.innerHTML,
                        content_: data_ + '\n',
                        callback_: resolve_,
                    });
                }
            });
        });
    }).then(() => {
        return new Promise((resolve_, reject_) => {
            $.ajax({
                url: './css/code-02.css',
                success: (data_) => {
                    autoRender({
                        render_: editorRender,
                        startContent_: cssDom.innerHTML,
                        content_: data_ + '\n',
                        callback_: resolve_,
                    });
                }
            });
        });
    }).then(() => {
        return new Promise((resolve_, reject_) => {
            marked.setOptions({
                renderer: new marked.Renderer(),
                gfm: true,
                tables: true,
                breaks: false,
                pedantic: false,
                sanitize: false,
                smartLists: true,
                smartypants: false,
                xhtml: false
            });
            paperDom.innerHTML = marked(paperDom.innerHTML).replace(/\r\n|\r|\n/g, '');
            resolve_();
        })
    }).then(() => {
        return new Promise((resolve_, reject_) => {
            $.ajax({
                url: './css/code-03.css',
                success: (data_) => {
                    autoRender({
                        render_: editorRender,
                        startContent_: cssDom.innerHTML,
                        content_: data_ + '\n',
                        callback_: resolve_,
                    });
                }
            });
        });
    });
}();
