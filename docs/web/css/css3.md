---
title: CSS3常用功能
date: 2018-03-31
author: 十一
tag: CSS3
meta:
  - name: description
    content: css3 圆角、盒状阴影、线性渐变、透明、旋转、变形、移位
  - name: keywords
    content: css css3 动画性能 回流 重绘 前端
---

## CSS3常用功能

1、圆角
* `Border-radius: 30px`
* 所有IE都不支持CSS圆角，要IE9才行

2、盒状阴影(`Box Shadow`)
* `Box-shadow: 3px 4px 4px #ffffff`
* 四个参数，分别为：X轴偏移值、Y轴偏移值、阴影的模糊度、以及阴影的颜色。

<!-- more -->

3、线性渐变（`Gradient`）
`Firefox：-moz-linear-gradient(top, #444444, #999999)`;
* 第一个参数表示线性渐变的方向，`top`是从上到下、`left`从左到右，如果定义为`left top`，就是从左上角到右下角。
* 第二个参数和第三个参数分别是起点颜色和终点颜色。可以在中间插入多种颜色，表示多种颜色的渐变。
`Webkit：-webkit-gradient(linear,left top, left bottom, color-stop(0, #444444),color-stop(1, #999999));`
* 第一个表示渐变的类型（`type`），`linear`(线性渐变)或者`radial`（辐射渐变）。
* 第二个参数和第三个参数，都是一对值，分别表示渐变起点和终点，可用坐标形式表示，可以用关键值表示。
* 第三个参数和第四个参数，分别表示两个color-stop函数，该函数接受两个参数，第一个表示渐变的位置，0为起点，0.5为中点，1为结束点；第二个参数表示该点的颜色。
`DXImageTransform.Microsoft.gradient(startColorStr='#444444', endColorStr='#999999', GradientType='0’)`;
* IE靠滤镜实现渐变。`startColorStr`表示起点的颜色，`endColorStr`表示终点的颜色。
* GradientType表示渐变类型，0位缺省值，表示垂直渐变，1表示水平渐变。

4、透明（`opacity`）
* 将上层对象的颜色变为透明，可以透过它看到下层对象，如朦层。
* `background-color: rgba(180, 180, 144, 0.6)`;
* 除IE浏览器外几乎都支持rgba函数，第四个为透明度。

5、旋转（`rotation`）
* 旋转`rotate()`函数通过指定的角度参数使元素相对原点进行旋转，主要在二位空间内进行操作。
* 正值即相对原点中心顺时针旋转，负值即相对原点中心逆时针旋转。

6、变形（`transfrom`）
* 扭曲（`skew`）
           Skew函数能够让元素倾斜显示，可以将一个对象以其中心位置围绕X轴和Y轴按照一定的角度倾斜。
           rotate函数只是旋转，不会改变元素的形状；shew函数不会旋转，而只会改变元素的形状。
           skew(x,y)使元素在水平和垂直方向同时扭曲
           skewX(x)仅使元素在水平方向扭曲变形（X轴扭曲变形）；
           skewY(y)仅使元素在垂直方向扭曲变形（Y轴扭曲变形）

* 缩放（`scale`）
           缩放函数让元素根据中心原点对对象进行缩放。
            scale(X,Y)使元素水平方向和垂直方向同时缩放（也就是X轴和Y轴同时缩放）
           scaleX(x)元素仅水平方向缩放（X轴缩放）
           scaleY(y)元素仅垂直方向缩放（Y轴缩放）

* 变动、移位（`translate`）
           translate函数可以将元素向指定的方向移动，类似于position中的relative
           translate(x,y)水平方向和垂直方向同时移动（也就是X轴和Y轴同时移动）
           translateX(x)仅水平方向移动（X轴移动）
           translateY(Y)仅垂直方向移动（Y轴移动）

7、过渡（`transition`）
* transition的作用是，制定状态变化所需的时间

```css
img{
    transition: 1s;
}
```

  即图片放大的过程需要1秒
* 可制定transition适用的属性，如height，即height的变化需要1秒实现，其他变化瞬间实现

```css
img{
    transition: 1s height;
}
```

* 延迟——delay，制定一个delay参数，width在1秒之后，再开始变化，就是延迟1秒。

```css
 img{
     transition: 1s height, 1s 1s width;
 }
```

  delay可以指定动画发生的顺序，使得多个不同的transition可以连在一起，形成复杂的效果。
* 变化速度——timing function，默认不是匀速，逐渐放慢，这叫ease。

```css
img{
    transition: 1s ease;
}
           linear：匀速
           ease-in：加速
           ease-out：减速
           cubic-bezier函数：自定义速度模式
```

* transition的完整写下

```css
img{
    transition: 1s 1s height ease;
}
img{
    transition-property: height;
    transition-duration: 1s;
    transition-delay: 1s;
    transition-timing-function: ease;
    }
```

* transition需要明确知道开始状态和结束状态的具体数值，只有两个状态，不能定义中间状态。
* transition需要事件触发，没法在网页加载时自动发生。
* transition是一次性的，不能重复发生，除非一再出发。
* 一条transition规则，只能定义一个属性的变化，不能涉及多个属性。

8、动画（animation）

Animation指定动画一个周期持续的时间，以及动画效果的名称。
*  当鼠标悬停在div元素上时，会产生名为rainbow的动画效果，持续时间为1秒。

```css
div:hover {
  animation: 1s rainbow;
}
@keyframes rainbow {
  0% { background: #c00; }
  50% { background: orange; }
  100% { background: yellowgreen; }
  }
```

* 播放次数

```css
div:hover {
  animation: 1s rainbow infinite;  //无限次播放
}
div:hover {
 animation: 1s rainbow 3;  //3次
}
```

* animation-fill-mode属性，forwards表示让动画停留在结束状态

```css
div:hover {
 animation: 1s rainbow forwards;
}
```

  .none：默认值，回到动画没开始的状态

  .backwards：让动画回到第一帧的状态

  .both：根据animation-direction轮流应用forwards和backwards规则

* animation-direction，动画播放方向，常用的是normal和reverse。
* animation的完整形式

```css
    div:hover {
      animation: 1s 1s rainbow linear 3 forwards normal;
    }
    div:hover {
      animation-name: rainbow;
      animation-duration: 1s;
      animation-timing-function: linear;
      animation-delay: 1s;
      animation-fill-mode:forwards;
      animation-direction: normal;
      animation-iteration-count: 3;
    }
```

* keyframes关键字用来定义动画的各个状态
* 浏览器从一个状态向一个状态过渡，是平滑过渡，steps函数可以实现分步过渡。
* IE10和Firefox支持没有前缀的animation，而chrome不支持，必须使用webkit前缀。