import Sprite from "../Sprite.js";
import Entity from "./Entity.js"

class Player extends Entity {
    constructor(id: string, x: number, y: number) {
        super(id, x, y)
        this.id = id;
        this.pos = [x, y];
        this.sprite = new Sprite('img/player.png', [0, 0], [39, 39], 16, [0, 1])
        this.speed = 200
    }

    move(dir: string, delta: number) {
        delta = delta * this.speed;
        switch (dir) {
            case 'DOWN':
                this.pos[1] += delta;
                break;
            case 'UP':
                this.pos[1] -= delta;
                break;
            case 'LEFT':
                this.pos[0] -= delta;
                break;
            case 'RIGHT':
                this.pos[0] += delta;
                break;
            case 'UP-RIGHT':
                this.pos[1] -= delta;
                this.pos[0] += delta;
                break;
            case 'UP-LEFT':
                this.pos[1] -= delta;
                this.pos[0] -= delta;
                break;
            case 'DOWN-LEFT':
                this.pos[1] += delta;
                this.pos[0] -= delta;
                break;
            case 'DOWN-RIGHT':
                this.pos[1] += delta;
                this.pos[0] += delta;
                break;
        }

        this.changeDirection(dir);
    }

    changeDirection(dir: string) {
        this.sprite.dir = dir
    }
}

class PlayerTest extends Player {
    constructor(id: string, x: number, y: number) {
        super(id, x, y)
        this.sprite = new Sprite('img/playerTest.png', [0, 0], [39, 39], 16, [0, 1])
    }
}

export { Player, PlayerTest }