// Зависимости
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 5000);
app.use('/', express.static(__dirname + '/'));

// Маршруты
app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});

// Запуск сервера
server.listen(5000, function () {
    console.log('Запускаю сервер на порте 5000');
});

var player = { x: 150, y: 150 };

io.on('connection', function (socket) {

    socket.on('new player', function () {
        // player = {
        //     x: 150,
        //     y: 150
        // };
    });

    socket.on('movement', function (data) {
        // var player = players[socket.id] || {};
        if (data.A) {
            player.x -= 5;
        }
        if (data.W) {
            player.y -= 5;
        }
        if (data.D) {
            player.x += 5;
        }
        if (data.S) {
            player.y += 5;
        }
    });
});

setInterval(function () {
    io.sockets.emit('state', player);
}, 1000 / 60);