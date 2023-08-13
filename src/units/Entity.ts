import Sprite from "src/Sprite";

abstract class Entity {
    id: string;
    pos: Array<number>;
    speed: number
    dir: number
    abstract sprite: Sprite

    constructor(id: string, x: number, y: number) {
        this.id = id;
        this.pos = [x, y];
        this.speed = 200
        this.dir = 0
    }

    changeDirection(dir: string) { }
    
    render (ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.pos[0], this.pos[1]);
        ctx.rotate(this.dir)
        this.sprite.render(ctx)
        ctx.restore();
     }
}

export default Entity