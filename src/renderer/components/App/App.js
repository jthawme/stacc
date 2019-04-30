import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components
import Nav from '../Common/Nav/Nav';
import Switcher from '../Common/Switcher/Switcher';
import Home from '../Home/Home';

// CSS, Requires
import "./App.scss";

class App extends React.Component {
  static propTypes = {
    children: PropTypes.node
  };

  state = {
    currentKey: 'home'
  };

  render() {
    const { currentKey } = this.state;

    const cls = classNames(
      'app'
    );

    return (
      <div className={cls}>
        <div className="app__fake-head"/>
        <div className="app__control">
          <Nav location={currentKey}/>
        </div>

        <div className="app__content">
          <Switcher location={currentKey}>
            <Home key="home"/>
          </Switcher>
        </div>
      </div>
    );
  }
}

export default App;
