import Client from "./Client.js";
import { Player, PlayerTest } from "./units/Player.js";
import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, Discover, IMessage, Join, ServerToClientEvents } from "./Interfaces.js";

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

        this.socket.on('DISCOVER', function (data: Discover) {
            client.playerId = data.uid
            document.getElementById("game-start")?.classList.add("show");
            document.getElementById("play")?.addEventListener("click", () => { network.socket.emit('JOIN', { uid: data.uid }) }, false)
        })

        this.socket.on('JOIN', function (data: Join) {
            console.log(111);
            client.players.push(new Player(client.playerId, 0, 0))
            document.getElementById("game-start")?.classList.remove("show");
        });

        this.socket.on('state', function (data: IMessage) {
            network.messages.push(data);
        })
    }

    receive() {
        return this.messages.shift()
    }

    gameOverScreen() {
        document.getElementById("game-over")?.classList.add("show");
    }
}

export default Network