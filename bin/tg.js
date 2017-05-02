#!/usr/bin/env node

var inquirer = require('inquirer');
var program = require('commander');
var Promise = require("bluebird");
var fs = Promise.promisifyAll(require('fs-extra'));;
var chalk = require('chalk');
var figlet = require('figlet');
var iconv = require('iconv-lite');
var ora = require('ora');
var fsp = require('fs-promise');
var exec = require('promise-exec');

var Mustache = require('../lib/mustache');
var checkVersion = require('../lib/check-version');
var shelljs = require('shelljs/global');
var rootPath = __dirname.replace(/(bin)|(lib)/, '');
var nowPath = process.cwd();
//config file
var configFile = rootPath + 'tg_config.json';
var templatePath = rootPath + 'template/';
//lib

var installConfig = require('../lib/installConfig.js');
var package = require(rootPath + '/package.json');

//temp
var configTemp = {};
var dt = new Date();
var installGulp = true;

program.option('-i, --install [arg]', '安装');
program.version(package.version);
program.parse(process.argv);




//安装
if(program.install) {

//检查版本
 checkVersion(function () {
	if(program.install.length > 0 && program.install[0] == 'pure') {
		installGulp = false
	}
	console.log(
		chalk.green(
			figlet.textSync("TG CLI")
		));
	//type
	inquirer.prompt(installConfig.type).then(function(args) {
		assignConfig(args)
		//name
		nameInit();
	});
	configTemp['time'] = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate();
 })
}

//专题名
function nameInit() {
	inquirer.prompt(installConfig.nameInit).then(function(args) {
		assignConfig(args);
		//作者名
		authorInit()
	})
};
//作者名
function authorInit() {
	inquirer.prompt(installConfig.author).then(function(args) {
		assignConfig(args);
		//游戏名
		if(args.author.toLowerCase() == 'cp') {
			configTemp['designAuthor'] = 'cp';
			//游戏名
			gameName()
		} else {
			//设计师名
			designAuthorInit();
		}

	})
};
//设计师
function designAuthorInit() {
	inquirer.prompt(installConfig.designAuthor).then(function(args) {
		assignConfig(args);
		//游戏名
		gameName()
	})
};
//游戏名
function gameName() {
	inquirer.prompt(installConfig.gameName).then(function(args) {
		assignConfig(args);
		//模块集成
		moduleLoad()
	})
};
//IEG模块集成
function moduleLoad() {
	inquirer.prompt(installConfig.moduleLoad).then(function(args) {
		assignConfig(args, true);
	})
};
//gulp环境
function gulp() {
	inquirer.prompt(installConfig.gulp).then(function(args) {
		assignConfig(args);
	})
};

function assignConfig(args, last) {
	configTemp = Object.assign(configTemp, args);
	if(last) {
		createrFn();
	}
}

function createrFn() {
	//强制小写
    configTemp.gameName = configTemp.gameName.toLocaleLowerCase();
    configTemp.appName = configTemp.appName.toLocaleLowerCase();
	//创建文件夹
	var d = '';
	if(configTemp.appType == '移动专题') {
		var type = 'act';
		var terminal = 'm';
		if(configTemp.gameName && fs.existsSync(templatePath + type + '/' + terminal + configTemp.gameName + '/')) {
			var path = type + '/' + terminal + configTemp.gameName;
			console.log('正在生成' + configTemp.gameName + '的单独模板...');
			//生成模板
			createTemplate(path, type, terminal)
		} else {
			var path = type + '/' + terminal + '/common';
			//console.log('无' + configTemp.gameName + '的单独模板');
			console.log('   正在生成通用模板...');
			//生成模板
			createTemplate(path, type, terminal)
		}
	} else if(configTemp.appType == 'PC专题') {
		var type = 'act';
		var terminal = 'pc';
		var path = '';
		if(configTemp.gameName && fs.existsSync(templatePath + type + '/' + terminal + configTemp.gameName + '/')) {
			var path = type + '/' + terminal + configTemp.gameName;
			console.log('   正在生成' + configTemp.gameName + '的单独模板...');
			//生成模板
			createTemplate(path, type, terminal)
		} else {
			var path = type + '/' + terminal + '/common';
			//console.log('无' + configTemp.gameName + '的单独模板');
			console.log('   正在生成通用模板...');
			//生成模板
			createTemplate(path, type, terminal)
		}
	}
}
//公用模块
function addMoudle(type, terminal) {
	//milo
	if(configTemp.module.length > 0) {
		var milo = fs.readFileSync(templatePath + 'module/' + terminal + '/milo.htm');
		configTemp['milo'] = iconv.decode(milo, 'gbk');
	}

	//通用登录
	if(configTemp.module.indexOf('IEG通用登录') >= 0) {
		var login = fs.readFileSync(templatePath + 'module/' + terminal + '/login.htm');
		configTemp['login'] = iconv.decode(login, 'gbk');
	}
	//弹窗
	if(configTemp.module.indexOf('浮层') >= 0) {
		var pop = fs.readFileSync(templatePath + 'module/' + terminal + '/pop.htm');
		configTemp['pop'] = iconv.decode(pop, 'gbk');
	}
	//jsLib
	var jsLib = fs.readFileSync(templatePath + 'module/' + terminal + '/jslib.htm')
	configTemp['jsLib'] = iconv.decode(jsLib, 'gbk');

	//视频
	if(configTemp.module.indexOf('视频') >= 0) {
		var player = fs.readFileSync(templatePath + 'module/common/player.htm')
		configTemp['player'] = iconv.decode(player, 'gbk');
	}
	//选项卡
	if(configTemp.module.indexOf('选项卡') >= 0) {
		var tab = fs.readFileSync(templatePath + 'module/' + terminal + '/tab.htm')
		configTemp['tab'] = iconv.decode(tab, 'gbk');
	}
	//轮播图
	if(configTemp.module.indexOf('轮播图') >= 0) {
		var scroll = fs.readFileSync(templatePath + 'module/' + terminal + '/scroll.htm')
		configTemp['scroll'] = iconv.decode(scroll, 'gbk');
	}
	//抽奖
	if(configTemp.module.indexOf('抽奖') >= 0) {
		var lottery = fs.readFileSync(templatePath + 'module/' + terminal + '/lottery.htm')
		configTemp['lottery'] = iconv.decode(lottery, 'gbk');
	}
}
//SEO
function  seoInfo(){
	 var m = JSON.parse(fs.readFileSync(templatePath + 'seo/meta.json').toString()).list;
	 for (g in m) {
	 	if(m[g].game == configTemp.gameName){
	 		configTemp['keywords'] = m[g].keywords;
	 		configTemp['description'] = m[g].description;
	 		configTemp['gamecn'] = m[g].gamecn;
	 	}
	 }
}

