interface State {
    uid: string
    x: number
    y: number
    lastTik: number
    dir: string
}

interface Input {
    tik: number
    delta: number
    uid: string
    dir: string
}

interface IBullet {
    way: Array<number>
}