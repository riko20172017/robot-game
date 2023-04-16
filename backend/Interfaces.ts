interface Entity {
    uid: string
    x: number
    y: number
    lastTik: number
}

interface Message {
    dir: string
    tik: number
    delta: number
    uid: string
}

interface Client {
    socketId: string
    uid: string
}

export { Entity, Message, Client }