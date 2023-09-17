import Sprite from "src/Sprite";

abstract class Entity {
    id: string;
    x: number
    y: number
    radian: number

    constructor(id: string, x: number, y: number) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.radian = 0
    }
}

export default Entity