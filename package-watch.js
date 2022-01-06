const fs = require('fs');
const path = require('path');

// {
//     path: contents,
// }
const watched = {};
// let changed = false;
let writeQueued = false;

const first = [
    'aabb.js',
    'hash.js',
    'mat3.js',
    'vec2.js',
];

const queueWrite = () => {
    if (writeQueued) {
        return;
    }
    writeQueued = true;

    setTimeout(() => {
        writeQueued = false;
        write();
    }, 50);
};

const clear = () => {
    for (const path in watched) {
        if (!fs.existsSync(path)) {
            delete watched[path];
            // changed = true;
            queueWrite();

            console.log('File deleted: ', path);
        }
    }
};

const read = (file) => {
    if (fs.lstatSync(file).isDirectory()) {
        const files = fs.readdirSync(file);
        for (let i = 0; i < files.length; i++) {
            read(path.join(file, files[i]));
        }
    } else if (!watched[file]) {
        // add the file, mark as changed, then wait for real changes
        watched[file] = String(fs.readFileSync(file));
        // changed = true;
        queueWrite();

        fs.watchFile(file, () => {
            if (fs.existsSync(file)) {
                watched[file] = String(fs.readFileSync(file));
                // changed = true;
                queueWrite();
    
                console.log('File changed: ', file);
            } else {
                delete watched[file];
                // changed = true;
                queueWrite();

                console.log('File deleted: ', file);
            }
        });
    }
};

const write = () => {
    const file = path.join(__dirname, 'pixelscan.js');

    let data = 'const PixelScan = (function() {';
    data += '\n';

    // move main.js to the end
    const files = Object.keys(watched);
    for (let i = 0; i < files.length; i++) {
        if (!first.find(name => files[i].endsWith(name))) {
            continue;
        }

        files.unshift(files.splice(i, 1)[0]);
    }
    files.push(files.splice(files.findIndex(file => file.endsWith('main.js')), 1)[0]);

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        data += watched[file];
        data += '\n';
    }

    data += 'return PixelScan;';
    data += '\n';
    data += '})();';

    fs.writeFileSync(file, data);

    console.log('Wrote file changes. ', Date.now());
};

const loop = () => {
    clear();
    read(path.join(__dirname, 'src'));

    // if (changed) {
    //     // changed = false;

    //     // write();
    //     // queueWrite();
    // }

    setTimeout(() => {
        loop();
    }, 2000);
};

loop();