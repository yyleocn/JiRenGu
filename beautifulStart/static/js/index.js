let keyBoardArray = [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',],
    ['tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',],
    ['caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',],
    ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm',],
]

let defaultUrl = {
    q: 'qq.com',
    w: 'weibo.com',
    e: 'ele.me',
    r: 'renren.com',
}

let createTag = function (tag_, attr_) {
    let tagObj = document.createElement(tag_);
    if (attr_) {
        for (let attr in attr_) {
            tagObj[attr] = attr_[attr];
        }
    }
    return tagObj;
}

let getLocalStorage = function (key_, default_) {
    return localStorage.getItem(key_) || default_;
}


let keyboardCreate = function (target_) {
    if (!(target_ || {}).tagName) {
        return;
    }
    keyBoardArray.forEach(function (keyRow_, index_, arr_) {
        let keyRowBox = createTag('div');
        keyRowBox.className = 'keyRow row' + index_;
        keyRow_.forEach(function (key_) {
            let keyObj = createTag(
                'kbd',
                {
                    innerText: key_,
                    className: key_,
                });
            if (key_.length <= 1) {
                keyObj.className = 'letter';
            }
            let editButton = createTag(
                'button',
                {
                    innerText: 'E',
                    type: 'button',
                    className: 'editButton',
                }
            );
            keyObj.appendChild(editButton);
            keyRowBox.appendChild(keyObj);
        });
        target_.appendChild(keyRowBox);
        target_.appendChild(document.createElement('br'));
    });
}

let keyboardBox = document.querySelector('#keyboard');

keyboardCreate(keyboardBox);