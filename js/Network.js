import Player from "./units/player.js";
import PlayerTest from "./units/playerTest.js";

class Network {
    constructor() {
        this.messages = []
        this.socket = io();
    }

    init(client) {
        let network = this;

        this.socket.emit('DISCOVER');

        this.socket.on('OFFER', function (data) {
            client.playerId = data
            client.players.push(new Player(client.playerId, 0, 0))
            client.players.push(new PlayerTest("asdasd", 0, 0))
        });

        this.socket.on('state', function (data) {
            network.messages.push(data);
        })

        // socket.on('explosions', function (data) {
        //     delete players[data.player.id]
        //     bullets.splice(data.bulletKey, 1);
        //     explosions.push({
        //         pos: [data.player.x, data.player.y],
        //         sprite: new Sprite('img/sprites.png',
        //             [0, 117],
        //             [39, 39],
        //             16,
        //             [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        //             null,
        //             true)
        //     });

        // })

        // if (data?.bullet) {
        //     bullets.push({
        //         ...data.bullet,
        //         sprite: new Sprite('img/sprites.png', [0, 39], [18, 8], [0, 0], 10, data.bullet.dir)
        //     })
        // }
    }

}

export default Network