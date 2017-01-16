# Flex Layout
```
.flex{
            width:100%;
            /*旧版语法*/
            /*display: -webkit-box;*/
            /*display: -ms-flexbox; */
            /*display: -moz-box;*/

            /*新版语法*/
            /*display: -webkit-flex;*/
            /*display: flex;*/

            /*移动端+PC端*/
            display: -webkit-box;       /*-IOS6以及以前：Safari3.1~6 */
            display: -webkit-flex;      /* Chrome, WebKit  */
            display: flex;              /* Firefox20+,Chrome40+, */
        }
        .flex .hor{
            /*PC端*/
            /*-webkit-box-flex: 1;*/
            /*-moz-box-flex: 1;*/
            /*-webkit-flex: 1;*/
            /*-ms-flex: 1;*/
            /*flex: 1;*/
            /*移动端*/
            -webkit-box-flex: 1;
            -webkit-flex: 1;
            flex: 1;
        }
```

## 容器的属性
以下6个属性设置在容器上

1. flex-direction  //主轴方向
       row（默认值）：主轴为水平方向，起点在左端。
       row-reverse：主轴为水平方向，起点在右端。
       column：主轴为垂直方向，起点在上沿。
       column-reverse：主轴为垂直方向，起点在下沿。
2. flex-wrap    //默认情况下，项目都排在一条线（又称"轴线"）上。flex-wrap属性定义，如果一条轴线排不下，如何换行。
       nowrap（默认）：不换行。
       wrap：换行，第一行在上方。
       wrap-reverse：换行，第一行在下方。
3. flex-flow    //flex-flow属性是flex-direction属性和flex-wrap属性的简写形式，默认值为row nowrap。

4. justify-content  //定义了项目在**主轴**上的对齐方式。(justify:对齐)
        flex-start（默认值）：左对齐
        flex-end：右对齐
        center： 居中
        space-between：两端对齐，项目之间的间隔都相等。
        space-around：每个项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍。

5. align-items  //定义项目在**交叉轴**上如何对齐。(单行内容)
        flex-start：交叉轴的起点对齐。
        flex-end：交叉轴的终点对齐。
        center：交叉轴的中点对齐。
        baseline: 项目的第一行文字的基线对齐。
        stretch（默认值）：如果项目未设置高度或设为auto，将占满整个容器的高度。
6. align-content    //定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用。（多行内容）
        flex-start：与交叉轴的起点对齐。
        flex-end：与交叉轴的终点对齐。
        center：与交叉轴的中点对齐。
        space-between：与交叉轴两端对齐，轴线之间的间隔平均分布。
        space-around：每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍。
        stretch（默认值）：轴线占满整个交叉轴。

## 项目属性
以下6个属性设置在项目上。
1. order    //定义项目的排列顺序。数值越小，排列越靠前，默认为0。

2. flex-grow    //flex-grow属性定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。

3. flex-shrink  //定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。(shrink:收缩)

4. flex-basis   //flex-basis属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小。
        它可以设为跟width或height属性一样的值（比如350px），则项目将占据固定空间
5. flex //flex属性是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto。后两个属性可选。
        建议优先使用这个属性，而不是单独写三个分离的属性，因为浏览器会推算相关值。
6. align-self   //align-self属性允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性。默认值为auto，表示继承父元素的align-items属性，如果没有父元素，则等同于stretch。

##九宫格 http://www.ruanyifeng.com/blog/2015/07/flex-examples.html
###居中对齐
```
.box {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}
```
###两点对角对齐
```
.box {
  display: flex;
  justify-content: space-between;//主轴两端对齐
}

.item:nth-child(2) {
  align-self: flex-end;//交叉轴右下角
}
```

###三点对角对齐
```
.box {
  display: flex;
}

.item:nth-child(2) {
  align-self: center;
}

.item:nth-child(3) {
  align-self: flex-end;
}
```

###四点对齐
```

<div class="box">
  <div class="column">
    <span class="item"></span>
    <span class="item"></span>
  </div>
  <div class="column">
    <span class="item"></span>
    <span class="item"></span>
  </div>
</div>
```
```
.box {
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
}

.column {
  flex-basis: 100%;
  display: flex;
  justify-content: space-between;
}
```
