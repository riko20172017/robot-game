class Inputs {

    mouse = { x: 0, y: 0 };

    constructor() {
        window.input = {};
        document.addEventListener('keydown', this.keydown.bind(this));
        document.addEventListener('keyup', this.keyup.bind(this));
        document.addEventListener('blur', this.blur.bind(this));
        document.addEventListener('mousemove', this.mousemove.bind(this));
    }

    setKey(event, status) {
        var code = event.keyCode;
        var key;

        switch (code) {
            case 32:
                key = 'SPACE'; break;
            case 37:
                key = 'LEFT'; break;
            case 38:
                key = 'UP'; break;
            case 39:
                key = 'RIGHT'; break;
            case 40:
                key = 'DOWN'; break;
            default:
                // Convert ASCII codes to letters
                key = String.fromCharCode(code);
        }

        window.input[key] = status;
    }

    keydown(e) {
        let self = this
        self.setKey(e, true);
    }

    keyup(e) {
        let self = this
        self.setKey(e, false);
    }

    blur() {
        window.input = {};
    }

    mousemove(e) {
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
    }

    getMouse() {
        let self = this
        return { x: self.mouse.x, y: self.mouse.y };
    }
    // document.inputManual = function (key) {
    //     return { ...window.input, mouse: { ...window.getMouse() } };
    // }
}

export default Inputs