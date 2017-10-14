var http = require('http');
var fs = require('fs');
var url = require('url');
var port = process.argv[2];

if (!port) {
  console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？');
  process.exit(1);
}

var server = http.createServer(function (request_, response_) {
  var parsedUrl = url.parse(request_.url, true);
  var path = request_.url;
  var query = '';
  if (path.indexOf('?') >= 0) { query = path.substring(path.indexOf('?')) };
  var pathNoQuery = parsedUrl.pathname;
  var queryObject = parsedUrl.query;
  var method = request_.method;
  /******** 从这里开始看，上面不要看 ************/

  switch (pathNoQuery) {
    case '/': {
      response_.setHeader('content-type', 'text/html; charset=UTF-8')
      response_.write('<!DOCTYPE html><html>' +
        '<head><link rel="stylesheet" href="/style.css"/></head>' +
        '<body><h1>Hello world!</h1><h2>你好！</h2><script type="text/javascript" src="/main.js" ></script></body>' +
        '</html>'
      );
      break;
    }
    case '/style.css': {
      response_.setHeader('content-type', 'text/css; charset=UTF-8')
      response_.write('body{background-color:#DDD;color:#444;}');
      break;
    }
    case '/main.js': {
      response_.setHeader('content-type', 'text/javascript; charset=UTF-8')
      response_.write('alert("JS工作了！")');
      break;
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


