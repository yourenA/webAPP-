#webAPP入门最佳实践

###meta
* H5页面窗口自动调整到设备宽度，并禁止用户缩放页面
```
<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
```
* 忽略将页面中的数字识别为电话号码
```
<meta name="format-detection" content="telephone=no" />
```
* 忽略Android平台中对邮箱地址的识别
```
<meta name="format-detection" content="email=no" />
```
* 允许全屏
```
"添加到主屏幕“后，全屏显示 <meta name="apple-mobile-web-app-capable" content="yes" />
这meta的作用就是删除默认的苹果工具栏和菜单栏。content有两个值”yes”和”no”,当我们需要显示工具栏和菜单栏时，这个行meta就不用加了，默认就是显示。
```
* 当网站添加到主屏幕快速启动方式，可隐藏地址栏，仅针对ios的safari
```
<meta name="apple-mobile-web-app-capable" content="yes" />
<!-- ios7.0版本以后，safari上已看不到效果 -->
```
* 将网站添加到主屏幕快速启动方式，仅针对ios的safari顶端状态条的样式
```
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<!-- 可选default、black、black-translucent -->
```
* 禁止百度转码
```
<meta http-equiv="Cache-Control" content="no-siteapp">
```
* 添加到主屏后的APP图标
```
<!-- 设计原图 -->
 <link href="short_cut_114x114.png" rel="apple-touch-icon-precomposed"> 
<!-- 添加高光效果 -->
 <link href="short_cut_114x114.png" rel="apple-touch-icon">
```
viewport模板
viewport模板——通用
```
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no" name="viewport">
<meta content="yes" name="apple-mobile-web-app-capable">
<meta content="black" name="apple-mobile-web-app-status-bar-style">
<meta content="telephone=no" name="format-detection">
<meta content="email=no" name="format-detection">
<title>标题</title>
<link rel="stylesheet" href="index.css">
</head>

<body>
这里开始内容
</body>
</html>
```
viewport模板 - target-densitydpi=device-dpi，android 2.3.5以下版本不支持
```
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=750, user-scalable=no, target-densitydpi=device-dpi"><!-- 强制设置页面的固定宽度，width取值与页面定义的宽度一致 -->
<meta content="yes" name="apple-mobile-web-app-capable">
<meta content="black" name="apple-mobile-web-app-status-bar-style">
<meta content="telephone=no" name="format-detection">
<meta content="email=no" name="format-detection">
<title>标题</title>
<link rel="stylesheet" href="index.css">
</head>

<body>
这里开始内容
</body>

</html>
```
> target-densitydpi：webkit内核已不准备再支持

###动态设置HTML的字号
```
<script>
    var iWidth = document.documentElement.clientWidth;
    document.getElementsByTagName("html")[0].style.fontSize = iWidth / 3 + "px";
</script>
```
使用rem进行设置宽高
###移动端如何定义字体font-family
各个手机系统有自己的默认字体，且都不支持微软雅黑
如无特殊需求，手机端无需定义中文字体，使用系统默认
英文字体和数字字体可使用 Helvetica ，三种系统都支持

中文字体使用系统默认即可，英文用Helvetica
````
   /* 移动端定义字体的代码 */
   body{font-family:Helvetica;}
````

###移动端字体单位font-size选择px还是rem
对于只需要适配少部分手机设备，且分辨率对页面影响不大的，使用px即可
对于需要适配各种移动设备，使用rem，例如只需要适配iPhone和iPad等分辨率差别比较挺大的设备
rem配置参考，适合视觉稿宽度为640px的：
```
html{font-size:10px}
@media screen and (min-width:321px) and (max-width:375px){html{font-size:11px}}
@media screen and (min-width:376px) and (max-width:414px){html{font-size:12px}}
@media screen and (min-width:415px) and (max-width:639px){html{font-size:15px}}
@media screen and (min-width:640px) and (max-width:719px){html{font-size:20px}}
@media screen and (min-width:720px) and (max-width:749px){html{font-size:22.5px}}
@media screen and (min-width:750px) and (max-width:799px){html{font-size:23.5px}}
@media screen and (min-width:800px){html{font-size:25px}}
```

###移动端touch事件(区分webkit 和 winphone)
当用户手指放在移动设备在屏幕上滑动会触发的touch事件

