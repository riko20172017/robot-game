import Network from "./Network.js"
import Bullet from "./units/Bullet.js";
import Entity from "./units/Entity.js";
import Settings from "./Settings.js";
import { Player } from "./units/Player.js";
import { Input, Keys } from "./Input.js";

// player id = asdasd

// Speed in pixels per second
var bulletSpeed = 500;
var enemySpeed = 100;

class Client {

    playerId: string
    players: Array<Player>
    bullets: Array<Bullet>
    enemies: Array<Entity>
    explosions: Array<Entity>
    pending_inputs: IInput[]
    stateBufer: Array<any>
    lastFire: number
    tik: number
    network: Network
    input: Input
    server_reconciliation: boolean
    entity_interpolation: boolean

    constructor() {
        this.playerId = ""
        this.players = []
        this.bullets = []
        this.enemies = []
        this.explosions = []
        this.pending_inputs = []
        this.stateBufer = []
        this.lastFire = Date.now();
        this.server_reconciliation = true
        this.entity_interpolation = false
        this.tik = 0
        this.network = new Network()
        this.input = new Input()

        this.network.init(this)
    }

    update(dt: number) {
        this.processServerMessages();
        this.processInputs(dt, this.input.getKeys());
        this.updateEntities(dt);
    }

    havePlayer(id: string) {
        return this.players.some((player) => player.id == id)
    }

    processServerMessages() {

        while /*➿*/(true) {
            let message = this.network.receive()
            if (!message) break; /*⛔*/

            // World state is a list of entity states.
            for (var i = 0; i < message.length; i++) {
                var state = message[i];

                // If this is the first time we see this entity, create a local representation.
                if (!this.havePlayer(state.uid)) {
                    let player = new Player(state.uid, state.x, state.y);
                    this.players.push(player);
                }

                let player = this.getPlayer(state.uid)
                if (!player) {
                    console.log("there is no entity state");
                    continue
                }

                // Received the authoritative position of this client's entity.
                if (state.uid == this.playerId) {
                    player.pos[0] = state.x
                    player.pos[1] = state.y

                    var testPlayer = this.getPlayer("asdasd")
                    if (testPlayer) {
                        testPlayer.pos[0] = state.x
                        testPlayer.pos[1] = state.y
                        testPlayer.changeDirection(state.dir)
                    }

                    if (this.server_reconciliation) {
                        var j = 0;
                        while (j < this.pending_inputs.length) {
                            let input = this.pending_inputs[j];
                            if (input.tik <= state.lastTik) {
                                // Already processed. Its effect is already taken into account into the world update
                                // we just got, so we can drop it.
                                this.pending_inputs.splice(j, 1);
                            }
                            else {
                                // Not processed by the server yet. Re-apply it.
                                player.move(input.dir, input.delta)
                                j++;
                            }
                        }
                    }
                    else {
                        // Reconciliation is disabled, so drop all the saved inputs.
                        this.pending_inputs = [];
                    }
                }
                else {
                    // Received the position of an entity other than this client's.
                    if (!this.entity_interpolation) {
                        // Entity interpolation is disabled - just accept the server's position.
                        player.pos[0] = state.x
                        player.pos[1] = state.y
                    } else {
                        // Add it to the position buffer.
                        var timestamp = +new Date();
                        // entity.position_buffer.push([timestamp, state.position]);
                    }
                }

            }

        }
        // this.network.messages.forEach((message: Array<State>) => {
        //     message.forEach(state => {
        //         var player = getPlayerById(this.players, state.uid);
        //         if (!player) {
        //             console.log("Player ${state.uid} is not exist");
        //             return
        //         }
        //         player.pos[0] = state.x
        //         player.pos[1] = state.y

        //         if (state.uid == this.playerId) {
        //             var serverTik = state.lastTik

        //             var bufferIndex = this.pending_inputs.findIndex(input => {
        //                 return input.tik == serverTik
        //             })

        //             if (!(bufferIndex == -1)) {

        //                 var limitVal = 30;
        //                 var xMin, xMax, yMin, yMax;
        //                 var [sbX, sbY] = this.stateBufer[bufferIndex].state;
        //                 xMin = sbX - limitVal
        //                 xMax = sbX + limitVal
        //                 yMin = sbY - limitVal
        //                 yMax = sbY + limitVal

        //                 this.pending_inputs.splice(0, bufferIndex + 1)
        //                 this.stateBufer.splice(0, bufferIndex + 1)

        //                 if (
        //                     state.x < xMin ||
        //                     state.x > xMax ||
        //                     state.y < yMin ||
        //                     state.y > yMax
        //                 ) {
        //                     var testPlayer = this.getPlayer("asdasd")
        //                     if (testPlayer) {
        //                         testPlayer.pos[0] = state.x
        //                         testPlayer.pos[1] = state.y
        //                         testPlayer.changeDirection(state.dir)
        //                     }

        //                     // inputBufer.forEach((input, i) => {
        //                     //     update(input.dt, input.input)
        //                     // })
        //                 };
        //             }
        //         }
        //     });
        // })

        this.network.messages = []
    }

