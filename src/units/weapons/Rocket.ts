import Sprite from "../../Sprite.js";
import Shell from "./Shell.js";

class Rocket extends Shell {

    constructor(
        id: string,
        playerId: string,
        x: number,
        y: number,
        tx: number,
        ty: number,
    ) {
        super(
            id, 
            "rocket", 
            playerId, 
            x, y, 
            tx, ty,
            new Sprite('img/sprites.png', [0, 39], [18, 6], 10, [0, 0]))
    }


}

export default Rocket