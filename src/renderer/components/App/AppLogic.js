import { shell, ipcRenderer, remote } from 'electron';
import { EVENTS, FILTERS, EXPORTS } from '../../../modules/Constants';

class AppLogic {
  constructor({ onFinished = () => {}, onProgress = () => {}, onInfo = () => {} }) {
    this.events = {
      onFinished,
      onProgress,
      onInfo
    };

    this.addEventListeners();
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
        filters: FILTERS.VIDEO,
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
    ipcRenderer.send(EVENTS.INFO_REQUEST, filePath);
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
   * Gets file extensions associated to extension
   *
   * @param {String} exportType
   */
  getExportExtension(exportType) {
    switch(exportType) {
      case EXPORTS.VIDEO:
        return '.mp4';
      case EXPORTS.GIF:
      default:
        return '.gif';
    }
  }

  /**
   * Gets a default target directory
   */
  getDefaultTarget = (exportType) => {
    return [
      remote.app.getPath('desktop'),
      `export${ this.getExportExtension(exportType) }`
    ].join('/');
  }


  /**
   * Opens a save dialog
   */
  getDestination = (exportType) => {
    return new Promise((resolve, reject) => {
      remote.dialog.showSaveDialog({
        defaultPath: this.getDefaultTarget(exportType),
        filters: FILTERS[exportType],
      }, (filename) => {
        if (filename) {
          resolve(filename);
        } else {
          reject();
        }
      });
    });
  }

  requestExport = (file, destination, properties) => {
    console.log({ file, destination, properties });
    ipcRenderer.send(EVENTS.CONVERT, { file, destination, properties });
    return destination;
  }
};

export default AppLogic;
