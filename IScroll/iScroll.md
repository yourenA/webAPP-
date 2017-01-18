#iScroll滚动插件
github项目地址：https://github.com/cubiq/iscroll
使用教程：https://segmentfault.com/a/1190000003113280

配置
```
var myScroll = new IScroll('#wrapper', {options);
```
options参数
mouseWheel: true 鼠标支持
scrollbars: true 滚动条支持   

####scrollTo(x, y, time, easing)
对应存在的一个叫做myScroll的iScroll实例，可以通过下面的方式滚动到任意的位置：
```
myScroll.scrollTo(0, -100);
```
通过上面的方式将向下滚动100个像素。记住：0永远是左上角。需要滚动你必须传递负数。
time 和 easing是可选项。他们控制滚动周期（毫秒级别）和动画的擦除效果。
擦除功能是一个有效的IScroll.utils.ease对象。例如应用一个一秒的经典擦除动画你应该这么做：
```
myScroll.scrollTo(0, -100, 1000, IScroll.utils.ease.elastic);
```

####scrollBy(x, y, time, easing)
和上面一个方法类似，但是可以传递X和Y的值从当前位置进行滚动。
```
myScroll.scrollBy(0, -10);
```
上面这个语句将在当前位置向下滚动10个像素。如果你当前所在位置为-100，那么滚动结束后位置为-110.

####scrollToElement(el, time, offsetX, offsetY, easing)
这是一个很有用的方法，你会喜欢它的。
在这个方法中只有一个强制的参数就是el。传递一个元素或者一个选择器，iScroll将尝试滚动到这个元素的左上角位置。
time是可选项，用于设置动画周期。
offsetX 和 offsetY定义像素级的偏移量，所以你可以滚动到元素并且加上特别的偏移量。但并不仅限于此。如果把这两个参数设置为true，元素将会位于屏幕的中间。
easing参数和scrollTo方法里的一样。

####缩放
为了使用缩放功能，你最好使用iscroll-zoom.js脚本。和前面的示例一样，一个好的缩放功能的配置如下：

myScroll = new IScroll('#wrapper', {
    zoom: true,
    mouseWheel: true,
    wheelAction: 'zoom'
});

####刷新
iScroll需要知道包装器和滚动器确切的尺寸，在iScroll初始化的时候进行计算，如果元素大小发生了变化，需要告诉iScroll DOM发生了变化。下面将提供调用refresh方法的正确时机。

每次触摸DOM，浏览器渲染器重绘页面。一旦发生了重画我们可以安全地读新的DOM属性。重新绘制阶段不是瞬时发生的只是范围结束时触发。这就是为什么我们需要给渲染器刷新iScroll之前一点时间。

为了确保javascript得到更新后的属性，应该像下面的例子这样使用刷新方法：
```
ajax('page.php', onCompletion);

function onCompletion () {
    // Update here your DOM

    setTimeout(function () {
        myScroll.refresh();
    }, 0);
};
```
这里调用refresh()使用了零秒等待，如果你需要立即刷新iScroll边界就是如此使用。当然还有其他方法可以等待页面重绘，但零超时方式相当稳定。

####自定义事件
iScroll还提供额一些你可以挂靠的有用的自定义事件。使用on(type, fn)方法注册事件。
```
myScroll = new IScroll('#wrapper');
myScroll.on('scrollEnd', doSomething);
```
上面的代码会在每次滚动停止是执行doSomething方法。可以挂靠的事件如下：

beforeScrollStart，在用户触摸屏幕但还没有开始滚动时触发。
scrollCancel，滚动初始化完成，但没有执行。
scrollStart，开始滚动
scroll，内容滚动时触发，只有在scroll-probe.js版本中有效，请参考onScroll event。
scrollEnd，停止滚动时触发。
flick，用户打开左/右。
zoomStart，开始缩放。
zoomEnd，缩放结束。