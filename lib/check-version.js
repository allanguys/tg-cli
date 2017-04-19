var request = require('request')
var semver = require('semver')
var chalk = require('chalk')
var packageConfig = require('../package.json')

module.exports = function (done) {
  // Ensure minimum supported node version is used
  if (!semver.satisfies(process.version, packageConfig.engines.node)) {
    return console.log(chalk.red(
      ' Tg-cli需要 >=' + packageConfig.engines.node + '.x的node版本，请升级当前版本'
    ))
  }

  request({
    url: 'https://registry.npmjs.org/tg-cli',
    timeout: 1000
  }, function (err, res, body) {
    if (!err && res.statusCode === 200) {
      var latestVersion = JSON.parse(body)['dist-tags'].latest
      var localVersion = packageConfig.version
      if (semver.lt(localVersion, latestVersion)) {
        console.log(chalk.green(' 新版本可用.'))
        console.log()
        console.log('  最新版本:    ' + chalk.green(latestVersion))
        console.log('  本地版本: ' + chalk.red(localVersion))
        console.log()
      }
    }
    done()
  })
}