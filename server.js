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
var bullets = []
var playerSpeed = 200;
var bulletSpeed = 500;
var lastFire = Date.now();

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

setInterval(() => {
    update()

}, 1000 / 60);

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

    if (data.SPACE && Date.now() - lastFire > 100) {
        var x = player.x;
        var y = player.y;

        var mx = data.mouse.x;
        var my = data.mouse.y;
        var vx = mx - x;
        var vy = my - y;

        var dist = Math.sqrt(vx * vx + vy * vy);
        var dx = vx / dist;
        var dy = vy / dist;

        var angle = Math.atan2(vx, vy);

        const bullet = {
            pos: [x, y],
            way: [dx, dy],
            dir: -angle + 1.5,
        }

        bullets.push({ ...bullet });

        lastFire = Date.now();

        return { ...player, bullet: { ...bullet } }
    }

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

function update(params) {
    updateEntities()
    checkCollisions();
}

function updateEntities() {
    // Update all the bullets
    for (var i = 0; i < bullets.length; i++) {
        var bullet = bullets[i];

        // bullet.pos[0] += bulletSpeed * dt * (- 1);
        bullet.pos[0] += bulletSpeed * (bullet.way[0]);
        bullet.pos[1] += bulletSpeed * (bullet.way[1]);



        // Remove the bullet if it goes offscreen
        if (bullet.pos[1] < 0 || bullet.pos[1] > 480 ||
            bullet.pos[0] > 580) {
            bullets.splice(i, 1);
            i--;
        }
    }
}

function checkCollisions() {
    checkPlayerBounds();

    // Run collision detection for all enemies and bullets

    for (const key in players) {
        if (Object.hasOwnProperty.call(players, key)) {
            const player = players[key];
            var pos = [player.x, player.y];
            var size = [39, 39];

            for (var j = 0; j < bullets.length; j++) {
                var pos2 = bullets[j].pos;
                var size2 = [18, 8];

                if (boxCollides(pos, size, pos2, size2)) {
                    // Remove the enemy
                    delete player[key];

                    io.sockets.emit('state', player);

                    // Add an explosion
                    explosions.push({
                        pos: pos,
                        sprite: new Sprite('img/sprites.png',
                            [0, 117],
                            [39, 39],
                            16,
                            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                            null,
                            true)
                    });

                    // Remove the bullet and stop this iteration
                    bullets.splice(j, 1);
                    break;
                }
            }


        }
    }


    // if (boxCollides(pos, size, player.pos, player.sprite.size)) {
    //     gameOver();
    // }
}

// Collisions

function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 ||
        b <= y2 || y > b2);
}

function boxCollides(pos, size, pos2, size2) {
    return collides(pos[0], pos[1],
        pos[0] + size[0], pos[1] + size[1],
        pos2[0], pos2[1],
        pos2[0] + size2[0], pos2[1] + size2[1]);
}