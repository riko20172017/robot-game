import Player from "./units/player.js";
import Sprite from "./sprite.js";

// Create the canvas
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// The main game loop
var lastTime;

resources.load([
    'img/sprites.png',
    'img/terrain.png',
    'img/player.png',
]);
resources.onReady(init);

// Game state
var players = {};
var bullets = [];
var enemies = [];
var explosions = [];

var lastFire = Date.now();
var gameTime = 0;
var isGameOver;
var terrainPattern;

var score = 0;
var scoreEl = document.getElementById('score');

// Speed in pixels per second
var playerSpeed = 200;
var bulletSpeed = 500;
var enemySpeed = 100;

var socket = io();

socket.emit('new player');

socket.on('new player', function (data) {
    players = {};
    for (const id in data) {
        if (Object.hasOwnProperty.call(data, id)) {
            const player = data[id];
            players[id] = new Player(player.id, player.x, player.y);
        }
    }
});

socket.on('state', function (data) {

    if (data?.id) {
        players[data.id].pos[0] = data.x;
        players[data.id].pos[1] = data.y
        players[data.id].changeDirection(data.dir)
    }

    if (data?.bullet) {
        bullets.push({
            ...data.bullet,
            sprite: new Sprite('img/sprites.png', [0, 39], [18, 8], [0, 0], 10, data.bullet.dir)
        })
    }

})


function main() {

    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;

    update(dt);
    render();

    if (
        window.inputManual().A ||
        window.inputManual().D ||
        window.inputManual().S ||
        window.inputManual().W ||
        window.inputManual().SPACE
    ) {
        socket.emit('movement', window.window.inputManual());
    }
    // socket.emit('movement', { A: false, W: false, D: true, S: false, space: false });

    lastTime = now;
    // socket.emit('movement', window.input());



    requestAnimationFrame(main);

};

function init() {
    terrainPattern = ctx.createPattern(resources.get('img/terrain.png'), 'repeat');

    document.getElementById('play-again').addEventListener('click', function () {
        reset();
    });

    reset();
    lastTime = Date.now();
    main();
}

// Update game objects
function update(dt) {
    gameTime += dt;

    handleInput(dt);
    updateEntities(dt);

    // It gets harder over time by adding enemies using this
    // equation: 1-.993^gameTime
    // if (Math.random() < 1 - Math.pow(.993, gameTime)) {
    //     enemies.push({
    //         pos: [canvas.width,
    //         Math.random() * (canvas.height - 39)],
    //         sprite: new Sprite('img/sprites.png', [0, 78], [80, 39],
    //             6, [0, 1, 2, 3, 2, 1])
    //     });
    // }

    // checkCollisions();

    scoreEl.innerHTML = score;
};

function handleInput(dt) {
    const player = players[socket.id]
    let delta = playerSpeed * dt;

    // if (input.isDown('SPACE') &&
    //     !isGameOver &&
    //     Date.now() - lastFire > 100) {
    //     var x = player.pos[0] + player.sprite.size[0] / 2;
    //     var y = player.pos[1] + player.sprite.size[1] / 2;

    //     var mx = window.getMouse().x;
    //     var my = window.getMouse().y;
    //     var vx = mx - x;
    //     var vy = my - y;

    //     var dist = Math.sqrt(vx * vx + vy * vy);
    //     var dx = vx / dist;
    //     var dy = vy / dist;

    //     var angle = Math.atan2(vx, vy);

    //     bullets.push({
    //         pos: [x, y],
    //         way: [dx, dy],
    //         dir: -angle + 1.5,
    //         sprite: new Sprite('img/sprites.png', [0, 39], [18, 8], [0, 0], 10, angle)
    //     });

    //     lastFire = Date.now();
    // }

    if (input.isDown('w') && input.isDown('d')) {
        player.move('UP-RIGHT', delta)
        return
    }

    if (input.isDown('w') && input.isDown('a')) {
        player.move('UP-LEFT', delta)
        return
    }

    if (input.isDown('s') && input.isDown('d')) {
        player.move('DOWN-RIGHT', delta)
        return
    }

    if (input.isDown('s') && input.isDown('a')) {
        player.move('DOWN-LEFT', delta)
        return
    }

    if (input.isDown('s')) {
        player.move('DOWN', delta)
        return
    }

    if (input.isDown('d')) {
        player.move('RIGHT', delta)
        return
    }

    if (input.isDown('w')) {
        player.move('UP', delta)
        return
    }

    if (input.isDown('a')) {
        player.move('LEFT', delta)
        return
    }

    if (input.isDown('d')) {
        player.move('RIGHT', delta)
    }
}

function updateEntities(dt) {
    // Update the player sprite animation
    for (const key in players) {
        if (Object.hasOwnProperty.call(players, key)) {
            const player = players[key];
            player.sprite.update(dt);

        }
    }

    // Update all the bullets
    for (var i = 0; i < bullets.length; i++) {
        var bullet = bullets[i];

        // bullet.pos[0] += bulletSpeed * dt * (- 1);
        bullet.pos[0] += bulletSpeed * dt * (bullet.way[0]);
        bullet.pos[1] += bulletSpeed * dt * (bullet.way[1]);



        // Remove the bullet if it goes offscreen
        if (bullet.pos[1] < 0 || bullet.pos[1] > canvas.height ||
            bullet.pos[0] > canvas.width) {
            bullets.splice(i, 1);
            i--;
        }
    }

    // Update all the enemies
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].pos[0] -= enemySpeed * dt;
        enemies[i].sprite.update(dt);

        // Remove if offscreen
        if (enemies[i].pos[0] + enemies[i].sprite.size[0] < 0) {
            enemies.splice(i, 1);
            i--;
        }
    }

    // Update all the explosions
    for (var i = 0; i < explosions.length; i++) {
        explosions[i].sprite.update(dt);

        // Remove if animation is done
        if (explosions[i].sprite.done) {
            explosions.splice(i, 1);
            i--;
        }
    }
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

function checkCollisions() {
    checkPlayerBounds();

    // Run collision detection for all enemies and bullets
    for (var i = 0; i < enemies.length; i++) {
        var pos = enemies[i].pos;
        var size = enemies[i].sprite.size;

        for (var j = 0; j < bullets.length; j++) {
            var pos2 = bullets[j].pos;
            var size2 = bullets[j].sprite.size;

            if (boxCollides(pos, size, pos2, size2)) {
                // Remove the enemy
                enemies.splice(i, 1);
                i--;

                // Add score
                score += 100;

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

        if (boxCollides(pos, size, player.pos, player.sprite.size)) {
            gameOver();
        }
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

// Draw everything
function render() {
    ctx.fillStyle = terrainPattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render the player if the game isn't over
    if (!isGameOver) {
        for (const id in players) {
            if (Object.hasOwnProperty.call(players, id)) {
                renderEntity(players[id]);
            }
        }
    }

    renderEntities(bullets);
    renderEntities(enemies);
    renderEntities(explosions);
};

function renderEntities(list) {
    for (var i = 0; i < list.length; i++) {
        renderEntity(list[i]);
    }
}

function renderEntity(entity) {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    ctx.rotate(entity.dir)
    entity.sprite.render(ctx);
    ctx.restore();
}

// Game over
function gameOver() {
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('game-over-overlay').style.display = 'block';
    isGameOver = true;
}

// Reset game to original state
function reset() {
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'none';
    isGameOver = false;
    gameTime = 0;
    score = 0;

    enemies = [];
    bullets = [];

    // player.pos = [50, canvas.height / 2];
};
