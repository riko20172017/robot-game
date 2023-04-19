import Sprite from "../sprite.js";
import Player from "./player.js";

export default class PlayerTest extends Player {
    constructor(id, x, y) {
        super(id, x, y)
        this.sprite = new Sprite('img/playerTest.png', [0, 0], [39, 39], 16, [0, 1])
    }
}