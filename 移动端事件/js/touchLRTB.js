//touch事件实现左右上下触摸滑动事件
var mytouch = (function() {
    var x, y,
        doc = document,
        list = doc.getElementById("list"),
        left = list.offsetLeft, //ul的左偏移量
        imgWidth = doc.getElementById("img").clientWidth,//一张图片的宽度
        i = 0,
        dots = doc.getElementsByClassName("dot"), //获取li.dot的集合
        len = dots.length - 1,//len=2
        totalWidth = imgWidth * len * (-1),//可移动的距离
        speed = 350, //每次移动的距离
        isMoved = true; //判断touchmove事件是否要切换图片（第一次移动时切换图片，连续移动，后面的不切换图片）
    console.log("totalWidth",totalWidth)
    var changeImg = function() { //切换图片，并改变图片对应的圆点显示颜色
        dots[i].className = "dot"; //圆点显示为白色
        console.log("left",left);
        if (left <= totalWidth) { //最后一张
            i = 0;
            left = 0;
        } else {
            i++;
            left -= speed;
        }
        list.style.left = left + "px";
        console.log("list.style.left",list.style.left)
        dots[i].className = "dot active"; //显示的图片对应圆点标黑
    };
    return { //返回对象
        tStart: function(event) { //获取触摸到屏幕时的坐标
            if (isMoved) {//第一次为true
                clearInterval(timer); //停止自动滚动图片
                var touches = event.targetTouches;//获取event.targetTouches对象
                // console.log(event.targetTouches)
                if (touches.length == 1) {//一个手指在屏幕上
                    x = touches[0].pageX;//获取坐标
                    y = touches[0].pageY;
                }
                console.log(x,y)
                isMoved = false;//改变isMoved为false
            }
        },
        tMove: function(event) { //手指在屏幕上移动时触发左/右/上/下滑事件
            event.preventDefault(); //阻止默认事件滚动
            if (!isMoved) { //只有手指第一次在屏幕上滑动时，并且满足响应条件，才触发左/右/上/下滑事件
                var touches = event.targetTouches;
                if (touches.length == 1) { //一个手指在屏幕上
                    var x1 = touches[0].pageX, //移动到的坐标
                        y1 = touches[0].pageY;
                    console.log("x1",x1,"y1",y1)//满足条件才不滑动，所以不满足前会一直打印这个
                    if (((x1 + 30) < x) && (Math.abs(y1 - y) < 20)) { //触摸左滑动,Math.abs(y1 - y) 绝对值
                        isMoved = true;
                        //设置为true，手指在屏幕上连续滑动时，后面满足条件的移动不再触发该事件，所以只会有几个touchMove事件!import
                        //向左切换图片
                        changeImg();
                    }
                    if (((x1 - 30) > x) && (Math.abs(y1 - y) < 20)) { //触摸右滑动
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
                    if ((y1 - 20) > y) //下滑
                    {
                        isMoved = true; //不设置该变量，会导致多个touchmove事件
                        //下拉刷新加载页面，显示顶部刷新图标
                        doc.getElementById("refreshTop").style.display = "block";
                        //提交ajax请求，并进行更新数据，更新完成后，隐藏“刷新图标”

                        //3s后隐藏“刷新图标”(测试用的)
                        setTimeout(function() {
                            doc.getElementById("refreshTop").style.display = "none";
                            alert("刷新完成");
                        }, 3000);
                    }
                    if (((y1 + 20) < y)) //上滑
                    {
                        isMoved = true;
                        //上拉刷新加载页面，显示底部刷新图标
                        doc.getElementById("refreshbottom").style.display = "block";
                        //提交ajax请求，并进行更新数据，更新完成后，隐藏“刷新图标”

                        //3s后隐藏“刷新图标”(测试用的)
                        setTimeout(function() {
                            doc.getElementById("refreshbottom").style.display = "none";
                            alert("加载完成");
                        }, 3000);
                    }
                }
            }
        },
        changeImg: function() { //切换图片
            changeImg();
        },
        tEnd: function() {
            timer = setInterval(mytouch.changeImg, 3000); //开启自动切换图片
        }
    };
})();
var timer = setInterval(mytouch.changeImg, 3000); //自动切换图片
//触摸左/右滑切换图片
document.addEventListener("touchstart", mytouch.tStart, false);
document.addEventListener("touchmove", mytouch.tMove, false);
document.addEventListener("touchend", mytouch.tEnd, false);