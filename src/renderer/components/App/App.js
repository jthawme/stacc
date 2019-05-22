import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components
import Section from '../UI/Section/Section';
import Title from '../UI/Title/Title';
import Button from '../UI/Button/Button';
import DropArea from '../UI/DropArea/DropArea';
import ToastManager from '../UI/Toast/ToastManager';

// CSS, Requires
import { FILTERS, createAcceptsFromFilter } from '../../../modules/Constants';
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
      asGif: true, // Whether the ouput should be gif or movie
      scaledDown: 2, // Scaled down to what size
      scaledFps: 2, // Scaled down FPS by factor
      sampleColors: true, // Whether to sample colours per frame (GIF only)
    };

    this.state = {
      filePath: false,

      exporting: false,
      exportingProgress: 0,

      properties: PROPERTY_DEFAULTS,

      messages: []
    };

    this.logic = new AppLogic({
      onFinished: this.onFinished,
      onProgress: this.onProgress,
    });
  }

  chooseFile = () => {
    this.logic.requestFile()
      .then(this.onFileSelect);
  }

  onFileSelect = filePath => {
    this.logic.requestInfo(filePath);
    this.setState({ filePath });
  }

  onRequestExport = () => {
    const { properties, filePath } = this.state;

    this.logic.getDestination(properties.asGif)
      .then(destination => this.logic.requestExport(filePath, destination, properties))
      .then(() => {
        this.setState({
          exporting: true,
          exportingProgress: 0
        });
      })
      .catch(() => {}) // No file chosen
  }

  onFinished = (args) => {
    this.setState({
      exporting: false,
      exportingProgress: 0
    });
  }

  onProgress = (percentage) => {
    this.setState({
      exportingProgress: percentage
    });
  }

  addMessage = (message, type = 'normal') => {
    const messages = this.state.messages.slice();
    messages.push({ message, type });
    this.setState({ messages });
  }

  render() {
    const { messages } = this.state;

    const cls = classNames(
      'app'
    );

    return (
      <div className={cls}>
        <div className="app__fake-head"/>

        <ToastManager messages={messages} onMessagesUpdate={messages => this.setState({messages})}/>

        <Section
          title={<Title>Video</Title>}
          >
          <DropArea
            onInvalid={() => this.addMessage('Invalid file', 'error')}
            accept={createAcceptsFromFilter(FILTERS.VIDEOS)}/>
        </Section>
      </div>
    );
  }
}

export default App;