以下支持webkit

* touchstart——当手指触碰屏幕时候发生。不管当前有多少只手指
* touchmove——当手指在屏幕上滑动时连续触发。通常我们再滑屏页面，会调用event的preventDefault()可以阻止默认情况的发生：阻止页面滚动
* touchend——当手指离开屏幕时触发
* touchcancel——系统停止跟踪触摸时候会触发。例如在触摸过程中突然页面alert()一个提示框，此时会触发该事件，这个事件比较少用
> 使用addEventLister添加事件才起作用，直接使用DOM0级事件会不起作用
```
el.addEventListener(eventType, function () {
}, false);
该方法应用至dom节点
第一个参数为事件名
第二个为事件处理程序
第三个为布尔值，true便是事件捕获，false为事件冒泡
```

TouchEvent

* touches：屏幕上所有手指的信息
* targetTouches：手指在目标区域的手指信息
* changedTouches：最近一次触发该事件的手指信息
* touchend时，touches与targetTouches信息会被删除，changedTouches保存的最后一次的信息，最好用于计算手指信息
参数信息(changedTouches[0])

clientX、clientY在显示区的坐标
target：当前元素

以下支持winphone 8

* MSPointerDown——当手指触碰屏幕时候发生。不管当前有多少只手指
* MSPointerMove——当手指在屏幕上滑动时连续触发。通常我们再滑屏页面，会调用css的html{-ms-touch-action: none;}可以阻止默认情况的发生：阻止页面滚动
* MSPointerUp——当手指离开屏幕时触发

###移动端click屏幕产生200-300 ms的延迟响应
移动设备上的web网页是有300ms延迟的，玩玩会造成按钮点击延迟甚至是点击失效。
解决方案：

* fastclick可以解决在手机上点击事件的300ms延迟
* zepto的touch模块，tap事件也是为了解决在click的延迟问题

###触摸事件的响应顺序
1. ontouchstart 
2. ontouchmove 
3. ontouchend 
4. onclick
解决300ms延迟的问题，也可以通过绑定ontouchstart事件，加快对事件的响应

###什么是Retina 显示屏，带来了什么问题
retina：一种具备超高像素密度的液晶屏，同样大小的屏幕上显示的像素点由1个变为多个，如在同样带下的屏幕上，苹果设备的retina显示屏中，像素点1个变为4个
在高清显示屏中的位图被放大，图片会变得模糊，因此移动端的视觉稿通常会设计为传统PC的2倍
那么，前端的应对方案是：
设计稿切出来的图片长宽保证为偶数，并使用backgroud-size把图片缩小为原来的1/2
```
//例如设计图图片宽高为：200px*200px，那么写法如下
.css{width:100px;height:100px;background-size:100px 100px;}
```
其它元素的取值为原来的1/2，例如视觉稿40px的字体，使用样式的写法为20px
```
.css{font-size:20px}
```
简单介绍下 devicePixelRatio ，它是设备上物理像素和设备独立像素( device-independent pixels (dips) )的比例，即 devicePixelRatio = 屏幕物理像素/设备独立像素 
例如iPhone4S，分辨率为：960×640，取屏幕宽度计算，物理像素640px，设备独立像素320px，那么，devicePixelRatio 值为 640px / 320px = 2，又如iPhone3，计算出来的 devicePixelRatio 值为 320px / 320px = 1
那么，通过计算 devicePixelRatio 的值，是可以区分普通显示屏和高清显示器，当devicePixelRatio值等于1时（也就是最小值），那么它普通显示屏，当devicePixelRatio值大于1(通常是1.5、2.0)，那么它就是高清显示屏

通过判断 devicePixelRatio 的值来加载不同尺寸的图片
1. 针对普通显示屏(devicePixelRatio = 1.0、1.3)，加载一张1倍的图片
2. 针对高清显示屏(devicePixelRatio >= 1.5、2.0、3.0)，加载一张2倍大的图片
```
.css{/* 普通显示屏(设备像素比例小于等于1.3)使用1倍的图 */ 
    background-image: url(img_1x.png);
}
@media only screen and (-webkit-min-device-pixel-ratio:1.5){
.css{/* 高清显示屏(设备像素比例大于等于1.5)使用2倍图  */
    background-image: url(img_2x.png);
  }
}
```

