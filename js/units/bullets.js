import Sprite from "../sprite.js";

export default class Player {
    constructor(x, y) {
        this.pos = [x, y];
        this.sprite = new Sprite('img/sprite.png', [0, 0], [39, 39], 16, [0, 1])
    }

    move(dir, delta) {
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

    changeDirection(dir) {
        this.sprite.dir = dir
    }
}