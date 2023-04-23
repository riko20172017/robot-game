import Sprite from "../Sprite.js";
import Entity from "./Entity.js"

class Bullet extends Entity {
    way: number[];

    constructor(id: string, x: number, y: number) {
        super(id, x, y)
        this.way = []
        this.sprite = new Sprite('img/sprites.png', [0, 0], [39, 39], 16, [0, 1])
    }

}

export default Bullet