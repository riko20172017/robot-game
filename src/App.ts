import Client from "./Client.js";
import Inputs from "./Inputs.js";
import Resources from "./resources.js";
import Entity from "./units/Entity.js";
import Player from "./units/Player.js"

var isGameOver;
var gameTime = 0;

class App {

    ctx: CanvasRenderingContext2D
    canvas: HTMLCanvasElement
    then: number
    startTime: number
    lastTime: number
    tik: number
    resources: Resources;
    terrainPattern: CanvasPattern | null
    client: Client
    inputs: Inputs
    now: number = 0
    elapsed: number = 0
    now1: number = 0
    currentFps: number = 0
    gameTime: number = 0
    update_interval: number
    isGameOver: boolean
    
    constructor() {
        this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        this.ctx = <CanvasRenderingContext2D>this.canvas.getContext("2d");
        this.then = performance.now()
        this.startTime = this.then;
        this.lastTime = performance.now();
        this.tik = 0
        this.resources = new Resources(this);
        this.terrainPattern = this.ctx.createPattern(this.resources.get('img/terrain.png'), 'repeat')
        this.client = new Client(this.ctx, this.resources)
        this.inputs = new Inputs()
        this.update_interval = 0
        this.isGameOver = false

        this.resources.load([
            'img/sprites.png',
            'img/terrain.png',
            'img/player.png',
            'img/playerTest.png',
        ]);

        this.resources.onReady(() => this.init());
    }

    init() {
        this.canvas.width = 512;
        this.canvas.height = 480;
        document.body.appendChild(this.canvas);

        this.main(30)
    }

    main(hz: number) {
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

    render() {
        if (this.terrainPattern) this.ctx.fillStyle = this.terrainPattern;

        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Render the player if the game isn't over
        if (!this.isGameOver) {
            this.client.players.forEach((player: Player) => this.renderEntity(player))
        }

        // this.renderEntities(this.client.bullets);
        // this.renderEntities(this.client.enemies);
        // this.renderEntities(this.client.explosions);

        this.renderGUI()
    }

    renderEntities(list: Array<Entity>) {
        for (var i = 0; i < list.length; i++) {
            this.renderEntity(list[i]);
        }
    }

    renderEntity(entity: Entity) {
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
