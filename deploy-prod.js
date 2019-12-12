const scpClient = require('scp2')

const ora = require('ora')
const chalk = require('chalk')

const spinner = ora('正在发布到服务器...')
let Client = require('ssh2').Client

const server = {
}

let conn = new Client()
conn
  .on('ready', () => {
    conn.exec(`rm -rf ${server.path}/*`, (error, stdout) => {
      if (error) throw error
      stdout
        .on('close', () => {
          spinner.start()
          scpClient.scp('./dist', server, error => {
            spinner.stop()
            if (error) {
              console.log(chalk.red('发布失败'))
              throw error
            } else console.log(chalk.green('发布成功！'))
          })
          conn.end()
        })
        .on('data', data => console.log('STDOUT: ' + data))
        .stderr.on('data', data => console.log('STDERR: ' + data))
    })
  })
  .connect(server)
