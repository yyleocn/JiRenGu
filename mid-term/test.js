let counterInit = function () {
    let count = 0;
    let countInc = function () {
        count += 1;
    };
    let getCount = function () {
        return count;
    };
    return {
        getCount: getCount,
        countInc: countInc,
    };
};

let counter = counterInit();

console.log(counter.getCount());  // 0
counter.countInc();
console.log(counter.getCount());  // 1