import { watch } from 'node:fs';
import path from 'node:path';
import { fork, exec, execFile } from 'node:child_process';

// var proc = fork(path.join(".\\dist\\backend\\", "Server.js"))


execFile("node", [path.join(".\\dist\\backend\\", "Server.js")], { encoding: 'utf8' }, (error, stdout, stderr) => {
    if (error) {
    console.error(`error: ${error.message}`);
    return;
  }

  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }

  console.log(`stdout:\n${stdout}`);
})


// proc.on("exit", function (code, signal) {
//     console.log("Exited", { code: code, signal: signal });
// });
// proc.on("error", console.error.bind(console));
// // cp.kill('SIGINT')