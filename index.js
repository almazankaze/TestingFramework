#!/usr/bin/env node

import Runner from "./runner.js";
const runner = new Runner();

const run = async () => {
  await runner.collectFiles(process.cwd());
  runner.runTests();
};

run();
