import { Keys } from "src/Input"
import { IBullet } from "src/Interfaces"

interface Entity {
    uid: string
    x: number
    y: number
    lastTik: number
}

interface Message {
    keys: Keys
    tik: number
    delta: number
    uid: string,
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