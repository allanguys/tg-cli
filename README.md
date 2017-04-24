
# Tg-cli - 互娱网站构建脚手架

`Tg-cli`是一个构建互娱网站的脚手架工具，
主要功能有：

* **构建互娱专题模版**
> - 生成PC、移动通用模板
>- 集成通用模块
>- 集成上报规则


* **集成gulp**
>- 自动分离
>- 压缩图片、样式、脚本


## 安装
环境: [Node.js](https://nodejs.org/en/download/) , npm  3.0+、 [Git](https://git-scm.com/).

``` bash
$ npm install -g tg-cli
```


## 用法

**项目初始化**

- 安装gulp依赖
``` bash
$ tg install
```


- 不安装gulp依赖（只写入相关配置文件）

``` bash
$ tg install pure
```


## 图解

----------


**项目初始化**

- 配置项目目录

![enter image description here](https://raw.githubusercontent.com/allanguys/tg-cli/master/READEME/ex.jpg)

- 配置完成后将自动在项目目录安装gulp依赖


----------


**项目完成后**

**1. **进入项目开发目录

``` bash
$ cd <新建的目录>
```

**2. **分离

>**推荐** - 携带相关开发配置项

``` bash
$ gulp
```
----------
>**不推荐** - 纯净版,不包含配置项

``` bash
$ gulp pure
```


## 项目即时刷新配置

**1. **安装chrome 插件: [LiveReload](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)

**2. **进入项目开发目录:

``` bash
$ cd <新建的目录>
```

**3. **启动watch task:

``` bash
$ gulp watch
```

**4. **用任意web server在chrome中打开页面，例`127.0.0.1/yourProject/index.htm`

**5. **点击浏览器右上角Liveload插件

![enter image description here](https://raw.githubusercontent.com/allanguys/tg-cli/master/READEME/liveload.jpg)


## 模板定制相关

**目录：**
``` bash
    \---template
    +---act      <专题模板>
    |   +---m    <专题模板>
    |   |   \---common    <移动通用专题模板>
    |   |       +---css
    |   |       +---js
    |   |       \---ossweb-img
    |   \---pc   <PC专题模板>
    |       +---common     <pc通用专题模板>
    |       |   +---css
    |       |   +---js
    |       |   \---ossweb-img
    |       \---wt         <wt.qq.com单独模板路径>
    |           \---ossweb-img
    |               +---css
    |               +---image
    |               \---js
    +---gulp      <gulp配置>
    \---module    <通用模块>
        +---common   <多端通用模块>
        +---m        <移动端通用模块>
        \---pc       <PC端通用模块>
``` 

----------

**模板语法：**

模板用Mustache语法配置载入相关模块嵌入和相关配置，
自定义单独模板目前可支持的配置有：



|表头1  | 表头2|
|--------- | --------|
|表格单元  | 表格单元 |
|表格单元  | 表格单元 |



|语法  | 值| 释义 |
|--------- | --------|
|{{time}}    |  2017-04-24 | 创建时间 |
|{{team}}  | cp/tgideas | 创建的团队 |
|{{author}}  | cp/昵称 | 创建文档的前端重构|
|{{designAuthor}}  | cp/昵称 |创建文档的设计师，如重构是cp则设计师默认为cp |
|{{{milo}}}  | `<script src=".."></script>` | milo库，[文档](http://tgideas.qq.com/milo/) |
|{{{jsLib}}}  | `<script src=".."></script>` | jquery/zepto库 (根据终端类型自动适配) |
|{{{tab}}}  | `//tab公用模块页面片(包含结构、css、脚本)` | tab组件( [PC端文档](http://tguide.qq.com/main/tab-component.htm),[移动端文档](http://tgideas.github.io/motion/doc/data/component/mo.Tab.html)) |
|{{{scroll}}}  | `//轮播公用模块页面片(包含结构、css、脚本)` | 轮播组件( [PC端文档](http://tguide.qq.com/main/picscroll-component.htm),[移动端文档](http://tgideas.github.io/motion/doc/data/component/mo.Slide.html)) |
|{{{login}}}  | `//登录公用模块页面片(包含结构、css、脚本)` | 登录组件( [PC端文档](http://tgideas.qq.com/webplat/info/news_version3/804/25810/25811/25812/25814/m16274/201611/521122.shtml),[移动端文档](http://tgideas.qq.com/webplat/info/news_version3/804/25810/25811/25812/25814/m16274/201611/521122.shtml)) |
|{{{player}}}  | `//视频公用模块页面片(包含结构、css、脚本)` | 视频组件( [PC端文档](http://tgideas.qq.com/webplat/info/news_version3/804/25810/25811/25812/25814/m16274/201611/522294.shtml),[移动端文档](http://tgideas.qq.com/webplat/info/news_version3/804/25810/25811/25812/25814/m16274/201611/522294.shtml)) |
|{{{lottery}}}  | `//抽奖模块页面片(包含结构、css、脚本)` | 抽奖组件( [PC端文档](http://tgideas.qq.com/webplat/info/news_version3/804/25810/25811/25812/25814/m16274/201611/521098.shtml),[移动端文档](http://tgideas.qq.com/webplat/info/news_version3/804/25810/25811/25812/25815/m16274/201612/529504.shtml)) |
|{{{pop}}}  | `//弹窗模块页面片(包含结构、css、脚本)` | 弹窗组件( [PC端文档](http://tgideas.qq.com/webplat/info/news_version3/804/25810/25811/25813/25816/m16274/201611/522576.shtml),[移动端文档](http://tgideas.github.io/motion/doc/data/component/mo.Overlay.html)) |
