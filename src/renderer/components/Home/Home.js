import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import { ipcRenderer, remote, shell } from 'electron';
import classNames from 'classnames';
import { EVENTS, FILTERS} from '../../../modules/Constants';
import { SlideDown } from 'react-slidedown';

const { app } = remote;

// Redux

// Components
import Btn from '../Common/Btn/Btn';
import Progress from '../Common/Progress/Progress';

import VideoChooser from '../VideoChooser/VideoChooser';
import Video from '../Video/Video';

import OptionRow from '../Options/OptionRow/OptionRow';
import OptionText from '../Options/OptionText/OptionText';
import OptionChecked from '../Options/OptionChecked/OptionChecked';
import OptionNumber from '../Options/OptionNumber/OptionNumber';

import TimeEditor from '../TimeEditor/TimeEditor';

// CSS, Requires
import "./Home.scss";
import "react-slidedown/lib/slidedown.css"

class Home extends React.Component {
  static propTypes = {
  };

  state = {
    disabled: false,

    fileInfo: {},

    fileURL: false,
    targetURL: false,
    exporting: false,
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
    ipcRenderer.on(EVENTS.FINISHED, (event, arg) => {
      let myNotification = new Notification('Export completed', {
        body: 'Click to view'
      });

      myNotification.onclick = () => {
        shell.openItem(arg.directory);
      }

      this.setState({
        fileURL: false,
        exporting: false
      });

      this.props.onExporting(false);
    });

    ipcRenderer.on(EVENTS.PROGRESS, (event, arg) => {
      this.props.onProgress(arg + 0.1);
    });

    ipcRenderer.on(EVENTS.INFO, (event, data) => {
      this.setState({ fileInfo: data });
    });
  }

  onFileChoose = (filePath) => {
    this.setState({
      fileURL: filePath
    });

    ipcRenderer.send(EVENTS.INFO_REQUEST, {
      input: filePath
    });
  }

  onExport = () => {
    const { options, targetURL } = this.state;

    remote.dialog.showSaveDialog({
      defaultPath: this._getDefaultPath(options.asGif, targetURL),
      filters: options.asGif ? FILTERS.GIFS : FILTERS.VIDEOS,
    }, this.onExportCB);
  }

  _getDefaultPath = (asGif, targetURL) => {
    if (targetURL) {
      const split = targetURL.split('/');
      const str = targetURL.substring(0, split[-1].length + 1);
      return [
        str,
        asGif ? 'export.gif' : 'export.mp4'
      ].join('/');
    }
    return [
      app.getPath('desktop'),
      asGif ? 'export.gif' : 'export.mp4'
    ].join('/');
  }

  onExportCB = (fileName) => {
    if (fileName) {
      this.setState({
        targetURL: fileName,
        exporting: true,
        percent: 0
      });

      ipcRenderer.send(EVENTS.CONVERT, {
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

  getFileUrl(fileUrl) {
    if (!fileUrl) {
      return false;
    }

    if (fileUrl.substring(0, 5) !== 'file:') {
      return `file:${fileUrl}`;
    }

    return fileUrl;
  }

  onOptionsChange = (name, value) => {
    const options = {
      ...this.state.options,
      [name]: value
    };
    this.setState({ options });
  }

  getScaledSize({ width = 0, height = 0 }, scaled) {
    return `${width / scaled}x${height / scaled}`;
  }

  getScaledFps({ fps = 0 }, scaled) {
    return `${Math.round((fps / scaled) * 10) / 10}fps`;
  }

  onTimeChange(key, value) {
    console.log(key, value);
  }

  render() {
    const { percent } = this.props;
    const { fileURL, exporting, options, fileInfo } = this.state;
    const { asGif, scaledDown, scaledFps, sampleColors } = options;

    const cls = classNames(
      'home'
    );

    console.log(this.getFileUrl(fileURL));

    return (
      <div className={cls}>
        <div className="home__row">
          <VideoChooser
            onFileChoose={this.onFileChoose}
            display={fileURL}>
            <Video
              width={fileInfo.width}
              height={fileInfo.height}
              src={this.getFileUrl(fileURL)}/>
          </VideoChooser>
        </div>

        <div className="home__row">
          <TimeEditor {...fileInfo}/>
        </div>

        <div className="home__row">
          <div className="home__row__col">
            <span className="home__title">Options</span>
          </div>
        </div>

        {/* <div className="home" */}
        <div className="home__row">
          <OptionRow
            title="Save as GIF"
            disabled={!fileURL}>
            <OptionChecked
              name="asGif"
              onChange={this.onOptionsChange}
              value={asGif}/>
          </OptionRow>
        </div>
        <div className="home__row">
          <OptionRow
            title="Scaled down"
            subtitle={ this.getScaledSize(fileInfo, scaledDown) }
            disabled={!fileURL}>
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
            subtitle={ this.getScaledFps(fileInfo, scaledFps) }
            disabled={!fileURL}>
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
          <OptionRow
            title="Sample colours"
            disabled={ !asGif || !fileURL }>
            <OptionChecked
              name="sampleColors"
              onChange={this.onOptionsChange}
              value={sampleColors}/>
          </OptionRow>
        </div>

        <Btn className={'home__export'} onClick={this.onExport}>Export</Btn>

        { exporting ? <Progress className="home__progress" percent={percent}/> : null }
      </div>
    );
  }
}

export default Home;
