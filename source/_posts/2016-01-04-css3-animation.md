title: CSS3动画实践
subtitle: 总结CSS3动画实现的方法，并进一步提出润色与优化的方案。
date: 2016-01-04 15:58:00
cover: "Yettyzyt/css3-animation/840.png"
tags:
  - CSS3
  - animation
author:
  nick: 燕婷 
  github_name: Yettyzyt
---
## 需求中常见的css3动画：
---
### 一、补间动画/关键帧动画
常用于实现位移、颜色（透明度）、大小、旋转、倾斜等变化。

**Transitions——简单的动画：起始两帧过渡**
> CSS的`transition`允许CSS的属性值在一定的时间区间内平滑地过渡。
> 这种效果可以在鼠标单击、获得焦点、被点击或对元素任何改变中触发，并圆滑地以动画效果改变CSS的属性值。

- **应用场景：**
页面的交互操作

- **优点：**
使用transition可使交互效果更生动活泼

**Keyframes animation——复杂的动画：关键帧较多的动画**

> 设置动画的关键帧规则。
> `animation`的`timing-function`设置为`ease`、`linear`或`cubic-bezier`，它会在每个关键帧之间插入补间动画，产生具有连贯性的动画。
      
### 二、逐帧动画
> animation的`timing-function`默认值为`ease`，它会在每个关键帧之间插入补间动画，所以动画效果是连贯性的。
> 除了`ease`、`linear`、`cubic-bezier`之类的过渡函数都会为其插入补间。
> 有些效果不需要补间，只需要关键帧之间的跳跃，这时应该使用`steps`过渡方式。
更多详细用法请查看：[深入理解CSS3 Animation 帧动画](http://www.cnblogs.com/aaronjs/p/4642015.html)

- **应用场景：**
1. loading动画
2. Sprite精灵动画（人物运动）——把所有帧都放在一起，通过CSS3的animation控制background-position

- **精灵动画示例：**
{% pimg Yettyzyt/css3-animation/1-1.gif [逐帧动画示例] %}
{% pimg Yettyzyt/css3-animation/1-2.png [逐帧动画示例] %}

- **steps中的坑：**
1. 第一个参数`number`为指定的间隔数：
	- 把动画分为 n 步阶段性展示(√)；不是keyframes写的变化次数(×)
	- 上述示例中hand使用不同number值产生不同结果：
	
	```css
	.active.share3 .hand{
		-webkit-animation: wave steps(2,end) 2s forwards infinite;
	}
	@-webkit-keyframes wave{
		0%{background-position:0 0;}
	  	50%{background-position:100% 0;}
	  	100%{background-position:0 0;}
	}
	```
	{% pimg Yettyzyt/css3-animation/1-4.gif [steps中的坑] %}（`number`为2时的结果）
	
	```css
	.active.share3 .hand{
		-webkit-animation: wave steps(1,end) 2s forwards infinite;
	}
	@-webkit-keyframes wave{
	  0%{background-position:0 0;}
	  50%{background-position:100% 0;}
	  100%{background-position:0 0;}
	}
	```
	{% pimg Yettyzyt/css3-animation/1-5.gif [steps中的坑] %}（`number`为1时的结果）

2. 第二个参数可选，接受`start`和`end`两个值：
	- 指定在每个间隔的起点或是终点发生阶跃变化
	- `steps(3,start)`与`steps(3,end)`的区别：
	
	{% pimg Yettyzyt/css3-animation/1-3.png [steps中的坑] %}（图片来源：[CSS3 timing-function: steps() 详解](http://www.tuicool.com/articles/neqMVr)）

3. TIPS：
> `step-start`等同于`steps(1,start)`：动画执行时为开始左侧端点的部分为开始
> `step-end`等同于`steps(1,end)`：动画执行时以结尾端点为开始，默认值为end

- **工具：**
[CSS3动画帧数计算器](http://tid.tenpay.com/labs/css3_keyframes_calculator.html)

## CSS动画优缺点：
---
### 一、优点：
> 简单、高效
> 声明式的
> 不依赖于主线程，采用硬件加速（GPU）
> 简单的控制keyframe animation播放和暂停

### 二、缺点：
> 不能动态修改或定义动画内容
> 不同的动画无法实现同步
> 多个动画彼此无法堆叠


## 简单做动画：
---
以此需求为例：
{% pimg Yettyzyt/css3-animation/3-1.jpg [简单做动画] %}

### 一、观察
- 哪些元素可以动
- 元素可以怎么动

### 二、沟通
- 了解设计师的想法
	{% pimg Yettyzyt/css3-animation/3-2.JPG [沟通] %}
- 提出自己的想法

### 三、分析
- 分析动画元素的层次（出现顺序）

	{% pimg Yettyzyt/css3-animation/3-3.jpg [分析] %}

- 画出动画时间轴

	{% pimg Yettyzyt/css3-animation/3-4.jpg [分析] %}

- 根据时间轴写出CSS动画时间轴
	**方法一：**将所有动画元素放在一个时间轴上（适合于元素较少的情况）
	```css
	a0{-webkit-animation: a0 2s forwards;}
	    @-webkit-keyframes a0{
	            0%{……}
	            30%{……}
	        }
	a1{-webkit-animation: a1 2s forwards;}
	    @-webkit-keyframes a1{
	            0%,30%{……}
	            50%{……}
	        }
	a2{-webkit-animation: a2 2s forwards;}
	    @-webkit-keyframes a2{
	            0%,50%{……}
	            75%{……}
	        }
	a3{-webkit-animation: a3 2s forwards;}
	    @-webkit-keyframes a3{
	            0%,75%{……}
	            100%{……}
	        }
	```
	**方法二：**同一阶段的动画元素放在一个时间轴上
	```css
	a0{-webkit-animation: a0 0.6s forwards;}
	    @-webkit-keyframes a0{
	            0%{……}
	            100%{……}
	        }
	a1{-webkit-animation: a1 0.4s 0.6s forwards;}
	    @-webkit-keyframes a1{
	            0%{……}
	            100%{……}
	        }
	a2{-webkit-animation: a2 0.5s 1s forwards;}
	    @-webkit-keyframes a2{
	            0%{……}
	            100%{……}
	        }
	a3{-webkit-animation: a3 0.5s 1.5s forwards;}
	    @-webkit-keyframes a3{
	            0%{……}
	            100%{……}
	        }
	```

### 四、切图
- PS CC 2015修改组/图层名为“***.png”，生成图像资源
{% pimg Yettyzyt/css3-animation/3-5.png [切图] %}
（使用PS CSS 2015切图步骤）

### 五、定位
- 绝对定位—position:absolute
- sublime插件：[PX转REM插件](https://github.com/youing/PxRemTranslate)

### 六、实现

- 从无到有：
	1. 透明度—opacity
	2. 位移—translate
	3. 宽度—width（少用）

- 动起来：
	1. 2/3D转换—transform
	2. 其他属性

### 七、润色
<p style="color:#bbb">后文介绍</p>

**TIPS：不要在before,after里加动画**


## 不止于“动”：
---
### 一、惯性

- 物体没有停在本应该停止的位置上而是靠惯性**继续摆动一段时间然后反方向摆回来**
- 惯性在日常的动画需求中应用相当普遍，元素的高速进入都涉及惯性
- 示例：
	1. 标题快速从左侧划入屏幕中
	2. 标题本应停在屏幕左右居中位置
	3. 由于惯性的作用，标题到达居中位置后又向右滑行一小段，再反方向滑回

	{% pimg Yettyzyt/css3-animation/4-1.png [惯性] %}
	{% pimg Yettyzyt/css3-animation/4-2.gif [惯性] %}

**总结：要停不停，要走不走**

### 二、透视

- 物体与观察者的距离远近在静态时通过**物体的大小**来体现
	{% pimg Yettyzyt/css3-animation/4-7.jpg [透视] %}
	（透视原理图）
- 当物体运动时，通过**远近物体不同的运动速度**来体现，从而形成层次感
- **近处的物体运动快，远处的物体运动慢**
- 示例：
	1. 云朵与观察者的距离有远近之分（不可能所有的云都在一个平面上）
	2. 设置云朵的飘动动画时，可根据云朵的大小（远近）设置不同的运动速度
	3. 近处的云朵飘动的速度比远处的快，从而形成透视
	
	```
	.cover_clouds .c1,
	.cover_clouds .c2,
	.cover_clouds .c4,
	.cover_clouds .c6
	{
	    -webkit-animation: cloudFloat linear 6s infinite;
	}
	.cover_clouds .c3,
	.cover_clouds .c5,
	.cover_clouds .c7
	{
	    -webkit-animation: cloudFloat linear 10s infinite;
	}
	```

	{% pimg Yettyzyt/css3-animation/4-8.png [透视] %}
	{% pimg Yettyzyt/css3-animation/4-9.gif [透视] %}


### 三、节奏

- 善用**曲线**和**缓动**
- **多个元素保持相同节奏**
- 示例：
	1. 匀速的呼吸效果：
	
	```
	.breath{
	    -webkit-animation:
	    breath 6s linear infinite;
	}
	```
	{% pimg Yettyzyt/css3-animation/4-10.gif [节奏] %}

	2. 缓动的呼吸效果：
	```
	.breath{
	    -webkit-animation:
	    breath 6s cubic-bezier(.2,.73,.71,.44) infinite;
	}
	```
	{% pimg Yettyzyt/css3-animation/4-11.gif [节奏] %}

	3. 分析呼吸的函数：
	{% pimg Yettyzyt/css3-animation/4-12.png [节奏] %}
	（图片来源：[让界面动画更自然——ISUX](http://isux.tencent.com/animation-factor.html)）

### 四、跟随

- 跟随动作是将物体的各部位拆解，通常是**没有骨架**的部位较容易产生跟随的动作
- 例如：
	1. 一个奔跑的人突然停下，他的衣服头发等可能仍会运动
	2. 其中，人是“主体”，衣服头发等是“附属物”
- 附属物的动作取决于：
	1. 主体的动作
	2. 附属物本身的重量和质地
	3. 空气的阻力
- **主体与附属物之间动作的重叠和追随**，就是鉴定动作流畅性与自然度好坏的标准
- 示例：
	1. 首页主体人物动作触发后，进行小范围的四向运动以模拟人物身体颤动的效果
	2. 人物头饰（花及骨头）与运动主体（人）并非一体，属于附属物
	3. 附属物的运动受主体的运动影响出现同向、延时的运动
	{% pimg Yettyzyt/css3-animation/4-17.png [跟随] %}
	{% pimg Yettyzyt/css3-animation/4-18.gif [跟随] %}


## 优化：
---
- 不用left/right/width/height/margin-top等
- 少用color/background等
- 使用translate/opacity
- 适当开启GPU加速
- 适当使用will-change


## 参考文章：
---
1. [CSS3 transition 属性过渡效果 详解,Techzero ,2014-04-1](http://www.itechzero.com/css3-transition-property-transition-effect-explain.html)
2. [深入理解CSS3 Animation 帧动画,Aaron,2015-07-13](http://www.cnblogs.com/aaronjs/p/4642015.html)
3. [CSS3 timing-function: steps() 详解,那个傻瓜瓜,2014-12-30](http://www.tuicool.com/articles/neqMVr)
4. [主流动画实现方式总结,Benjamin,2015-01-25](http://www.zuojj.com/archives/1292.html)
5. [Animation Principles for the Web](https://cssanimation.rocks/principles/)
6. [12 basic principles of animation](https://en.wikipedia.org/wiki/12_basic_principles_of_animation)