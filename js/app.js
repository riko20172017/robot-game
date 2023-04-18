import Client from "./Client.js";

var lastTime;
var isGameOver;
var gameTime = 0;

class App {

    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = 512;
        this.canvas.height = 480;
        this.then = performance.now()
        this.startTime = this.then;

        this.tik = 0

        document.body.appendChild(canvas);

        resources.load([
            'img/sprites.png',
            'img/terrain.png',
            'img/player.png',
            'img/playerTest.png',
        ]);

        let self = this
        resources.onReady(() => self.init());
    }

    init() {
        this.terrainPattern = this.ctx.createPattern(resources.get('img/terrain.png'), 'repeat');
        document.getElementById('play-again').addEventListener('click', function () {
            reset();
        });

        this.reset();
        this.lastTime = Date.now();

        this.client = new Client(this.ctx)
        this.main(30)
    }

    main(hz) {
        let self = this

        this.now = performance.now();
        this.elapsed = this.now - this.then;
        if (this.elapsed > 1000 / hz) {

            this.then = this.now - (this.elapsed % (1000 / hz));
            var sinceStart = this.now - this.startTime;
            this.now1 = performance.now();
            let dt = Math.abs((this.now1 - this.lastTime) / 1000);

            this.client.update(dt);
            this.render();

            if (!(this.tik % 5)) {
                this.currentFps = Math.round(1000 / (this.now1 - this.lastTime));
                this.gameTime = Math.round((sinceStart / 1000) * 100) / 100
            }

            this.lastTime = this.now1;
            this.tik++;
        }

        this.update_interval = requestAnimationFrame(function () { self.main(30) });


        // cancelAnimationFrame(this.update_interval);
    }

    reset() {
        document.getElementById('game-over').style.display = 'none';
        document.getElementById('game-over-overlay').style.display = 'none';
        isGameOver = false;
        gameTime = 0;

        // enemies = [];
        // bullets = [];

        // player.pos = [50, canvas.height / 2];
    }

    gameOver() {
        document.getElementById('game-over').style.display = 'block';
        document.getElementById('game-over-overlay').style.display = 'block';
        isGameOver = true;
    }

    render() {
        this.ctx.fillStyle = this.terrainPattern;
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Render the player if the game isn't over
        if (!this.isGameOver) {
            this.client.players.forEach(player => this.renderEntity(player))
        }

        // this.renderEntities(this.client.bullets);
        // this.renderEntities(this.client.enemies);
        // this.renderEntities(this.client.explosions);

        this.renderGUI()
    }

    renderEntities(list) {
        for (var i = 0; i < list.length; i++) {
            renderEntity(list[i]);
        }
    }

    renderEntity(entity) {
        this.ctx.save();
        this.ctx.translate(entity.pos[0], entity.pos[1]);
        this.ctx.rotate(entity.dir)
        entity.sprite.render(this.ctx);
        this.ctx.restore();
    }

    renderGUI() {
        this.ctx.fillStyle = "white"
        this.ctx.font = "18px arial";
        this.ctx.fillText("time: " + this.gameTime, 350, 20);
        this.ctx.fillText("fps:   " + this.currentFps, 350, 40);
    }

}

window.input = {};
var mouse = { x: 0, y: 0 };

function setKey(event, status) {
    var code = event.keyCode;
    var key;

    switch (code) {
        case 32:
            key = 'SPACE'; break;
        case 37:
            key = 'LEFT'; break;
        case 38:
            key = 'UP'; break;
        case 39:
            key = 'RIGHT'; break;
        case 40:
            key = 'DOWN'; break;
        default:
            // Convert ASCII codes to letters
            key = String.fromCharCode(code);
    }

    window.input[key] = status;

}


document.addEventListener('keydown', function (e) {
    setKey(e, true);
});

document.addEventListener('keyup', function (e) {
    setKey(e, false);
});

window.addEventListener('blur', function () {
    window.input = {};
});

window.inputManual = function (key) {
    return { ...window.input, mouse: { ...window.getMouse() } };
}

canvas.addEventListener('mousemove', event => {
    mouse.x = event.offsetX;
    mouse.y = event.offsetY;
});

window.getMouse = function () {
    return { x: mouse.x, y: mouse.y };
}

new App()
