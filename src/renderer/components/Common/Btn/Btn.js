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
    className: PropTypes.string
  };

  state = {
  }

  render() {
    const { className, children, ...props } = this.props;

    const cls = classNames(
      className,
      'btn'
    );

    return (
      <button className={cls} {...props}>{ children }</button>
    );
  }
}

export default Btn;
