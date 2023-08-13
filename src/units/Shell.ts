import Sprite from "../Sprite.js";
import Entity from "./Entity.js"

class Shell extends Entity {
    playerId: string
    sprite: Sprite
    shellType: string
    dx: number
    dy: number
    radian: number

    constructor(
        shellType: string,
        id: string,
        playerId: string,
        x: number,
        y: number,
        dx: number,
        dy: number,
        radian: number,
        sprite: Sprite
    ) {
        super(id, x, y)
        this.shellType = shellType
        this.playerId = playerId
        this.dx = dx
        this.dy = dy
        this.radian = radian
        this.sprite = sprite
    }


}

export default Shell