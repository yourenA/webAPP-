#使用Flexible实现手淘H5页面的终端适配
手淘设计师常选择iPhone6作为基准设计尺寸，交付给前端的设计尺寸是按 **750px * 1334px** 为准(高度会随着内容多少而改变)。前端开发人员通过一套适配规则自动适配到其他的尺寸。

###物理像素(physical pixel)
物理像素又被称为设备像素，他是显示设备中一个最微小的物理部件。每个像素可以根据操作系统设置自己的颜色和亮度。正是这些设备像素的微小距离欺骗了我们肉眼看到的图像效果。
###设备独立像素(density-independent pixel)
设备独立像素也称为密度无关像素，可以认为是计算机坐标系统中的一个点，这个点代表一个可以由程序使用的虚拟像素(比如说CSS像素)，然后由相关系统**转换为物理像素**。
###设备像素比(device pixel ratio)
设备像素比简称为dpr，其定义了物理像素和设备独立像素的对应关系。它的值可以按下面的公式计算得到：
```
设备像素比 ＝ 物理像素 / 设备独立像素
```
在JavaScript中，可以通过 window.devicePixelRatio 获取到当前设备的dpr。而在CSS中，可以通过 -webkit-device-pixel-ratio ， -webkit-min-device-pixel-ratio 和 -webkit-max-device-pixel-ratio 
进行媒体查询，对不同dpr的设备，做一些样式适配(这里只针对webkit内核的浏览器和webview)。

iPhone6的设备宽度和高度为 375pt * 667pt ,可以理解为设备的独立像素；而其dpr为 2 ，根据上面公式，我们可以很轻松得知其物理像素为 750pt * 1334pt 。

##lib-flexible是什么？
lib-flexible 是一个制作H5适配的开源库，获取需要的JavaScript和CSS文件。
直接加载阿里CDN的文件：
```
<script src="http://g.tbcdn.cn/mtb/lib-flexible/0.3.4/??flexible_css.js,flexible.js"></script>
```
另外强烈建议对JS做**内联处理** ，在所有资源加载之前执行这个JS。执行这个JS后，会在 <html> 元素上增加一个 data-dpr 属性，以及一个 font-size 样式。
JS会根据不同的设备添加不同的 data-dpr 值，比如说 2 或者 3 ，同时会给 html 加上对应的 font-size 的值，比如说 75px（根据屏幕的不同而不同，与dpr无关） 。
如此一来，页面中的元素，都可以通过 rem 单位来设置。他们会根据 html 元素的 font-size 值做相应的计算，从而实现屏幕的适配效果。
**不需要写\<meta name="viewport"\>**
flexible 实际上
就是能过JS来动态改写 meta 标签
给 <html> 元素添加 data-dpr 属性，并且动态改写 data-dpr 的值
给 <html> 元素添加 font-size 属性，并且动态改写 font-size 的值
```
<html lang="en" data-dpr="1" style="font-size: 37.5px;">
```

除此之外，在引入 lib-flexible 需要执行的JS之前，可以手动设置 meta 来控制 dpr 值，如：
```
<meta name="flexible" content="initial-dpr=2" />
```
在此不建议手动强制设置 dpr ，因为在Flexible中，**只对iOS设备进行 dpr 的判断**，对于**Android系列**，始终认为其 **dpr 为 1 **。


##把视觉稿中的 px 转换成 rem(宽高使用 rem)
首先，目前日常工作当中，视觉设计师给到前端开发人员手中的视觉稿尺寸一般是基于 640px 、 750px 以及 1125px 宽度为准。甚至为什么？大家应该懂的（考虑Retina屏）。

目前Flexible会将视觉稿分成 100份 （主要为了以后能更好的兼容 vh 和 vw ），而每一份被称为一个单位 a 。同时 1rem 单位被认定为 10a 。针对我们这份视觉稿可以计算出：
```
//针对iphone6
1a   = 7.5px
1rem = 75px 
```
那么我们稿子就分成了 10a ，也就是整个宽度为 10rem ， <html> 对应的 font-size 为 75px ：
如果设计图上面宽度为176px,则转换为rem(176/75=2.3466667rem)


##字号不使用 rem
rem 并不适合用到段落文本上。所以在Flexible整个适配方案中，考虑文本还是**使用 px** 作为单位。只不过使用 **[data-dpr]** 属性来区分不同 dpr 下的文本字号大小。
```
<!--这里值针对div进行字号设置-->
div {
	width: 1rem; 
	height: 0.4rem;
	font-size: 12px; // 默认写上dpr为1的fontSize
}
[data-dpr="2"] div {
	font-size: 24px;
}
[data-dpr="3"] div {
	font-size: 36px;
}
```
当然这只是针对于描述性的文本，比如说段落文本。但有的时候文本的字号也需要分场景的，
比如在项目中有一个slogan（标题）,业务方希望这个slogan能根据不同的终端适配。针对这样的场景，完全可以使用 rem 给slogan做计量单位。
