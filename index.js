const tinify = require('tinify');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const bytes = require('bytes');
const ora = require('ora');
const Table = require('cli-table');

const supportExtnames = ['.png', '.jpg', '.jpeg'];
const excludeDir = ['node_modules'];

class ImgCompressionWebpackPlugin {
  constructor(options = {}) {
    tinify.key = options.key;
  }

  /**
   * @param {String} path 
   * @returns {Number}
   */
  getFileSize(path) {
    const stat = fs.statSync(path);
    return stat.size;
  }

  getImgPathAll(dirPath = process.cwd()) {
    const imgPathAll = [];

    const f = function f(dirPath2 = dirPath) {
      const readdirRes = fs.readdirSync(dirPath2, { withFileTypes: true });

      for (let v of readdirRes) {
        const fullPath = path.join(dirPath2, v.name);

        if (v.isDirectory()) {
          if (excludeDir.includes(v.name)) continue;
          f(fullPath);
        } else {
          const extname = path.extname(v.name);
          if (supportExtnames.includes(extname)) {
            imgPathAll.push(fullPath);
          }
        }
      }
    };
    f();

    return imgPathAll;
  }

  startCompress(surplusCompressionCount = 0) {
    return new Promise(async (resolve) => {
      let imgDataAll = this.getImgPathAll().map(abPath => {
        const size = bytes(this.getFileSize(abPath));
        abPath = {
          path: abPath,
          relativePath: path.relative(process.cwd(), abPath),
          byte: this.getFileSize(abPath),
          size: size,
          compressed: size
        };
        return abPath;
      });
    
      if (imgDataAll.length === 0) {
        console.log(chalk.yellow('No compressible pictures!'));
        return;
      }
    
      const spinner = ora('Staring...').start();
    
      for (let i = 0; i < imgDataAll.length; i++) {
        const _5mb = 1024 * 1024 * 5;
        const p = imgDataAll[i].path;
        if (i >= surplusCompressionCount) break;
        if (imgDataAll[i].byte >= _5mb) continue;

        spinner.text = `[${i + 1}/${imgDataAll.length}] ${imgDataAll[i].relativePath}`;
        
        const result = new Promise((resolve, reject) => {
          tinify.fromFile(p).toFile(p, (err) => {
            if (err) {
              reject(err);
              throw Error(err);
            }
            imgDataAll[i].compressed = bytes(this.getFileSize(p));
            resolve();
          });
        });
    
        await result;
      }

      const table = new Table();
      table.push([
        chalk.cyan('File'),
        chalk.cyan('Byte'),
        chalk.cyan('Size'),
        chalk.cyan('Compressed')
      ]);
      imgDataAll.forEach(el => {
        table.push([
          chalk.green(el.relativePath),
          el.byte,
          el.size,
          el.compressed
        ]);
      });
    
      spinner.stop();
      console.log(table.toString());
      resolve();
    });
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('compile', (compilation, callback) => {

      tinify.validate(async (err) => {
        if (err) {
          callback();
          throw err;
        }
        let count = tinify.compressionCount;
        const total = 500;
      
        if (count > total) {
          console.log(
            ' ==========================================================\n',
            chalk.red('  Compression times exceed 500, Please use it next month.\n'),
            '==========================================================\n'
          );
        } else {
          console.log(
            ' =====================================================\n',
            chalk.yellow(`  Residual compression times of this month [${count}/${total}] \n`),
            '=====================================================\n\n'
          );
          await this.startCompress(total - count);
        }
        callback();
      });
    });
  }
}

module.exports = ImgCompressionWebpackPlugin;
