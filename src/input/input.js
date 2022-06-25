class Input {
    static KEY_0 = '0';
    static KEY_1 = '1';
    static KEY_2 = '2';
    static KEY_3 = '3';
    static KEY_4 = '4';
    static KEY_5 = '5';
    static KEY_6 = '6';
    static KEY_7 = '7';
    static KEY_8 = '8';
    static KEY_9 = '9';
    static KEY_A = 'a';
    static KEY_B = 'b';
    static KEY_C = 'c';
    static KEY_D = 'd';
    static KEY_E = 'e';
    static KEY_F = 'f';
    static KEY_G = 'g';
    static KEY_H = 'h';
    static KEY_I = 'i';
    static KEY_J = 'j';
    static KEY_K = 'k';
    static KEY_L = 'l';
    static KEY_M = 'm';
    static KEY_N = 'n';
    static KEY_O = 'o';
    static KEY_P = 'p';
    static KEY_Q = 'q';
    static KEY_R = 'r';
    static KEY_S = 's';
    static KEY_T = 't';
    static KEY_U = 'u';
    static KEY_V = 'v';
    static KEY_W = 'w';
    static KEY_X = 'x';
    static KEY_Y = 'y';
    static KEY_Z = 'z';
    static KEY_ESCAPE = 'escape';
    static KEY_SHIFT = 'shift';
    static KEY_SPACE = ' ';

    static NONE = 0x0;
    static DOWN = 0x1;
    static DELTA_DOWN = 0x2;

    static keys = {};

    static mouseDownLeft = Input.NONE;
    static mouseDownRight = Input.NONE;

    static mousePosition = new Vec2();

    static clear() {
        Input.mouseDownLeft &= ~Input.DELTA_DOWN;
        Input.mouseDownRight &= ~Input.DELTA_DOWN;
        
        for (const key in Input.keys) {
            Input.keys[key] &= ~Input.DELTA_DOWN;
        }
    }
}

window.addEventListener('load', () => {
    window.addEventListener('keydown', event => {
        if (!event.key) {
            return true;
        }

        Input.keys[event.key.toLowerCase()] = Input.DOWN | Input.DELTA_DOWN;

        return true;
    }, true);


    window.addEventListener('keyup', event => {
        if (!event.key) {
            return true;
        }

        delete Input.keys[event.key.toLowerCase()];

        return true;
    }, true);

    window.addEventListener('mousedown', event => {
        if (event.button === 0) {
            Input.mouseDownLeft = Input.DOWN | Input.DELTA_DOWN;
        }
        if (event.button === 2) {
            Input.mouseDownRight = Input.DOWN | Input.DELTA_DOWN;
        }

        return true;
    }, true);

    window.addEventListener('mouseup', event => {
        if (event.button === 0) {
            Input.mouseDownLeft = Input.NONE;
        }
        if (event.button === 2) {
            Input.mouseDownRight = Input.NONE;
        }

        return true;
    }, true);

    window.addEventListener('mousemove', event => {
        Input.mousePosition.x = event.clientX;
        Input.mousePosition.y = event.clientY;

        return true;
    }, true);

    window.addEventListener('contextmenu', event => {
        event.preventDefault();
        return false;
    }, true);
});