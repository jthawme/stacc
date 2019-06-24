import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components
import DropArea from '../UI/DropArea/DropArea';
import ToastManager from '../UI/Toast/ToastManager';

import VideoPreview from '../VideoPreview/VideoPreview';
import DropDisplay from '../DropDisplay/DropDisplay';
import Controls from '../Controls/Controls';

import ExportingDisplay from '../ExportingDisplay/ExportingDisplay';
import DisplayChanger from '../DisplayChanger/DisplayChanger';
import Splash from '../Splash/Splash';

import Button from '../UI/Button/Button';

// CSS, Requires
import { EXPORTS, FILTERS, createAcceptsFromFilter } from '../../../modules/Constants';
import AppLogic from './AppLogic';
import "./App.scss";
import "../UI/Common/css/defaults.scss";

class App extends React.Component {
  static propTypes = {
    children: PropTypes.node
  };

  constructor(props) {
    super(props);

    const PROPERTY_DEFAULTS = {
      start: 0,
      duration: 0,
      exportType: EXPORTS.GIF, // Whether the ouput should be gif or movie
      scaledDown: 2, // Scaled down to what size
      scaledFps: 1, // Scaled down FPS by factor
      sampleColors: true, // Whether to sample colours per frame (GIF only)
    };

    this.state = {
      file: false,

      videoInfo: false,

      exporting: false,
      exportingProgress: 0,

      properties: PROPERTY_DEFAULTS,

      messages: [],

      activeTime: 0,

      update: false
    };

    this.logic = new AppLogic({
      onFinished: this.onFinished,
      onProgress: this.onProgress,
      onInfo: this.onInfo,
      onExternalFile: this.onFiles,
      onUpdate: this.onUpdate,
      onSettings: this.onSettings,
    });
  }

  componentDidMount() {
    this.logic.checkForUpdates();
  }

  onFiles = files => {
    this.onFileSelect(files[0].path);

    this.setState({
      file: files[0]
    });
  }

  chooseFile = () => {
    this.logic.requestFile()
      .then(this.onFileSelect);
  }

  onFileSelect = filePath => {
    this.logic.requestInfo(filePath);
  }

  onRequestExport = () => {
    const { properties, file } = this.state;

    this.logic.getDestination(properties.exportType)
      .then(destination => {
        this.setState({
          exporting: true,
          exportingProgress: 0
        });

        this.setExportingTimer();

        this.logic.requestExport(file.path, destination, properties)
      })
      .catch(() => {}) // No file chosen
  }

  onFinished = (args) => {
    clearTimeout(this.timer);

    this.setState({
      exportingProgress: 1
    });

    setTimeout(() => {
      this.setState({
        exporting: false,
        exportingProgress: 0
      });
    }, 500);
  }

  onProgress = (percentage) => {
    this.setState({
      exportingProgress: percentage
    });
  }

  onInfo = info => {
    const properties = {
      ...this.state.properties,
      start: info.start,
      duration: 5000
    };
    this.setState({ videoInfo: info, properties, activeTime: 0 });
  }

  onUpdate = (data) => {
    this.setState({
      update: this.isImportantUpdate(data.current, data.latest)
    });
  }

  onSettings = (settings) => {
    this.setState({ properties: settings });
  }

  isImportantUpdate(current, latest) {
    let curr = current.substring(1).split('.').map(v => parseInt(v));
    let late = latest.substring(1).split('.').map(v => parseInt(v));

    return (late[0] > curr[0] || late[1] > curr[1]);
  }

  /**
   * A method to display a toast
   *
   * @param {String} message
   * @param {String} type
   */
  addMessage = (message, type = 'normal') => {
    const messages = this.state.messages.slice();
    messages.push({ message, type, full: true });
    this.setState({ messages });
  }

  setExportingTimer() {
    this.timer = setTimeout(() => {
      this.addMessage('Still exporting, hang in there!');
      this.setExportingTimer();
    }, 30000);
  }

  onPropertyUpdate = (value, name) => {
    const state = {
      properties: {
        ...this.state.properties,
        [name]: value
      }
    };

    if (name === 'start') {
      let endTime = value + this.state.properties.duration;

      if (endTime > this.state.videoInfo.duration) {
        state.properties[name] = this.state.videoInfo.duration - this.state.properties.duration;
      }

      state.activeTime = value;
    }

    if (name === 'duration') {
      let endTime = this.state.properties.start + value;

      if (value > 5000) {
        this.addMessage("Over 5s will produce large file size", "error");
      }

      if (endTime > this.state.videoInfo.duration) {
        state.properties[name] = this.state.videoInfo.duration - this.state.properties.start;
      }

      // TODO Cut down over length

      state.activeTime = endTime;
    }

    this.setState(state);
  }

  openUpdate = () => {
    this.logic.openUpdate();
  }

  onOptions = () => {
    this.logic.requestSettings(this.state.properties, this.state.videoInfo);
  }

  render() {
    const { messages, videoInfo, properties, exporting, exportingProgress, file, activeTime, update } = this.state;

    const cls = classNames(
      'app',
      {
        'app--has-file': file
      }
    );

    return (
      <div className={cls}>
        <div className="app__fake-head"/>

        <ToastManager
          className="app__toast-manager"
          messages={messages}
          onMessagesUpdate={messages => this.setState({messages})}/>

        <Splash/>

        { exporting ? (
          <ExportingDisplay
            className="app__exporting-display"/>
        ) : null }

        <DropArea
          clickable={false}
          className="app__drop-wrapper"
          onInvalid={() => this.addMessage('Invalid file', 'error')}
          onFiles={this.onFiles}
          accept={createAcceptsFromFilter(FILTERS.VIDEO)}>
          { (files, dropping) => {
            const dropCls = classNames(
              'app__drop',
              {
                'app__drop--dropping': dropping
              }
            );

            return (
              <div className={ dropCls }>
                <DropDisplay
                  dropping={dropping}
                  hasFiles={file}/>
                <VideoPreview
                  time={activeTime}
                  start={properties.start}
                  duration={properties.duration}
                  className="app__drop__video"
                  file={file}/>
              </div>
            );
          }}
        </DropArea>

        <DisplayChanger
          type={ properties.exportType }
          className="app__display-changer"/>

        <Controls
          className="app__controls"
          progress={exportingProgress}
          videoInfo={videoInfo}
          properties={properties}
          disabled={exporting}
          onPropertyUpdate={this.onPropertyUpdate}
          onExport={this.onRequestExport}
          onOptions={this.onOptions}/>

        {
          update ? (
            <div className="app__update">
              <Button onClick={this.openUpdate}>
                Update required {global.location.search}
              </Button>
            </div>
          ) : null
        }
      </div>
    );
  }
}

export default App;
