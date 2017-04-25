var request = require('request');
var chalk = require('chalk');
var packageConfig = require('../package.json');

module.exports = function (done) {


  request({
    url: 'https://registry.npmjs.org/tg-cli',
    timeout: 1000
  }, function (err, res, body) {
  
    if (!err && res.statusCode === 200) {
      var latestVersion = JSON.parse(body)['dist-tags'].latest
      var localVersion = packageConfig.version
      if (localVersion !== latestVersion) {
      	console.log()
        console.log(chalk.gray('  tg-cli新版本可用.'))
        console.log()
        console.log(chalk.gray('  最新版本: ' + latestVersion))
        console.log(chalk.gray('  本地版本: ' + localVersion))
        console.log()
        console.log('  重新安装获得新特性: ' + chalk.green('npm install -g tg-cli'))
        console.log()
      }
    }
    done()
  })
}