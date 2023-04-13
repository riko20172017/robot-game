import httpServer from "./http.js"
import { Server as Socket } from "socket.io"
import { uid } from 'uid'

class Network {
    constructor() {
        this.messages = []
        this.io = new Socket(httpServer);
    }

    init(server) {
        this.io.on('connection', function (socket) {

            socket.on('DISCOVER', function (socket) {
                let uid = uid()
                let socketId = socket.id

                socket.emit('OFFER', uid)

                server.clients.push({ socketId, uid })
                server.entities.push({
                    uid,
                    x: randomInteger(10, 500),
                    y: randomInteger(10, 400),
                    lastTik: 0
                })
            })

            socket.on('movement', function (data) {
                this.messages.push(data)
            })

            socket.on('disconnect', function (data) {
                if (!players.length) return
                players = players.filter(player => player.socketId != socket.id)
                this.io.sockets.emit('new player', players)
            })

        });
    }
}

export default Network