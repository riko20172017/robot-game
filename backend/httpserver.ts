import express from 'express';
import { createServer } from "http";
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
let __dirname = path.resolve(path.dirname(__filename), "../..");

var app = express();
app.set('port', 5000);
app.use('/', express.static(__dirname + '/'));

// Маршруты
app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});

var httpServer = createServer(app);
// Запуск сервера
httpServer.listen(5000, function () {
    console.log('Запускаю сервер на порте 5000');
});

export default httpServer