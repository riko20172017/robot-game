import { IBullet } from "src/Interfaces"

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
    uid: string,
    fire: boolean,
    bullet?: IBullet
}

interface Client {
    socketId: string
    uid: string
}

interface IExplosion {
    x: number
    y: number
    bulletId: string
}

export { Entity, Message, Client, IExplosion }