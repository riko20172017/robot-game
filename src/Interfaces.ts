interface State {
    uid: string
    x: number
    y: number
    lastTik: number
    dir: string
}

interface Message {

}

interface IInput {
    tik: number
    delta: number
    uid: string
    dir: string,
    fire: boolean
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
}

interface ClientToServerEvents {
    DISCOVER: () => void
    movement: (data: IInput) => void;
}