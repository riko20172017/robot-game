import Sprite from "../sprite.js";
import Entity from "./Entity.js"

class Bullet extends Entity implements IBullet {
    way: number[];

    constructor() {
        super()
        this.way = []
    }

}

export default Bullet