###ios系统中元素被触摸时产生的半透明灰色遮罩怎么去掉
###部分android系统中元素被点击时产生的边框(遮罩)怎么去掉
android用户点击一个链接，会出现一个边框或者半透明灰色遮罩, 不同生产商定义出来额效果不一样，可设置-webkit-tap-highlight-color的alpha值为0去除部分机器自带的效果
```
a,button,input,textarea{
-webkit-tap-highlight-color: rgba(0,0,0,0;)
}
```
###winphone系统a、input标签被点击时产生的半透明灰色背景怎么去掉
```
<meta name="msapplication-tap-highlight" content="no">
```

###webkit表单元素的默认外观怎么重置
1. 通用
```
.css{-webkit-appearance:none;appearance:none; }
```
2. 伪元素改变number类型input框的默认样式
```
input[type=number]::-webkit-textfield-decoration-container {
    background-color: transparent;    
}
input[type=number]::-webkit-inner-spin-button {
     -webkit-appearance: none;
}
input[type=number]::-webkit-outer-spin-button {
     -webkit-appearance: none;
}
```
3. webkit表单输入框placeholder的颜色值能改变么
```
input::-webkit-input-placeholder{color:#AAAAAA;}
input:focus::-webkit-input-placeholder{color:#EEEEEE;}
```
###IE10（winphone8）表单元素默认外观如何重置
1. 禁用 radio 和 checkbox 默认样式
::-ms-check 适用于表单复选框或单选按钮默认图标的修改，同样有多个属性值，设置它隐藏 (display:none) 并使用背景图片来修饰可得到我们想要的效果。
```
input[type=radio]::-ms-check,input[type=checkbox]::-ms-check{
display: none;
}
```
2. 禁用 select 默认下拉箭头
::-ms-expand 适用于表单选择控件下拉箭头的修改，有多个属性值，设置它隐藏 (display:none) 并使用背景图片来修饰可得到我们想要的效果。
```
select::-ms-expand {
display: none;
}
```
###取消input在ios下，输入的时候英文首字母的默认大写
```<input autocapitalize="off" autocorrect="off" />   ```
###关闭iOS输入自动修正
和英文输入默认自动首字母大写那样，IOS还做了一个功能，默认输入法会开启自动修正输入内容，这样的话，用户经常要操作两次。如果不希望开启此功能，我们可以通过input标签属性来关闭掉：
```<input type="text" autocorrect="off" /> ```
###禁止ios 长按时不触发系统的菜单，禁止ios&android长按时下载图片
```.css{-webkit-touch-callout: none}```
###禁止ios和android用户选中文字
```.css{-webkit-user-select:none}```

###打电话发短信写邮件怎么实现
打电话```<a href="tel:0755-10086">打电话给:0755-10086</a>```
发短信，winphone系统无效```<a href="sms:10086">发短信给: 10086</a>```
写邮件```<a href="mailto:peun@foxmail.com">peun@foxmail.com</a>```

###模拟按钮hover效果
移动端触摸按钮的效果，可明示用户有些事情正要发生，是一个比较好体验，但是移动设备中并没有鼠标指针，使用css的hover并不能满足我们的需求，还好国外有个激活移动端css的active效果。
直接在body上添加ontouchstart，同样可激活移动端css的active效果，比较推荐这种方式，代码如下：
```
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no" name="viewport">
<meta content="yes" name="apple-mobile-web-app-capable">
<meta content="black" name="apple-mobile-web-app-status-bar-style">
<meta content="telephone=no" name="format-detection">
<meta content="email=no" name="format-detection">
<style type="text/css">
a{-webkit-tap-highlight-color: rgba(0,0,0,0);}
.btn-blue{display:block;height:42px;line-height:42px;text-align:center;border-radius:4px;font-size:18px;color:#FFFFFF;background-color: #4185F3;}
.btn-blue:active{background-color: #357AE8;}
</style>
</head>
<body ontouchstart>
<div class="btn-blue">按钮</div>
//或者设置
//<script type="text/javascript">
//document.addEventListener("touchstart", function(){}, true)
//</script>
</body>
</html>
```

