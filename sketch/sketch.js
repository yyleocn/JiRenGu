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

document.write(1);


let canvasFillCircle = function (context_, x_, y_, radius_, color_) {
    if (!context_ instanceof CanvasRenderingContext2D) {
        throw 'Invalid canvas object!';
    }
    context_.beginPath();
    context_.arc(
        x_, y_, radius_,
        0, Math.PI * 2,
    );
    context_.fillStyle = color_;
    context_.fill();
    context_.closePath();
};

let canvasFillLine = function (context_, fromX_, fromY_, toX_, toY_, width_, color_) {
    if (!context_ instanceof CanvasRenderingContext2D) {
        throw 'Invalid canvas object!';
    }
    context_.beginPath();
    context_.moveTo(fromX_, fromY_);
    context_.lineTo(toX_, toY_);
    context_.lineWidth = width_;
    context_.strokeStyle = color_;
    context_.stroke();
    context_.closePath();
};

let isTouchDevice = function () {
    return 'ontouchstart' in window;
}

let getEvent = function (event_) {
    console.log(event_);
};

let sketch = function (target_) {
    'use strict';
    if (!(this instanceof sketch)) {
        console.warn('sketch function called');
        return new sketch(target_);
    };

    //***** init config */
    let config = {
        radius: 2,
        mode: 'default',
        color: '#000',
        mouseClicking: false,
        lastPointX: 0,
        lastPointY: 0,

    };

    //***** get event offset */
    let getEventOffset = function (event_, target_) {
        if (event_ instanceof TouchEvent) {
            let targetTouche = event_.targetTouches[0];
            let targetOffsetX = target_.offsetLeft;
            let targetOffsetY = target_.offsetTop;
            return {
                x: targetTouche.clientX - targetOffsetX,
                y: targetTouche.clientY - targetOffsetY,
            };
        }
        if (event_ instanceof Event) {
            return {
                x: event_.offsetX,
                y: event_.offsetY,
            };
        }
        return {
            x: 0,
            y: 0,
        }
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
    let canvasContext = canvasObj.getContext('2d');
    let windowResize = function () {
        canvasObj.height = target_.clientHeight - toolBar.clientHeight;
        canvasObj.width = target_.clientWidth;
    };
    windowResize();
    window.addEventListener('resize', windowResize);
    target_.appendChild(canvasObj);

    //***** canvas event bind */
    let canvasEventBind = function (target_, start_, move_, end_) {};
    if (isTouchDevice()) {
        canvasEventBind = function (target_, start_, move_, end_) {
            target_.ontouchstart = start_;
            target_.ontouchmove = move_;
            target_.ontouchend = end_;
        };
    } else {
        canvasEventBind = function (target_, start_, move_, end_) {
            target_.onmousedown = start_;
            target_.onmousemove = move_;
            target_.onmouseup = end_;
        };
    }

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
        max: 5,
        value: config.radius,
    });
    let widthPickerChange =
        function (event_) {
            config.radius = parseInt(event_.target.value);
        }
    widthPicker.addEventListener(
        'change',
        widthPickerChange
    );
    toolBar.appendChild(widthPicker);



    /***** define click event */
    let saveBtn = createTag('i', {
        className: ['iconfont', 'icon-download', ],
        mode: 'default',
    });
    saveBtn.addEventListener('click', function (event_) {
        console.log(event_);
    })
    toolBar.appendChild(saveBtn);

    /***** event bind cache list */
    let clearEventBind = function () {};

    /***** define click event bind */
    let modeEventBind = {
        'pen': {
            'mouseDown': function (event_) {
                let eventOffset = getEventOffset(event_, canvasObj);
                canvasFillCircle(
                    canvasContext,
                    eventOffset.x, eventOffset.y,
                    config.radius, config.color,
                )
                //***** update config */
                config.lastPointX = eventOffset.x;
                config.lastPointY = eventOffset.y;
                config.mouseClicking = true;
            },
            'mouseMove': function (event_) {
                if (!config.mouseClicking) {
                    return undefined;
                }
                let eventOffset = getEventOffset(event_, canvasObj);
                console.log(eventOffset);
                canvasFillLine(
                    canvasContext,
                    config.lastPointX, config.lastPointY,
                    eventOffset.x, eventOffset.y,
                    config.radius * 2, config.color,
                );
                canvasFillCircle(
                    canvasContext,
                    eventOffset.x, eventOffset.y,
                    config.radius, config.color,
                );
                //***** update config */
                config.lastPointX = eventOffset.x;
                config.lastPointY = eventOffset.y;
            },
            'mouseUp': function (event_) {
                config.mouseClicking = false;
            },
        },
    };

    //** init modePicker */
    let modePick = function (event_) {
        let target = event_.target;
        if (target.classList.contains('active')) {
            return;
        }
        config.mode = target.mode;
        if (target.parentNode.querySelector('.modePicker.active')) {
            target.parentNode.querySelector('.modePicker.active').classList.remove('active');
        }
        target.classList.add('active');
        switch (target.mode) {
            case 'pen':
                {
                    canvasEventBind(
                        canvasObj,
                        modeEventBind.pen.mouseDown,
                        modeEventBind.pen.mouseMove,
                        modeEventBind.pen.mouseUp
                    );
                    break;
                }
            case 'eraser':
                {
                    break;
                }
            default:
                {
                    canvasEventBind(
                        canvasObj,
                        null,
                        null,
                        null,
                    );
                }
        }
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
    modePen.click();

    let modeDefault = createTag('i', {
        className: ['iconfont', 'icon-hand', 'modePicker', ],
        mode: 'default',
    });
    modeDefault.onclick = modePick;
    toolBar.appendChild(modeDefault);

    /***** debug */
    console.log([
        target_,
        config,
        canvasObj,
        canvasContext,
    ])
}

let sketchObj = document.querySelector('#sketch');
let target = new sketch(sketchObj);