    processInputs(delta: number, keys: Keys) {

        let dir = "";

        if (keys.DOWN) {
            dir = 'DOWN'
        } else if (keys.UP) {
            dir = 'UP'
        } else if (keys.RIGHT) {
            dir = 'RIGHT'
        } else if (keys.LEFT) {
            dir = 'LEFT'
        } else {
            return
        }

        let input: IInput = {
            tik: this.tik,
            uid: this.playerId,
            delta,
            dir
        }

        const player = this.getPlayer("asdasd");

        if (!player) {
            console.log("local player is not exist")
            return
        }

        player.move(dir, delta)

        this.network.socket.emit('movement', input);

        this.pending_inputs.push(input)
        this.stateBufer.push({ tik: this.tik, state: player.pos });
    }

    updateEntities(dt: number) {
        // Update the player sprite animation
        for (const key in this.players) {
            if (Object.hasOwnProperty.call(this.players, key)) {
                const player = this.players[key];
                player.sprite.update(dt);

            }
        }

        // Update all the bullets
        for (var i = 0; i < this.bullets.length; i++) {
            var bullet = this.bullets[i];

            // bullet.pos[0] += bulletSpeed * dt * (- 1);
            bullet.pos[0] += bulletSpeed * dt * (bullet.way[0]);
            bullet.pos[1] += bulletSpeed * dt * (bullet.way[1]);



            // Remove the bullet if it goes offscreen
            if (bullet.pos[1] < 0 || bullet.pos[1] > Settings.height ||
                bullet.pos[0] > Settings.width) {
                this.bullets.splice(i, 1);
                i--;
            }
        }

        // Update all the enemies
        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].pos[0] -= enemySpeed * dt;
            this.enemies[i].sprite.update(dt);

            // Remove if offscreen
            if (this.enemies[i].pos[0] + this.enemies[i].sprite.size[0] < 0) {
                this.enemies.splice(i, 1);
                i--;
            }
        }

        // Update all the explosions
        for (var i = 0; i < this.explosions.length; i++) {
            this.explosions[i].sprite.update(dt);

            // Remove if animation is done
            if (this.explosions[i].sprite.done) {
                this.explosions.splice(i, 1);
                i--;
            }
        }
    }

    getPlayer(id: string): Player | undefined {
        // return players.find(player => player.id == playerId);
        return this.players.find(player => player.id == id);
    }

}

// function checkPlayerBounds() {
//     // Check bounds
//     if (player.pos[0] < 0) {
//         player.pos[0] = 0;
//     }
//     else if (player.pos[0] > canvas.width - player.sprite.size[0]) {
//         player.pos[0] = canvas.width - player.sprite.size[0];
//     }

//     if (player.pos[1] < 0) {
//         player.pos[1] = 0;
//     }
//     else if (player.pos[1] > canvas.height - player.sprite.size[1]) {
//         player.pos[1] = canvas.height - player.sprite.size[1];
//     }
// }

function getPlayerById(players: Player[], playerId: string) {
    return players.find(({ id }) => id == playerId);
}

export default Client