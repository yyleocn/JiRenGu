console.log('Start!');

let createTag = function (tag_, attr_) {
    let tagObj = document.createElement(tag_);
    if (attr_) {
        for (let key in attr_) {
            let attr = attr_[key];
            tagObj[key] = Array.isArray(attr) ? attr.join(' ') : attr;
        }
    }
    return tagObj;
};

let sketch = function (target_) {
    'use strict';
    if (!(this instanceof sketch)) {
        console.warn('sketch function called');
        return new sketch(target_);
    };

    //***** init config */
    let config = {
        width: 5,
        mode: 'default',
        color: '#000',
    };

    //** init toolBar */
    let toolBar = createTag('div', {
        className: 'toolBar',
    })
    target_.appendChild(toolBar);

    //***** init canvas */
    let canvasObj = createTag('canvas', {
        innerHtml: '浏览器不支持Canvas',
    });
    let windowResize = function () {
        canvasObj.height = target_.clientHeight - toolBar.clientHeight;
        canvasObj.width = target_.clientWidth;
    };
    windowResize();
    window.addEventListener('resize', windowResize);
    target_.appendChild(canvasObj);

    //** init colorPicker */
    let colorPicker = createTag('input', {
        type: 'color',
        className: 'colorPicker',
    });
    let colorPickerChange =
        function (event_) {
            config.color = event_.target.value;
        }
    colorPicker.addEventListener(
        'change',
        colorPickerChange
    );
    toolBar.appendChild(colorPicker);

    //** init widthPicker */
    let widthPicker = createTag('input', {
        type: 'range',
        className: 'widthPicker',
        min: 1,
        max: 10,
        value: config.width,
    });
    let widthPickerChange =
        function (event_) {
            config.width = parseInt(event_.target.value);
        }
    widthPicker.addEventListener(
        'change',
        widthPickerChange
    );
    toolBar.appendChild(widthPicker);

    //** init modePicker */
    let modePick = function (event_) {
        let target = event_.target;
        if (target.classList.contains('active')) {
            return;
        }
        config.mode = target.mode;
        target.parentNode.querySelector('.modePicker.active').classList.remove('active');
        target.classList.add('active');
    };


    let modeEraser = createTag('i', {
        className: ['iconfont', 'icon-eraser', 'modePicker', ],
        mode: 'eraser',
    });
    modeEraser.onclick = modePick;
    toolBar.appendChild(modeEraser);

    let modePen = createTag('i', {
        className: ['iconfont', 'icon-pen', 'modePicker', ],
        mode: 'pen',
    });
    modePen.onclick = modePick;
    toolBar.appendChild(modePen);

    let modeDefault = createTag('i', {
        className: ['iconfont', 'icon-hand', 'modePicker', 'active', ],
        mode: 'default',
    });
    modeDefault.onclick = modePick;
    toolBar.appendChild(modeDefault);

    /***** define click event */
    let saveBtn = createTag('i', {
        className: ['iconfont', 'icon-download', ],
        mode: 'default',
    });
    toolBar.appendChild(saveBtn);

    /***** define click event */
    let mouseClick = function (event_) {
        switch (config.mode) {
            case 'pen':
                {
                    break;
                }
            case 'eraser':
                {
                    break;
                }
            default:
                {

                }
        }
    }

    let mouseMove = function (event_) {
        switch (config.mode) {
            case 'pen':
                {
                    break;
                }
            case 'eraser':
                {
                    break;
                }
            default:
                {

                }
        }
    }

    let mouseRelease = function (event_) {

    }
}

let sketchObj = document.querySelector('#sketch');
let target = new sketch(sketchObj);