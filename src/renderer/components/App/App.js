import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components
import Section from '../UI/Section/Section';
import Title from '../UI/Title/Title';
import Button from '../UI/Button/Button';

import NumberInput from '../UI/Inputs/NumberInput';
import CheckedInput from '../UI/Inputs/CheckedInput';
import SelectInput from '../UI/Inputs/SelectInput';

import DropArea from '../UI/DropArea/DropArea';
import ToastManager from '../UI/Toast/ToastManager';
import Progress from '../UI/Progress/Progress';

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
      scaledFps: 2, // Scaled down FPS by factor
      sampleColors: true, // Whether to sample colours per frame (GIF only)
    };

    this.state = {
      file: false,

      videoInfo: false,

      exporting: false,
      exportingProgress: 0,

      properties: PROPERTY_DEFAULTS,

      messages: []
    };

    this.logic = new AppLogic({
      onFinished: this.onFinished,
      onProgress: this.onProgress,
      onInfo: this.onInfo,
    });
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

    this.setState({
      exporting: true,
      exportingProgress: 0
    });

    this.logic.getDestination(properties.exportType)
      .then(destination => this.logic.requestExport(file.path, destination, properties))
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
      start: info.start / 1000,
      duration: Math.floor(info.duration / 1000)
    };
    this.setState({ videoInfo: info, properties });
  }

  /**
   * A method to display a toast
   *
   * @param {String} message
   * @param {String} type
   */
  addMessage = (message, type = 'normal') => {
    const messages = this.state.messages.slice();
    messages.push({ message, type });
    this.setState({ messages });
  }

  onPropertyUpdate = (value, name) => {
    const properties = {
      ...this.state.properties,
      [name]: value
    };

    this.setState({ properties });
  }

  render() {
    const { messages, videoInfo, properties, exporting, exportingProgress } = this.state;

    const cls = classNames(
      'app'
    );

    return (
      <div className={cls}>
        <div className="app__fake-head"/>

        <ToastManager messages={messages} onMessagesUpdate={messages => this.setState({messages})}/>

        <Section>
          <DropArea
            onInvalid={() => this.addMessage('Invalid file', 'error')}
            onFiles={this.onFiles}
            accept={createAcceptsFromFilter(FILTERS.VIDEO)}/>
        </Section>

        { videoInfo ? (
          <Section
            inline
            title={<Title el="h2" size="small">Properties</Title>}>
            <Section>
              <NumberInput
                min={0}
                max={Math.floor(videoInfo.duration / 1000)}
                name="start"
                label="Start"
                onUpdate={this.onPropertyUpdate}
                value={properties.start}/>
            </Section>
            <Section>
              <NumberInput
                min={0}
                max={Math.floor(videoInfo.duration / 1000)}
                name="duration"
                label="Duration"
                onUpdate={this.onPropertyUpdate}
                value={properties.duration}/>
            </Section>
            <Section>
              <SelectInput
                name="exportType"
                label="Export as"
                value={properties.exportType}
                options={Object.keys(EXPORTS).map(e => {
                  return {
                    value: EXPORTS[e],
                    label: EXPORTS[e]
                  }
                })}
                onUpdate={this.onPropertyUpdate}/>
            </Section>
            <Section>
              <NumberInput
                min={1}
                max={4}
                name="scaledDown"
                label="Scaled down"
                onUpdate={this.onPropertyUpdate}
                value={properties.scaledDown}/>
            </Section>
            <Section>
              <NumberInput
                min={1}
                max={4}
                name="scaledFps"
                label="Scaled FPS"
                onUpdate={this.onPropertyUpdate}
                value={properties.scaledFps}/>
            </Section>
            { properties.exportType === EXPORTS.GIF ? (
              <Section>
                <CheckedInput
                  name="sampleColors"
                  label="Sample colours"
                  onUpdate={this.onPropertyUpdate}
                  value={properties.sampleColors}/>
              </Section>
            ) : null }
            <Section>
              <Button
                onClick={this.onRequestExport}>
                Export
              </Button>
            </Section>

            { exporting ? <Progress percent={exportingProgress}/> : null }
          </Section>
        ) : null }
      </div>
    );
  }
}

export default App;
