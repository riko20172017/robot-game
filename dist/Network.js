import httpServer from "./httpserver.js";
import { Server as Socket } from "socket.io";
import { uid as uidd } from 'uid';
class Network {
    constructor() {
        this.messages = [];
        this.io = new Socket(httpServer);
    }
    init(server) {
        let network = this;
        this.io.on('connection', function (socket) {
            socket.on('DISCOVER', function (data) {
                let uid = uidd();
                let socketId = socket.id;
                socket.emit('OFFER', uid);
                server.clients.push({ socketId, uid });
                server.entities.push({
                    uid,
                    x: randomInteger(10, 500),
                    y: randomInteger(10, 400),
                    lastTik: 0
                });
            });
            socket.on('movement', function (data) {
                network.messages.push(data);
            });
            socket.on('disconnect', function (data) {
                var client = server.clients.find(({ socketId }) => socketId == socket.id);
                if (client === undefined) {
                    console.log("can`t disconnect: client is undefined");
                    return;
                }
                server.clients = server.clients.filter(({ socketId }) => {
                    return socketId !== (client === null || client === void 0 ? void 0 : client.socketId);
                });
                server.entities = server.entities.filter(({ uid }) => {
                    return uid !== (client === null || client === void 0 ? void 0 : client.uid);
                });
            });
        });
    }
}
function randomInteger(min, max) {
    // получить случайное число от (min-0.5) до (max+0.5)
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}
export default Network;
//# sourceMappingURL=Network.js.map