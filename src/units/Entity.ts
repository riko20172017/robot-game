import Sprite from "src/Sprite";

abstract class Entity {
    id: string;
    x: number
    y: number
    speed: number
    radian: number
    abstract sprite: Sprite

    constructor(id: string, x: number, y: number) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.speed = 200
        this.radian = 0
    }

    changeDirection(dir: string) { }

    render(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.radian)
        this.sprite.render(ctx)
        ctx.restore();
    }
}

export default Entity