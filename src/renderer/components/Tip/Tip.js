import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import "./Tip.scss";

class Tip extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  render() {
    const { className } = this.props;

    const cls = classNames(
      className,
      'tip'
    );

    return (
      <div className={cls}>
        Tip
      </div>
    );
  }
}

export default Tip;
