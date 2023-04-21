import { watch } from 'node:fs';
import path from 'node:path';
import { fork } from 'node:child_process';

var proc = fork(path.join(".\\dist\\backend\\", "Server.js"))

watch('.\\backend', (eventType, filename) => {
    console.log(`file is: ${eventType}`);

    proc.kill('SIGINT')
    proc = fork(path.join(".\\dist\\backend\\", "Server.js"))

    if (filename) {
        // console.log(`filename provided: ${filename}`);
    } else {
        console.log('filename not provided');
    }
});



proc.on("exit", function (code, signal) {
    console.log("Exited", { code: code, signal: signal });
});
proc.on("error", console.error.bind(console));
// cp.kill('SIGINT')