// Зависимости
import { performance } from 'perf_hooks'
import Network from "./Network.js";
import { Entity, Client, IExplosion } from './Interfaces.js';
import { Shell } from 'src/Interfaces.js';
import Config from '../src/Config.js';

// Game state

var playerSpeed = 200;

class Server {
    clients: Array<Client>
    entities: Array<Entity>
    updateRate: number;
    network: Network;
    update_interval: NodeJS.Timer | undefined
    shells: Shell[]
    explosions: IExplosion[]
    lastime: number
    previousTick: number
    actualTicks: number

    constructor() {
        this.clients = [];
        this.entities = [];
        this.updateRate = 1000 / 30
        this.network = new Network()
        this.network.init(this)
        this.shells = []
        this.explosions = []
        this.lastime = 0
        this.previousTick = Date.now()
        this.actualTicks = 0
        // Default update rate.
        this.setUpdateRate();
    }

    setUpdateRate() {
        var now = Date.now()
        this.actualTicks++
        if (this.previousTick + this.updateRate <= now) {
            var delta = (now - this.previousTick) / 1000
            this.previousTick = now

            this.update(delta)

            // console.log('delta', delta, '(target: ' + this.updateRate +' ms)', 'node ticks', this.actualTicks)
            this.actualTicks = 0
        }

        if (Date.now() - this.previousTick < this.updateRate - 16) {
            setTimeout((function (self) { return function () { self.setUpdateRate() } })(this))
        } else {
            setImmediate((function (self) { return function () { self.setUpdateRate() } })(this))
        }


        // clearInterval(this.update_interval);
        // this.update_interval = setInterval(
        //     (function (self) { return function () { self.update(); }; })(this),
        //     1000 / this.update_rate);
    }

    update(delta: number) {
        this.handleInput()
        this.updateEntities(delta)
        this.checkCollisions();
        this.sendState();

        // var now = performance.now();

        // var currentFps = Math.round(1000 / (now - this.lastime));

        // this.lastime = performance.now();
        // console.log(currentFps);

    }


    handleInput() {
        // [ dir, playerId, tik, dt ]
        this.network.messages.forEach(message => {
            let { keys, uid, tik, delta, shell } = message;

            var entity = this.getEntity(uid)

            if (entity == undefined) {
                console.log("entity is undefined");
                return
            }

            let dt = playerSpeed * delta;

            if (shell) {
                this.shells.push({ id: shell.id, playerId: shell.playerId, x: shell.x, y: shell.y, dx: shell.dx, dy: shell.dy, radian: shell.radian, type: shell.type })
            }

            entity.lastTik = tik

            if (keys.DOWN) {
                entity.y += dt;
            }
            if (keys.UP) {
                entity.y -= dt;
            }
            if (keys.LEFT) {
                entity.x -= dt;
            }
            if (keys.RIGHT) {
                entity.x += dt;
            }
        });

        this.network.messages = []

    }

    updateEntities(delta: number) {
        // Update all the bullets
        for (var i = 0; i < this.shells.length; i++) {
            var bullet = this.shells[i];

            bullet.x += Config.rocketSpeed * delta * (bullet.dx);
            bullet.y += Config.rocketSpeed * delta * (bullet.dy);

            // Remove the bullet if it goes offscreen
            if (bullet.x < 0 || bullet.x > 512 ||
                bullet.y < 0 || bullet.y > 480) {
                this.shells.splice(i, 1);
                i--;
            }
        }
    }

    checkCollisions() {
        // this.checkPlayerBounds();

        // Run collision detection for all enemies and bullets
        for (let i = 0; i < this.entities.length; i++) {
            const player = this.entities[i];
            var playerSize = Config.size.player;

            for (var j = 0; j < this.shells.length; j++) {
                let shell = this.shells[j];
                let shellSize;

                switch (shell.type) {
                    case "Rocket":
                        shellSize = Config.size.rocket.server
                        break;

                    default:
                        shellSize = [0, 0]
                        break;
                }

                if (shell.playerId !== player.uid) {
                    if (this.boxCollides(
                        [
                            player.x - playerSize[0] / 2,
                            player.y - playerSize[1] / 2
                        ],
                        playerSize,
                        [
                            shell.x - shellSize[0] / 2,
                            shell.y - shellSize[1] / 2
                        ],
                        shellSize)
                    ) {
                        // Remove the enemy
                        this.entities.splice(i, 1)
                        // Add explosion-
                        this.explosions.push({ x: player.x, y: player.y, bulletId: shell.id })
                        // Remove the bullet and stop this iteration
                        this.shells.splice(j, 1);
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
        this.network.io.sockets.emit('state', { states: this.entities, bullets: this.shells, explosions: this.explosions })
        this.explosions = []
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