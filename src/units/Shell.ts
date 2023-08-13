import Sprite from "../Sprite.js";
import Entity from "./Entity.js"

class Shell extends Entity {
    way: number[]
    playerId: string
    sprite: Sprite
    shellType: string

    constructor(shellType: string, id: string, playerId: string, x: number, y: number, way: number[], dir: number) {
        super(id, x, y)
        this.shellType = shellType
        this.playerId = playerId
        this.way = way
        this.dir = dir

        switch (shellType) {
            case "Rocket":
                this.sprite = new Sprite('img/sprites.png', [0, 39], [18, 6], 10, [0, 0])
                break;
            case "Laser":
                this.sprite = new Sprite('img/sprites.png', [0, 39], [18, 6], 10, [0, 0])
                break;
            default:
                this.sprite = new Sprite('img/sprites.png', [0, 39], [18, 6], 10, [0, 0])
                break;
        }
    }


}

export default Shell