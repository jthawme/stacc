import React from 'react';
import PropTypes from 'prop-types';
import { ipcRenderer, remote } from 'electron';
import { EVENTS, FILTERS, EXPORTS } from '../../../modules/Constants';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import "./Settings.scss";

class Settings extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  state = {
    properties: false,
    videoInfo: false
  };

  componentDidMount() {
    this.addEventListeners();
  }

  addEventListeners() {
    ipcRenderer.on(EVENTS.SETTINGS, this.onSettings);
    ipcRenderer.on(EVENTS.SETTINGS_INITIAL, this.onInitial);
  }

  onInitial = (event, { properties, videoInfo }) => {
    this.setState({ properties, videoInfo });
  }

  onSettings = (event, settings) => {
    this.setState({ settings });
  }

  closeWindow = () => {
    remote.getCurrentWindow().close();
  }

  onChange = e => {
    ipcRenderer.send(EVENTS.SETTINGS, {
      [e.target.name]: e.target.value
    });
  }

  render() {
    const { className } = this.props;
    const { settings } = this.state;

    const cls = classNames(
      className,
      'settings'
    );

    return (
      <div className={cls}>
        Settings

        { settings }

        <input type="text" name="test" onChange={this.onChange}/>

        <button onClick={this.closeWindow}>Close</button>
      </div>
    );
  }
}

export default Settings;
