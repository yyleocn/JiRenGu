'use strict';

/***** define function */

let createTag = function (tag_, attr_) {
    let tagObj = document.createElement(tag_);
    if (attr_) {
        for (let attr in attr_) {
            tagObj[attr] = attr_[attr];
        }
    }
    return tagObj;
};

function configManage(name_, default_) {
    'use strict';
    if (!new.target) {
        return new configManage(name_, default_);
    }
    let config = null;
    try {
        config = JSON.parse(localStorage.getItem(name_));
    } catch (err_) {
        console.log('Invalidation local storage config.');
    }
    if (!config) {
        console.log('Load default config.');
        config = default_;
    }
    this.getConfig = function (key_) {
        return config[key_]
    };
    this.setConfig = function (key_, value_) {
        config[key_] = value_;
        this.saveConfig();
    };
    this.saveConfig = function () {
        localStorage.setItem(name_, JSON.stringify(config))
    }
};

let urlopen = function (keyboardUrlConfig_, event_) {
    let key = event_.key
    if (!keyboardUrlConfig_.getConfig(key)) {
        return false;
    }
    window.open('http://' + keyboardUrlConfig_.getConfig(key), '_blank');
}
let keyboardCreate = function (box_, keyboardUrlConfig_, defaultFavicon_, blankFavicon_) {
    if (!(box_ || {}).tagName) {
        return false;
    }
    if (typeof (keyboardUrlConfig_) !== 'object' || !keyboardUrlConfig_.getConfig) {
        return false;
    }
    keyboardLetterArray.forEach(function (keyRow_, index_, arr_) {
        let keyRowBox = createTag('div');
        keyRowBox.className = 'keyRow row' + index_;
        keyRow_.forEach(function (key_) {
            let keyObj = createTag(
                'kbd', {
                    innerText: key_,
                    className: key_,
                });
            let editButton = createTag(
                'button', {
                    innerText: 'E',
                    type: 'button',
                    className: 'editButton'
                },
            );
            if (key_.match(/^[a-z]$/i)) {
                let favicon = {};
                if (defaultFavicon_) {
                    favicon = createTag(
                        'img',
                        {
                            src: blankFavicon_,
                            className: 'favicon'
                        }
                    );
                    if (keyboardUrlConfig_.getConfig(key_)) {
                        favicon.src = 'http://' + keyboardUrlConfig_.getConfig(key_) + '/favicon.ico'
                    }
                    favicon.onerror = function (event_) {
                        if (event_.target.src !== defaultFavicon_) {
                            event_.target.src = defaultFavicon_
                        }
                    }
                    keyObj.appendChild(favicon);
                }
                keyObj.className = 'letter';
                editButton.onclick = function () {
                    let result = window.prompt('请输入' + key_ + '的快捷网址', '');
                    if (result) {
                        keyboardUrlConfig_.setConfig(key_, result);
                        favicon.url = 'http://' + result + '/favicon.ico'
                    }
                }
            }
            keyObj.appendChild(editButton);
            keyRowBox.appendChild(keyObj);
        });
        box_.appendChild(keyRowBox);
        box_.appendChild(document.createElement('br'));
    });
    return true;
}


/***** define config */

let keyboardLetterArray = [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0','-','=','back',],
    ['tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p','[',']','\\',],
    ['caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',';','\'','enter',],
    ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm',',','.','/','shift',],
];

let keyboardUrlConfigDefault = {
    q: 'qq.com',
    w: 'weibo.com',
    e: 'ele.me',
    r: 'renren.com',
};

let configName = 'keyboardUrl';
let defaultFavicon = './static/img/defaultFavicon.png'
let blankFavicon = './static/img/blankFavicon.png'

/***** process */
let keyboardLinkConfig = configManage(configName, keyboardUrlConfigDefault);
let keyboardBox = document.querySelector('#keyboard', {});
let initRes = keyboardCreate(
    keyboardBox, keyboardLinkConfig,
    defaultFavicon, blankFavicon
);
document.onkeypress = urlopen.bind(null, keyboardLinkConfig);
if (!initRes) {
    console.log('Init fail.')
}