//创建模板
function createTemplate(path, type, terminal) {

	var tg_config = JSON.stringify(configTemp);
	//通用模块集成
	addMoudle(type, terminal)
    //SEO
    seoInfo();
	//作者
	if(configTemp['author'].toLowerCase() == 'cp') {
		configTemp['author'] = 'cp'
		configTemp['team'] = 'cp'
	} else {
		configTemp['team'] = 'Tgideas'
	};
	fs.readFile(templatePath + path + '/index.htm', function(err, buffer) {
		if(err) throw err;
		var str = iconv.decode(buffer, 'gbk');

		var M = Mustache.render(str, configTemp);
		var spinner = ora('   正在生成...').start();
		//复制模板目录			
		fsp.copy(templatePath + path + '/', nowPath + '\\' + configTemp.appName + '/')
		.then(function(){
			//生成首页
			return fsp.ensureDir(nowPath + '\\' + configTemp.appName + '')
		}).then(function(){
			//写入文件	
			return fsp.writeFile(nowPath + '\\' + configTemp.appName + '/index.htm', iconv.encode(M, 'gbk'));
		}).then(function(){
			//生成配置文件
			return fsp.writeFile(nowPath + '\\' + configTemp.appName + '/tg_config.json', tg_config)
		}).then(function(){
			//生成gulp配置&目录主要配置完成
			return 	fsp.copy(templatePath + '/gulp', nowPath + '\\' + configTemp.appName + '/')
		}).then(function(){
			spinner.stop();
			console.log('')
			ora(chalk.green('目录生成成功！')).succeed();
			//初始化gulp
			if(installGulp) {
				var spinnerInstall = ora('安装依赖').start();
				//安装依赖
				exec('npm install --save-dev', {
					cwd: nowPath + '\\' + configTemp.appName + ''
				}).then(function(){
					console.log('')
 					ora(chalk.green('相关依赖安装成功！')).succeed();
					exec('npm install  gulp -g --save-dev', {
						cwd: nowPath + '\\' + configTemp.appName + ''
					})
				}).then(function(){
                    spinnerInstall.stop();
                    console.log('')
                    ora(chalk.green('gulp安装成功！')).succeed();
                    console.log('')
                    console.log(chalk.gray('   您的文件路径：') + nowPath + '\\' + configTemp.appName + '\\');
                    console.log('')
                    console.log('   使用gulp：');
                    console.log('');
					console.log('      ' + chalk.green('cd  ') + configTemp.appName);
					console.log('      ' + chalk.green('npm install'));
					console.log('      ' + chalk.green('npm install -g gulp'));
					console.log('');
                    console.log(chalk.gray('  请愉快的coding吧:)'));
				}).catch(function(err) {
		            console.error(err);
		        });
		    //默认不初始化gulp   
			}else{
				console.log('');
				console.log(chalk.gray('   您的文件路径：') + nowPath + '\\' + configTemp.appName + '\\');
				console.log('');
				console.log(chalk.gray('   您选择没有安装') + 'gulp' +chalk.gray('依赖，稍后安装：'));
				console.log('');
				console.log('      ' + chalk.green('cd  ') + configTemp.appName);
				console.log('      ' + chalk.green('npm install'));
				console.log('      ' + chalk.green('npm install -g gulp'));
				console.log(''); 
			}
		}).catch(function(err) {
            console.error(err);
        });
	})
};