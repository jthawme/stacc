import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import "./Btn.scss";

class Btn extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    invert: PropTypes.bool,
    subtle: PropTypes.bool,
  };

  state = {
  }

  render() {
    const { className, children, invert, subtle, disabled, ...props } = this.props;

    const cls = classNames(
      className,
      'btn',
      {
        'btn--invert': invert
      },
      {
        'btn--subtle': subtle
      }
    );

    return (
      <button className={cls} {...props} disabled={disabled}>{ children }</button>
    );
  }
}

export default Btn;
