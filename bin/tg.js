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
var path = require('path');

var Mustache = require('../lib/mustache');
var checkVersion = require('../lib/check-version');
var shelljs = require('shelljs/global');
var rootPath = __dirname.replace(/(tg-cli\/bin)|(tg-cli\/lib)/, 'tg-cli\/');
var nowPath = process.cwd();
//config file
var configFile = path.resolve(__dirname, '../tg_config.json');
var templatePath = path.resolve(__dirname, '../template\/') +'/' ;
//lib

var installConfig = require('../lib/installConfig.js');
var package = require(path.resolve(__dirname, '../package.json'));

//temp
var configTemp = {};
var dt = new Date();
var installGulp = false;
var npmSource = 'npm';

function printHelp() {
	console.log('  Examples:');
  console.log('');
  console.log('    交互式创建项目：')
  console.log('    tg');
  console.log('');
  console.log('    快捷方式创建项目：')
  console.log('    tg -g cf -d a20170406newbie');
  console.log('');
}

program.version(package.version)
  .usage('[options]')
  .option('-g --game <game>', '指定游戏域名前缀，例如"cf"、"dnf"、"lol"等', /^[a-z0-9][a-z0-9\-]*[a-z0-9]+$/)
  .option('-d --dir <dir>', '指定需求目录名，格式为"a+日期+名称"，例如"a20170601test"', /^a\d{8}[a-z]+$/);

