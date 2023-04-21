class Keys {
    SPACE = false
    LEFT = false
    UP = false
    RIGHT = false
    DOWN = false
}

class Input {

    mouse = { x: 0, y: 0 };

    keys: Keys = new Keys()

    constructor() {
        document.addEventListener('keydown', this.keydown.bind(this));
        document.addEventListener('keyup', this.keyup.bind(this));
        document.addEventListener('blur', this.blur.bind(this));
        document.addEventListener('mousemove', this.mousemove.bind(this));
    }

    setKey(event: KeyboardEvent, status: boolean) {
        switch (event.keyCode) {
            case 32:
                this.keys.SPACE = status; break;
            case 37:
                this.keys.LEFT = status; break;
            case 38:
                this.keys.UP = status; break;
            case 39:
                this.keys.RIGHT = status; break;
            case 40:
                this.keys.DOWN = status; break;
            default:
        }
    }

    keydown(e: KeyboardEvent) {
        let self = this
        this.setKey(e, true);
    }

    keyup(e: KeyboardEvent) {
        let self = this
        this.setKey(e, false);
    }

    blur() {
        this.keys.SPACE = false
        this.keys.LEFT = false
        this.keys.UP = false
        this.keys.RIGHT = false
        this.keys.DOWN = false
    };


    mousemove(e: MouseEvent) {
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
    }

    getMouse() {
        let self = this
        return { x: self.mouse.x, y: self.mouse.y };
    }

    getKeys() {
        return this.keys
    }
    // document.inputManual = function (key) {
    //     return { ...window.input, mouse: { ...window.getMouse() } };
    // }
}

export {Input, Keys}