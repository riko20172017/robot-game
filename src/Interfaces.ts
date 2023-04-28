interface State {
    uid: string
    x: number
    y: number
    lastTik: number
    dir: string
}

interface Message {

}

interface IExplosion {
    playerId: string,
    entity: State
}

interface Bullet {
    id: string, x: number, y: number, vx: number, vy: number, angle: number
}

interface IInput {
    tik: number
    delta: number
    uid: string
    dir: string,
    fire: boolean
    bullet?: Bullet
}

interface IBullet {
    way: Array<number>
}

interface Key {

}

interface Offer {
    uid: string
}

interface ServerToClientEvents {
    noArg: () => void;
    OFFER: (data: Offer) => void;
    state: (data: Array<State>) => void;
    explosions: (data: IExplosion) => void;
}

interface ClientToServerEvents {
    DISCOVER: () => void
    movement: (data: IInput) => void;
}