import Sprite from "../Sprite.js"

class Entity {
    id: string;
    pos: Array<number>;
    sprite: Sprite
    speed: number
    dir: number

    constructor(id: string, x: number, y: number) {
        this.id = id;
        this.pos = [x, y];
        this.sprite = new Sprite('img/player.png', [0, 0], [39, 39], 16, [0, 1])
        this.speed = 200
        this.dir = 0
    }

    changeDirection(dir: string) { }
    move(input: Input) { }
}

export default Entity