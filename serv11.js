import { watch } from 'node:fs';
import path from 'node:path';
import { fork, exec, execFile } from 'node:child_process';

// var proc = fork(path.join(".\\dist\\backend\\", "Server.js"))

var fsTimeout
var proc = undefined;

var proc = startServer()

watch('.\\backend', function (eventType, filename) {

    if (!fsTimeout) {
        console.log('file is', filename)
        exec("npx tsc", (err, stdout, stderr) => {
            // console.log(err);
            // console.log(stdout);
            // console.log(stderr);
        })

        if (proc !== undefined) { proc.kill('SIGINT') }




        fsTimeout = setTimeout(function () { fsTimeout = null }, 100) // give 5 seconds for multiple events
    }
})

function startServer() {
    return execFile("node", [path.join(".\\dist\\backend\\", "Server.js")], { encoding: 'utf8' }, (error, stdout, stderr) => {
        if (error) {
            console.error('stderr: ' + Buffer.isBuffer(stderr) ? stderr.toString() : stderr);
            throw error;
        }
        console.log('stdout: ' + Buffer.isBuffer(stdout) ? stdout.toString() : stdout);
    })
}



// proc.on("exit", function (code, signal) {
//     console.log("Exited", { code: code, signal: signal });
// });
// proc.on("error", console.error.bind(console));
// // cp.kill('SIGINT')