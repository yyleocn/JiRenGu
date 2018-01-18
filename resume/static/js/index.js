let addEvent = function (elem_, type_, handler_) {
    if (window.addEventListener) {
        addEvent = function (elem_, type_, handler_) {
            elem_.addEventListener(type_, handler_, false);
        };
    } else if (window.attachEvent) {
        addEvent = function (elem_, type_, handler_) {
            elem_.attachEvent('on' + type_, handler_);
        };
    }
    addEvent(elem_, type_, handler_);
};

let animate = function (time) {
    requestAnimationFrame(animate);
    TWEEN.update(time);
};
requestAnimationFrame(animate);


let navBar = document.querySelector('nav.navBar');
if (navBar) {
    let windowScrollLast = 0;
    let navBarFade = function () {
        if (window.scrollY > windowScrollLast) {
            navBar.classList.add('fixed');
        }
        if (window.scrollY < windowScrollLast && window.scrollY < 70) {
            navBar.classList.remove('fixed');
        }
        windowScrollLast = window.scrollY;
    };
    navBarFade();
    addEvent(window, 'scroll', navBarFade);

    let navList = navBar.querySelectorAll('.navItem>a');
    let scrollMonitorList = [];
    navList.forEach(function (item_) {
        if (!item_.hash) {
            return undefined;
        }
        let target = document.querySelector(item_.hash);
        scrollMonitorList.push({
            navTag: item_.parentNode,
            anchor: item_,
            target: target,
            offsetTop: target.offsetTop,
            offsetBottom: target.offsetTop + target.offsetHeight,
        });
        item_.onclick = function (event_) {
            event_.preventDefault();
            let currentOffset = window.scrollY;
            let targetOffset = target.offsetTop - 100;
            let animateParameter = {
                y: currentOffset
            };
            let time = Math.abs((targetOffset - currentOffset) / 3);
            if (time > 1000) {
                time = 1000;
            }
            let tween = new TWEEN.Tween(animateParameter) // 起始位置
                .to(
                    {y: targetOffset},
                    time
                ) // 结束位置 和 时间
                .easing(
                    TWEEN.Easing.Cubic.InOut
                ) // 缓动类型
                .onUpdate(function () {
                    // coords.y 已经变了
                    window.scrollTo(0, animateParameter.y); // 如何更新界面
                })
                .start();
        }
    });
    let scrollMonitorHandler = function () {
        scrollMonitorList.forEach(function (item_) {
            if ((window.scrollY + window.outerHeight * 0.7) > (item_.offsetTop)) {
                item_.target.classList.remove('hidden');
            }
            if (
                (window.scrollY + window.outerHeight * 0.5 > item_.offsetTop)
                && (window.scrollY + window.outerHeight * 0.5 < item_.offsetBottom)
            ) {
                item_.navTag.classList.add('active');
            } else {
                item_.navTag.classList.remove('active');
            }
        })
    };
    scrollMonitorHandler();
    addEvent(window, 'scroll', scrollMonitorHandler);
}

let switchBar = document.querySelector('.portfolioNav hr.switchBar');
let portfolioTagSwitch = function (event_) {
    switchBar.className = 'switchBar ' + event_.target.dataset.switch;
};
document.querySelectorAll('.portfolioNav .portfolioTag').forEach(function (item_) {
    addEvent(item_, 'click', portfolioTagSwitch);
});

