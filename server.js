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

var players = {}

io.on('connection', function (socket) {

    socket.on('new player', function () {
        players[socket.id] = { id: socket.id, x: randomInteger(10, 500), y: randomInteger(10, 400), dir: "LEFT" }
        io.sockets.emit('new player', players);
    });

    var lastUpdateTime = (new Date()).getTime();

    socket.on('movement', function (data) {
        var currentTime = (new Date()).getTime();
        var timeDifference = currentTime - lastUpdateTime;

        var player = players[socket.id] || {};
        player = handleInput(player, data);

        // player.x > 550 ? player.x = 0 : ""

        lastUpdateTime = currentTime

        io.sockets.emit('state', player);
    });

    socket.on('disconnect', function (data) {
        delete players[socket.id]
        io.sockets.emit('new player', players)
    })

});

// setInterval(function () {
//     io.sockets.emit('state', player);
// }, 1000 / 20);

// setInterval(function () {
//     if (player.x == 500) player.x = 0
//     player.x = player.x + 5
//     io.sockets.emit('state', player);
// }, 1000 / 60);

function randomInteger(min, max) {
    // получить случайное число от (min-0.5) до (max+0.5)
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

function handleInput(player, data) {

    if (data.W && data.D) {
        player.y -= 5;
        player.x += 5;
        player.dir = 'UP-RIGHT'
        return player
    }

    if (data.W && data.A) {
        player.y -= 5;
        player.x -= 5;
        player.dir = 'UP-LEFT'
        return player
    }

    if (data.S && data.D) {
        player.y += 5;
        player.x += 5;
        player.dir = 'DOWN-RIGHT'
        return player
    }

    if (data.S && data.A) {
        player.y += 5;
        player.x -= 5;
        player.dir = 'DOWN-LEFT'
        return player
    }

    if (data.S) {
        player.y += 5;
        player.dir = 'DOWN'
        return player
    }

    if (data.W) {
        player.y -= 5;
        player.dir = 'UP'
        return player
    }

    if (data.A) {
        player.x -= 5;
        player.dir = 'LEFT'
        return player
    }

    if (data.D) {
        player.x += 5;
        player.dir = 'RIGHT'
        return player
    }
}