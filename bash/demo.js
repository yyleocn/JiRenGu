var fs = require('fs');
var dirName = process.argv[2];
if (fs.existsSync("./" + dirName)) { //判断目录是否存在
    console.log('目录已存在');
    process.exit(1);
}
fs.mkdirSync("./" + dirName); // mkdir $1
process.chdir("./" + dirName); // cd $1
fs.mkdirSync('css'); // mkdir css
fs.mkdirSync('js'); // mkdir js
fs.writeFileSync("./index.html", '<!DOCTYPE>\n<title>Hello</title>\n<h1>Hi</h1>');
fs.writeFileSync("css/style.css", 'h1{color: red;}');
fs.writeFileSync("./js/main.js", 'var string = "Hello World"\nalert(string)');