let http = require('http');
let fs = require('fs');
let url = require('url');
let port = process.argv[2];

if (!port) {
    console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？');
    process.exit(1);
}

let server = http.createServer(function (request_, response_) {
    let parsedUrl = url.parse(request_.url, true);
    let path = request_.url;
    let query = '';
    if (path.indexOf('?') >= 0) {
        query = path.substring(path.indexOf('?'))
    }
    let pathNoQuery = parsedUrl.pathname;
    let queryObject = parsedUrl.query;
    let method = request_.method;
    /******** 从这里开始看，上面不要看 ************/
    switch (pathNoQuery) {
        case '/': {
            response_.setHeader('content-type', 'text/html; charset=UTF-8')
            response_.write('');
            break;
        }
        case '/JSONP': {
            if (queryObject.callback) {
                response_.setHeader('content-type', 'text/javascript; charset=UTF-8');
                response_.write(`
                    ${queryObject.callback}.call(undefined,{\'message\':\'JSONP 加载成功\'})
                `);
            } else {
                response_.statusCode = 404;
            }
            break
        }
        default: {
            response_.statusCode = 404;
        }
    }
    response_.end();


    /******** 代码结束，下面不要看 ************/
});

server.listen(port);
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port);


