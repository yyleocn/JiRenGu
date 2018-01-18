let addEvent = (elem_, type_, func_) => {
    if (window.addEventListener) {
        addEvent = (elem_, type_, func_) => {
            elem_.addEventListener(type_, func_, false);
        };
    } else if (window.attachEvent) {
        addEvent = (elem_, type_, func_) => {
            elem_.attachEvent('on' + type_, func_);
        };
    } else {
        throw 'Un support event system';
    }
    addEvent(elem_, type_, func_);
};

let removeEvent = (elem_, type_, func_) => {
    if (window.removeEventListener) {
        removeEvent = (elem_, type_, func_) => {
            elem_.removeEventListener(type_, func_, false);
        };
    } else if (window.attachEvent) {
        removeEvent = (elem_, type_, func_) => {
            elem_.detachEvent(type_, func_, false);
        };
    } else {
        throw 'Un support event system';
    }
    removeEvent(elem_, type_, func_);
};

let animate = (time) => {
    requestAnimationFrame(animate);
    TWEEN.update(time);
};
requestAnimationFrame(animate);


let navBar = document.querySelector('nav.navBar');
if (navBar) {
    let windowScrollLast = 0;
    let navBarFade = () => {
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
    navList.forEach((item_) => {
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
                .onUpdate(() => {
                    // coords.y 已经变了
                    window.scrollTo(0, animateParameter.y); // 如何更新界面
                })
                .start();
        }
    });
    let scrollTagMonitor = () => {
        scrollMonitorList.forEach((item_, index_) => {
            if (
                (window.scrollY + window.innerHeight * 0.5 > item_.offsetTop)
                && (window.scrollY + window.innerHeight * 0.5 < item_.offsetBottom)
            ) {
                item_.navTag.classList.add('active');
            } else {
                item_.navTag.classList.remove('active');
            }
        });
    };
    let sectionFadeinArr = document.querySelectorAll('section.hidden');
    let sectionFadeinHandler = () => {
        sectionFadeinArr.forEach((item_, index_) => {
            if ((window.scrollY + window.innerHeight * 0.7) > (item_.offsetTop)) {
                item_.classList.remove('hidden');
            }
        });
        if (window.scrollY + window.innerHeight * 1.5 > document.documentElement.scrollHeight) {
            sectionFadeinArr.forEach((item_, index_) => {
                item_.classList.remove('hidden');
            });
            removeEvent(window, 'scroll', sectionFadeinHandler)
        }
    };
    sectionFadeinHandler();
    addEvent(window, 'scroll', scrollTagMonitor);
    addEvent(window, 'scroll', sectionFadeinHandler);
}

let switchBar = document.querySelector('.portfolioNav hr.switchBar');
let portfolioTagSwitch = (event_) => {
    switchBar.className = 'switchBar ' + event_.target.dataset.switch;
};
document.querySelectorAll('.portfolioNav .portfolioTag').forEach((item_) => {
    addEvent(item_, 'click', portfolioTagSwitch);
});