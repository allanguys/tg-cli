

# Tg-cli - 互娱网站构建脚手架

**主要功能：**

* **构建互娱专题模版**
> - 生成PC、移动通用模板
>- 集成通用模块
>- 集成上报规则


* **集成gulp**
>- 分离线上URL
>- 压缩图片


## 安装
环境: [Node.js](https://nodejs.org/en/download/) , npm  3.0+、 [Git](https://git-scm.com/).

``` bash
$ npm install -g tg-cli
```


## 新建项目
``` bash
$ tg install
```

## 使用


**项目初始化**

- 配置项目目录

![enter image description here](https://raw.githubusercontent.com/allanguys/tg-cli/master/READEME/ex.jpg)

- 配置完成后,自动在项目目录安装gulp依赖


___


**项目完成后**

**1.** 进入项目开发目录

``` bash
$ cd <新建的目录>
```

**2.** 分离

**推荐** - 携带相关开发配置项

``` bash
$ gulp
```

**不推荐** - 纯净版,不包含配置项

``` bash
$ gulp pure
```



## 项目即时刷新配置

**1.** 安装chrome 插件:
[LiveReload](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)

**2.** 进入项目开发目录:

``` bash
$ cd <新建的目录>
```

**3.** 启动watch task:

``` bash
$ gulp watch
```

**4.** 用任意web server在chrome中打开页面，例`127.0.0.1/yourProject/index.htm`

**5.**点击浏览器右上角Liveload插件

![enter image description here](https://raw.githubusercontent.com/allanguys/tg-cli/master/READEME/liveload.jpg)


## 模板

**目录：**

* template/
    *  act/   `专题模板`
        *  pc/  `PC模板`
        
                *  comm/  `通用模板`
                
                *  wt/  `战雷单独模板`
                
                *  ...  `其他移动端单独模板`
                
        *  m/  `移动端通用模板`
        
                *  comm/  `通用模板`
                
                *  ...  `其他移动端单独模板`
