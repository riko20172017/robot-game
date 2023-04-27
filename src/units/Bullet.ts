import Sprite from "../Sprite.js";
import Entity from "./Entity.js"

class Bullet extends Entity {
    way: number[]
    angle: number

    constructor(x: number, y: number, way: [], dir: number, angle: number) {
        super("", x, y)
        this.way = way
        this.dir = dir
        this.angle = angle
        this.sprite = new Sprite('img/sprites.png', [0, 39], [18, 8], 10, [0, 0], angle)
    }

}

export default Bullet