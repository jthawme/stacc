import { ipcRenderer, remote } from 'electron';
import Events from '../modules/Events';

ipcRenderer.on(Events.FINISHED, (event, arg) => {
    console.log(arg);
})

function createButton(txt) {
    const btn = document.createElement('button');
    btn.innerText = txt;

    document.body.appendChild(btn);

    return btn;
}

let videoFile;
let targetFile;

function createStuff() {
    const openBtn = createButton('Open');
    openBtn.addEventListener('click', e => {

    });

    const exportBtn = createButton('Convert');
    exportBtn.addEventListener('click', e => {
        if (videoFile) {
            remote.dialog.showSaveDialog({
                properties: ['openFile'],
                filters: [
                    { name: 'Movies', extensions: ['mkv', 'avi', 'mp4', 'mov'] }
                ],
            }, (fileName) => {
                if (fileName) {
                    targetFile = fileName;

                    ipcRenderer.send(Events.CONVERT, JSON.stringify({
                        input: videoFile,
                        output: targetFile
                    }));
                }
            });
        }
    })
}

createStuff();
