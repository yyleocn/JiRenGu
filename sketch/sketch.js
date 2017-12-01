'use strict';

let createTag = function (tag_, attr_) {
    let tagObj = document.createElement(tag_);
    if (attr_) {
        for (let key in attr_) {
            let attr = attr_[key];
            switch (key) {
                case 'className':
                    {
                        tagObj[key] = Array.isArray(attr) ? attr.join(' ') : attr;
                        break;
                    }
                default:
                    {
                        tagObj[key] = attr;
                    }
            }
        }
    }
    return tagObj;
};

// let base64Img2Blob = function (code_) {
//     let parts = code_.split(';base64,');
//     let contentType = parts[0].split(':')[1];
//     let raw = window.atob(parts[1]);
//     let rawLength = raw.length;
//     let uInt8Array = new Uint8Array(rawLength);
//     for (let i = 0; i < rawLength; ++i) {
//         uInt8Array[i] = raw.charCodeAt(i);
//     }
//     return new Blob([uInt8Array], {
//         type: contentType
//     });
// }

// let downloadFile = function (fileName_, content_) {
//     let anchorDom = document.createElement('a');
//     let blobObj = base64Img2Blob(content_); //new Blob([content]);
//     let eventObj = document.createEvent("HTMLEvents");
//     eventObj.initEvent("click", false, false); //initEvent 不加后两个参数在FF下会报错
//     anchorDom.download = fileName_;
//     anchorDom.href = URL.createObjectURL(blobObj);
//     anchorDom.dispatchEvent(eventObj);
// }

let linePath = function (startX_, startY_, endX_, endY_) {
    let rangeX = endX_ - startX_;
    let rangeY = endY_ - startY_;
    if (!rangeX && !rangeY) {
        return [];
    }
    let pathArray = [];
    if (Math.abs(rangeX) >= Math.abs(rangeY)) {
        let direction = rangeX > 0 ? 1 : -1;
        for (let iLoop = 1; iLoop < Math.abs(rangeX); iLoop++) {
            let pointX = startX_ + iLoop * direction;
            let pointY = Math.floor(startY_ + iLoop * direction / rangeX * rangeY + 0.5);
            pathArray.push({
                x: pointX,
                y: pointY,
            });
        }
    } else {
        let direction = rangeY > 0 ? 1 : -1;
        for (let iLoop = 1; iLoop < Math.abs(rangeY); iLoop++) {
            let pointY = startY_ + iLoop * direction;
            let pointX = Math.floor(startX_ + iLoop * direction / rangeY * rangeX + 0.5);
            pathArray.push({
                x: pointX,
                y: pointY,
            });
        }
    }
    return pathArray;
}

