import Sprite from "../Sprite.js";
import Entity from "./Entity.js"

class Bullet extends Entity {
    way: number[]

    constructor(x: number, y: number, way: number[], dir: number) {
        super("", x, y)
        this.way = way
        this.dir = dir
        this.sprite = new Sprite('img/sprites.png', [0, 39], [18, 8], 10, [0, 0])
    }

}

export default Bullet