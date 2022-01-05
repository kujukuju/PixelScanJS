class Hash {
    static buffer = new ArrayBuffer(4);
    static byteBuffer = new Uint8Array(Hash.buffer);
    static intBuffer = new Int32Array(Hash.buffer);

    static integerHash(string) {
        let value = 0;

        let index = 0;
        while (index < string.length) {
            for (let i = 0; i < 4; i++) {
                if (index < string.length) {
                    Hash.byteBuffer[i] = string.charCodeAt(index);
                    index++;
                } else {
                    Hash.byteBuffer[i] = 0;
                }
            }
        }
        
        value ^= Hash.intBuffer[0];

        return value;
    }
}