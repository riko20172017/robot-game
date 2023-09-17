import { watch } from 'node:fs';
import path from 'node:path';
import { fork, exec, execFile, spawn } from 'node:child_process';

var express;
var tsc = spawn('tsc', ['-w'], { shell: true });

tsc.stdout.on('data', (data) => {
  console.log(data.toString());
  if (express) express.kill('SIGINT')
  express = fork(path.join(".\\dist\\backend\\", "Server.js"));
});

tsc.stderr.on('data', (data) => {
  console.error(data.toString());
});

tsc.on('exit', (code) => {
  console.log(`Child exited with code ${code}`);
});