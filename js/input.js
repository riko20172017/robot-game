
(function () {
    var pressedKeys = { left: false, up: false, right: false, down: false, space: false };
    var mouse = { x: 0, y: 0 };

    function setKey(event, status) {
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

        pressedKeys[key] = status;
    }

    document.addEventListener('keydown', function (e) {
        setKey(e, true);
    });

    document.addEventListener('keyup', function (e) {
        setKey(e, false);
    });

    window.addEventListener('blur', function () {
        pressedKeys = {};
    });

    window.input = function (key) {
        return pressedKeys;
    }


    const canvas = document.getElementById('canvas');
    // We can use our function with a canvas event
    // canvas.addEventListener('mousemove', event => {
    //     // const transformedCursorPosition = getTransformedPoint(event.offsetX, event.offsetY);
    //     console.log(event.offsetX, event.offsetY);

    // });
    canvas.addEventListener('mousemove', event => {
        mouse.x = event.offsetX;
        mouse.y = event.offsetY;
    });

    window.getMouse = function () {
        return { x: mouse.x, y: mouse.y };
    }

})();