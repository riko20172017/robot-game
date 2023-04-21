import Sprite from "../Sprite.js";
import Entity from "./Entity.js"

class Bullet extends Entity {
    way: number[];

    constructor(id: string, x: number, y: number) {
        super(id, x, y)
        this.way = []
    }

}

export default Bullet