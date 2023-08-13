import { IExplosion } from "backend/Interfaces"
import { Keys } from "./Input"

interface State {
    uid: string
    x: number
    y: number
    lastTik: number
    dir: string
}

interface IMessage {
    states: State[]
    bullets: Shell[]
    explosions: IExplosion[]
}

// interface IExplosion {
//     playerId: string,
//     entity: State
// }

type Shell = {
    id: string
    playerId: string
    x: number
    y: number
    vx: number
    vy: number,
    angle: number,
    shellType: string
}

interface IInput {
    tik: number
    delta: number
    uid: string
    keys: Keys,
    shell?: Shell
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
    Shell,
    IInput,
}