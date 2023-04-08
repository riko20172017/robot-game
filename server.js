// Зависимости
import express from 'express';
import { createServer } from "http";
import path from 'path';
import { Server } from "socket.io";
import { uid } from 'uid'
import { fileURLToPath } from 'url';
import { performance } from 'perf_hooks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var app = express();
var httpServer = createServer(app);
var io = new Server(httpServer);


app.set('port', 5000);
app.use('/', express.static(__dirname + '/'));

// Маршруты
app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});

// Запуск сервера
httpServer.listen(5000, function () {
    console.log('Запускаю сервер на порте 5000');
});

// Game state
var fps = 10;
var interval = 1000 / fps;
let messages = [];

var players = []
var bullets = []
var playerSpeed = 200;
var bulletSpeed = 500;
var lastFire = performance.now();

io.on('connection', function (socket) {

    socket.on('new player', function () {
        var id = uid()
        players.push(
            {
                id,
                socketId: socket.id,
                x: randomInteger(10, 500),
                y: randomInteger(10, 400),
                lastTik: 0
            })
        io.sockets.emit('new player', players);
    });


    socket.on('movement', function (data) {
        messages.push(data)
    })

    socket.on('disconnect', function (data) {
        if (!players.length) return
        players = players.filter(player => player.socketId != socket.id)
        io.sockets.emit('new player', players)
    })

});


function main() {
    update()

    io.sockets.emit('state', [...players]);

}

function update() {

    handleInput()
    // updateEntities(dt)
    //checkCollisions();
}

function handleInput() {

    // [ dir, playerId, tik, dt ]
    messages.forEach(message => {
        let { dir, playerId, tik, delta } = message;

        var player = getPlayer(playerId)

        let dt = playerSpeed * delta;

        // if (input.SPACE && Date.now() - lastFire > 300) {
        //     var x = player.x + 19;
        //     var y = player.y + 19;

        //     var mx = input.mouse.x;
        //     var my = input.mouse.y;
        //     var vx = mx - x;
        //     var vy = my - y;

        //     var dist = Math.sqrt(vx * vx + vy * vy);
        //     var dx = vx / dist;
        //     var dy = vy / dist;

        //     var angle = Math.atan2(vx, vy);

        //     const bullet = {
        //         id: randomInteger(1000, 10000),
        //         playerId: player.id,
        //         pos: [x, y],
        //         way: [dx, dy],
        //         dir: -angle + 1.5,
        //     }

        //     bullets.push({ ...bullet });

        //     lastFire = Date.now();

        //     return { ...player, bullet: { ...bullet } }
        // }

        player.lastTik = tik

        switch (dir) {
            case 'DOWN':
                player.y += dt;
                break;
            case 'UP':
                player.y -= dt;
                break;
            case 'LEFT':
                player.x -= dt;
                break;
            case 'RIGHT':
                player.x += dt;
                break;
            default:
                break;
        }
    });

    messages = []

}

function updateEntities(dt) {
    // Update all the bullets
    for (var i = 0; i < bullets.length; i++) {
        var bullet = bullets[i];

        // bullet.pos[0] += bulletSpeed * dt * (- 1);
        bullet.pos[0] += bulletSpeed * dt * (bullet.way[0]);
        bullet.pos[1] += bulletSpeed * dt * (bullet.way[1]);



        // Remove the bullet if it goes offscreen
        if (bullet.pos[1] < 0 || bullet.pos[1] > 480 ||
            bullet.pos[0] < 0 || bullet.pos[0] > 580) {
            bullets.splice(i, 1);
            i--;
        }
    }
}

function checkCollisions() {
    // checkPlayerBounds();

    // Run collision detection for all enemies and bullets

    for (const key in players) {
        if (Object.hasOwnProperty.call(players, key)) {
            const player = players[key];
            var pos = [player.x, player.y];
            var size = [39, 39];


            for (var j = 0; j < bullets.length; j++) {
                var pos2 = bullets[j].pos;
                var size2 = [18, 8];
                if (bullets[j].playerId !== player.id) {
                    if (boxCollides(pos, size, pos2, size2)) {
                        // Remove the enemy
                        delete players[key];
                        io.sockets.emit('explosions', { player, bulletKey: j });

                        // Remove the bullet and stop this iteration
                        bullets.splice(j, 1);

                        break;
                    }
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

function getPlayerId(socketId) {
    for (const key in players) {
        if (Object.hasOwnProperty.call(players, key)) {
            const player = players[key];
            if (player.socketId == socketId) return key
        }
    }

    throw "Player not exist"
}

function getPlayer(playerId) {
    return players.find(player => player.id == playerId)
}

function randomInteger(min, max) {
    // получить случайное число от (min-0.5) до (max+0.5)
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

setInterval(() => { main() }, interval);