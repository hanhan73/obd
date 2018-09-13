const fs = require('fs');
const path = require('path');
// eslint-disable-next-line
const colors = require('colors');
const Client = require('ssh2').Client;

class UploadFiles {
  constructor(configArray) {
    this.start(configArray);
  }

  async start(configArray) {
    await Promise.all(
      configArray.map(async (i) => {
        await this.upload(i);
      }),
    );
  }

  upload(config) {
    return new Promise((resolve) => {
      const conn = new Client();
      conn
        .on('ready', () => {
          console.log(`连接 ${config.host} 成功...`.bgGreen);
          conn.sftp(async (err, sftp) => {
            if (err) throw err;
            this.sftp = sftp;
            console.log('正在准备上传文件...');
            try {
              await this.uploadFiles(config.localPath, config.remotePath);
            } finally {
              conn.end();
              resolve();
            }
          });
        })
        .on('end', () => {
          console.log('上传完毕, 连接已断开'.bgGreen);
        })
        .connect(config);
    });
  }

  uploadFiles(localPath, remotePath) {
    return new Promise(async (resolve) => {
      if (this.isDir(localPath)) {
        const files = fs.readdirSync(localPath);
        await Promise.all(
          files.map(async (i) => {
            const _localPath = path.join(localPath, i);
            const _remotePath = path.join(remotePath, i).replace(/\\/g, '/');
            if (this.isDir(_localPath)) {
              await this.mkdir(_remotePath);
            }
            await this.uploadFiles(_localPath, _remotePath);
          }),
        );
        resolve();
      } else {
        const _isExist = await this.isExist(remotePath);
        if (_isExist) {
          console.log(`${localPath.yellow} 已存在!`);
          resolve();
        }
        await new Promise((_resolve) => {
          this.sftp.fastPut(localPath, remotePath, (err) => {
            if (err) {
              throw err;
            } else {
              console.log(`${localPath.green} 上传完毕!`);
              _resolve();
            }
          });
        });
        resolve();
      }
    });
  }

  // eslint-disable-next-line
  isDir(localPath) {
    return fs.existsSync(localPath) && fs.statSync(localPath).isDirectory();
  }

  mkdir(remotePath) {
    return new Promise((resolve) => {
      this.sftp.mkdir(remotePath, (err) => {
        if (err) {
          resolve();
        } else {
          resolve();
        }
      });
    });
  }

  isExist(remotePath) {
    return new Promise((resolve) => {
      this.sftp.stat(remotePath, (err, stats) => {
        if (stats !== undefined) {
          resolve(true);
        }
        resolve(false);
      });
    });
  }
}

let configArray = [
  {
    name: 'test',
    host: '192.168.1.14',
    port: 22,
    username: 'root',
    privateKey: fs.readFileSync('c:/Users/Administrator/.ssh/id_rsa'),
    localPath: './dist',
    remotePath: '/usr/local/nginx/gps',
  },
  {
    name: 'prod',
    host: '120.78.82.60',
    port: 22,
    username: 'root',
    privateKey: fs.readFileSync('c:/Users/Administrator/.ssh/id_rsa'),
    localPath: './dist',
    remotePath: '/www/gps',
  },
];

const args = process.argv.splice(2);

if (args.length) {
  configArray = configArray.filter(i => args.indexOf(i.name) !== -1);
}

if (configArray.length) {
  // eslint-disable-next-line
  new UploadFiles(configArray);
} else {
  console.log('未找到对应服务器配置'.red);
}
