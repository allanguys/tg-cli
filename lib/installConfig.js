var chalk = require('chalk');
var inquirer = require('inquirer'); 
var terminal ='';

let type = [
    {
        name: 'appType',
        type: 'list',
        message: '选择项目类型： ',
        choices:['移动专题','PC专题']
    }
];
let nameInit = [
    {
        name: 'appName',
        type: 'input',
        message: '输入项目名'+ chalk.gray('(例: a20170406tgcil)： '),
        validate( value ) {
            if (value.length) {
                return true;
            } else { 
                return '请输入您项目的名称：';
            }
        }
    }
];
let author = [
    {
        name: 'author',
        type: 'input',
        message: '作者'+ chalk.gray(' <cp/rtx名>：'),
         validate( value ) {
            if (value.length) {
                return true;
            } else { 
                return '如是cp专题请填写 “ cp ”，内部重构请填写rtx名称。此选项会影响分离和页面当中的备注，请认真填写。';
            }
        }
    }
];
let designAuthor = [
    {
        name: 'designAuthor',
        type: 'input',
        message: '设计师：'
    }
];
let gameName = [
    {
        name: 'gameName',
        type: 'input',
        message: '输入游戏域名前缀'+ chalk.gray('(例: cf)：'),
        validate( value ) {
            if (value.length) {
                return true;
            } else { 
                return '此选项将会影响后期自动分离，请务必保证正确';
            }
        }
    }
];
let moduleLoad = [
    {
        name: 'module',
        type: 'checkbox',
        message:' ',
         choices: [
		      new inquirer.Separator(' = 请选择通用模块(用空格多选) = '),
		      {
		        name: 'IEG通用登录'
		      },
		      {
		        name: '浮层'
		      },
		      {
		        name: '选项卡'
		      },
		      {
		        name: '轮播图'
		      },
		      {
		        name: '视频'
		      },
		      {
		        name: '抽奖模块'
		      }
          ],
    validate: function (answer) {
      if (answer.length < 1) {
        return '请用空格选择通用模块';
      }
      return true;
    }
    }
];
let gulp = [
    {
        name: 'gulp',
        type: 'input',
        message: '集成gulp'+ chalk.gray('(压缩css/js/image/liveload)')+' <Y/N>'
    }    
];

module.exports = {
    nameInit: nameInit,
    type: type,
    gameName: gameName,
    moduleLoad: moduleLoad,
    gulp:gulp,
    author:author,
    designAuthor:designAuthor
};