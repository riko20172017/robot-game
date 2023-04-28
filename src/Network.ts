import { IExplosion } from "backend/Interfaces.js";
import Client from "./Client.js";
import Explosion from "./units/Explosion.js";
import { Player, PlayerTest } from "./units/Player.js";
import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, IMessage, Offer, ServerToClientEvents } from "./Interfaces.js";

class Network {

    messages: IMessage[]
    socket: Socket<ServerToClientEvents, ClientToServerEvents>

    constructor() {
        this.messages = []
        this.socket = io();
    }

    init(client: Client) {
        let network = this;

        this.socket.emit('DISCOVER');

        this.socket.on('OFFER', function (data: Offer) {
            client.playerId = data.uid
            client.players.push(new Player(client.playerId, 0, 0))
            // client.players.push(new PlayerTest("asdasd", 0, 0))
        });

        this.socket.on('state', function (data: IMessage) {
            network.messages.push(data);
        })

        // this.socket.on('explosions', function (data: IExplosion) {
        // bullets.splice(data.bulletKey, 1);

        // client.explosions.push(new Explosion(data.entity.x, data.entity.y))

        // })

        // if (data?.bullet) {
        //     bullets.push({
        //         ...data.bullet,
        //         sprite: new Sprite('img/sprites.png', [0, 39], [18, 8], [0, 0], 10, data.bullet.dir)
        //     })
        // }
    }

    receive() {
        return this.messages.shift()
    }
}

export default Network