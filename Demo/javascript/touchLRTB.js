//轮播图触摸滑动事件
var carouseltouch = (function () {
    var x, y,
        doc = document,
        list = doc.querySelector("#list1"),
        left = list.offsetLeft, //ul的左偏移量
        imgWidth = doc.querySelector("#list1 li").clientWidth,//一张图片的宽度
        i = 0,
        dots = doc.getElementsByClassName("dot"), //获取li.dot的集合
        len = dots.length - 1,//len=2
        totalWidth = imgWidth * len * (-1),//可移动的距离
        speed = imgWidth, //每次移动的距离
        isMoved = true; //判断touchmove事件是否要切换图片（第一次移动时切换图片，连续移动，后面的不切换图片）
    var changeImg = function () { //切换图片，并改变图片对应的圆点显示颜色
        dots[i].className = "dot"; //圆点显示为白色
        if (left <= totalWidth) { //最后一张
            i = 0;
            left = 0;
        } else {
            i++;
            left -= speed;
        }
        list.style.left = left + "px";
        dots[i].className = "dot active"; //显示的图片对应圆点标黑
    };
    return { //返回对象
        tStart: function (event) { //获取触摸到屏幕时的坐标
            event.stopPropagation();
            clearInterval(timer); //停止自动滚动图片
            if (isMoved) {

                var touches = event.targetTouches;//获取event.targetTouches对象
                if (touches.length == 1) {
                    x = touches[0].pageX;//获取坐标
                    y = touches[0].pageY;
                }
                isMoved = false;
            }
        },
        tMove: function (event) { //手指在屏幕上移动时触发左/右/上/下滑事件
            event.stopPropagation();
            event.preventDefault(); //默认事件滚动
            if (!isMoved) { //只有手指第一次在屏幕上滑动时，并且满足响应条件，才触发左/右/上/下滑事件
                var touches = event.targetTouches;
                if (touches.length == 1) { //一个手指在屏幕上
                    var x1 = touches[0].pageX, //移动到的坐标
                        y1 = touches[0].pageY;
                    if (((x1 + 50) < x) && (Math.abs(y1 - y) < 50)) { //触摸左滑动,Math.abs(y1 - y) 绝对值
                        isMoved = true; //设置为true，手指在屏幕上连续滑动时，后面满足条件的移动不再触发该事件!import
                        //向左切换图片
                        changeImg();
                    }
                    if (((x1 - 50) > x) && (Math.abs(y1 - y) < 50)) { //触摸右滑动
                        isMoved = true;
                        //向右切换图片
                        dots[i].className = "dot";
                        if (left >= 0) {
                            i = len;
                            left = totalWidth;
                        } else {
                            i--;
                            left += speed;
                        }
                        list.style.left = left + "px";
                        dots[i].className = "dot active";
                    }
                }
            }
        },
        changeImg: function () { //切换图片
            changeImg();
        },
        tEnd: function () {
            event.stopPropagation();
            timer = setInterval(carouseltouch.changeImg, 3000); //开启自动切换图片
        }
    };
})();
var timer = setInterval(carouseltouch.changeImg, 3000); //自动切换图片
document.querySelector('.carousel').addEventListener("touchstart", carouseltouch.tStart, false);
document.querySelector('.carousel').addEventListener("touchmove", carouseltouch.tMove, false);
document.querySelector('.carousel').addEventListener("touchend", carouseltouch.tEnd, false);


//brand触摸滑动事件
var brandUl = document.querySelector('.brand ul');
var brandLists = document.querySelectorAll('.brand ul li');
var brandUlWidth = 0;
for (var i = 0; i < brandLists.length; i++) {
    brandUlWidth += brandLists[i].offsetWidth;
}
brandUl.style.width = brandUlWidth + 'px';
var brandlitouch = (function () {
    var x, y, X, Y, swipeX, swipeY;
    return { //返回对象
        tStart: function (event) { //获取触摸到屏幕时的坐标
            event.stopPropagation();
            x = event.changedTouches[0].pageX - this.offsetLeft;
            y = event.changedTouches[0].pageY - this.offsetTop;
            swipeX = true;
            swipeY = true;
        },
        tMove: function (event) { //手指在屏幕上移动时触发左/右/上/下滑事件
            event.stopPropagation();
            X = event.changedTouches[0].pageX;
            Y = event.changedTouches[0].pageY;
            var moveDistance = X - x;
            // 左右滑动
            if (swipeX && Math.abs(X - x) - Math.abs(Y - y) > 30) {
                this.style.left = moveDistance + 'px';
                swipeY = false;
            }
        },
        tEnd: function (event) {
            event.stopPropagation();
            event.preventDefault(); //默认事件滚动
            if (parseInt(this.offsetLeft) > 0) {
                this.style.left = '0px'
            } else if (parseInt(this.offsetLeft) < parseInt(-(brandUlWidth - document.documentElement.offsetWidth))) {
                this.style.left = -(brandUlWidth - document.documentElement.offsetWidth) + 'px'
            }
        }
    };
})();
brandUl.addEventListener("touchstart", brandlitouch.tStart, false);
brandUl.addEventListener("touchmove", brandlitouch.tMove, false);
brandUl.addEventListener("touchend", brandlitouch.tEnd, false);
