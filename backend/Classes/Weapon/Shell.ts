import Config from "../../../src/Config.js"
import Entity from "../Entity.js"

class Shell extends Entity {
    type: string
    playerId: string
    sx: number
    sy: number
    tx: number
    ty: number
    dx: number
    dy: number
    moves: number
    radian: number
    distance: number

    constructor(
        id: string,
        type: string,
        playerId: string,
        x: number,
        y: number,
        tx: number,
        ty: number,
    ) {
        super(id, x, y)
        this.type = type
        this.playerId = playerId
        this.sx = x
        this.sy = y
        this.tx = tx
        this.ty = ty
        this.dx = 0
        this.dy = 0
        this.moves = 0
        this.distance = 0
        this.radian = 0

        this.init()

    }

    init() {
        var diffx = this.tx - this.x;
        var diffy = this.ty - this.y;
        this.distance = Math.sqrt(diffx * diffx + diffy * diffy);
        this.moves = this.distance / 0.9
        this.dx = diffx / this.moves;
        this.dy = diffy / this.moves;
        this.radian = Math.atan2(diffy, diffx);
    }

    update(dt: number) {
        this.x += Config.rocketSpeed * dt * this.dx;
        this.y += Config.rocketSpeed * dt * this.dy;
    }

    isMoveEnd() {
        var diffx = this.x - this.sx;
        var diffy = this.y - this.sy;
        let distance = Math.sqrt(Math.pow(diffx, 2) + Math.pow(diffy, 2));
        if (distance > this.distance) {
            return true
        }
    }

    isOutOfScreen() {
        return this.x < 0 || this.y < 0 || this.y > Config.height ||
            this.x > Config.width
    }
}

export default Shell