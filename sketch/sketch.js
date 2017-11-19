console.log('Start!');

let createTag = function (tag_, attr_) {
    let tagObj = document.createElement(tag_);
    if (attr_) {
        for (let key in attr_) {
            let attr = attr_[key];
            if (Array.isArray(attr)) {
                tagObj[key] = attr.join(' ');
            } else {
                tagObj[key] = attr_[key];
            }
        }
    }
    return tagObj;
};

let sketch = function (target_) {
    'use strict';
    if (!new.target) {
        return new sketch(target_);
    };

    //***** init config */
    let config = {
        width: 50,
        mode: 'draw',
        color: '#000',
    };

    //***** init canvas */
    let canvasObj = createTag('canvas', {
        innerHtml: '浏览器不支持Canvas',
    });
    let windowResize = function () {
        canvasObj.height = target_.clientHeight;
        canvasObj.width = target_.clientWidth;
    };
    windowResize();
    window.addEventListener('resize', windowResize);
    target_.appendChild(canvasObj);

    //** init toolBar */
    let toolBar = createTag('div', {
        className: 'toolBar',
    })
    target_.appendChild(toolBar);

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
    target_.appendChild(colorPicker);

    //** init widthPicker */
    let widthPicker = createTag('input', {
        type: 'range',
        className: 'widthPicker',
        min: 1,
        max: 10,
    });
    let widthPickerChange =
        function (event_) {
            config.width = parseInt(event_.target.value);
            console.log(config);
        }
    widthPicker.addEventListener(
        'change',
        widthPickerChange
    );
    target_.appendChild(widthPicker);

    //** init modePicker */
    let modePicker = createTag('i', {
        className: ['iconfont', 'icon-pen', 'modePicker'],
    });
    target_.appendChild(modePicker);
}

let sketchObj = document.querySelector('#sketch');
sketch(sketchObj);