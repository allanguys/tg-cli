/*
 此文件由@TG-CLI自动生成
 文档地址：https://github.com/allanguys/tg-cli
 */
var gulp = require('gulp');
var livereload = require('gulp-server-livereload');
var imagemin = require('gulp-imagemin');
var replace = require('gulp-replace');
var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');
var clean = require('gulp-clean');
var zip = require('gulp-zip');
var chalk = require('chalk');
var cheerio = require('gulp-cheerio');
var iconv = require('gulp-iconv');
var iconvLite = require('iconv-lite');
var crypto = require('crypto');
var _ = require('lodash');
var tgtest = require('tgt-pkg');
var config = {};
var deps = [];
var deps_dev = [];
var deps_html = [];
var deps_image = [];
var sepPath = [];
var picPath = [];
var build_path;
var has = false;

var md5 = crypto.createHash('md5').update(new Date().toString()).digest('hex');


var gitignore = {
    "dir":['.idea','node_modules','css','js','build']
}

var fileList = fs.readdirSync(path.resolve('./'));
var copyDir = [];
var copyFile = [];
//需要复制的文件夹列表
fileList.forEach(function (f,index) {
    var stats = fs.statSync(f);
    var ig = false;
    if(stats.isDirectory()){
        gitignore.dir.forEach(function (g) {
            if(f == g ){
                ig = true;
            }
        })
        if(!ig){copyDir.push(f);}
    }else{
        copyFile.push(f)
    }

});



//分离路径
sepPath = [
    ['**','css/**/*','js/**/*','inc/**/*', 'ossweb-img/**/*'],
    ['','css/','js/','inc/','ossweb-img/']
];
picPath = ['ossweb-img/**/*'];
//初始化参数
try {
    config = fs.readFileSync('tg_config.json').toString();
    config = JSON.parse(config);
    dirName = config.appName;
    build_path = 'build/'+dirName+'/';
    sepUrl = config.author == "cp" ? '//game.gtimg.cn/images/' + config.imagePath + '/cp/' + dirName + '/' : '//game.gtimg.cn/images/' + config.imagePath + '/act/' + dirName + '/';
    cssUrl = config.author == "cp" ?'href="//'+config.gameName+'.qq.com/cp/'+ dirName + '/css/':'href="//'+config.gameName+'.qq.com/act/'+ dirName + '/css/'
    jsUrl = config.author == "cp" ?'src="//'+config.gameName+'.qq.com/cp/'+ dirName + '/js/':'src="//'+config.gameName+'.qq.com/act/'+ dirName + '/js/'

} catch(err) {
    return console.log('读取config_tg.json出错,请检查或咨询allanglwang');
}

var simpleTypes = {
    ".htm": "text/html",
    ".html": "text/html",
    ".shtml": "text/html",
    ".js": "application/x-javascript",
    ".json": "application/json",
    ".gif": "image/gif",
    ".png": "image/png",
    ".jpg": "image/jpeg",

}

gulp.task('watch', function() {
    gulp.src('.')
        .pipe(livereload({
            livereload: {
                enable:true,
                filter: function(filePath, cb) {
                    var shouldHandle = /(node_modules|gulpfile\.js|package\.json|tg_config\.json).test(filePath)/.test(filePath);
                    cb( !shouldHandle );
                }
            },
            directoryListing: false,
            fallback: 'index.htm',
            fallbackLogic: function(req, res, fallbackFile) {
                fs.readFile(fallbackFile, function(err, file) {
                    if(err) {
                        res.setHeader('Content-Type','text/plain');
                        res.end(err);
                    } else {
                        var ext = path.extname(fallbackFile);
                        res.setHeader("Content-Type", simpleTypes[ext]+"; charset=utf-8");
                        var data = iconvLite.decode(file, 'gbk');
                        var buff = iconvLite.encode(data, 'utf8');
                        res.write(buff);
                        res.end();
                    }
                });
            },
            open: true,
        }));
});




