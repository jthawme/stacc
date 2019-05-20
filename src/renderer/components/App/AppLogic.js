import { shell, ipcRenderer, remote } from 'electron';
import { EVENTS, FILTERS } from '../../../modules/Constants';

class AppLogic {
  constructor({ onFinished = () => {}, onProgress = () => {} }) {
    this.events = {
      onFinished,
      onProgress,
    };
  }

  addEventListeners() {
    ipcRenderer.on(EVENTS.FINISHED, this.onFinished);
    ipcRenderer.on(EVENTS.PROGRESS, this.onProgress);
    ipcRenderer.on(EVENTS.INFO, this.onInfo);
  }


  requestFile() {
    return new Promise((resolve, reject) => {
      remote.dialog.showOpenDialog({
        properties: ['openFile'],
        filters: FILTERS.VIDEOS,
      }, (filePaths) => {
        if (filePaths) {
          resolve(filePaths[0]);
        } else {
          reject();
        }
      });
    });
  }

  /**
   * Sends request for FFprobe file info
   *
   * @param {String} filePath
   */
  requestInfo(filePath) {
    ipcRenderer.send(EVENTS.INFO_REQUEST, { input: filePath });
  }


  /**
   * Callback from main file, after FFProbe has got basic
   * data about a video file
   */
  onInfo = (event, data) => {
    this.events.onInfo(data);
  }


  /**
   * Callback from main file of when an export has been
   * successfully completed
   */
  onFinished = (event, { filePath, directory }) => {
    this.createNotification('Export completed', { body: 'View in finder' }, () => {
      shell.openItem(directory);
    });

    this.events.onFinished({ filePath, directory });
  }


  /**
   * Callback from main file of the progress of a file
   * export
   */
  onProgress = (event, percentage) => {
    this.events.onProgress(percentage);
  }


  /**
   * Helper method for creating native notifications
   */
  createNotification(title, opts = {}, onClick = () => {}) {
    const notification = new Notification(title, opts);
    notification.onclick = onClick;
  }


  /**
   * Gets a default target directory
   */
  getDefaultTarget = (asGif = true) => {
    return [
      remote.app.getPath('desktop'),
      asGif ? 'export.gif' : 'export.mp4'
    ].join('/');
  }


  /**
   * Opens a save dialog
   */
  getDestination = (asGif = true) => {
    return new Promise((resolve, reject) => {
      remote.dialog.showSaveDialog({
        defaultPath: this._getDefaultPath(asGif),
        filters: asGif ? FILTERS.GIFS : FILTERS.VIDEOS,
      }, (filename) => {
        if (filename) {
          resolve(filename);
        } else {
          reject();
        }
      });
    });
  }

  requestExport = (filePath, destination, properties) => {
    ipcRenderer.send(EVENTS.CONVERT, { filePath, destination, properties });
    return destination;
  }
};

export default AppLogic;
