const fs = require('fs');
const path = require('path');

// {
//     path: contents,
// }
const watched = {};
let changed = false;

const read = (file) => {
    if (fs.lstatSync(file).isDirectory()) {
        const files = fs.readdirSync(file);
        for (let i = 0; i < files.length; i++) {
            read(path.join(file, files[i]));
        }
    } else if (!watched[file]) {
        // add the file, mark as changed, then wait for real changes
        watched[file] = String(fs.readFileSync(file));
        changed = true;

        fs.watchFile(file, () => {
            watched[file] = String(fs.readFileSync(file));
            changed = true;

            console.log('File changed: ', file);
        });
    }
};

const write = () => {
    const file = path.join(__dirname, 'packaged.js');

    let data = '';
    for (const file in watched) {
        data += watched[file];
        data += '\n';
    }

    const keys = {};
    (function() {
        eval(data);

        console.log(this);
    })();

    fs.writeFileSync(file, data);

    console.log('Wrote file changes. ', Date.now());
};

const loop = () => {
    read(path.join(__dirname, 'src'));

    if (changed) {
        changed = false;

        write();
    }

    setTimeout(() => {
        loop();
    }, 200);
};

loop();