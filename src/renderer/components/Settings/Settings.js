import React from 'react';
import PropTypes from 'prop-types';
import { ipcRenderer, remote } from 'electron';
import { EVENTS, FILTERS, EXPORTS } from '../../../modules/Constants';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components
import Section from '../UI/Section/Section';
import Title from '../UI/Title/Title';

// CSS, Requires
import "./Settings.scss";
import Button from '../UI/Button/Button';

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
    ipcRenderer.send(EVENTS.SETTINGS, this.state.properties);

    setTimeout(() => {
      remote.getCurrentWindow().close();
    }, 150);
  }

  onChange = e => {
    const properties = this.state.properties;

    this.setState({
      properties: Object.assign({}, properties, {
        [e.target.name]: e.target.value
      })
    });
  }

  render() {
    const { className } = this.props;
    const { properties, videoInfo } = this.state;

    const cls = classNames(
      className,
      'settings'
    );

    return (
      <main className={cls}>
        <Button
          rounded
          noMargin
          className="settings__close"
          icon={"close"}
          onClick={this.closeWindow}/>

        <Section
          title={<Title>Settings</Title>}
          className="settings__content">

          <Section
            title="Size"
            subtitle={<p className="settings__subtitle">Making your gif smaller, saves a lot of file&nbsp;size.</p>}
            className="settings__row"
            inline>
            SIZE CHANGER
          </Section>

          <Section
            title="Frame Rate"
            subtitle={<p className="settings__subtitle">The less frames per second, the smaller the&nbsp;file.</p>}
            className="settings__row"
            inline>
            FRAME RATE CHANGER
          </Section>

          <Section
            className="settings__row"
            inline>
            <Button
              onClick={this.closeWindow}
              noMargin>
              Save
            </Button>
          </Section>
        </Section>
      </main>
    );
  }
}

export default Settings;
