import Client from "./Client.js";
import Inputs from "./Inputs.js";
import Resources from "./resources.js";

var isGameOver;
var gameTime = 0;

class App {

    ctx;

    constructor() {
        this.then = performance.now()
        this.startTime = this.then;
        this.lastTime = Date.now();
        this.tik = 0
        this.resources = new Resources(this);

        this.resources.load([
            'img/sprites.png',
            'img/terrain.png',
            'img/player.png',
            'img/playerTest.png',
        ]);

        this.resources.onReady(() => this.init());
    }

    init() {
        let canvas = document.getElementById('canvas');
        canvas.width = 512;
        canvas.height = 480;
        document.body.appendChild(canvas);

        this.ctx = canvas.getContext("2d");

        new Inputs()

        this.terrainPattern = this.ctx.createPattern(this.resources.get('img/terrain.png'), 'repeat');

        document.getElementById('play-again').addEventListener('click', function () {
            reset();
        });

        this.reset();

        this.client = new Client(this.ctx, this.resources)
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

new App()
