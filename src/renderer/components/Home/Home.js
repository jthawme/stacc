import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import { ipcRenderer, remote, shell } from 'electron';
import classNames from 'classnames';
import Events from '../../../modules/Events';

// Redux

// Components
import Btn from '../Common/Btn/Btn';
import Progress from '../Common/Progress/Progress';
import VideoEditor from '../VideoEditor/VideoEditor';

// CSS, Requires
import "./Home.scss";
import Video from '../Video/Video';

const FILTERS = {
  VIDEOS: [
    { name: 'Movies', extensions: ['mkv', 'avi', 'mp4', 'mov'] }
  ],
  GIFS: [
    { name: 'Gifs', extensions: ['gif'] }
  ]
}

class Home extends React.Component {
  static propTypes = {
  };

  state = {
    asGif: true,
    fileURL: false,
    targetURL: false,
    exporting: false,
    exportPercent: 0
  }

  componentDidMount() {
    this.addEventListeners();
  }

  addEventListeners() {
    ipcRenderer.on(Events.FINISHED, (event, arg) => {
      let myNotification = new Notification('Export completed', {
        body: 'Click to view'
      });

      myNotification.onclick = () => {
        shell.openItem(arg.directory);
      }

      this.setState({
        fileURL: false,
        exporting: false,
        exportPercent: 0
      });

      this.props.onExporting(false);
    });

    ipcRenderer.on(Events.PROGRESS, (event, arg) => {
      this.setState({
        exportPercent: arg
      });

      this.props.onProgress(arg);
    });
  }

  onFileChoose = () => {
    remote.dialog.showOpenDialog({
        properties: ['openFile'],
        filters: FILTERS.VIDEOS,
    }, this.onFileChooseCB);
  }

  onFileChooseCB = (filePaths) => {
    if (filePaths) {
      this.setState({
        fileURL: filePaths[0]
      });

      // ipcRenderer.send(Events.THUMBNAIL, JSON.stringify({
      //   input: filePaths[0]
      // }));
    }
  }

  onExport = () => {
    remote.dialog.showSaveDialog({
        filters: this.state.asGif ? FILTERS.GIFS : FILTERS.VIDEOS,
    }, this.onExportCB);
  }

  onExportCB = (fileName) => {
    if (fileName) {
      this.setState({
        targetURL: fileName,
        exporting: true,
        percent: 0
      });

      ipcRenderer.send(Events.CONVERT, {
        input: this.state.fileURL,
        output: this.state.targetURL
      });
      this.props.onExporting(true);
    }
  }

  getDisplayUrl(fileUrl) {
    const split = fileUrl.split('/');
    return split[split.length - 1];
  }

  render() {
    const { fileURL, exporting, exportPercent } = this.state;

    const cls = classNames(
      'home'
    );

    return (
      <div className={cls}>
        <div className="home__row">
          <div className="home__row__col">
            <Btn onClick={this.onFileChoose}>Choose file</Btn>
          </div>
          <div className="home__row__col">
            <span className="home__url">{ fileURL ? this.getDisplayUrl(fileURL) : 'Select file' }</span>
          </div>
        </div>

        <div className="home__row">
          <div className="home__row__col">
            <span className="home__title">Options</span>
          </div>
          <div className="home__row__col">

          </div>
        </div>

        <Btn className={'home__export'} onClick={this.onExport}>Export</Btn>

        { exporting ? <Progress className="home__progress" percent={exportPercent}/> : null }
      </div>
    );
  }
}

export default Home;
