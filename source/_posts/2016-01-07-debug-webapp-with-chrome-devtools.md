title: 使用Chrome开发工具优化Web应用
subtitle: 本文主要介绍如何使用Chrome开发工具的Timeline功能来监控Web应用的性能，找出问题，并由此延伸出一些优化Web应用性能的思路。
cover: http://7xt3gj.com1.z0.glb.clouddn.com/Simbachen/cover.jpg
categories: 性能优化
tags:
  - chrome
  - DevTool
author:
  nick: Simba
  github_name: Simbachen
date: 2016-01-07 
---

当我们写了一组炫(fu)酷(za)的H5动效后，发现在移动端上会卡顿，该怎么办？
目前市场上大多数设备的屏幕刷新频率是60Hz，想要用户滑动页面或者播放动画没有卡顿，浏览器的渲染速率就要和屏幕刷新的频率同步，达到60fps。

Chrome开发工具的Timeline面板监控了web应用运行时所有活动情况，不过它的功能很多，对于英文不好的童鞋，有点无从下手，下面直接上手来使用。

## 首先，审查一个页面，切换到Timeline面板。
{% pimg http://7xt3gj.com1.z0.glb.clouddn.com/Simbachen/panel.png [Timeline面板] %}

图中红框标出的部分是功能栏：从45到47版本，Timeline工具连续都有更新，当前截图的版本号是47.0；

>* 开始/停止记录，打开Timeline面板时刷新页面会自动开始记录
* 清除已有记录
* 过滤内容
* 强制垃圾回收
* 视图模式，最新版本中点击切换两种视图模式
* 捕获内容选项，选中最后一项截屏的话会保留每帧的截图，记录数据的buffer空间会和快被占满

## 接下来记录一段时间线状态。

{% pimg http://7xt3gj.com1.z0.glb.clouddn.com/Simbachen/frames.png [Timeline面板] %}
图中没被标出的部分是整个监控过程中的数据概览；红框标出的部分有两栏，上面是选中的时间段内每一帧的情况，下面是内存占用的变化。

浏览器渲染的速率达到60帧/秒，那么每一帧只有1000ms / 60 = 16.67ms的时间来响应，其中浏览器在每一帧还要做一些额外的事情，因为我们要保证每一帧的CPU time在12ms左右。

有红色三角形角标标出的表示当前帧消耗过多时间
{% pimg http://7xt3gj.com1.z0.glb.clouddn.com/Simbachen/frames01.png [Timeline面板] %}

点击选中一帧可以看到当前帧的详细情况，图中显示，当前帧的渲染消耗了30.8ms，可能会造成卡顿。
饼图中可能会有五个颜色：

>* 蓝色： 加载
* 黄色： 脚本执行
* 紫色： 渲染
* 绿色： 绘制
* 灰色： DevTools不感知的活动

图中帧因为没有加载活动，没有蓝色区域。可以看出脚本执行和帧绘制占据了大部分面积，不过问题并不在这里，因为它们总共才花费7.82s。
在Chrome的45.0版本中，饼图里还有一种颜色：白色，表示刷新周期里空闲的时间。在这段时间里，一直在等待用户的响应，直到一个交互事件触发了页面视图的变化。最新的更新里在饼图中去掉了白色，区分为CPU time和帧的Duration，更加合理。这里引起视图渲染和绘制可能有：
1. 用户的交互行为
2. 定时器触发

使用requestAnimationFrame这个函数，将脚本执行和渲染流程联系起来，以避免在某一帧的中间突然执行脚本导致重新渲染和绘制而整个过程不能在16ms内完成。


## 分析一个问题帧
{% pimg http://7xt3gj.com1.z0.glb.clouddn.com/Simbachen/frames02.png [Timeline面板] %}

这一帧比较极端，从图上看就是紫色部分花费掉了大量时间，我们就可以从这里入手来优化代码，在此之前先得了解一下浏览器绘制帧的整个过程。实际导致绘制帧卡顿可能是其中任何一个环节。


{% pimg http://7xt3gj.com1.z0.glb.clouddn.com/Simbachen/frame-full.jpg [Timeline面板] %}

>* Javascript： 除了使用Javascrit来实现视觉变化，还有CSS Animations、 Transitions。
* Style： 根据CSS选择器，对每个DOM元素匹配对应的CSS样式。
* Layout: 在上一步确定了每个DOM元素的样式规则后，这一步就是具体计算每个DOM元素最终在屏幕上显示的大小和位置。web页面中元素的布局是相对的，因此一个元素的布局发生变化，会联动地引发其他元素的布局发生变化。例如父元素的宽度变化引发子元素宽度变化，又联动的引发孙子元素的宽度变化。
* Painting： 绘制，本质上就是填充像素的过程。包括绘制文字、颜色、图像、边框和阴影等，也就是一个DOM元素所有的可视效果。一般来说，这个绘制过程是在多个层上完成的。
* Composite： 上一步的绘制是在多个层上进行的，在这一步，浏览器会将所有层按照合理的顺序合并成一个图层，然后显示在屏幕上。


说明，上述过程的解释总结或直接引用自谷歌开发者文档。

在以上5个过程里：

1. 修改DOM元素的“layout”(宽、高、位置)属性，浏览器会检查哪些元素需要重新布局，然后对页面激发一个reflow过程完成重新布局。被reflow的元素，接下来也会激发绘制过程，最后激发渲染层合并过程，生成最后的画面。
2. DOM元素有一些“paint only”属性，例如背景图片、文字颜色、阴影，这些属性不会影响页面的布局，因此浏览器会在完成样式计算之后，跳过布局过程，只做绘制和渲染层合并过程。
3. 还有一些CSS属性既不需要重新布局也不需要重新绘制，例如，transform、opacity（目前，只有这两个属性），浏览器会在完成样式计算之后，直接做渲染层合并。
4. 用translateZ(0)属性把动画元素提升到单独的渲染层中（我们常说的启用3D加速）。

对于滚屏和动画，最理想的就是只使用transform和opacity来实现视觉变化效果，并且遵循第四点。


## 点击切换视图模式，找到问题所在。

{% pimg http://7xt3gj.com1.z0.glb.clouddn.com/Simbachen/frames03.png [Timeline面板] %}

这是一个知名线上网站的首页，这里发生了滚屏触发加载内容，导致DOM结构变化，引发了大量内容的重绘和渲染，并且页面旧的内容没有回收，节点较多，明显的感觉到滚屏的时候有卡顿感。对于这个应用按照上述的思路来优化，在优化的过程中，我们也许会遇到下面这个问题。

{% pimg http://7xt3gj.com1.z0.glb.clouddn.com/Simbachen/frames04.png [Timeline面板] %}

这是另一个demo页面，有数千个节点组成，用以模拟无限懒加载数据的情况，其中只有一个节点上应用了循环的css3动画。其它的都不会改变。为了将有动画的节点独立到一个单独的渲染层中，我对它应用了translateZ(0)。本以为大功告成，结果在滚屏的时候发现非常卡顿。于是就有了上图，平均每帧的渲染都消耗掉了200ms左右，从Timeline监控数据中可以看到，其中Composite Layers这个过程耗费了大量时间。那么直接查看layer状态：

{% pimg http://7xt3gj.com1.z0.glb.clouddn.com/Simbachen/frames05.png [Timeline面板] %}

再看官方文档的提示：由于每个渲染层的纹理都需要上传到GPU处理，过多的渲染层来带的开销而对页面渲染性能产生的影响，甚至远远超过了它在性能改善上带来的好处。

实际上页面里并没有主动通过translateZ属性来独立更多的层，我们可以认为这是触发了浏览器的一个“bug”，最新版本的chrome仍然会触发这个问题，不过最新版本的ios里Safari已经不会触发这个问题了。至于什么情况会触发浏览器去创建一个独立层来渲染元素，例如拥有3DCSS属性的元素、使用加速视频解码的元素等，对这个问题这里就不再详述。

如果手动的将大量的层独立出来渲染，导致GPU罢工，或是任由他们导致CPU罢工，都会造成性能问题，不过有了Timeline工具，我们就能找到问题所在，一一去分析解决了。





## 参考文档：
https://developers.google.com/web/fundamentals/performance
https://developer.chrome.com/devtools/docs/timeline










