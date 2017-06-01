
![npm](https://nodei.co/npm/tg-cli.png?downloads=true)

# Tg-cli - 互娱网站构建脚手架

**Tg-cli**是一个刚刚诞生的脚手架工具，还存在很多问题。如果在使用中遇到问题或者希望添加新功能，欢迎积极反馈，每问必答。谢谢。

主要功能有：

* **构建互娱专题模版**
> - 生成PC、移动通用模板
>- 集成通用模块
>- 集成上报规则


* **集成gulp**
>- 自动分离图片路径
>- 压缩图片
>- 自动补齐`img['alt']`/`a['title']`属性

## 安装
环境: [Node.js](https://nodejs.org/en/download/) , npm  3.0+、 [Git](https://git-scm.com/).

``` bash
npm install -g tg-cli
```



**推荐**使用国内镜像安装 [cnpm](https://cnpmjs.org/)

----------

## 创建专题

安装完成以后，可以在命令行下使用 `tg` 命令来创建专题，该命令的用法：

```bash
$ tg -h

  Usage: tg [options]

  Options:

    -h, --help        output usage information
    -V, --version     output the version number
    -g --game <game>  指定游戏域名前缀，例如"cf"、"dnf"、"lol"等
    -d --dir <dir>    指定需求目录名，格式为"a+日期+名称"，例如"a20170601test"

  Examples:

    交互式创建项目：
    tg

    快捷方式创建项目：
    tg -g cf -d a20170406newbie
```

快捷创建需求模板，可以通过 `tg -g 游戏域名前缀 -d 需求目录名` 来实现：
<strong style="color:#900">特别提醒：外包同学请用下面的交互式创建方法！！</strong>

```bash
E:\codes> tg -g lol -d a20170601demo
   正在生成通用模板...

√ 目录生成成功！

   您的文件路径：E:\codes\a20170601demo\

   接下来，请执行：

      cd a20170601demo
      npm install
      npm run dev

   请愉快地coding吧:)
```

交互式创建，直接执行 `tg`
```bash
$ tg
  _____ ____    ____ _     ___
 |_   _/ ___|  / ___| |   |_ _|
   | || |  _  | |   | |    | |
   | || |_| | | |___| |___ | |
   |_| \____|  \____|_____|___|

? 选择项目类型：  (Use arrow keys)
> 移动专题
  PC专题
? 输入项目名(例: a20170406tgcil)：a20170601demo
{ appName: 'a20170601demo' }
? 作者 <cp/rtx名>：cp
? 输入游戏域名前缀(例: cf)：lol
?   (Press <space> to select, <a> to toggle all, <i> to inverse selection)
  = 请选择通用模块(用空格多选) =
>(*) IEG通用登录
 ( ) 浮层
 ( ) 选项卡
 ( ) 轮播图
 ( ) 视频
 ( ) 抽奖
    正在生成通用模板...

√ 目录生成成功！

   您的文件路径：/data/codes/a20170601demo/

   接下来，请执行：

      cd a20170601demo
      npm install
      npm run dev

   请愉快地coding吧:)
```


## 网页开发及实时预览

1. 用命令行进入项目开发目录

```bash
cd <新建的目录>
```

2. 安装依赖项

```bash
npm install
```

3. 启动预览和实时刷新

```bash
npm run dev
```

执行上述命令后，默认浏览器会自动启动，并打开 **http://localhost:8000**，你对网页、样式、脚本、图片做的任何修改，一旦保存，浏览器会立即自动刷新当前页面。

## 目录说明
生成的需求目录（`aYYYYMMDDxxxx`）下，目录结构如下图所示：
```plain
css                             //样式文件夹，可以删除，建议外联样式放到ossweb-img目录下
  |__comm.css                   //外联样式文件，默认不使用，可以删除
js                              //js文件夹，如果没有外联js可以删除
  |__comm.js                    //外联js文件，默认不使用，可以删除
ossweb-img                      //静态文件夹，该文件夹下的所有子目录及文件会发布到静态文件CDN，URL需要分离处理
  |__tg-cli.png                 //图片资源文件，默认不使用，可以删除
index.htm                       //首页文件，可以根据需要修改后缀为shtml
```
除了上述需求相关文件之外，目录下还会有`node_modules`、`package.json`、`gulpfile.js`、`tg_config.js`这几个文件，请勿修改或删除。
如果需要用到 **Server Side Includes** 特性，可以在目录下创建一个 `inc` 目录，将页面片（后缀`.inc`）存放于其中。


## 分离和打包

页面制作完毕之后，可以进行分离和打包操作：

1. 分离 (`npm run build`)
```bash
E:\codes\a20170601demo> npm run build
> iegact@1.0.0 build E:\codes\a20170601demo
> gulp pure

[21:57:24] Using gulpfile E:\codes\a20170601demo\gulpfile.js
[21:57:24] Starting 'sep0'...
[21:57:24] Starting 'sep1'...
[21:57:24] Starting 'sep2'...
[21:57:24] Starting 'sep3'...
[21:57:24] Starting 'sep4'...
[21:57:24] Starting 'imagemin'...
[21:57:24] Finished 'sep3' after 17 ms
[21:57:24] gulp-imagemin: Minified 0 images
[21:57:24] Finished 'sep2' after 67 ms
[21:57:24] Finished 'sep4' after 66 ms
[21:57:24] Finished 'imagemin' after 66 ms
[21:57:24] Finished 'sep1' after 71 ms
[21:57:24] Finished 'sep0' after 84 ms
[21:57:24] Starting 'pure'...

   分离目录：build/a20170601demo/

[21:57:24] Finished 'pure' after 212 μs
```
该命令会对网页、js、css文件中的路径进行必要的替换，把对ossweb-img目录下的文件的引用替换为静态CDN的完整URL。然后把处理后的文件拷贝到 `build` 目录下的同名文件夹中。建议内部重构同学用该命令进行分离后再通过SVN上传。

2. 分离并打包（`npm run zip`）
```bash
E:\codes\a20170601demo> npm run zip

> iegact@1.0.0 zip E:\codes\a20170601demo
> gulp zip

[22:09:23] Using gulpfile E:\codes\a20170601demo\gulpfile.js
[22:09:23] Starting 'sep0'...
[22:09:23] Starting 'sep1'...
[22:09:23] Starting 'sep2'...
[22:09:23] Starting 'sep3'...
[22:09:23] Starting 'sep4'...
[22:09:23] Starting 'imagemin'...
[22:09:23] Finished 'sep3' after 20 ms
[22:09:23] gulp-imagemin: Minified 0 images
[22:09:23] Finished 'sep0' after 79 ms
[22:09:23] Finished 'sep1' after 69 ms
[22:09:23] Finished 'sep2' after 68 ms
[22:09:23] Finished 'sep4' after 67 ms
[22:09:23] Finished 'imagemin' after 66 ms
[22:09:23] Starting 'zip'...

   分离目录：build/a20170601demo/
   压缩包：build/a20170601demo.zip

[22:09:23] Finished 'zip' after 17 ms
```
执行`npm run zip`命令后，同样会对需要处理的文件中的相对路径进行必要的替换，并将完成分离后的文件打包成zip格式的压缩包，存放于build目录下。建议外包同学用该命令进行分离打包后，通过QCP系统上传生成的zip包以同步到服务器，或者将zip包发给接口人即可。

## 更多资源

* [视频教程](http://zzlt.qq.com/act/tgcli/index.html)

* 使用预览
![配置项目目录](https://raw.githubusercontent.com/allanguys/tg-cli/master/READEME/0510last.gif)


## 模板定制

### 目录：

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


### 模板语法：

模板用Mustache语法配置载入相关模块嵌入和相关配置，
目前支持的自定义配置：

|语法  | 值| 描述 |
|--------- | --------|--------|
|{{time}}  |  2017-04-24 | 创建时间 |
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
