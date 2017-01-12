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
