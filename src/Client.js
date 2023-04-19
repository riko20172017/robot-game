import Network from "./Network.js"

// Speed in pixels per second
var bulletSpeed = 500;
var enemySpeed = 100;

class Client {
    constructor() {
        this.playerId = ""
        this.players = []
        this.bullets = []
        this.enemies = []
        this.explosions = []
        this.inputBufer = []
        this.stateBufer = []
        this.lastFire = Date.now();
        this.tik = 0
        this.network = new Network()
        this.network.init(this)
    }

    update(dt) {
        this.processServerMessages();
        this.processInputs(dt, window.input);
        this.updateEntities(dt);
    }

    processServerMessages() {
        this.network.messages.forEach((message) => {
            message.forEach(state => {
                var player = getPlayerById(this.players, state.uid);
                player.pos[0] = state.x
                player.pos[1] = state.y

                if (state.uid == this.playerId) {
                    var serverTik = state.lastTik

                    var bufferIndex = this.inputBufer.findIndex(input => {
                        return input.tik == serverTik
                    })

                    if (!(bufferIndex == -1)) {

                        var limitVal = 30;
                        var xMin, xMax, yMin, yMax;
                        var [sbX, sbY] = this.stateBufer[bufferIndex].state;
                        xMin = sbX - limitVal
                        xMax = sbX + limitVal
                        yMin = sbY - limitVal
                        yMax = sbY + limitVal

                        this.inputBufer.splice(0, bufferIndex + 1)
                        this.stateBufer.splice(0, bufferIndex + 1)

                        if (
                            state.x < xMin ||
                            state.x > xMax ||
                            state.y < yMin ||
                            state.y > yMax
                        ) {
                            var testPlayer = this.getPlayer()
                            testPlayer.pos[0] = state.x
                            testPlayer.pos[1] = state.y
                            testPlayer.changeDirection(state.dir)

                            // inputBufer.forEach((input, i) => {
                            //     update(input.dt, input.input)
                            // })
                        };
                    }
                }
            });

        })

        this.network.messages = []
    }

    processInputs(dt, keys) {
        var input
        if (isDown('s', keys)) {
            input = { dir: 'DOWN' }
        }
        else if (isDown('w', keys)) {
            input = { dir: 'UP' }
        } else if (isDown('d', keys)) {
            input = { dir: 'RIGHT' }
        }
        else if (isDown('a', keys)) {
            input = { dir: 'LEFT' }
        }
        else {
            return
        }

        input.tik = this.tik
        input.delta = dt
        input.uid = this.playerId

        const player = this.getPlayer();
        player.move(input)

        this.network.socket.emit('movement', input);

        this.inputBufer.push(input)
        this.stateBufer.push({ tik: this.tik, state: this.getPlayer().pos });
    }

    updateEntities(dt) {
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
            if (bullet.pos[1] < 0 || bullet.pos[1] > canvas.height ||
                bullet.pos[0] > canvas.width) {
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

    getPlayer() {
        // return players.find(player => player.id == playerId);
        return this.players.find(player => player.id == "asdasd");
    }

}

function checkPlayerBounds() {
    // Check bounds
    if (player.pos[0] < 0) {
        player.pos[0] = 0;
    }
    else if (player.pos[0] > canvas.width - player.sprite.size[0]) {
        player.pos[0] = canvas.width - player.sprite.size[0];
    }

    if (player.pos[1] < 0) {
        player.pos[1] = 0;
    }
    else if (player.pos[1] > canvas.height - player.sprite.size[1]) {
        player.pos[1] = canvas.height - player.sprite.size[1];
    }
}

function getPlayerById(players, playerId) {
    return players.find(({ id }) => id == playerId);
}

function isDown(key, input) {
    return input[key.toUpperCase()];
}

export default Client