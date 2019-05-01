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

import OptionRow from '../Options/OptionRow/OptionRow';
import OptionText from '../Options/OptionText/OptionText';
import OptionChecked from '../Options/OptionChecked/OptionChecked';
import OptionNumber from '../Options/OptionNumber/OptionNumber';

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
    disabled: false,

    fileInfo: {},

    fileURL: false,
    targetURL: false,
    exporting: false,
    exportPercent: 0,
    options: {
      asGif: true,
      scaledDown: 2,
      scaledFps: 2,
      sampleColors: true,
    }
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
        exportPercent: arg + 0.1
      });

      this.props.onProgress(arg + 0.1);
    });

    ipcRenderer.on(Events.INFO, (event, data) => {
      this.setState({ fileInfo: data });
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
        fileURL: filePaths[0],
        disabled: true
      });

      ipcRenderer.send(Events.INFO_REQUEST, {
        input: filePaths[0]
      });
    }
  }

  onExport = () => {
    remote.dialog.showSaveDialog({
        filters: this.state.options.asGif ? FILTERS.GIFS : FILTERS.VIDEOS,
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
        output: this.state.targetURL,
        options: this.state.options
      });
      this.props.onExporting(true);
    }
  }

  getDisplayUrl(fileUrl) {
    const split = fileUrl.split('/');
    return split[split.length - 1];
  }

  onOptionsChange = (name, value) => {
    const options = {
      ...this.state.options,
      [name]: value
    };
    this.setState({ options });
  }

  getScaledSize(width, height, scaled) {
    return `${width / scaled}x${height / scaled}`;
  }

  getScaledFps(fps, scaled) {
    return `${Math.round((fps / scaled) * 10) / 10}fps`;
  }

  render() {
    const { fileURL, exporting, exportPercent, options, fileInfo } = this.state;
    const { asGif, scaledDown, scaledFps, sampleColors } = options;

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
        </div>

        <div className="home__row">
          <OptionRow title="Save as GIF">
            <OptionChecked
              name="asGif"
              onChange={this.onOptionsChange}
              value={asGif}/>
          </OptionRow>
        </div>
        <div className="home__row">
          <OptionRow
            title="Scaled down"
            subtitle={ fileInfo.width ? this.getScaledSize(fileInfo.width, fileInfo.height, scaledDown) : null }>
            <OptionNumber
              name="scaledDown"
              onChange={this.onOptionsChange}
              min={1}
              max={4}
              prefix={"/"}
              value={scaledDown}/>
          </OptionRow>
        </div>
        <div className="home__row">
          <OptionRow
            title="Scaled FPS"
            subtitle={ fileInfo.fps ? this.getScaledFps(fileInfo.fps, scaledFps) : null }>
            <OptionNumber
              name="scaledFps"
              onChange={this.onOptionsChange}
              min={1}
              max={4}
              prefix={"/"}
              value={scaledFps}/>
          </OptionRow>
        </div>
        <div className="home__row">
          <OptionRow title="Sample colours">
            <OptionChecked
              name="sampleColors"
              onChange={this.onOptionsChange}
              value={sampleColors}/>
          </OptionRow>
        </div>

        <Btn className={'home__export'} onClick={this.onExport}>Export</Btn>

        { exporting ? <Progress className="home__progress" percent={exportPercent}/> : null }
      </div>
    );
  }
}

export default Home;
