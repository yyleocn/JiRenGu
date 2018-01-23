# Answer 1
~~~ javascript

var object = {}
object.__proto__ ===  Object.prototype  // 为 true

var fn = function(){}
fn.__proto__ === Function.prototype  // 为 true
fn.__proto__.__proto__ === Object.prototype  // 为 true

var array = function(){}
array.__proto__ === Function.prototype // 为 true
array.__proto__.__proto__ === Object.prototype // 为 true

Function.__proto__ === Function.prototype // 为 true
Array.__proto__ === Function.prototype // 为 true
Object.__proto__ === Function.prototype // 为 true

true.__proto__ === Object.prototype // 为 true

Function.prototype.__proto__ === Object.prototype // 为 true
~~~

# Answer 2

* `this` 自身没有任何属性
* `this` 的原型为 `fn.prototype`，具有的属性为`constructor`，值为`fn`

# Answer 3

* JSON 脱胎于 JavaScript，是 JavaScript 的子集。
* JSON 是一种数据格式，很多编程语言都支持。JavaScript 是一种编程语言。


# Answer 4


