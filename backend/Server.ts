// Зависимости
import { performance } from 'perf_hooks'
import Network from "./Network.js";
import { Entity, Client } from './Interfaces.js';


// Game state

var bullets = []
var playerSpeed = 200;
var bulletSpeed = 500;
var lastFire = performance.now();

class Server {
    clients: Array<Client>
    entities: Array<Entity>
    update_rate: number;
    network: Network;
    update_interval: NodeJS.Timer | undefined

    constructor() {
        this.clients = [];
        this.entities = [];
        this.update_rate = 0
        this.network = new Network()
        this.network.init(this)
        // Default update rate.
        this.setUpdateRate(10);
    }

    setUpdateRate(hz: number) {
        this.update_rate = hz;

        clearInterval(this.update_interval);
        this.update_interval = setInterval(
            (function (self) { return function () { self.update(); }; })(this),
            1000 / this.update_rate);
    }

    update() {
        this.handleInput()
        // updateEntities(dt)
        //checkCollisions();
        this.sendState();
    }


    handleInput() {
        // [ dir, playerId, tik, dt ]
        this.network.messages.forEach(message => {
            let { dir, uid, tik, delta } = message;

            var entity = this.getEntity(uid)

            if (entity == undefined) {
                console.log("entity is undefined");
                return
            }

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

            entity.lastTik = tik

            switch (dir) {
                case 'DOWN':
                    entity.y += dt;
                    break;
                case 'UP':
                    entity.y -= dt;
                    break;
                case 'LEFT':
                    entity.x -= dt;
                    break;
                case 'RIGHT':
                    entity.x += dt;
                    break;
                default:
                    break; 
            }
        });

        this.network.messages = [] 

    }

    sendState() {
        this.network.io.sockets.emit('state', [...this.entities]);
    }

    getEntity(uid: string): Entity | undefined {
        return this.entities.find(entity => entity.uid == uid) 
    }
}

new Server()  


// function updateEntities(dt) {
//     // Update all the bullets
//     for (var i = 0; i < bullets.length; i++) {
//         var bullet = bullets[i];

//         // bullet.pos[0] += bulletSpeed * dt * (- 1);
//         bullet.pos[0] += bulletSpeed * dt * (bullet.way[0]);
//         bullet.pos[1] += bulletSpeed * dt * (bullet.way[1]);



//         // Remove the bullet if it goes offscreen
//         if (bullet.pos[1] < 0 || bullet.pos[1] > 480 ||
//             bullet.pos[0] < 0 || bullet.pos[0] > 580) {
//             bullets.splice(i, 1);
//             i--;
//         }
//     }
// }

// function checkCollisions() {
//     // checkPlayerBounds();

//     // Run collision detection for all enemies and bullets

//     for (const key in players) {
//         if (Object.hasOwnProperty.call(players, key)) {
//             const player = players[key];
//             var pos = [player.x, player.y];
//             var size = [39, 39];


//             for (var j = 0; j < bullets.length; j++) {
//                 var pos2 = bullets[j].pos;
//                 var size2 = [18, 8];
//                 if (bullets[j].playerId !== player.id) {
//                     if (boxCollides(pos, size, pos2, size2)) {
//                         // Remove the enemy
//                         delete players[key];
//                         io.sockets.emit('explosions', { player, bulletKey: j });

//                         // Remove the bullet and stop this iteration
//                         bullets.splice(j, 1);

//                         break;
//                     }
//                 }
//             }
//         }
//     }


//     // if (boxCollides(pos, size, player.pos, player.sprite.size)) {
//     //     gameOver();
//     // }
// }

// // Collisions

// function collides(x, y, r, b, x2, y2, r2, b2) {
//     return !(r <= x2 || x > r2 ||
//         b <= y2 || y > b2);
// }

// function boxCollides(pos, size, pos2, size2) {
//     return collides(pos[0], pos[1],
//         pos[0] + size[0], pos[1] + size[1],
//         pos2[0], pos2[1],
//         pos2[0] + size2[0], pos2[1] + size2[1]);
// }

// function getPlayerId(socketId) {
//     for (const key in players) {
//         if (Object.hasOwnProperty.call(players, key)) {
//             const player = players[key];
//             if (player.socketId == socketId) return key
//         }
//     }

//     throw "Player not exist"
// }

// function getEntities(playerId) {
//     return players.find(player => player.id == playerId)
// }

export default Server