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
      onUpdate: this.onUpdate
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

        this.logic.requestExport(file.path, destination, properties)
      })
      .catch(() => {}) // No file chosen
  }

  onFinished = (args) => {
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

  onUpdate = () => {
    this.setState({
      update: true
    });
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

  onPropertyUpdate = (value, name) => {
    const state = {
      properties: {
        ...this.state.properties,
        [name]: value
      }
    };

    if (name === 'start') {
      state.activeTime = value;
    }

    if (name === 'duration') {
      let endTime = this.state.properties.start + value;

      // TODO Cut down over length

      state.activeTime = endTime;
    }

    this.setState(state);
  }

  openUpdate = () => {
    this.logic.openUpdate();
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
          onExport={this.onRequestExport}/>

        {
          update ? (
            <div className="app__update">
              <Button onClick={this.openUpdate}>
                Update required
              </Button>
            </div>
          ) : null
        }
      </div>
    );
  }
}

export default App;
