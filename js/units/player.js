import Sprite from "../sprite.js";

export default class Player {
    constructor(x, y) {
        this.pos = [x, y];
        this.sprite = new Sprite('img/sprites.png', [0, 0], [39, 39], 16, [0, 1])
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
        }

        this.sprite.changeDirection = dir
    }
}