let canvasFillCircle = function (context_, x_, y_, radius_, color_) {
    if (!context_ instanceof CanvasRenderingContext2D) {
        throw 'Invalid canvas object!';
    }
    context_.beginPath();
    context_.arc(
        x_, y_, radius_,
        0, Math.PI * 2
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
};

let getEvent = function (event_) {
    console.log(event_);
};

function Sketch(target_) {
    'use strict';
    if (!(this instanceof Sketch)) {
        console.warn('Sketch function called');
        return new Sketch(target_);
    }

    //***** init config */
    let config = {
        radius: 2,
        mode: 'default',
        color: '#0000FF',
        mouseClicking: false,
        lastPointX: 0,
        lastPointY: 0,
        eraserZoom: 3,
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
    });
    target_.appendChild(toolBar);

    //***** init canvas */
    let canvasObj = createTag('canvas', {
        innerHtml: '浏览器不支持Canvas',
    });
    let canvasContext = canvasObj.getContext('2d');
    let canvasResize = function () {
        let canvasCopy = document.createElement('canvas'); // create a canvas copy dom
        canvasCopy.width = canvasObj.width;
        canvasCopy.height = canvasObj.height;
        canvasCopy.getContext('2d').drawImage(canvasObj, 0, 0); // copy the 'old' canvas
        // resize
        canvasObj.height = target_.clientHeight - toolBar.clientHeight;
        canvasObj.width = target_.clientWidth;
        canvasContext.drawImage(canvasCopy, 0, 0); // copy back canvas
    };
    canvasResize();
    window.addEventListener('resize', canvasResize);
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
        value: config.color,
    });
    toolBar.appendChild(colorPicker);
    let colorPickerChange =
        function (event_) {
            config.color = event_.target.value;
            if (document.querySelector('.toolBar .modePicker.icon-pen')) {
                document.querySelector('.toolBar .modePicker.icon-pen').click();
            }
        };
    colorPicker.addEventListener(
        'change',
        colorPickerChange
    );

    //** init widthPicker */
    let widthPicker = createTag('input', {
        type: 'range',
        className: 'widthPicker',
        min: 1,
        max: 5,
        value: config.radius,
    });
    toolBar.appendChild(widthPicker);
    let widthPickerChange =
        function (event_) {
            config.radius = parseInt(event_.target.value);
        };
    widthPicker.addEventListener(
        'change',
        widthPickerChange
    );


    /***** save button */
    let saveButton = createTag('i', {
        className: ['iconfont', 'icon-download', ],
        mode: 'default',
    });
    toolBar.appendChild(saveButton);
    let canvasSave = function (event_) {
        // let anchorDom = document.createElement('a');
        // anchorDom.href=canvasObj.toDataURL("image/png").replace("image/png", "image/octet-stream");
        // anchorDom.download='sketch.png';
        // anchorDom.click();
        // downloadFile('sketch.png', canvasObj.toDataURL("image/png"));
        // let imgData = canvasObj.toDataURL("image/png").replace("image/png", "image/octet-stream");
        let imgData = canvasObj.toDataURL("image/png");
        let newTab = window.open('', '_blank');
        let imgDom = newTab.document.createElement('img');
        imgDom.src = imgData;
        let anchorDom = newTab.document.createElement('a');
        anchorDom.href = imgData;
        anchorDom.download = 'sketch.png';
        anchorDom.innerHTML = '下载';
        newTab.document.body.appendChild(imgDom);
        newTab.document.body.appendChild(
            newTab.document.createElement('br')
        );
        newTab.document.body.appendChild(anchorDom);
    }
    saveButton.addEventListener('click', canvasSave);


    /***** clear button */
    let clearButton = createTag('i', {
        className: ['iconfont', 'icon-delete2f', ],
        mode: 'default',
    });
    toolBar.appendChild(clearButton);
    clearButton.addEventListener('click', function (event_) {
        canvasContext.clearRect(
            0, 0,
            canvasObj.clientWidth, canvasObj.clientHeight
        )
    });

    /***** event bind cache list */
    let clearEventBind = function () {};

    /***** define click event bind */
    let modeEventBind = {
        pen: {
            mouseDown: function (event_) {
                let eventOffset = getEventOffset(event_, canvasObj);
                canvasFillCircle(
                    canvasContext,
                    eventOffset.x, eventOffset.y,
                    config.radius, config.color
                );
                //***** update config */
                config.lastPointX = eventOffset.x;
                config.lastPointY = eventOffset.y;
                config.mouseClicking = true;
            },
            mouseMove: function (event_) {
                if (!config.mouseClicking) {
                    return undefined;
                }
                let eventOffset = getEventOffset(event_, canvasObj);
                canvasFillLine(
                    canvasContext,
                    config.lastPointX, config.lastPointY,
                    eventOffset.x, eventOffset.y,
                    config.radius * 2, config.color
                );
                canvasFillCircle(
                    canvasContext,
                    eventOffset.x, eventOffset.y,
                    config.radius, config.color
                );
                //***** update config */
                config.lastPointX = eventOffset.x;
                config.lastPointY = eventOffset.y;
            },
            mouseUp: function (event_) {
                config.mouseClicking = false;
            },
        },
        eraser: {
            mouseDown: function (event_) {
                let eventOffset = getEventOffset(event_, canvasObj);
                canvasContext.clearRect(
                    eventOffset.x - config.radius * config.eraserZoom, eventOffset.y - config.radius * config.eraserZoom,
                    config.radius * 2 * config.eraserZoom, config.radius * config.eraserZoom
                )
                //***** update config */
                config.lastPointX = eventOffset.x;
                config.lastPointY = eventOffset.y;
                config.mouseClicking = true;
            },
            mouseMove: function (event_) {
                if (!config.mouseClicking) {
                    return undefined;
                }
                let eventOffset = getEventOffset(event_, canvasObj);
                let linePathArray = linePath(
                    config.lastPointX, config.lastPointY,
                    eventOffset.x, eventOffset.y
                )
                linePathArray.forEach(function (point_) {
                    canvasContext.clearRect(
                        point_.x - config.radius * config.eraserZoom, point_.y - config.radius * config.eraserZoom,
                        config.radius * 2 * config.eraserZoom, config.radius * 2 * config.eraserZoom
                    )
                })
                //***** update config */
                config.lastPointX = eventOffset.x;
                config.lastPointY = eventOffset.y;
            },
            mouseUp: function (event_) {
                config.mouseClicking = false;
            },
        }
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
        canvasObj.className = target.mode;
        switch (target.mode) {
            case 'pen':
                {
                    canvasObj.style = 'cursor:crosshair';
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
                    canvasObj.style = 'cursor:cell';
                    canvasEventBind(
                        canvasObj,
                        modeEventBind.eraser.mouseDown,
                        modeEventBind.eraser.mouseMove,
                        modeEventBind.eraser.mouseUp
                    );
                    break;
                }
            default:
                {
                    canvasObj.style = 'cursor:all-scroll';
                    canvasEventBind(
                        canvasObj,
                        null,
                        null,
                        null
                    );
                }
        }
    };


    let modeEraser = createTag('i', {
        className: ['iconfont', 'icon-eraser', 'modePicker', ],
        mode: 'eraser',
    });
    toolBar.appendChild(modeEraser);
    modeEraser.onclick = modePick;

    let modePen = createTag('i', {
        className: ['iconfont', 'icon-pen', 'modePicker', ],
        mode: 'pen',
    });
    toolBar.appendChild(modePen);
    modePen.onclick = modePick;
    modePen.click();

    let modeDefault = createTag('i', {
        className: ['iconfont', 'icon-hand', 'modePicker', ],
        mode: 'default',
    });
    toolBar.appendChild(modeDefault);
    modeDefault.onclick = modePick;

    /***** debug */
    // console.log([
    //     target_,
    //     config,
    //     canvasObj,
    //     canvasContext,
    // ]);
};

let sketchObj = document.querySelector('#sketch');
let target = new Sketch(sketchObj);
// alert(1);