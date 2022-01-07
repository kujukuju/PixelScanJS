const LE = new Uint8Array(new Uint32Array([0x00000001]).buffer)[0] === 0x01;

class BinaryHelper {
    static _buffer = new ArrayBuffer(4);
    static _floatBuffer = new Float32Array(BinaryHelper._buffer);
    static _intBuffer = new Int32Array(BinaryHelper._buffer);
    static _uintBuffer = new Uint32Array(BinaryHelper._buffer);
    static _byteBuffer = new Uint8Array(BinaryHelper._buffer);

    static readFloat(byte1, byte2, byte3, byte4) {
        if (LE) {
            BinaryHelper._byteBuffer[0] = byte1;
            BinaryHelper._byteBuffer[1] = byte2;
            BinaryHelper._byteBuffer[2] = byte3;
            BinaryHelper._byteBuffer[3] = byte4;
        } else {
            BinaryHelper._byteBuffer[0] = byte4;
            BinaryHelper._byteBuffer[1] = byte3;
            BinaryHelper._byteBuffer[2] = byte2;
            BinaryHelper._byteBuffer[3] = byte1;
        }

        return BinaryHelper._floatBuffer[0];
    }

    static readInt(byte1, byte2, byte3, byte4) {
        if (LE) {
            BinaryHelper._byteBuffer[0] = byte1;
            BinaryHelper._byteBuffer[1] = byte2;
            BinaryHelper._byteBuffer[2] = byte3;
            BinaryHelper._byteBuffer[3] = byte4;
        } else {
            BinaryHelper._byteBuffer[0] = byte4;
            BinaryHelper._byteBuffer[1] = byte3;
            BinaryHelper._byteBuffer[2] = byte2;
            BinaryHelper._byteBuffer[3] = byte1;
        }

        return BinaryHelper._intBuffer[0];
    }

    static readUnsignedInt(byte1, byte2, byte3, byte4) {
        if (LE) {
            BinaryHelper._byteBuffer[0] = byte1;
            BinaryHelper._byteBuffer[1] = byte2;
            BinaryHelper._byteBuffer[2] = byte3;
            BinaryHelper._byteBuffer[3] = byte4;
        } else {
            BinaryHelper._byteBuffer[0] = byte4;
            BinaryHelper._byteBuffer[1] = byte3;
            BinaryHelper._byteBuffer[2] = byte2;
            BinaryHelper._byteBuffer[3] = byte1;
        }

        return BinaryHelper._uintBuffer[0];
    }

    static readUnsignedLong(byte1, byte2, byte3, byte4, byte5, byte6, byte7, byte8) {
        if (LE) {
            BinaryHelper._byteBuffer[0] = byte1;
            BinaryHelper._byteBuffer[1] = byte2;
            BinaryHelper._byteBuffer[2] = byte3;
            BinaryHelper._byteBuffer[3] = byte4;
        } else {
            BinaryHelper._byteBuffer[0] = byte8;
            BinaryHelper._byteBuffer[1] = byte7;
            BinaryHelper._byteBuffer[2] = byte6;
            BinaryHelper._byteBuffer[3] = byte5;
        }
        const int1 = BinaryHelper._uintBuffer[0];

        if (LE) {
            BinaryHelper._byteBuffer[0] = byte5;
            BinaryHelper._byteBuffer[1] = byte6;
            BinaryHelper._byteBuffer[2] = byte7;
            BinaryHelper._byteBuffer[3] = byte8;
        } else {
            BinaryHelper._byteBuffer[0] = byte4;
            BinaryHelper._byteBuffer[1] = byte3;
            BinaryHelper._byteBuffer[2] = byte2;
            BinaryHelper._byteBuffer[3] = byte1;
        }
        const int2 = BinaryHelper._uintBuffer[0];

        return int1 * 0x100000000 + int2;
    }

    static writeFloat(float, bytes, index) {
        BinaryHelper._floatBuffer[0] = float;

        if (LE) {
            bytes[index + 0] = BinaryHelper._byteBuffer[0];
            bytes[index + 1] = BinaryHelper._byteBuffer[1];
            bytes[index + 2] = BinaryHelper._byteBuffer[2];
            bytes[index + 3] = BinaryHelper._byteBuffer[3];

            return index + 4;
        }

        bytes[index + 0] = BinaryHelper._byteBuffer[3];
        bytes[index + 1] = BinaryHelper._byteBuffer[2];
        bytes[index + 2] = BinaryHelper._byteBuffer[1];
        bytes[index + 3] = BinaryHelper._byteBuffer[0];

        return index + 4;
    }

    static writeInt(int, bytes, index) {
        BinaryHelper._intBuffer[0] = int;

        if (LE) {
            bytes[index + 0] = BinaryHelper._byteBuffer[0];
            bytes[index + 1] = BinaryHelper._byteBuffer[1];
            bytes[index + 2] = BinaryHelper._byteBuffer[2];
            bytes[index + 3] = BinaryHelper._byteBuffer[3];

            return index + 4;
        }

        bytes[index + 0] = BinaryHelper._byteBuffer[3];
        bytes[index + 1] = BinaryHelper._byteBuffer[2];
        bytes[index + 2] = BinaryHelper._byteBuffer[1];
        bytes[index + 3] = BinaryHelper._byteBuffer[0];

        return index + 4;
    }

    static writeLong(int, bytes, index) {
        if (LE) {
            BinaryHelper._intBuffer[0] = MathHelper.left32Bits(int);
            const byte1 = BinaryHelper._byteBuffer[0];
            const byte2 = BinaryHelper._byteBuffer[1];
            const byte3 = BinaryHelper._byteBuffer[2];
            const byte4 = BinaryHelper._byteBuffer[3];

            BinaryHelper._intBuffer[0] = MathHelper.right32Bits(int);

            bytes[index + 0] = BinaryHelper._byteBuffer[0];
            bytes[index + 1] = BinaryHelper._byteBuffer[1];
            bytes[index + 2] = BinaryHelper._byteBuffer[2];
            bytes[index + 3] = BinaryHelper._byteBuffer[3];
            bytes[index + 4] = byte1;
            bytes[index + 5] = byte2;
            bytes[index + 6] = byte3;
            bytes[index + 7] = byte4;

            return index + 8;
        }

        BinaryHelper._intBuffer[0] = MathHelper.right32Bits(int);
        const byte1 = BinaryHelper._byteBuffer[3];
        const byte2 = BinaryHelper._byteBuffer[2];
        const byte3 = BinaryHelper._byteBuffer[1];
        const byte4 = BinaryHelper._byteBuffer[0];

        BinaryHelper._intBuffer[0] = MathHelper.left32Bits(int);

        bytes[index + 0] = BinaryHelper._byteBuffer[3];
        bytes[index + 1] = BinaryHelper._byteBuffer[2];
        bytes[index + 2] = BinaryHelper._byteBuffer[1];
        bytes[index + 3] = BinaryHelper._byteBuffer[0];
        bytes[index + 4] = byte1;
        bytes[index + 5] = byte2;
        bytes[index + 6] = byte3;
        bytes[index + 7] = byte4;

        return index + 8;
    }

    static writeString(string, bytes, index) {
        index = BinaryHelper.writeInt(string.length, bytes, index);
        for (let i = 0; i < string.length; i++) {
            index = BinaryHelper.writeInt(string.charCodeAt(i), bytes, index);
        }

        return index;
    }
}
