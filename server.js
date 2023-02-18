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
        io.sockets.emit('state', player);
    });

    var lastUpdateTime = (new Date()).getTime();

    socket.on('movement', function (data) {
        var currentTime = (new Date()).getTime();
        var timeDifference = currentTime - lastUpdateTime;
        // var player = players[socket.id] || {};
        console.log(timeDifference);
        if (timeDifference > 500) {
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

            lastUpdateTime = currentTime

            io.sockets.emit('state', player);
        }




    });

});

// setInterval(function () {
//     io.sockets.emit('state', player);
// }, 1000 / 60);