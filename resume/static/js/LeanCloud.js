const appId = '90ce20ES6J438eDeTR0TDhiW-gzGzoHsz';
const appKey = 'lSJKxFHIGS2iLPVMt8Qx7wGT';
AV.init({appId, appKey});

let TestObject = AV.Object.extend('TestObject');
let testObject = new TestObject();
testObject.save({
    words: 'Hello World!'
}).then(function(object) {
    alert('LeanCloud Rocks!');
});