program.on('--help', printHelp);
program.parse(process.argv);
if(program.game || program.dir ) {
	if(!program.game) {
		console.log("必须指定游戏域名前缀。\n");
		printHelp();
		process.exit(1);
	}

	if(!program.dir) {
		console.log("必须指定需求目录名称。\n");
		printHelp();
		process.exit(1);
	}
	assignConfig({ gameName: program.game, appName: program.dir}, true);
} else {
	//检查版本
	checkVersion(function () {
		configTemp['time'] = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate();

		console.log(
		  chalk.green(
			  figlet.textSync("TG CLI")
		));
		inquirer.prompt(installConfig.type).then(function(args) {
			assignConfig(args)
			//name
			nameInit();
		});
	});
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
	if(!configTemp.gameName == undefined){
		configTemp.gameName = configTemp.gameName.toLocaleLowerCase();
	}
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
		console.log(templatePath + type + '/' + terminal  + '/'+ configTemp.gameName + '/')
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
	}else if(configTemp.appType == '视频H5') {
		var type = 'act';
		var terminal = 'h5video';
		var path = '';
		if(configTemp.gameName && fs.existsSync(templatePath + type + '/' + terminal + '/' + configTemp.gameName + '/')) {
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
	//jsLib
	var jsLib = fs.readFileSync(templatePath + '/module/' + terminal + '/jslib.htm')
	configTemp['jsLib'] = iconv.decode(jsLib, 'gbk');
	if(configTemp.module == undefined) return
	//milo
	if(configTemp.module.length > 0) {
		var milo = fs.readFileSync(templatePath + '/module/' + terminal + '/milo.htm');
		configTemp['milo'] = iconv.decode(milo, 'gbk');
	}

	//通用登录
	if(configTemp.module.indexOf('IEG通用登录') >= 0) {
		var login = fs.readFileSync(templatePath + '/module/' + terminal + '/login.htm');
		configTemp['login'] = iconv.decode(login, 'gbk');
	}
	//弹窗
	if(configTemp.module.indexOf('浮层') >= 0) {
		var pop = fs.readFileSync(templatePath + '/module/' + terminal + '/pop.htm');
		configTemp['pop'] = iconv.decode(pop, 'gbk');
	}


	//视频
	if(configTemp.module.indexOf('视频') >= 0) {
		var player = fs.readFileSync(templatePath + '/module/common/player.htm')
		configTemp['player'] = iconv.decode(player, 'gbk');
	}
	//选项卡
	if(configTemp.module.indexOf('选项卡') >= 0) {
		var tab = fs.readFileSync(templatePath + '/module/' + terminal + '/tab.htm')
		configTemp['tab'] = iconv.decode(tab, 'gbk');
	}
	//轮播图
	if(configTemp.module.indexOf('轮播图') >= 0) {
		var scroll = fs.readFileSync(templatePath + '/module/' + terminal + '/scroll.htm')
		configTemp['scroll'] = iconv.decode(scroll, 'gbk');
	}
	//抽奖
	if(configTemp.module.indexOf('抽奖') >= 0) {
		var lottery = fs.readFileSync(templatePath + '/module/' + terminal + '/lottery.htm')
		configTemp['lottery'] = iconv.decode(lottery, 'gbk');
	}
}
//SEO
function  seoInfo(){
	 var m = JSON.parse(fs.readFileSync(templatePath + '/gameinfo.js').toString()).list;
    m.forEach(function (value) {
        if(value.domain == configTemp.gameName){
            configTemp['keywords'] =value.keywords;
            configTemp['description'] = value.description;
            configTemp['gamecn'] = value.gameName;
            configTemp['domain'] = value.domain;
            configTemp['imagePath'] =(value.imagePath == '' || typeof value.imagePath == 'undefined' )? value.domain: value.imagePath;
        }
	})
}
//创建模板
function createTemplate(path, type, terminal) {

	var tg_config = JSON.stringify(configTemp);
	//通用模块集成
	if(terminal == 'h5video'){
		addMoudle(type, 'm')
	}else{
		addMoudle(type, terminal)
	}

    //SEO
    seoInfo();
	//作者
	if(configTemp.author != undefined){
		if(configTemp['author'].toLowerCase() == 'cp') {
			configTemp['author'] = 'cp'
			configTemp['team'] = 'cp'
		}else{
			configTemp['team'] = 'Tgideas'
		};
	}
    tg_config =  JSON.stringify(configTemp)
	fs.readFile(templatePath + path + '/index.htm', function(err, buffer) {
		if(err) throw err;
		var str = iconv.decode(buffer, 'gbk');
		var M = Mustache.render(str, configTemp);
		var spinner = ora('   正在生成...').start();
		//复制模板目录
		fsp.copy(templatePath + path + '/', nowPath + '/' + configTemp.appName + '/')
		.then(function(){
			//生成首页
			return fsp.ensureDir(nowPath + '/' + configTemp.appName + '')
		}).then(function(){
			//写入文件
			return fsp.writeFile(nowPath + '/' + configTemp.appName + '/index.htm', iconv.encode(M, 'gbk'));
		}).then(function(){
			//生成配置文件
			return fsp.writeFile(nowPath + '/' + configTemp.appName + '/tg_config.json', tg_config)
		}).then(function(){
			//生成gulp配置&目录主要配置完成
			return 	fsp.copy(templatePath + '/gulp', nowPath + '/' + configTemp.appName + '/')
		}).then(function(){
			spinner.stop();
			console.log('')
			ora(chalk.green('目录生成成功！')).succeed();
			//初始化gulp
			if(installGulp) {
				console.log('')
				var spinnerInstall = ora('安装依赖').start();
				console.log('')
				//安装依赖
				exec(npmSource + ' install', {
					cwd: nowPath + '/' + configTemp.appName + ''
				}).then(function(){
					console.log('')
					spinnerInstall.stop();
 					ora(chalk.green('相关依赖安装成功！')).succeed();
					exec(npmSource + ' install -g gulp', {
						cwd: nowPath + '/' + configTemp.appName + ''
					})
				}).then(function(){
                    console.log('')
                    ora(chalk.green('gulp安装成功！')).succeed();
                    console.log('')
                    console.log(chalk.gray('   您的文件路径：') + nowPath + '/' + configTemp.appName + '/');
                    console.log('')
                    console.log('   使用gulp：');
                    console.log('');
					console.log('      ' + chalk.green('cd  ') + configTemp.appName);
					console.log('      ' + chalk.green('gulp'));
					console.log('');
                    console.log(chalk.gray('  请愉快的coding吧:)'));
				}).catch(function(err) {
		            console.error(err);
		        });
		    //默认不初始化gulp
			}else{
				console.log('');
				console.log(chalk.gray('   您的文件路径：') + nowPath + '/' + configTemp.appName + '\\');
				console.log('');
				console.log(chalk.gray('   接下来，请执行：'));
				console.log('');
				console.log('      ' + chalk.green('cd ') + configTemp.appName);
				console.log('      ' + chalk.green(npmSource + ' install'));
				console.log('      ' + chalk.green(npmSource + ' run dev'));
				console.log('');
				console.log(chalk.gray('   请愉快地coding吧:)'));
			}
		}).catch(function(err) {
            console.error(err);
        });
	})
};
