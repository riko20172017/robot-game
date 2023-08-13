import Sprite from "../../Sprite.js";
import Entity from "../Entity.js"

class Shell extends Entity {
    type: string
    playerId: string
    tx: number
    ty: number
    dx: number
    dy: number
    moves: number
    radian: number
    sprite: Sprite

    constructor(
        id: string,
        type: string,
        playerId: string,
        x: number,
        y: number,
        tx: number,
        ty: number,
        sprite: Sprite
    ) {
        super(id, x, y)
        this.type = type
        this.playerId = playerId
        this.tx = tx
        this.ty = ty
        this.dx = 0
        this.dy = 0
        this.moves = 0
        this.radian = 0
        this.sprite = sprite
        
        this.init()
    }
    init() {
        var diffx = this.tx - this.x;
        var diffy = this.ty - this.y;
        let distance = Math.sqrt(diffx * diffx + diffy * diffy);
        this.moves = distance / 0.9
        this.dx = diffx / this.moves;
        this.dy = diffy / this.moves;
        this.radian = Math.atan2(diffy, diffx);


    }
}

export default Shell