要做到全兼容的办法，可通过绑定ontouchstart和ontouchend来控制按钮的类名
```
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no" name="viewport">
<meta content="yes" name="apple-mobile-web-app-capable">
<meta content="black" name="apple-mobile-web-app-status-bar-style">
<meta content="telephone=no" name="format-detection">
<meta content="email=no" name="format-detection">
<style type="text/css">
a{-webkit-tap-highlight-color: rgba(0,0,0,0);}
.btn-blue{display:block;height:42px;line-height:42px;text-align:center;border-radius:4px;font-size:18px;color:#FFFFFF;background-color: #4185F3;}
.btn-blue-on{background-color: #357AE8;}
</style>
</head>
<body>

<div class="btn-blue">按钮</div>

<script type="text/javascript">
var btnBlue = document.querySelector(".btn-blue");
btnBlue.ontouchstart = function(){
    this.className = "btn-blue btn-blue-on"
}
btnBlue.ontouchend = function(){
    this.className = "btn-blue"
}
</script>
</body>
</html>
```

###屏幕旋转的事件和样式
```
window.onorientationchange = function(){
    switch(window.orientation){
        case -90:
        case 90:
        alert("横屏:" + window.orientation);
        case 0:
        case 180:
        alert("竖屏:" + window.orientation);
        break;
    }
}
```
```
//竖屏时使用的样式
@media all and (orientation:portrait) {
.css{}
}

//横屏时使用的样式
@media all and (orientation:landscape) {
.css{}
}
```

###audio元素和video元素在ios和andriod中无法自动播放
   应对方案：触屏即播
   ```
   $('html').one('touchstart',function(){
       audio.play()
   })
   ```
###手机拍照和上传图片
   ```
   <!-- 选择照片 -->
   <input type=file accept="image/*">
   <!-- 选择视频 -->
   <input type=file accept="video/*">
   ```
   使用总结：
   *  ios 有拍照、录像、选取本地图片功能
   * 部分android只有选取本地图片功能
   * winphone不支持
   * input控件默认外观丑陋
   
###开启硬件加速
 
   解决页面闪白
   保证动画流畅
```
.css {
   -webkit-transform: translate3d(0, 0, 0);
   -moz-transform: translate3d(0, 0, 0);
   -ms-transform: translate3d(0, 0, 0);
   transform: translate3d(0, 0, 0);
}
```

##JS动态改变HTML的fontSize并且动态生成meta标签
```
<script>
    (function (doc, win) {
        // 分辨率Resolution适配
        var docEl = doc.documentElement;//document根标签
        var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';//判断事件类型
        var recalc=function() { //事件回调
            var clientWidth = docEl.clientWidth;//document的宽度
            if (!clientWidth) return;
            docEl.style.fontSize = 100 * (clientWidth / 320) + 'px'; //改变document（既HTML标签）的fontSize字号
        };
        /*监听事件*/
        if (!doc.addEventListener) return;
        win.addEventListener(resizeEvt, recalc, false);
        doc.addEventListener('DOMContentLoaded', recalc, false);

        // 一物理像素在不同屏幕的显示效果不一样。要根据devicePixelRatio来修改meta标签的scale,要注释上面的meta标签
        (function () {
            var dpr = scale = 1;//将dpr与缩放比例都初始化为1
            var isIPhone = win.navigator.appVersion.match(/iphone/gi);//判断是否是iphone
            console.log( win.navigator.appVersion);
            var devicePixelRatio = win.devicePixelRatio;
            console.log("devicePixelRatio", devicePixelRatio);
            console.log("isIPhone",isIPhone);
            if (isIPhone) {
                // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
                if (devicePixelRatio >= 3 ) {
                    dpr = 3;
                } else if (devicePixelRatio >= 2 ) {
                    dpr = 2;
                } else {
                    dpr = 1;
                }
            } else {
                // 其他设备下，仍旧使用1倍的方案
                dpr = 1;
            }
            /*页面缩放比例*/
            scale = 1 / dpr;

            //动态添加meta标签
            var metaEl = "";
            metaEl = doc.createElement('meta');
            metaEl.setAttribute('name', 'viewport');
            metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
            console.log(docEl.firstElementChild);

            if (docEl.firstElementChild) {
                docEl.firstElementChild.appendChild(metaEl);
            } else {
                var wrap = doc.createElement('div');
                wrap.appendChild(metaEl);
                doc.write(wrap.innerHTML);
            }
        })();

    })(document, window);
</script>

```
