import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import "./Logo.scss";

class Logo extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  static defaultProps = {
    animation: 'default'
  }

  render() {
    const { className, animation } = this.props;

    const cls = classNames(
      className,
      'logo',
      `logo--${animation}`
    );

    return (
      <div className={cls}>
        <div className="logo__square logo__square--one"/>
        <div className="logo__square logo__square--two"/>
        <div className="logo__square logo__square--three"/>
        <div className="logo__square logo__square--four"/>
      </div>
    );
  }
}

export default Logo;
