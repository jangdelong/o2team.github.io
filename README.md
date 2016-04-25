# aotu.io

## 博客的一些特性

1. 使用github头像

  记得将你们在github的头像更新到最帅，将你github的用户名在文章内头部填好即可！

2. [不蒜子](http://ibruce.info/2015/04/04/busuanzi/) 统计博文的pv
3. [多说](http://duoshuo.com)评论

## 使用指引

1. 安装hexo

    ```
    npm i hexo-cli -g
    ```

2. 将o2team.github.io的源码拉到本地

    ```
    git clone git@github.com:o2team/o2team.github.io.git o2team
    ```
    原来已拉过旧版代码，可切换至v2分支再拉取

4. 安装npm包

    ```
    npm install
    ```

5. 运行`hexo s --watch`

    运行上述命令后，浏览器打开 [http://localhost:4000](http://localhost:4000) 即可本地访问我们的网站
    
## 创建文章

有两种方法创建文章，可任选其一：

> 注意：文件名不要出现中文!!!

1. 使用`hexo new` 命令
  
  ``` bash
  $ hexo new "My New Post"
  ```

2. 拷贝现有的文章进行修改
  
  hexo使用markdown来编辑文章，在source目录下，拷贝任意md文件进行创建新的文章。具体可参考下hexo的官方说明

## 文章规范

1. 使用markdown写博文 
2. 博文图片统一位置：`source/img/post/[你的github帐号名]/`
    在博客内容中可以使用 `pimg` 自定义标签来引用图片。

    其语法格式为：
    
    `{% pimg imageName [alt text] [JSONImageAttibutes] %}`
    
    例如： 
    
    `{% pimg post-aotu.jpg "空格请用%20来区分" '{"title":"hello","class":"test_img"}' %}`
    需要注意的是：`pimg` 利用空格来划分字段属性，如果一个属性的值需要空格，请将空格用`%20`代替!!!    

3. 3张标准配图
   - 博客封面配图：840x340，命名：xxx_cover
   - 公众号推广长图: 900x500，命名：xxx_900x500
   - 公众号推广方图：200x200，命名：xxx_200x200
4. 指明文章的副标题、作者信息、封面图片地址

    ```
    subtitle: "凹凸实验室博客是一个托管于Github的静态博客，基于HEXO搭建..."
    date: 2015-11-20 00:24:35
    cover: "封面图片地址"
    tags:
    - Hexo
    author:
        nick: LV主唱大人
        github_name: mamboer

    ```
5. 利用`<!-- more --> `设置文章的摘要

    示例：
    ```
	title: 文章标题
	---
	这部分是文章摘要，这部分是文章摘要。在hexo模版里可通过 {% raw %}{{ post.excerpt }}{% endraw %} 来引用。
	<!-- more --> 
	这里是文章的剩余部分。在hexo模版里可通过{% raw %}{{ post.more }}{% endraw %} 来引用。
    ```

    实际使用请参考[本文]({{ raw_link('_post/2015-11-20-aotu-blog-v1.md') }})。


## 关于博客的发布

为了便于统一维护，博客的发布由`LV`负责。同学们写好博文并在本地预览OK后直接提交Github即可。

## 其他

- [版本日志](https://github.com/o2team/o2team.github.io/wiki/change-logs)
- [文章运营](https://github.com/o2team/o2team.github.io/wiki/文章运营)
