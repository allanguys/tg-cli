#!/usr/bin/env node

var inquirer = require('inquirer');
var program = require('commander');
var Promise = require("bluebird");
var fs = Promise.promisifyAll(require('fs-extra'));;
var chalk = require('chalk');
var figlet = require('figlet');
var iconv = require('iconv-lite');
var ora = require('ora');


var Mustache = require('../lib/mustache');

var shelljs = require('shelljs/global');

var rootPath = __dirname.replace(/(bin)|(lib)/,'');
var nowPath = process.cwd();
//config file
var configFile = rootPath+'tg_config.json';
var templatePath = rootPath + 'template/';
//lib

var installConfig = require('../lib/installConfig.js');

//temp
var configTemp = {};
var dt = new Date();



//fs.readJsonSync(rootPath+'tg_config.json',configTemp);

//初始化config
function initconfigTemp() {
	fs.ensureFileSync(nowPath+ '\\' + configFile, (err, contents) => {
		if(err) console.error(err)
		configTemp = contents;
	})
}		
configTemp['time'] = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate();


program
	.option('i, install', '安装')
	.parse(process.argv);

//安装
if(program.install) {
	//初始化config
	//initconfigTemp();
	console.log(
		chalk.green(
			figlet.textSync("TG CLI")
		));
	//type
	inquirer.prompt(installConfig.type).then(function(args) {
		assignConfig(args)
		//name
		nameInit();
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
		if(args.author.toLowerCase() == 'cp'){
			configTemp['designAuthor'] = 'cp';
			//游戏名
			gameName()
		}else{
			//设计师名
			designAuthorInit();
		}
		
	})
};
//作者名
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
			console.log('正在生成通用模板...');
			//生成模板
			createTemplate(path, type, terminal)
		}
	} else if(configTemp.appType == 'PC专题') {
		var type = 'act';
		var terminal = 'pc';
		var path = '';
		if(configTemp.gameName && fs.existsSync(templatePath + type + '/' + terminal + configTemp.gameName + '/')) {
			var path = type + '/' + terminal + configTemp.gameName;
			console.log('正在生成' + configTemp.gameName + '的单独模板...');
			//生成模板
			createTemplate(path, type, terminal)
		} else {
			var path = type + '/' + terminal + '/common';
			//console.log('无' + configTemp.gameName + '的单独模板');
			console.log('正在生成通用模板...');
			//生成模板
			createTemplate(path, type, terminal)
		}
	}
}
//公用模块
function addMoudle(type, terminal) {
	//milo
	if(configTemp.module.length > 0 ) {
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
	if(configTemp.module.indexOf('视频')>= 0){
	  var player = fs.readFileSync(templatePath + 'module/common/player.htm')
	  configTemp['player'] = iconv.decode(player, 'gbk');
	}
	//选项卡
	if(configTemp.module.indexOf('选项卡')>= 0){
	  var tab = fs.readFileSync(templatePath + 'module/' + terminal + '/tab.htm')
	  configTemp['tab'] = iconv.decode(tab, 'gbk');
	}
	//轮播图
	if(configTemp.module.indexOf('轮播图')>= 0){
	  var scroll = fs.readFileSync(templatePath + 'module/' + terminal + '/scroll.htm')
	  configTemp['scroll'] = iconv.decode(scroll, 'gbk');
	}
	//抽奖
	if(configTemp.module.indexOf('方形抽奖')>= 0){
	  var lottery = fs.readFileSync(templatePath + 'module/' + terminal + '/lottery.htm')
	  configTemp['lottery'] = iconv.decode(lottery, 'gbk');
	}

	
}
//创建模板
function createTemplate(path, type, terminal) {


	var tg_config = JSON.stringify(configTemp);
	//通用模块集成
	addMoudle(type, terminal)
	//作者
    if( configTemp['author'].toLowerCase() == 'cp'){
    	configTemp['author'] = 'cp'
    	configTemp['team'] = 'cp'
    }else{
    	configTemp['team'] = 'Tgideas'
    }
	
	fs.readFile(templatePath + path + '/index.htm', function(err, buffer) {
		if(err) throw err;
		var str = iconv.decode(buffer, 'gbk');

		var M = Mustache.render(str, configTemp);
		var spinner = ora('正在生成...').start();
		fs.ensureDir(nowPath+ '\\' +configTemp.appName + '', err => {
		  if(err) return console.error(err);
				fs.writeFile(nowPath+ '\\' + configTemp.appName + '/index.htm', iconv.encode(M, 'gbk'), function(err) {
					if(err) return console.error(err);
			 //生成配置文件
             fs.writeFile(nowPath+ '\\' +configTemp.appName + '/tg_config.json',tg_config, function(err) {
					if(err) return console.error(err);
			
					fs.copy(templatePath+'/gulp',nowPath+ '\\' + configTemp.appName + '/', err => {
						fs.copy(templatePath+type+'/common/ossweb-img',nowPath+ '\\' + configTemp.appName + '/ossweb-img', err => {
						  if (err) return console.error(err)
						  spinner.stop();
						  ora(chalk.green('目录生成成功！')).succeed();
						}) 
					});
					var spinnerInstall = ora('安装gulp依赖').start();
					exec('npm install', {cwd: nowPath+ '\\' + configTemp.appName + ''},function(err){
						if(err){
							console.log('安装依赖出错，请检查网络环境或在目录中重试npm install');					console.log('')
							console.log(chalk.gray('您的文件目录路径：' + nowPath+ '\\' + configTemp.appName + '\\'));
						}else{
							spinnerInstall.stop();
							console.log('')
							ora(chalk.green('gulp相关依赖安装成功！')).succeed();
							console.log('')
							console.log(chalk.gray('您的文件路径：' + nowPath+ '\\' + configTemp.appName + '\\'));
							console.log(chalk.gray('请愉快的coding吧:)'));	
						}

					});
				});
		      });
			});
		})



}