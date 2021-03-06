import { shell, ipcRenderer, remote } from 'electron';
import { EVENTS, FILTERS, EXPORTS } from '../../../modules/Constants';

class AppLogic {
  constructor({ onFinished = () => {}, onProgress = () => {}, onInfo = () => {}, onExternalFile = () => {}, onUpdate = () => {}, onSettings = () => {} }) {
    this.events = {
      onFinished,
      onProgress,
      onInfo,
      onExternalFile,
      onUpdate,
      onSettings
    };

    this.releaseURL = 'https://api.github.com/repos/jthawme/stacc/releases/latest';

    this.addEventListeners();
  }

  addEventListeners() {
    ipcRenderer.on(EVENTS.FINISHED, this.onFinished);
    ipcRenderer.on(EVENTS.PROGRESS, this.onProgress);
    ipcRenderer.on(EVENTS.INFO, this.onInfo);
    ipcRenderer.on(EVENTS.EXTERNAL_FILE, this.onExternalFile);
    ipcRenderer.on(EVENTS.UPDATE, this.onUpdate);
    ipcRenderer.on(EVENTS.SETTINGS, this.onSettings);
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
   * Requests the opening of a modal window for settings
   */
  requestSettings(properties, videoInfo) {
    ipcRenderer.send(EVENTS.SETTINGS_REQUEST, {
      properties,
      videoInfo
    });
  }


  /**
   * Callback from main file, after FFProbe has got basic
   * data about a video file
   */
  onInfo = (event, data) => {
    this.events.onInfo(data);
  }


  /**
   * Callback from main file, if Electron supplies a
   * file in a different way
   */
  onExternalFile = (event, data) => {
    this.events.onExternalFile(data);
  }


  /**
   * Callback from main file, if its determined
   * that there is a newer version
   */
  onUpdate = (event, data) => {
    this.events.onUpdate(data);
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
   * Callback from main file of the progress of a file
   * export
   */
  onSettings = (event, settings) => {
    this.events.onSettings(settings);
  }


  /**
   * Helper method for creating native notifications
   */
  createNotification(title, opts = {}, onClick = () => {}) {
    const notification = new Notification(title, opts);
    notification.onclick = onClick;

    console.log(notification);
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
    ipcRenderer.send(EVENTS.CONVERT, { file, destination, properties });
    return destination;
  }

  checkForUpdates = () => {
    fetch(this.releaseURL)
      .then(resp => resp.json())
      .then(json => {
        ipcRenderer.send(EVENTS.VERSION_CHECK, json.tag_name)
      });
  }

  openUpdate() {
    shell.openExternal('https://stacc.netlify.com');
  }
};

export default AppLogic;
