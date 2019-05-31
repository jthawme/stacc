import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components
import Logo from '../Logo/Logo';

// CSS, Requires
import "./Splash.scss";

class Splash extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  state = {
    animation: 'static',
    hide: false
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        animation: 'default'
      });
    }, 500);

    setTimeout(() => {
      this.setState({
        hide: true
      });
    }, 2000);
  }

  render() {
    const { className } = this.props;
    const { animation, hide } = this.state;

    const cls = classNames(
      className,
      'splash',
      {
        'splash--hide': hide
      }
    );

    return (
      <div className={cls}>
        <Logo
          animation={ animation }
          className="splash__logo"/>
      </div>
    );
  }
}

export default Splash;
