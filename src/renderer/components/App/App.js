import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components
import Nav from '../Common/Nav/Nav';
import Switcher from '../Common/Switcher/Switcher';
import Progress from '../Common/Progress/Progress';
import Tip from '../Tip/Tip';
import Home from '../Home/Home';

// CSS, Requires
import "./App.scss";

class App extends React.Component {
  static propTypes = {
    children: PropTypes.node
  };

  state = {
    currentKey: 'home',
    percent: 0,
    exporting: false
  };

  onProgress = percent => this.setState({ percent })
  onExporting = exporting => this.setState({ exporting })

  render() {
    const { currentKey, percent, exporting } = this.state;

    const cls = classNames(
      'app'
    );

    return (
      <div className={cls}>
        { exporting ? (
          <Progress className="app__progress" percent={percent} transparent/>
        ) : null }
        <div className="app__fake-head"/>
        <div className="app__control">
          <Nav location={currentKey}/>

          <Tip/>
        </div>

        <div className="app__content">
          <Switcher location={currentKey}>
            <Home
              key="home"
              onProgress={this.onProgress}
              onExporting={this.onExporting}
              percent={percent}/>
          </Switcher>
        </div>
      </div>
    );
  }
}

export default App;
