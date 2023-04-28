import { IExplosion } from "backend/Interfaces"

interface State {
    uid: string
    x: number
    y: number
    lastTik: number
    dir: string
}

interface IMessage {
    states: State[]
    bullets: IBullet[]
    explosions: IExplosion[]
}

// interface IExplosion {
//     playerId: string,
//     entity: State
// }

interface IBullet {
    id: string
    playerId: string
    x: number
    y: number
    vx: number
    vy: number,
    angle: number
}

interface IInput {
    tik: number
    delta: number
    uid: string
    dir: string,
    fire: boolean
    bullet?: IBullet
}



interface Key {

}

interface Offer {
    uid: string
}

interface ServerToClientEvents {
    noArg: () => void;
    OFFER: (data: Offer) => void;
    state: (data: IMessage) => void;
}

interface ClientToServerEvents {
    DISCOVER: () => void
    movement: (data: IInput) => void;
}

export {
    State,
    IMessage,
    ServerToClientEvents,
    ClientToServerEvents,
    Offer,
    IBullet,
    IInput,
}