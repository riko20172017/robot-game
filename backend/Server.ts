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
    bullets: Bullet[]

    constructor() {
        this.clients = [];
        this.entities = [];
        this.update_rate = 0
        this.network = new Network()
        this.network.init(this)
        this.bullets = []
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
        this.updateEntities()
        this.checkCollisions();
        this.sendState();
    }


    handleInput() {
        // [ dir, playerId, tik, dt ]
        this.network.messages.forEach(message => {
            let { dir, uid, tik, delta, fire, bullet } = message;

            var entity = this.getEntity(uid)

            if (entity == undefined) {
                console.log("entity is undefined");
                return
            }

            let dt = playerSpeed * delta;

            if (bullet) {
                this.bullets.push({ id: bullet.id, x: bullet.x, y: bullet.y, vx: bullet.vx, vy: bullet.vy, angle: bullet.angle })
            }

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

    updateEntities() {
        // Update all the bullets
        for (var i = 0; i < this.bullets.length; i++) {
            var bullet = this.bullets[i];

            // bullet.pos[0] += bulletSpeed * dt * (- 1);
            bullet.x += bulletSpeed * 0.1 * (bullet.vx);
            bullet.y += bulletSpeed * 0.1 * (bullet.vy);

            // Remove the bullet if it goes offscreen
            if (bullet.x < 0 || bullet.x > 480 ||
                bullet.y < 0 || bullet.y > 580) {
                this.bullets.splice(i, 1);
                i--;
            }
        }
    }

    checkCollisions() {
        // this.checkPlayerBounds();

        // Run collision detection for all enemies and bullets
        for (let i = 0; i < this.entities.length; i++) {
            const entity = this.entities[i];
            var entitySize = [39, 39];

            for (var j = 0; j < this.bullets.length; j++) {
                let bullet = this.bullets[j];
                var bulletSize = [18, 8];
                
                // if (bullet.id !== entity.uid) {
                    if (this.boxCollides([entity.x, entity.y], entitySize, [bullet.x, bullet.y], bulletSize)) {
                        // Remove the enemy
                        this.entities.splice(i, 1)

                        this.network.io.emit('explosions', { entity, bulletKey: j });
                        // Remove the bullet and stop this iteration
                        this.bullets.splice(j, 1);
                        break;
                    }
                // }
            }

        }


        // if (boxCollides(pos, size, player.pos, player.sprite.size)) {
        //     gameOver();
        // }
    }

    // Collisions

    collides(x: number, y: number, r: number, b: number, x2: number, y2: number, r2: number, b2: number) {
        return !(r <= x2 || x > r2 ||
            b <= y2 || y > b2);
    }

    boxCollides(pos: number[], size: number[], pos2: number[], size2: number[]) {
        return this.collides(pos[0], pos[1],
            pos[0] + size[0], pos[1] + size[1],
            pos2[0], pos2[1],
            pos2[0] + size2[0], pos2[1] + size2[1]);
    }

    sendState() {
        this.network.io.sockets.emit('state', [...this.entities]);
    }

    getEntity(uid: string): Entity | undefined {
        return this.entities.find(entity => entity.uid == uid)
    }
}

new Server()

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