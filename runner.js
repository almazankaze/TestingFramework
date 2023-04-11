import fs from "fs";
import path from "path";
import chalk from "chalk";
import render from "./render.js";

const forbiddenDirs = ["node_modules"];

export default class Runner {
  constructor() {
    this.testFiles = [];
  }

  async runTests() {
    for (let file of this.testFiles) {
      console.log(chalk.gray(`---- ${file.shortName}`));

      const beforeEaches = [];

      global.render = render;

      global.beforeEach = (fn) => {
        beforeEaches.push(fn);
      };

      global.it = async (desc, fn) => {
        beforeEaches.forEach((func) => func());

        try {
          await fn();
          console.log(chalk.green(`\tOK - ${desc}`));
        } catch (err) {
          const message = err.message.replace(/\n/g, "\n\t\t");
          console.log(chalk.red(`\tX - ${desc}`));
          console.log(chalk.red(`\t`, message));
        }
      };

      try {
        import(`file://${file.name}`);
      } catch (err) {
        console.log(`X - Error Loading File`, file.name);
        console.log(err);
      }
    }
  }

  async collectFiles(targetPath) {
    const files = await fs.promises.readdir(targetPath);

    for (let file of files) {
      const filepath = path.join(targetPath, file);
      const stats = await fs.promises.lstat(filepath);

      if (stats.isFile() && file.includes(".test.js")) {
        this.testFiles.push({ name: filepath, shortName: file });
      } else if (stats.isDirectory() && !forbiddenDirs.includes(file)) {
        const childFiles = await fs.promises.readdir(filepath);

        files.push(...childFiles.map((f) => path.join(file, f)));
      }
    }
  }
}