for(var i = 0; i < sepPath[0].length; i++) {

    (function(i) {
        deps.push('sep' + i);
        //分离
        gulp.task('sep' + i, function() {
            return gulp.src([sepPath[0][i] + '*.**','!gulpfile.js', '!package.json','!tg_config.json','!node_modules/','!*.zip'])
                .pipe(iconv({
                    decoding: 'gbk',
                    encoding: 'utf-8'
                }))
                //自动补齐seo信息
                .pipe(cheerio({
                        run:function ($, file) {
                            var titleText = $('title').text();
                            $('a').each(function () {
                                var a = $(this);
                                //网站使用 rel="noopener" 打开外部锚，https://developers.google.com/web/tools/lighthouse/audits/noopener?hl=zh-cn
                                if(a.attr('target') == '_blank'){
                                    if(a.attr('rel') !== 'noopener'){
                                        a.attr('rel','noopener');
                                    }
                                }
                                //自动补充title
                                if(typeof a.attr('title') == 'undefined' || a.attr('title') == ''){
                                    var t = a.text() == '' ? titleText : a.text()
                                    a.attr('title',t);
                                }
                            });
                            //自动补充alt
                            $('img').each(function(){

                                var img = $(this);
                                var src = img.attr('src');
                                if(typeof img.attr('alt') == 'undefined' || img.attr('alt') == ''){
                                    img.attr('alt',titleText)
                                    img.attr('src',src+'?v='+md5)
                                }
                            })
                        },
                        parserOptions: {
                            decodeEntities: false
                        }
                    })
                )
                //图片路径分离
                .pipe(replace(/(ossweb-img\/)|(..\/ossweb-img\/)/g, sepUrl))
                //样式路径分离
                .pipe(replace(/(href="css\/)/g, cssUrl))
                //脚本路径分离
                .pipe(replace(/(src="js\/)/g, jsUrl))
                //适配https协议
                .pipe(replace(/http:\/\//g, '\/\/'))
                .pipe(iconv({
                    decoding: 'utf-8',
                    encoding: 'gbk'
                }))
                .pipe(
                    gulp.dest(build_path + sepPath[1][i])
                );
        });
    })(i);

    (function(i) {
        deps_dev.push('sep' + i + '_dev')
        //分离DEV
        gulp.task('sep' + i + '_dev', function() {
            return gulp.src([sepPath[0][i] + '*.**','!gulpfile.js', '!package.json','!tg_config.json','!node_modules/','!*.zip'])
                .pipe(iconv({
                    decoding: 'gbk',
                    encoding: 'utf-8'
                }))
                //自动补齐seo信息
                .pipe(cheerio({
                        run:function ($, file) {
                            var titleText = $('title').text().split("-")[0];
                            $('a').each(function () {
                                var a = $(this);
                                if(a.attr('title') == undefined || a.attr('title') == ''){
                                    a.attr('title',a.text());
                                }
                            });
                            $('img').each(function(){
                                var img = $(this);
                                console.log(img)
                                if(img.attr('alt') == undefined || img.attr('alt') == ''){
                                    img.attr('alt',titleText)
                                }
                            })
                        },
                        parserOptions: {
                            decodeEntities: false
                        }
                    })
                )
                //路径分离
                .pipe(replace(/(ossweb-img\/)|(..\/ossweb-img\/)/g, sepUrl))
                //样式路径分离
                .pipe(replace(/(href="css\/)/g, cssUrl))
                //脚本路径分离
                .pipe(replace(/(src="js\/)/g, jsUrl))
                //适配https协议
                .pipe(replace(/http:\/\//g, '\/\/'))

                .pipe(iconv({
                    decoding: 'utf-8',
                    encoding: 'gbk'
                }))
                .pipe(
                    gulp.dest(build_path + sepPath[1][i])
                );
        });
    })(i);
};
//copy配置文件
gulp.task('copyConfig', function() {

    return gulp.src(['gulpfile.js','package.json','tg_config.json'])
        .pipe(gulp.dest(build_path));
});
deps_dev.push('copyConfig');
//图片压缩
for(var i = 0; i < picPath.length; i++) {
    (function(i) {
        deps.push('图片压缩');
        deps_image.push('图片压缩');
        gulp.task('图片压缩', function() {
            return gulp.src([picPath[i] + '*.jpg', picPath[i] + '*.gif', picPath[i] + '*.png', picPath[i] + '*.svg'])
                .pipe(imagemin({
                    progressive: true,
                    interlaced: true,
                    multipass: true
                }))
                .pipe(gulp.dest(build_path + 'ossweb-img'));
        });
    })(i);
    (function(i) {
        var m = '图片压缩_dev';
        deps_dev.push(m);
        gulp.task(m, function() {
            return gulp.src([picPath[i] + '*.jpg', picPath[i] + '*.gif', picPath[i] + '*.png', picPath[i] + '*.svg'])
                .pipe(imagemin({
                    progressive: true,
                    interlaced: true,
                    multipass: true
                }))
                .pipe(gulp.dest(build_path + 'ossweb-img'));
        });
    })(i);
};




deps_dev.unshift('页面规范验证');
deps.unshift('页面规范验证');
deps.unshift('复制文件');
deps_html = _.without(deps, '图片压缩');
gulp.task('复制文件',function () {
    copyDir.forEach(function (c) {
        fse.copySync(c,build_path + c)
    })
    copyFile.forEach(function (c) {
        fse.copySync(c,build_path + c)
    })
})
gulp.task('页面规范验证',function(){
    return new Promise(function(resolve){
        tgtest.check({
            'file':{'name':'index.htm','charset':'GBK'}
        },function (cb) {
            var error = [];
            var data = cb.checkResult.list;
            for(var i = 0;i < data.length;i++){
                if(typeof  data[i].error_info !== 'undefined' && data[i].error_info != '' ){
                    error.push(data[i].error_info);
                    chalk.red(data[i].error_info);
                }
            };
            if(error.length > 0){
                console.log('')
                console.log(chalk.red.bold('页面有如下错误不符合TGuide规范，请修改:'));
                console.log('')

            }
            for(var i = 0;i < error.length;i++){
                console.log('> '+error[i])
            }
            if(error.length > 0){
                process.exit()
            }else{
                resolve()
            }


        })
    })

})



gulp.task('zip',deps, function() {
    return gulp.src([build_path + '**'])
        .pipe(zip(dirName+'.zip'))
        .pipe(gulp.dest('./build/'))
        .on('end', function() {
            console.log('')
            console.log('   分离目录：'+chalk.green(build_path))
            console.log('   压缩包：'+chalk.green('build/'+dirName + '.zip'))
            console.log('')
        });
});
gulp.task('pure', deps, function() {

    console.log('')
    console.log('   分离目录：'+chalk.green(build_path))
    console.log('')
});
gulp.task('html', deps_html, function() {

    console.log('')
    console.log('   分离目录：'+chalk.green(build_path))
    console.log('')
});
gulp.task('image', deps_image, function() {

    console.log('')
    console.log('   分离目录：'+chalk.green(build_path))
    console.log('')
});