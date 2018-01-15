let jQueryX = function (node_) {
    let nodeArr = {
        length: 0,
    };
    let nodeAdd = function (nodeElem_) {
        nodeArr[nodeArr.length] = nodeElem_;
        nodeArr.length += 1;
    };
    // if (node_ instanceof Node) {
    //     nodeAdd(node_);
    // } else if (typeof node_ === 'string') {
    //     let nodeQuery = document.querySelectorAll(node_);
    //     for (let i = 0; i < nodeQuery.length; i++) {
    //         nodeAdd(nodeQuery[i]);
    //     }
    // } else {
    //     throw 'Invalid node parameter.';
    // }
    if (node_ instanceof Node) {
        nodeArr = {
            0: node_,
            length: 1
        }
    } else if (typeof node_ === 'string') {
        nodeArr = document.querySelectorAll(node_);
    } else {
        throw 'Invalid node parameter.';
    }
    nodeArr.addClass = function (class_) {
        for (let i = 0; i < nodeArr.length; i++) {
            let nodeClassList = nodeArr[i].classList;
            nodeClassList.add.apply(nodeClassList, arguments);
        }
    };
    nodeArr.setText = function (text_) {
        for (let i = 0; i < nodeArr.length; i++) {
            nodeArr[i].textContent = text_;
        }
    };
    return nodeArr;
};

jQueryX.ajax = ({url_, method_, body_, success_, fail_}) => {
    return new Promise(function (resolve_, reject_) {
        let request = new XMLHttpRequest();
        request.open(method_, url_);
        request.onreadystatechange = (event_) => {
            if (request.readyState !== 4) {
                return
            }
            if (request.status >= 200 && request.status < 300) {
                resolve_.call(undefined, request.responseText);
            } else if (request.status >= 400) {
                reject_.call(undefined, request.responseText);
            }
        }
    });
};