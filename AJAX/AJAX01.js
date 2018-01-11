let ajax = (url_, method_) => {
    let requestObj = new XMLHttpRequest();
    requestObj.open(method_ || 'GET', url_ || '/');
    requestObj.onreadystatechange = (event_) => {
        let target = event_.currentTarget;
        if (target.readyState !== 4) {
            return;
        }
        if (target.status >= 200 && target.status < 300) {
            console.log(
                `请求成功，返回结果如下：\n${target.responseText}`
            );
        } else if (target.status >= 400) {
            console.log('请求失败。');
        }
    };
    requestObj.send();
};

ajax.call(undefined, '/ajaxAPI', 'GET');